package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import org.apache.commons.lang3.StringUtils;
import org.javalite.http.Get;
import org.javalite.http.Http;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NewsFunctions {

    private static Logger log = LoggerFactory.getLogger(NewsFunctions.class);

    private static final ArrayList<String> ALLOWED_ARTICLES = new ArrayList<String>();
    private static final DateTimeFormatter ARTICLE_XML_SORT_FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");
    private static final DateTimeFormatter ARTICLE_XML_DATE_FORMAT = DateTimeFormatter.ofPattern("MM/dd/yyyy");

    static {
        ALLOWED_ARTICLES.add("7353");
        ALLOWED_ARTICLES.add("7320");
    }

    public static final String getStackTrace(Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }

    private static String getXMLNewsFile() {
        String return_data = "";
        try {
            Get get = Http.get(Init.ostigov_news_xml).header("Accept", "application/xml").header("Content-Type", "application/xml");
            return_data = get.text("UTF-8");
        } catch (Exception e) {
            log.error("Exception in getting xml news file: " + getStackTrace(e));
        }
        return return_data;
    }

    public static ObjectNode getNewsPageJson(String article_type_query, String publication_year_query) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        HashMap<String, Integer> article_types_count_map = new HashMap<String, Integer>();
        HashMap<String, Integer> pub_year_counts_map = new HashMap<String, Integer>();

        String news_page_data = getXMLNewsFile();
        if (news_page_data != null) {
            Document doc = Jsoup.parse(news_page_data);
            //Get all of the articles. Go through them
            Elements articles = doc.selectFirst("datasets").selectFirst("data").selectFirst("catalog").select("cd");

            //Go through each article, and only add the ones we want
            HashMap<Integer, ArrayNode> unsorted_articles = new HashMap<Integer, ArrayNode>();
            for (Element article : articles) {
                boolean meets_criteria = false;
                //First, ensure that it's a valid DDE article
                if (article.selectFirst("f2") != null) {
                    Elements products_list = article.selectFirst("f2").selectFirst("div").selectFirst("ul").select("li");
                    for (Element product : products_list) {
                        String html = product.html().trim();
                        if (ALLOWED_ARTICLES.contains(html)) {
                            meets_criteria = true;
                            break;
                        }
                    }
                }

                //Now, see if it's of a valid article type, if they are querying based on that
                Elements article_types_nodes = article.selectFirst("f1").selectFirst("div").selectFirst("ul").select("li");
                ArrayList<String> article_types = new ArrayList<String>();
                article_types_nodes.forEach(type -> {
                    article_types.add(type.html());
                });
                if (meets_criteria && StringUtils.isNotBlank(article_type_query) && Init.NEWS_ARTICLE_TYPES_OBJ.containsKey(article_type_query)) {
                    //See if any of the article types contain what we need
                    meets_criteria = article_types.contains(article_type_query);
                }

                //See if there was a publication year filtering
                String publication_date = article.selectFirst("d11").html();
                LocalDate pub_date = LocalDate.parse(publication_date, ARTICLE_XML_DATE_FORMAT);
                if (meets_criteria && StringUtils.isNotBlank(publication_year_query) && StringUtils.isNumeric(publication_year_query.trim())) {
                    int year = Integer.parseInt(publication_year_query.trim());
                    meets_criteria = year == pub_date.getYear();
                }

                //If it met all of the search criteria, add it to the list
                if (meets_criteria) {
                    //Create an object for the unsorted articles. Each article will have an associated publication date. These dates will be used as keys for sorting, so we can get a proper order, newest to oldest
                    ObjectNode article_data = JsonUtils.MAPPER.createObjectNode();

                    /*Article Types*/
                    ArrayNode types_for_this_rec = JsonUtils.MAPPER.createArrayNode();
                    //Add to teh article type counts
                    for (String type : article_types) {
                        //If we don't already have this count, we'll have to add it to our list. Otherwise, we increment the amount we have
                        String type_display = Init.NEWS_ARTICLE_TYPES_OBJ.get(type);
                        if (!article_types_count_map.containsKey(type_display)) {
                            article_types_count_map.put(type_display, 1);
                        } else {
                            article_types_count_map.put(type_display, article_types_count_map.get(type_display) + 1);
                        }
                        ObjectNode current_rec_type = JsonUtils.MAPPER.createObjectNode();
                        current_rec_type.put("display", type_display);
                        //current_rec_type.put("value", type);
                        switch (type_display) {
                            case "News":
                                current_rec_type.put("is_news", true);
                                break;
                            case "Updates and Tips":
                                current_rec_type.put("is_updates_and_tips", true);
                                break;
                            case "Blog":
                                current_rec_type.put("is_blog", true);
                                break;
                        }
                        types_for_this_rec.add(current_rec_type);
                    }
                    article_data.put("article_types", types_for_this_rec);

                    /*Title*/
                    article_data.put("title", article.selectFirst("d1").html());

                    /*Publication Date*/
                    String pub_year = Integer.toString(pub_date.getYear());
                    //Add to the publication date counts
                    if (!pub_year_counts_map.containsKey(pub_year)) {
                        pub_year_counts_map.put(pub_year, 1);
                    } else {
                        pub_year_counts_map.put(pub_year, pub_year_counts_map.get(pub_year) + 1);
                    }
                    article_data.put("publication_date", publication_date);

                    /*Link*/
                    article_data.put("link_suffix", article.selectFirst("d2").html().trim());

                    /*Abstract*/
                    article_data.put("abstract", article.selectFirst("d5").html().trim());

                    //Add it to our list of actually approved records
                    Integer pub_date_sort = Integer.parseInt(pub_date.format(ARTICLE_XML_SORT_FORMAT));//Make a key that makes the dates easily sortable
                    ArrayNode list_for_date = unsorted_articles.getOrDefault(pub_date_sort, JsonUtils.createArrayNode());
                    list_for_date.add(article_data);
                    unsorted_articles.put(pub_date_sort, list_for_date);

                }
            }

            /*We're storing all of this stuff in JSON objects*/
            ArrayNode sorted_article_data = JsonUtils.MAPPER.createArrayNode();
            ArrayNode publication_years_counts = JsonUtils.MAPPER.createArrayNode();
            ArrayNode article_types_counts = JsonUtils.MAPPER.createArrayNode();

            /*Get a sorted version of the articles key list, then add that sorted list */
            List<Integer> sorted_articles_keys = new ArrayList<Integer>(unsorted_articles.keySet());
            Collections.sort(sorted_articles_keys, Collections.reverseOrder());
            //Go through each list in our now sorted keyset, and grab the list of articles that belong to that year, month, day combo
            for (Integer sorted_key : sorted_articles_keys) {
                ArrayNode articles_for_date = unsorted_articles.get(sorted_key);
                for (JsonNode art : articles_for_date) {
                    sorted_article_data.add(art);
                }

            }

            /*Sort out the article types*/
            List<String> sorted_article_type_keys = new ArrayList<String>(article_types_count_map.keySet());
            Collections.sort(sorted_article_type_keys);
            sorted_article_type_keys.forEach((type) -> {
                String article_type_code = Init.NEWS_ARTICLE_TYPES_INVERSE_OBJ.get(type);
                if (StringUtils.isBlank(article_type_query) || StringUtils.equals(article_type_code, article_type_query)) {
                    ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                    row.put("type", type);
                    row.put("count", article_types_count_map.get(type));
                    row.put("is_checked", StringUtils.equals(Init.NEWS_ARTICLE_TYPES_OBJ.get(article_type_query), type));
                    row.put("value", article_type_code);
                    row.put("art_type_id", type.replaceAll(" ", "-"));
                    article_types_counts.add(row);
                }
            });

            /*Sort out the publication years*/
            List<String> sorted_pubyear_type_keys = new ArrayList<String>(pub_year_counts_map.keySet());
            Collections.sort(sorted_pubyear_type_keys, Collections.reverseOrder());
            sorted_pubyear_type_keys.forEach((year) -> {
                ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                row.put("year", year);
                row.put("count", pub_year_counts_map.get(year));
                row.put("is_checked", StringUtils.equals(publication_year_query, year));
                publication_years_counts.add(row);
            });

            /*We gotta do featured article stuff real quick*/
            boolean show_featured = StringUtils.isBlank(article_type_query) && StringUtils.isBlank(publication_year_query);
            return_data.put("show_featured", show_featured);
            if (show_featured) {
                ObjectNode featured_article = (ObjectNode) sorted_article_data.get(0);
                return_data.set("featured", featured_article);
                sorted_article_data.remove(0);
            }

            /*Take care of the filter stuff*/
            ArrayNode search_filters = JsonUtils.MAPPER.createArrayNode();
            if (StringUtils.isNotBlank(article_type_query)) {
                ObjectNode article_type_filter = JsonUtils.MAPPER.createObjectNode();
                article_type_filter.put("value", article_type_query);
                article_type_filter.put("display", Init.NEWS_ARTICLE_TYPES_OBJ.get(article_type_query));
                article_type_filter.put("type", "article-type");
                search_filters.add(article_type_filter);
            }
            if (StringUtils.isNotBlank(publication_year_query)) {
                ObjectNode publication_year_filter = JsonUtils.MAPPER.createObjectNode();
                publication_year_filter.put("value", publication_year_query);
                publication_year_filter.put("display", publication_year_query);
                publication_year_filter.put("type", "publication-year");
                search_filters.add(publication_year_filter);
            }


            /*If we didn't filter on anything, then we have a featured article*/
            return_data.set("article_types", article_types_counts);
            return_data.set("publication_years", publication_years_counts);
            return_data.set("article_list", sorted_article_data);
            return_data.put("total_found", sorted_article_data.size() + (show_featured ? 1 : 0));
            return_data.put("more_than_one", sorted_article_data.size() > 1);
            return_data.put("had_results", sorted_article_data.size() > 0);
            return_data.put("search_filters", search_filters);
            return_data.put("has_search_filter", search_filters.size() > 0);
            return_data.put("article_type_newspaper", Init.NEWS_ARTICLE_TYPES_INVERSE_OBJ.get("News"));
            return_data.put("article_type_updates", Init.NEWS_ARTICLE_TYPES_INVERSE_OBJ.get("Updates and Tips"));
            return_data.put("article_type_blog", Init.NEWS_ARTICLE_TYPES_INVERSE_OBJ.get("Blog"));
            return_data.put("article_type_event", Init.NEWS_ARTICLE_TYPES_INVERSE_OBJ.get("Events"));
            return_data.put("news_environment_url", Init.news_environment_url);
        }
        return return_data;
    }

    public static void getNewsTermsData() {
        try {
            String response = getXMLNewsFile();

            if (response != null) {
                //Parse html into a JSOUP Document
                Document doc = Jsoup.parse(response);
                Element terms_doc = doc.selectFirst("datasets").selectFirst("data").selectFirst("catalog").selectFirst("terms");

                terms_doc.select("t").forEach((element) -> {
                    String term_type = element.selectFirst("d1").html().trim();
                    String display_val = element.selectFirst("d2").html().trim();
                    String code = element.selectFirst("f1").html().trim();

                    if (StringUtils.equals(term_type, "Article Type")) {
                        Init.NEWS_ARTICLE_TYPES_OBJ.put(code, display_val);
                        Init.NEWS_ARTICLE_TYPES_INVERSE_OBJ.put(display_val, code);
                    }
                });
            }

        } catch (Exception e) {
            log.error("Exception in getting news terms data: " + getStackTrace(e));
        }
    }

}
