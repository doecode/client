package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.jknack.handlebars.internal.lang3.ArrayUtils;

import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import java.net.URLEncoder;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.Month;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.Locale;
import org.apache.commons.lang3.StringUtils;
import org.javalite.http.Get;
import org.javalite.http.Http;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class NewsFunctions {

      private static Logger log = LoggerFactory.getLogger(NewsFunctions.class);

      public static final DateTimeFormatter NEWS_TIME_HOUR_AMPM_ONLY = DateTimeFormatter.ofPattern("h a");
      public static final DateTimeFormatter NEWS_HOUR_MINUTE_AMPM = DateTimeFormatter.ofPattern("hh:mm a");
      public static final DateTimeFormatter NEWS_ARTICLE_DATE_FORMAT = DateTimeFormatter.ofPattern("MM/dd/yyyy");

      static LocalDateTime getEndPublicationDateTime(LocalDateTime start_pub_date, ObjectNode obj_filters) {
            LocalDateTime return_data = LocalDateTime.now();
            if (obj_filters.findPath("has_publication_date_year").asBoolean(false)) {
                  return_data = return_data.withYear(start_pub_date.getYear()).withMonth(12).withDayOfMonth(31)
                              .withHour(23).withMinute(59).withSecond(59);
            }
            // check for publication month and year
            if (obj_filters.findPath("has_publication_month_year").asBoolean(false)) {
                  return_data = return_data.withMonth(start_pub_date.getMonthValue());
            }
            // check for publication month/day/year
            if (obj_filters.findPath("has_publication_month_day_year").asBoolean(false)) {
                  return_data = return_data.withDayOfMonth(start_pub_date.getDayOfMonth());
            }
            // check for publication hour
            if (obj_filters.findPath("has_publication_hour").asBoolean(false)) {
                  return_data = return_data.withHour(start_pub_date.getHour());
            }
            // check for publication minute
            if (obj_filters.findPath("has_publication_minute").asBoolean(false)) {
                  return_data = return_data.withMinute(start_pub_date.getMinute());
            }
            return return_data;
      }

      public static ObjectNode getFilterParamList(ArrayNode article_type_list, LocalDateTime publication_date_start,
                  ObjectNode date_filter_obj) {
            ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
            ArrayNode filter_list = JsonUtils.MAPPER.createArrayNode();
            // Check article types
            for (JsonNode type : article_type_list) {
                  ObjectNode type_data = (ObjectNode) type;
                  if (type_data.findPath("is_checked").asBoolean(false)) {
                        String art_type = type_data.findPath("art_type").asText("");
                        ObjectNode row = NewsFunctions.makeNewsFilterNode(art_type,
                                    "article-type-" + art_type.replaceAll(" ", "-"));
                        filter_list.add(row);
                  }
            }
            // Check dates
            if (date_filter_obj != null) {
                  String pub_year = Integer.toString(publication_date_start.getYear());
                  String pub_month_display = StringUtils.capitalize(
                              publication_date_start.getMonth().getDisplayName(TextStyle.FULL, Locale.getDefault()));
                  String pub_month_val = StringUtils.leftPad(Integer.toString(publication_date_start.getMonthValue()),
                              2, "0");
                  String pub_day = Integer.toString(publication_date_start.getDayOfMonth());
                  if (date_filter_obj.findPath("has_publication_date_year").asBoolean(false)) {
                        filter_list.add(NewsFunctions.makeNewsFilterNode(pub_year, "publication_date-" + pub_year));
                  }
                  // check for publication month and year
                  if (date_filter_obj.findPath("has_publication_month_year").asBoolean(false)) {
                        // publication_date-month-year-MonthYear
                        filter_list.add(NewsFunctions.makeNewsFilterNode(pub_month_display + " " + pub_year,
                                    "publication_date-month-year-" + pub_month_val + pub_year));
                  }
                  // check for publication month/day/year
                  if (date_filter_obj.findPath("has_publication_month_day_year").asBoolean(false)) {
                        // publication_date-month-year-day-MonthDayYear
                        filter_list.add(NewsFunctions.makeNewsFilterNode(
                                    pub_month_display + " " + pub_day + ", " + pub_year,
                                    "publication_date-month-year-day-" + pub_month_val + pub_day + pub_year));
                  }
                  // check for publication hour
                  if (date_filter_obj.findPath("has_publication_hour").asBoolean(false)) {
                        // publication_date-hour-Hour
                        filter_list.add(NewsFunctions.makeNewsFilterNode(
                                    publication_date_start.format(NewsFunctions.NEWS_TIME_HOUR_AMPM_ONLY),
                                    "publication_date-hour-" + publication_date_start.getHour()));
                  }
                  // check for publication minute
                  if (date_filter_obj.findPath("has_publication_minute").asBoolean(false)) {
                        // publication_date-minute-Minute
                        filter_list.add(NewsFunctions.makeNewsFilterNode(
                                    publication_date_start.format(NewsFunctions.NEWS_HOUR_MINUTE_AMPM),
                                    "publication_date-minute-" + publication_date_start.getMinute()));
                  }
            }
            return_data.set("filter_params_list", filter_list);
            return_data.put("has_filter_params", filter_list.size() > 0);
            return return_data;
      }

      /**
       * Gets news article data from a specific source. In this case, it gets the
       * number of articles, an array of different article types and the number of
       * each type found, an array of publication date years and the number of
       * instances of each year, and a list of the articles themselves
       */
      public static ObjectNode getNewsPageData(String news_url, ObjectNode request_data) {
            ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
            ArrayNode news_data_raw_list = JsonUtils.MAPPER.createArrayNode();
            try {
                  // Get a list of the article types
                  // Requested article types
                  ArrayNode requested_article_types = (request_data != null && request_data.has("article_types"))
                              ? (ArrayNode) request_data.get("article_types")
                              : JsonUtils.MAPPER.createArrayNode();
                  ArrayList<String> requested_art_types = new ArrayList<String>();
                  for (JsonNode jn : requested_article_types) {
                        requested_art_types.add(jn.asText(""));
                  }
                  // Get the date and time we're using for the
                  boolean use_publicationdate = true;
                  LocalDateTime requested_publication_date = LocalDateTime.now();
                  LocalDateTime publication_date_end = LocalDateTime.now().withMonth(Month.DECEMBER.getValue())
                              .withDayOfMonth(31).withHour(23).withMinute(59);
                  ObjectNode publication_date_filters = null;
                  // See whether or not they've sent a publication date object, and whether it has
                  // anything in it
                  if (request_data.has("publication_date")
                              && JsonUtils.getKeys((ObjectNode) request_data.get("publication_date")).size() > 0) {
                        // Get the publication date data
                        ObjectNode publication_date_obj = (ObjectNode) request_data.get("publication_date");
                        requested_publication_date = getStartPublicationDateTime(publication_date_obj);
                        // Get what parts of publication date were used, and put the filter together
                        publication_date_filters = NewsFunctions.getWhatPublicationDateFilters(publication_date_obj);
                        // Get the end date, based on what we filtered on
                        publication_date_end = NewsFunctions.getEndPublicationDateTime(requested_publication_date,
                                    publication_date_filters);
                  } else {
                        use_publicationdate = false;
                  }
                  String search_string = news_url + makeNewsURLParams(requested_art_types, requested_publication_date,
                              publication_date_end, use_publicationdate);
                  // URL encode the query part of the sting
                  Get get = Http.get(search_string).header("Accept", "application/json").header("Content-Type",
                              "application/json");
                  String response = get.text("UTF-8");
                  ObjectNode news_data_raw = JsonUtils.parseObjectNode(response.toString());
                  if (news_data_raw.has("response")) {
                        news_data_raw_list = (ArrayNode) news_data_raw.get("response").get("docs");
                  } else {
                        return_data.put("error", "An error occurred. News data couldn't be loaded.");
                  }
                  // Unpack the data, and construct what we need from it
                  HashMap<String, Integer> article_types_map = new HashMap<String, Integer>();
                  ArrayList<LocalDateTime> publication_date_list = new ArrayList<LocalDateTime>();
                  ArrayNode refined_articles_list = JsonUtils.MAPPER.createArrayNode();
                  for (JsonNode jn : news_data_raw_list) {
                        ObjectNode article = (ObjectNode) jn;
                        ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                        row.put("url", Init.news_environment_url + article.findPath("path_alias").asText(""));
                        row.put("title", article.findPath("label").asText(""));
                        row.put("content", article.findPath("content").asText(""));
                        LocalDateTime publication_date = LocalDateTime.parse(
                                    article.findPath("ds_created").asText("").replaceAll("T", "").replaceAll("Z", ""),
                                    SearchFunctions.SOLR_DATE_FORMAT);
                        row.put("publication_date", publication_date.format(NEWS_ARTICLE_DATE_FORMAT));
                        publication_date_list.add(publication_date);
                        // Get the article types, and add them to the list too
                        ArrayNode article_types_with_other = JsonUtils.MAPPER.createArrayNode();
                        ArrayNode article_types_list = (ArrayNode) article.get("sm_vid_Article_Type");
                        for (JsonNode n : article_types_list) {
                              String article_type = n.asText("");
                              // Go through the article types. If we already have this type, increment its
                              // count by 1. Otherwise, add the new one to the map
                              if (article_types_map.containsKey(article_type)) {
                                    article_types_map.put(article_type, article_types_map.get(article_type) + 1);
                              } else {
                                    article_types_map.put(article_type, 1);
                              }
                              ObjectNode single_article_type = JsonUtils.MAPPER.createObjectNode();
                              single_article_type.put("type", article_type);
                              switch (article_type) {
                              case "News":
                                    single_article_type.put("is_news", true);
                                    break;
                              case "Blog":
                                    single_article_type.put("is_blog", true);
                                    break;
                              case "Updates and Tips":
                                    single_article_type.put("is_updates_and_tips", true);
                                    break;
                              }
                              article_types_with_other.add(single_article_type);
                        }
                        row.put("article_type_str", article_types_list.toString());
                        row.set("article_types", article_types_with_other);
                        row.put("need_break", article_types_with_other.size() == 1);
                        refined_articles_list.add(row);
                  }
                  // Convert article types to arraynode
                  ArrayNode filter_article_types = JsonUtils.MAPPER.createArrayNode();
                  for (String type : article_types_map.keySet()) {
                        ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                        row.put("art_type", type);
                        row.put("art_type_id", type.replaceAll(" ", "-"));
                        row.put("count", article_types_map.get(type));
                        row.put("is_checked", requested_art_types.contains(type));
                        filter_article_types.add(row);
                  }
                  HashMap<Integer, Integer> publication_year_map = new HashMap<Integer, Integer>();
                  for (LocalDateTime ldt : publication_date_list) {
                        int year = ldt.getYear();
                        if (publication_year_map.containsKey(year)) {
                              publication_year_map.put(year, publication_year_map.get(year) + 1);
                        } else {
                              publication_year_map.put(year, 1);
                        }
                  }
                  ArrayNode filter_publication_date_years = JsonUtils.MAPPER.createArrayNode();
                  ArrayList<Integer> publication_year_list = new ArrayList<Integer>(publication_year_map.keySet());
                  Collections.sort(publication_year_list, Collections.reverseOrder());
                  for (Integer key : publication_year_list) {
                        ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                        row.put("pub_year", key);
                        row.put("count", publication_year_map.get(key));
                        row.put("is_checked", publication_date_filters != null
                                    && publication_date_filters.findPath("has_publication_date_year").asBoolean(false));
                        filter_publication_date_years.add(row);
                  }
                  boolean did_date_filter = false;
                  if (publication_date_filters != null) {
                        did_date_filter = true;
                        if (publication_date_filters.get("has_publication_date_year").asBoolean(false)) {
                              int checked_count = 0;
                              return_data.put("has_publication_year_filter", true);
                              // Get how many groups there are of each publication month/year combinations
                              // there are
                              HashMap<String, Integer> pub_monthyears = new HashMap<String, Integer>();
                              for (LocalDateTime ldt : publication_date_list) {
                                    String monthyear_key = StringUtils.leftPad(Integer.toString(ldt.getMonthValue()), 2,
                                                "0") + Integer.toString(ldt.getYear());
                                    // If we already have this combination, just increment the amount that
                                    // we have by 1. Otherwise, set the starting value of 1
                                    if (pub_monthyears.keySet().contains(monthyear_key)) {
                                          pub_monthyears.put(monthyear_key, pub_monthyears.get(monthyear_key) + 1);
                                    } else {
                                          pub_monthyears.put(monthyear_key, 1);
                                    }
                              }
                              ArrayNode filter_publication_month_years = JsonUtils.MAPPER.createArrayNode();
                              for (String key : pub_monthyears.keySet()) {
                                    ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                                    int month = Integer.parseInt(StringUtils.substring(key, 0, 2));
                                    int year = Integer.parseInt(StringUtils.substring(key, 2, key.length()));
                                    row.put("month", month);
                                    row.put("year", year);
                                    row.put("pub_month_year", key);
                                    row.put("count", pub_monthyears.get(key));
                                    // Gives you the full month name, followed by the year. So, "September
                                    // 2018", for example
                                    String month_display = Month.of(month).getDisplayName(TextStyle.FULL,
                                                Locale.getDefault());
                                    row.put("display", StringUtils.capitalize(month_display) + " " + year);
                                    // If publication month year was checked on the front end, then this
                                    // will be the only one that will show up, so we'll set it as checked
                                    if (publication_date_filters.get("has_publication_month_year").asBoolean(false)) {
                                          row.put("is_checked", true);
                                          checked_count++;
                                    }
                                    filter_publication_month_years.add(row);
                              }
                              return_data.put("has_month_year_filter", checked_count > 0);
                              return_data.set("month_year_filter", filter_publication_month_years);
                        }
                        if (publication_date_filters.get("has_publication_month_year").asBoolean(false)) {
                              int checked_count = 0;
                              // Get how many groups there are of each publication month year
                              HashMap<String, Integer> pub_month_dayyears = new HashMap<String, Integer>();
                              for (LocalDateTime ldt : publication_date_list) {
                                    // Makes a key that looks solmething like 01012018
                                    String key = StringUtils.leftPad(Integer.toString(ldt.getMonthValue()), 2, "0")
                                                + StringUtils.leftPad(Integer.toString(ldt.getDayOfMonth()), 2, "0")
                                                + ldt.getYear();
                                    if (pub_month_dayyears.containsKey(key)) {
                                          pub_month_dayyears.put(key, pub_month_dayyears.get(key) + 1);
                                    } else {
                                          pub_month_dayyears.put(key, 1);
                                    }
                              }
                              ArrayNode filter_publication_month_day_year = JsonUtils.MAPPER.createArrayNode();
                              for (String key : pub_month_dayyears.keySet()) {
                                    ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                                    String month_str = StringUtils.substring(key, 0, 2);
                                    String day_str = StringUtils.substring(key, 2, 4);
                                    int month = Integer.parseInt(month_str);
                                    int day = Integer.parseInt(day_str);
                                    int year = Integer.parseInt(StringUtils.substring(key, 4, key.length()));
                                    row.put("month", month);
                                    row.put("year", year);
                                    row.put("day", day);
                                    row.put("count", pub_month_dayyears.get(key));
                                    String month_display = Month.of(month).getDisplayName(TextStyle.FULL,
                                                Locale.getDefault());
                                    row.put("display", month_display + " " + day_str + ", " + year);
                                    row.put("month_day_year", key);
                                    if (publication_date_filters.get("has_publication_month_day_year")
                                                .asBoolean(false)) {
                                          row.put("is_checked", true);
                                          checked_count++;
                                    }
                                    filter_publication_month_day_year.add(row);
                              }
                              return_data.put("has_month_day_year_filter", checked_count > 0);
                              return_data.set("month_day_year_filter", filter_publication_month_day_year);
                        }
                        if (publication_date_filters.get("has_publication_month_day_year").asBoolean(false)) {
                              int checked_count = 0;
                              HashMap<Integer, Integer> pub_hour = new HashMap<Integer, Integer>();
                              for (LocalDateTime ldt : publication_date_list) {
                                    int key = ldt.getHour();
                                    if (pub_hour.containsKey(key)) {
                                          pub_hour.put(key, (pub_hour.get(key)) + 1);
                                    } else {
                                          pub_hour.put(key, 1);
                                    }
                              }
                              ArrayNode filter_publication_hour = JsonUtils.MAPPER.createArrayNode();
                              for (Integer key : pub_hour.keySet()) {
                                    ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                                    row.put("hour", key);
                                    LocalTime lt = LocalTime.of(key, 1);
                                    row.put("display", lt.format(NEWS_TIME_HOUR_AMPM_ONLY));
                                    row.put("count", pub_hour.get(key));
                                    if (publication_date_filters.get("has_publication_hour").asBoolean(false)) {
                                          row.put("is_checked", true);
                                          checked_count++;
                                    }
                                    filter_publication_hour.add(row);
                              }
                              return_data.put("has_hour_filter", checked_count > 0);
                              return_data.set("hour_filter", filter_publication_hour);
                        }
                        if (publication_date_filters.get("has_publication_hour").asBoolean(false)) {
                              int checked_count = 0;
                              HashMap<String, Integer> pub_minute = new HashMap<String, Integer>();
                              for (LocalDateTime ldt : publication_date_list) {
                                    int hour = ldt.getHour();
                                    int minute = ldt.getMinute();
                                    String key = StringUtils.leftPad(Integer.toString(hour), 2, "0")
                                                + StringUtils.leftPad(Integer.toString(minute), 2, "0");
                                    if (pub_minute.containsKey(key)) {
                                          pub_minute.put(key, pub_minute.get(Integer.toString(minute)) + 1);
                                    } else {
                                          pub_minute.put(key, 1);
                                    }
                              }
                              ArrayNode filter_publication_minute = JsonUtils.MAPPER.createArrayNode();
                              for (String key : pub_minute.keySet()) {
                                    ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                                    LocalTime time = LocalTime.parse(key, DateTimeFormatter.ofPattern("HHmm"));
                                    row.put("minute", time.getMinute());
                                    row.put("display", time.format(NEWS_HOUR_MINUTE_AMPM));
                                    row.put("count", pub_minute.get(key));
                                    if (publication_date_filters.get("has_publication_minute").asBoolean(false)) {
                                          row.put("is_checked", true);
                                          checked_count++;
                                    }
                                    filter_publication_minute.add(row);
                              }
                              return_data.put("has_minute_filter", checked_count > 0);
                              return_data.set("minute_filter", filter_publication_minute);
                        }
                  }
                  return_data.put("total_results", refined_articles_list.size());
                  return_data.set("article_types", filter_article_types);
                  return_data.set("publication_date_years", filter_publication_date_years);
                  return_data.put("hide_featured", requested_art_types.size() > 0 || did_date_filter);
                  // Take the feature article, and make it a separate object. Put the rest of this
                  // in the list
                  ObjectNode featured_article = (ObjectNode) refined_articles_list.get(0);
                  String featured_article_content = featured_article.findPath("content").asText("");
                  featured_article.put("content", featured_article_content);
                  // Split the article content into words
                  String[] featured_content_words = StringUtils.split(featured_article_content, " ");
                  if (featured_content_words.length > SearchFunctions.MAX_WORD_IN_FEATURED_ARTICLE) {
                        featured_article
                                    .put("content",
                                                StringUtils.join(
                                                            ArrayUtils.subarray(featured_content_words, 0,
                                                                        SearchFunctions.MAX_WORD_IN_FEATURED_ARTICLE),
                                                            " ") + "...");
                        featured_article.put("content_over_limit", true);
                  }
                  // Grab the first article type, and say that it will be the type we show
                  ObjectNode featured_article_first_type = (ObjectNode) ((ArrayNode) featured_article
                              .get("article_types")).get(0);
                  featured_article.set("article_type", featured_article_first_type);
                  return_data.set("featured_article", featured_article);
                  // take out the first because it's the featured article
                  return_data.set("refined_articles_list", refined_articles_list);
                  // Put all of the filter params in
                  return_data.set("filter_params", NewsFunctions.getFilterParamList(filter_article_types,
                              requested_publication_date, publication_date_filters));
            } catch (Exception e) {
                  log.error("Exception in getting news data: " + e.getMessage());
                  log.error("Exception in getting news data: " + DOECODEUtils.getStackTrace(e));
                  return_data.put("error", "An error occurred. News data couldn't be loaded.");
                  return_data.put("has_error", true);
            }
            return return_data;
      }

      static LocalDateTime getStartPublicationDateTime(ObjectNode date_obj) {
            LocalDateTime return_time = LocalDateTime.of(LocalDateTime.now().getYear(), 1, 1, 0, 0, 1);
            int year = return_time.getYear();
            int month = return_time.getMonthValue();
            int day = return_time.getDayOfMonth();
            int hour = return_time.getHour();
            int minute = return_time.getMinute();
            int second = return_time.getSecond();
            // Get what fields are being filtered on
            ObjectNode obj_filters = NewsFunctions.getWhatPublicationDateFilters(date_obj);
            // Check for publication year
            if (obj_filters.get("has_publication_date_year").asBoolean(false)) {
                  year = date_obj.findPath("publication_date_year").asInt();
            }
            // check for publication month and year
            if (obj_filters.get("has_publication_month_year").asBoolean(false)) {
                  ObjectNode pub_month_year = (ObjectNode) date_obj.get("publication_month_year");
                  month = pub_month_year.findPath("month").asInt(1);
                  year = pub_month_year.findPath("year").asInt(0);
            }
            // check for publication month/day/year
            if (obj_filters.get("has_publication_month_day_year").asBoolean(false)) {
                  ObjectNode pub_month_day_year = (ObjectNode) date_obj.get("publication_month_day_year");
                  month = pub_month_day_year.findPath("month").asInt(1);
                  year = pub_month_day_year.findPath("year").asInt(0);
                  day = pub_month_day_year.findPath("day").asInt(0);
            }
            // check for publication hour
            if (obj_filters.get("has_publication_hour").asBoolean(false)) {
                  hour = date_obj.findPath("publication_hour").asInt(0);
            }
            // check for publication minute
            if (obj_filters.get("has_publication_minute").asBoolean(false)) {
                  minute = date_obj.findPath("publication_minute").asInt(0);
            }
            // Set the values of the LocalDateTime object
            return_time = LocalDateTime.of(year, month, day, hour, minute, second);
            return return_time;
      }

      static ObjectNode getWhatPublicationDateFilters(ObjectNode pub_obj) {
            ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
            return_data.put("has_publication_date_year", pub_obj.has("publication_date_year"));
            return_data.put("has_publication_month_year", pub_obj.has("publication_month_year"));
            return_data.put("has_publication_month_day_year", pub_obj.has("publication_month_day_year"));
            return_data.put("has_publication_hour", pub_obj.has("publication_hour"));
            return_data.put("has_publication_minute", pub_obj.has("publication_minute"));
            return return_data;
      }

      private static ObjectNode makeNewsFilterNode(String label, String related_field) {
            ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
            return_data.put("label", label);
            return_data.put("related_field", related_field);
            return return_data;
      }

      private static String makeNewsURLParams(ArrayList<String> article_types_join_list,
                  LocalDateTime publication_date_start, LocalDateTime publication_date_end, boolean use_pubdate)
                  throws Exception {
            String return_data = "";
            if (article_types_join_list.size() > 0) {
                  // Joins all of the items in the list with [type wrapped in quotes] OR [next
                  // type wrapped in quotes]
                  return_data += ("&fq=" + URLEncoder.encode(
                              "sm_vid_Article_Type:(\"" + StringUtils.join(article_types_join_list, "\" OR \"") + "\")",
                              "UTF-8"));
            }
            if (use_pubdate) {
                  // Make publication date range
                  return_data += ("&fq=" + URLEncoder.encode(
                              "ds_created:[\"" + publication_date_start.format(SearchFunctions.SOLR_DATE_ONLY) + "T"
                                          + publication_date_start.format(SearchFunctions.SOLR_TIME_ONLY) + "Z\" TO \""
                                          + publication_date_end.format(SearchFunctions.SOLR_DATE_ONLY) + "T"
                                          + publication_date_end.format(SearchFunctions.SOLR_TIME_ONLY) + "Z\"]",
                              "UTF-8"));
            }
            return return_data;
      }
}
