package gov.osti.doecode.entity;

import com.eclipsesource.json.Json;
import com.eclipsesource.json.JsonArray;
import com.eclipsesource.json.JsonObject;
import com.eclipsesource.json.JsonValue;
import gov.osti.doecode.utils.DOECODEUtils;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang.StringUtils;
import org.apache.http.Consts;
import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.params.CoreProtocolPNames;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;

public class SearchFunctions {

     private final static Logger log = Logger.getLogger(SearchFunctions.class.getName());
     public static final DateTimeFormatter RELEASE_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
     public static final DateTimeFormatter APA_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy, MMMM dd");
     public static final DateTimeFormatter CHICAGO_DATE_FORMAT = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
     public static final DateTimeFormatter MLA_DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMM. yyyy.");
     public static final DateTimeFormatter SEARCH_RESULTS_DESCRIPTION_FORMAT = DateTimeFormatter.ofPattern("MM-dd-yyyy");

     public static JsonObject conductSearch(HttpServletRequest request, ServletContext context, long page_num) {
          JsonObject return_data = new JsonObject();

          //Go and actually search
          return_data = doSearchPost(request, context.getInitParameter("api_url"), context);

          //Get the search form data and get teh page number
          JsonObject search_form_data = return_data.get("search_form_data").asObject();
          search_form_data.add("pageNum", page_num);

          //Add together all of the data, send it out
          return_data.add("had_results", return_data.getLong("search_result_count", 0) > 0);
          return_data.add("search_form_data", search_form_data);

          return return_data;
     }

     private static JsonObject doSearchPost(HttpServletRequest request, String api_url, ServletContext context) {
          JsonObject return_data = new JsonObject();
          boolean had_error = false;
          boolean invalid_search_data = false;
          String error_message = "";

          long start = Long.parseLong(StringUtils.defaultIfBlank(request.getParameter("start"), "0"));
          long rows = Long.parseLong(StringUtils.defaultIfBlank(request.getParameter("rows"), "10"));

          //Get all of the data into a postable object
          JsonObject post_data = new JsonObject();
          post_data.add("all_fields", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("all_fields"), ""), Whitelist.basic()));
          post_data.add("software_title", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("software_title"), ""), Whitelist.basic()));
          post_data.add("developers_contributors", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("developers_contributors"), ""), Whitelist.basic()));
          post_data.add("biblio_data", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("biblio_data"), ""), Whitelist.basic()));
          post_data.add("identifiers", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("identifiers"), ""), Whitelist.basic()));
          post_data.add("date_earliest", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("date_earliest"), ""), Whitelist.basic()));
          post_data.add("date_latest", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("date_latest"), ""), Whitelist.basic()));
          post_data.add("start", start);
          post_data.add("rows", rows);
          post_data.add("sort", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("sort"), ""), Whitelist.basic()));
          post_data.add("orcid", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("orcid"), ""), Whitelist.basic()));

          post_data.add("accessibility", handleRequestArray(request.getParameter("accessibility")));
          post_data.add("licenses", handleRequestArray(request.getParameter("licenses")));
          post_data.add("research_organization", handleRequestArray(request.getParameter("research_organization")));
          post_data.add("sponsoring_organization", handleRequestArray(request.getParameter("sponsoring_organization")));
          post_data.add("software_type", handleRequestArray(request.getParameter("software_type")));

          //Create the post object
          CloseableHttpClient hc = HttpClientBuilder.create().setDefaultRequestConfig(RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000).setConnectionRequestTimeout(5000).build()).build();
          HttpPost post = new HttpPost(api_url + "search");
          post.setHeader("Content-Type", "application/json");
          post.setHeader("Accept", "application/json");
          post.setEntity(new StringEntity(post_data.toString(), "UTF-8"));

          //Build our post object and execute it
          JsonObject search_result_data = new JsonObject();
          try {
               HttpResponse response = hc.execute(post);
               String raw_search_data = EntityUtils.toString(response.getEntity());
               if (DOECODEUtils.isValidJsonObject(raw_search_data)) {
                    search_result_data = Json.parse(raw_search_data).asObject();
               } else {
                    invalid_search_data = true;
               }
          } catch (Exception ex) {
               log.severe("Exception in search: " + ex.getMessage());
               had_error = true;
               invalid_search_data = true;
               error_message = "An error has occurred that is preventing your search from working.";
          } finally {
               try {
                    hc.close();
               } catch (IOException ex) {
                    log.severe("Bad issue in closing search connection: " + ex.getMessage());
               }
          }

          //Get the num found
          long num_found = search_result_data.getLong("num_found", 0);

          //Pull out the list of results and process the data so we only get what we want, assume we got correct data
          JsonArray search_results_list = new JsonArray();
          if (search_result_data.get("docs") != null) {
               search_results_list = processSearchResultData(search_result_data.get("docs").asArray(), start, num_found);
          }

          //Go through, and stringify all of the json array values, so they can sit on the page correctly
          JsonObject search_form_data = post_data;
          for (String s : search_form_data.names()) {
               if (search_form_data.get(s).isArray()) {
                    search_form_data.set(s, search_form_data.get(s).asArray().toString());
               }
          }

          //Give everything back
          return_data.add("search_result_count", num_found);
          return_data.add("had_error", had_error);
          return_data.add("error_message", error_message);
          return_data.add("search_form_data", search_form_data);
          return_data.add("search_results_list", search_results_list);
          return_data.add("pagination_btn", getPaginationData(search_form_data, num_found));
          return_data.add("breadcrumbTrailItem", getSearchBreadcrumbTrailList(post_data, num_found));
          return_data.add("search_sort_dropdown", sort_dropdownOptions(context, post_data.getString("sort", "")));
          return_data.add("availabilities_list", getSearchDropdownList(context, DOECODEUtils.AVAILABILITIES_LIST_JSON, DOECODEUtils.AVAILABILITIES_LIST_JSON_KEY, handleRequestArray(request.getParameter("accessibility"))));
          return_data.add("license_options_list", getSearchDropdownList(context, DOECODEUtils.LICENSE_OPTIONS_LIST_JSON, DOECODEUtils.LICENSE_JLIST_SON_KEY, handleRequestArray(request.getParameter("licenses"))));
          return_data.add("software_type_options_list", getSearchDropdownList(context, DOECODEUtils.SOFTWARE_TYPES_LIST_JSON, DOECODEUtils.SOFTWARE_TYPES_LIST_JSON_KEY, handleRequestArray(request.getParameter("software_type"))));
          return_data.add("search_description", getSearchResultsDescription(post_data, context));
          if (!invalid_search_data) {
               return_data.add("search_facets_data", search_result_data.get("facets"));
               return_data.add("year_facets_data", getYearFacetsData(search_result_data.get("facets").asObject()));
          }

          return return_data;
     }

     private static JsonArray getYearFacetsData(JsonObject facets) {
          JsonArray return_data = new JsonArray();
          List<String> keys = facets.names();

          for (String key : keys) {
               //Get our needed values
               JsonObject row = new JsonObject();
               int year = Integer.parseInt(StringUtils.substring(key, 0, 4));
               int count = facets.get(key).asInt();
               row.add("year", year);
               row.add("count", count);

               return_data.add(row);
          }
          return return_data;
     }

     private static JsonObject getSearchResultsDescription(JsonObject post_data, ServletContext context) {
          JsonObject return_data = new JsonObject();
          JsonArray search_description_list = new JsonArray();

          //All Fields
          if (StringUtils.isNotBlank(post_data.getString("all_fields", ""))) {
               search_description_list.add(makeSearchDescriptionObject("Keywords", post_data.getString("all_fields", ""), "all_fields"));
          }

          //Software Title
          if (StringUtils.isNotBlank(post_data.getString("software_title", ""))) {
               search_description_list.add(makeSearchDescriptionObject("Software Title", post_data.getString("software_title", ""), "software_title"));
          }

          //Developers/Contributors
          if (StringUtils.isNotBlank(post_data.getString("developers_contributors", ""))) {
               search_description_list.add(makeSearchDescriptionObject("Developers/Contributors", post_data.getString("developers_contributors", ""), "developers_contributors"));
          }

          //Biblio Data
          if (StringUtils.isNotBlank(post_data.getString("biblio_data", ""))) {
               search_description_list.add(makeSearchDescriptionObject("Bibliographic Data", post_data.getString("biblio_data", ""), "biblio_data"));
          }

          //Identifiers
          if (StringUtils.isNotBlank(post_data.getString("identifiers", ""))) {
               search_description_list.add(makeSearchDescriptionObject("Identifiers", post_data.getString("identifiers", ""), "identifiers"));
          }

          //Date Earliest
          if (StringUtils.isNotBlank(post_data.getString("date_earliest", ""))) {
               String date_earliest_trimmed = post_data.getString("date_earliest", "");
               //Remove everything T and after
               date_earliest_trimmed = date_earliest_trimmed.substring(0, date_earliest_trimmed.indexOf("T"));
               //Test the date, and see whether it's valid or not
               if (DOECODEUtils.isValidDateOfPattern(RELEASE_DATE_FORMAT, date_earliest_trimmed)) {
                    //Format it to a date that we want to see
                    date_earliest_trimmed = LocalDate.parse(date_earliest_trimmed, RELEASE_DATE_FORMAT).format(SEARCH_RESULTS_DESCRIPTION_FORMAT);
               }
               //Now, we show it
               search_description_list.add(makeSearchDescriptionObject("Earliest Release Date", date_earliest_trimmed, "date_earliest"));
          }

          //Date Latest
          if (StringUtils.isNotBlank(post_data.getString("date_latest", ""))) {
               String date_latest_trimmed = post_data.getString("date_latest", "");
               //Remove everythign T and after
               date_latest_trimmed = date_latest_trimmed.substring(0, date_latest_trimmed.indexOf("T"));
               //Test the date, and see whether it's valid or not
               if (DOECODEUtils.isValidDateOfPattern(RELEASE_DATE_FORMAT, date_latest_trimmed)) {
                    //Format it to a date that we want to see
                    date_latest_trimmed = LocalDate.parse(date_latest_trimmed, RELEASE_DATE_FORMAT).format(SEARCH_RESULTS_DESCRIPTION_FORMAT);
               }
               //Show it
               search_description_list.add(makeSearchDescriptionObject("Latest Release Date", date_latest_trimmed, "date_latest"));
          }

          //Accessibility
          String accessibility_array = post_data.getString("accessibility", "");
          if (StringUtils.isNotBlank(accessibility_array) && Json.parse(accessibility_array).asArray().size() > 0) {
               //Get teh accessibility array so we can get some display values
               JsonArray accessiblity_display_vals = new JsonArray();
               try {
                    accessiblity_display_vals = DOECODEUtils.getJsonList((context.getRealPath("./json") + "/" + DOECODEUtils.AVAILABILITIES_LIST_JSON), DOECODEUtils.AVAILABILITIES_LIST_JSON_KEY);
               } catch (Exception e) {
                    log.severe("Couldn't get accessiblity json file: " + e.getMessage());
               }

               search_description_list.add(makeSearchDescriptionObjectArray("Accessibility", Json.parse(accessibility_array).asArray(), "accessibility", accessiblity_display_vals));
          }

          //Software Type
          String software_type_array = post_data.getString("software_type", "");
          if (StringUtils.isNotBlank(software_type_array) && Json.parse(software_type_array).asArray().size() > 0) {
               //Get the software_type array so we can get display values
               JsonArray software_type_display_vals = new JsonArray();
               try {
                    software_type_display_vals = DOECODEUtils.getJsonList((context.getRealPath("./json") + "/" + DOECODEUtils.SOFTWARE_TYPES_LIST_JSON), DOECODEUtils.SOFTWARE_TYPES_LIST_JSON_KEY);
               } catch (Exception e) {
                    log.severe("Couldn't get accessiblity json file: " + e.getMessage());
               }

               search_description_list.add(makeSearchDescriptionObjectArray("Software Type", Json.parse(software_type_array).asArray(), "software_type", software_type_display_vals));
          }
          //Licenses
          String license_array = post_data.getString("licenses", "");
          if (StringUtils.isNotBlank(license_array) && Json.parse(license_array).asArray().size() > 0) {
               search_description_list.add(makeSearchDescriptionObjectArray("Licenses", Json.parse(license_array).asArray(), "licenses", null));
          }

          //Research Organization
          String research_org_array = post_data.getString("research_organization", "");
          if (StringUtils.isNotBlank(research_org_array) && Json.parse(research_org_array).asArray().size() > 0) {
               search_description_list.add(makeSearchDescriptionObjectArray("Research Organization", Json.parse(research_org_array).asArray(), "research_organization", null));
          }

          //Sponsoring Organization
          String sponsoring_organization = post_data.getString("sponsoring_organization", "");
          if (StringUtils.isNotBlank(sponsoring_organization) && Json.parse(sponsoring_organization).asArray().size() > 0) {
               search_description_list.add(makeSearchDescriptionObjectArray("Sponsoring Organization", Json.parse(sponsoring_organization).asArray(), "sponsoring_organization", null));
          }

          //ORCID
          if (StringUtils.isNotBlank(post_data.getString("orcid", ""))) {
               search_description_list.add(makeSearchDescriptionObject("ORCID", post_data.getString("orcid", ""), "orcid"));
          }
          return_data.add("search_description_list", search_description_list);
          return_data.add("is_targeted_search", StringUtils.isNotBlank(post_data.getString("all_fields", "")));
          return_data.add("had_things_to_search_by", search_description_list.size() > 0);
          return return_data;
     }

     private static JsonObject makeSearchDescriptionObject(String displayField, String display_value, String field) {
          JsonObject return_data = new JsonObject();
          return_data.add("displayField", displayField);
          return_data.add("value", display_value);
          return_data.add("field", field);
          return return_data;
     }

     private static JsonObject makeSearchDescriptionObjectArray(String displayField, JsonArray values, String field, JsonArray display_vals_array) {
          JsonObject return_data = new JsonObject();
          return_data.add("displayField", displayField);

          JsonArray values_to_show = values;
          //If we have a display vals array, we'll through there and grab the display values we actually want to show
          if (display_vals_array != null) {
               JsonArray new_vals = new JsonArray();
               for (JsonValue v : values) {
                    String val = v.asString();
                    //Go through array we passed in, and find the label, which is the display value we want to show
                    for (JsonValue disp : display_vals_array) {
                         if (disp.asObject().getString("value", "").equals(val)) {
                              new_vals.add(disp.asObject().getString("label", ""));
                              break;
                         }
                    }
               }
               values_to_show = new_vals;
          }

          //Add some content to the objects in the array we send back
          JsonArray values_arr = new JsonArray();
          for (int i = 0; i < values_to_show.size(); i++) {
               JsonObject row = new JsonObject();
               row.add("value", values_to_show.get(i).asString());
               row.add("orig_value", values.get(i).asString());
               row.add("field", field);
               row.add("is_first", i == 0);
               values_arr.add(row);
          }
          return_data.add("value", values_arr);

          return_data.add("field", field);
          return_data.add("is_array", true);
          return return_data;
     }

     private static JsonArray getSearchDropdownList(ServletContext context, String list, String list_key, JsonArray selected) {
          JsonArray return_data = new JsonArray();
          try {
               String jsonPath = context.getRealPath("./json");
               return_data = DOECODEUtils.getJsonList(jsonPath + "/" + list, list_key);
          } catch (IOException ex) {
               log.severe("Exception in gettin search sidebar Options: " + ex.getMessage());
          }

          /*Go through the array, and if we have that selected, we'll set a flag that says it's checked*/
          for (int i = 0; i < return_data.size(); i++) {
               JsonObject row = return_data.get(i).asObject();

               String current_row_val = row.getString("value", "");
               for (JsonValue v : selected) {
                    if (v.asString().equals(current_row_val)) {
                         row.add("is_checked", true);
                         return_data.set(i, row);
                         break;
                    }
               }

          }

          return return_data;
     }

     private static JsonObject sort_dropdownOptions(ServletContext context, String sort_value) {
          JsonObject options_obj = new JsonObject();
          JsonArray options = new JsonArray();
          String current = "";
          try {
               String jsonPath = context.getRealPath("./json");
               options = DOECODEUtils.getJsonList((jsonPath + "/" + DOECODEUtils.SEARCH_SORT_OPTIONS_LIST_JSON), DOECODEUtils.SEARCH_SORT_LIST_JSON_KEY);
               for (JsonValue j : options) {
                    if (j.asObject().getString("value", "").equals(sort_value)) {
                         current = j.asObject().getString("label", "");
                         break;
                    }
               }
          } catch (IOException ex) {
               log.severe("Exception in gettin search sort Options: " + ex.getMessage());
          }

          options_obj.add("sort_dropdown_options", options);
          options_obj.add("current", current);
          return options_obj;
     }

     private static JsonObject getPaginationData(JsonObject search_form_data, long num_found) {
          JsonObject return_data = new JsonObject();
          long start = search_form_data.getLong("start", 0);
          long rows = search_form_data.getLong("rows", 10);

          long page = ((int) (start / rows) + 1);
          long max_pages = ((int) (num_found / rows) + 1);

          return_data.add("pagination_btn_prev_disabled", page < 2);
          return_data.add("pagination_btn_next_disabled", (start + rows >= num_found));
          return_data.add("pagination_btn_choose_disabled", max_pages < 2);
          return_data.add("min_pages", 1);
          return_data.add("max_pages", max_pages);
          return_data.add("current_page", page);

          return return_data;
     }

     private static JsonArray handleRequestArray(String value) {
          JsonArray request_array = new JsonArray();
          if (StringUtils.isNotBlank(value) && !StringUtils.equals("[]", value)) {
               JsonArray temp_array = new JsonArray();
               for (JsonValue v : Json.parse(value).asArray()) {
                    temp_array.add(Jsoup.clean(v.asString(), Whitelist.basic()));
               }
               request_array = temp_array;
          }

          return request_array;
     }

     private static JsonArray processSearchResultData(JsonArray search_result_list, long start, long num_found) {
          JsonArray return_data = new JsonArray();

          for (int i = 0; i < search_result_list.size(); i++) {
               JsonObject row = search_result_list.get(i).asObject();

               JsonObject newRow = new JsonObject();
               newRow.add("code_id", row.getLong("code_id", 0));
               newRow.add("release_date", row.getString("release_date", ""));
               newRow.add("show_release_date", StringUtils.isNotBlank(row.getString("release_date", "")));
               newRow.add("software_title", row.getString("software_title", ""));

               //Devs and contributors
               /*We need to remove all but 3 of the devs and contributors, since this is the search page*/
               JsonArray devContributors = combineDevContributorNames(row.get("developers").asArray(), row.get("contributors").asArray());
               JsonArray devContributorsTrimmed = new JsonArray();
               boolean is_more_than_3 = false;
               if (devContributors.size() > 3) {//If we have more than 3, then we want to trim the list down to just 3
                    for (int x = 0; x < 3; x++) {//If we have 3 or less, we'll just set the list directly
                         devContributorsTrimmed.add(devContributors.get(x));
                    }
                    is_more_than_3 = true;
               } else {
                    devContributorsTrimmed = devContributors;
               }

               newRow.add("dev_contributors", getDevAndContributorLink(devContributorsTrimmed, false, is_more_than_3, false));
               newRow.add("descriptionObj", getDescription(row.getString("description", ""), 100));
               newRow.add("searchRowLandingLinks", getDoiReposLinks(row.getString("doi", ""), row.getString("repository_link", ""), row.getString("landing_page", ""), row.getString("release_date", "")));

               //Get the sponsorOrgRow number. The sponsorOrgRow number is where we start, plus 1, plus the index we're on
               newRow.add("list_number", ((start + 1) + i));

               //Get teh classes that will contain the result sponsorOrgRow
               newRow.add("result_column_classes", (num_found > 9999) ? "col-sm-2 col-xs-12 search-result-count-column" : "col-sm-1 col-xs-2 search-result-count-column");
               newRow.add("result_subrow_classes", (num_found > 9999) ? "col-sm-10 col-xs-12 search-result-sub-row" : "col-sm-11 col-xs-10 search-result-sub-row");

               return_data.add(newRow);
          }

          return return_data;
     }

     private static JsonArray combineDevContributorNames(JsonArray developers, JsonArray contributors) {
          JsonArray return_data = new JsonArray();

          if (developers != null) {
               for (JsonValue v : developers) {
                    JsonObject row = v.asObject();
                    //Get the first and last names, strip out any nulls, undefineds, and such from bad, old data
                    String first_name = row.getString("first_name", "").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");
                    String last_name = row.getString("last_name", "").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");

                    //Combine the names
                    String combined_name = last_name + ", " + first_name;

                    //If we still had anything left over, we'll assume we have a properly combined name
                    if (StringUtils.isNotBlank(combined_name.replaceAll(" ", "").replaceAll(",", ""))) {
                         row.add("combined_name", combined_name);
                         row.add("author_type", "developer");
                         return_data.add(row);
                    }
               }
          }

          if (contributors != null) {
               for (JsonValue v : contributors) {
                    JsonObject row = v.asObject();
                    //Get the first and last names, strip out any nulls, undefineds, and such from bad, old data
                    String first_name = row.getString("first_name", "").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");
                    String last_name = row.getString("last_name", "").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");

                    //Combine the names
                    String combined_name = last_name + ", " + first_name;

                    //If we still had anything left over, we'll assume we have a properly combined name
                    if (StringUtils.isNotBlank(combined_name.replaceAll(" ", "").replaceAll(",", ""))) {
                         row.add("combined_name", combined_name);
                         row.add("author_type", "contributor");
                         return_data.add(row);
                    }
               }
          }

          return return_data;
     }

     private static JsonObject getDevAndContributorLink(JsonArray authorlist, boolean showAffiliations, boolean showEllipsis, boolean showOrcid) {
          JsonObject return_data = new JsonObject();
          //We need to go ahead and tack on the lack of a need of a semi-colon after a given author
          if (authorlist.size() > 0) {
               JsonValue last_row = authorlist.get(authorlist.size() - 1);
               last_row.asObject().add("is_last", true);
               authorlist.set(authorlist.size() - 1, last_row);
          }

          //Now, we have a lot to do with each author
          int affiliations_count = 1;
          JsonArray affiliations_list = new JsonArray();
          for (int i = 0; i < authorlist.size(); i++) {
               JsonObject current_row = authorlist.get(i).asObject();

               //We need to know whether this author has an orcid or not
               current_row.add("showOrcid", StringUtils.isNotBlank(current_row.getString("orcid", "")) && showOrcid);

               if (showAffiliations) {
                    JsonArray countArray = new JsonArray();
                    //Go through each affiliation. If it's a valid one, tack on another number to show in the superscript thing in the link
                    if (current_row.get("affiliations") != null && current_row.get("affiliations").asArray().size() > 0) {
                         //Go through each affiliation, and if it's not "null", add a number for it to the authorlist of developers/contributors
                         for (JsonValue v : current_row.get("affiliations").asArray()) {
                              if (!v.isNull() && !StringUtils.equalsIgnoreCase(v.asString(), "null")) {
                                   countArray.add(affiliations_count);
                                   affiliations_list.add(v.asString());
                                   affiliations_count++;
                              }
                         }
                    }
                    //Add the counts needed to this given developer/contributor
                    current_row.add("sup_count", countArray);
                    current_row.add("show_sup", countArray.size() > 0);
               }

               authorlist.set(i, current_row);
          }

          //Only if want affiliations will we struggle through this
          return_data.add("affiliations_list", affiliations_list);
          return_data.add("list", authorlist);
          return_data.add("show_ellipsis", showEllipsis);
          return_data.add("show_affiliations", showAffiliations && affiliations_list.size() > 0);
          return return_data;
     }

     private static JsonObject getDescription(String description, int moreLessValue) {
          JsonObject return_data = new JsonObject();
          String description_pt1 = description;
          String description_pt2 = "";

          //Now, let's do some parsing
          String[] description_words = StringUtils.split(description, " ");
          boolean needs_toggle = description_words.length > moreLessValue;
          if (needs_toggle) {
               //Take out only the first moreLessValue words. Man, this is easier in javascript
               description_pt1 = String.join(" ", Arrays.asList(description_words).subList(0, moreLessValue));
               description_pt2 = String.join(" ", Arrays.asList(description_words).subList(moreLessValue, description_words.length));
          }

          return_data.add("description_pt1", description_pt1);
          return_data.add("description_pt2", description_pt2);
          return_data.add("needs_toggle", needs_toggle);
          return return_data;
     }

     private static JsonObject getDoiReposLinks(String doi, String repository_link, String landing_page, String release_date) {
          JsonObject return_data = new JsonObject();
          boolean has_doi = StringUtils.isNotBlank(doi);
          boolean has_repos_link = StringUtils.isNotBlank(repository_link) || StringUtils.isNotBlank(landing_page);

          return_data.add("show_doi", has_doi && StringUtils.isNotBlank(release_date));
          return_data.add("doi", doi);
          return_data.add("fixed_doi", "https://doi.org/" + doi);
          return_data.add("show_divider", has_doi && has_repos_link);
          return_data.add("has_repository_link", StringUtils.isNotBlank(repository_link));
          return_data.add("has_landing_page", StringUtils.isNotBlank(landing_page));
          return_data.add("repository_link", (StringUtils.startsWith(repository_link, "http:") || StringUtils.startsWith(repository_link, "https:")) ? repository_link : "http://" + repository_link);
          return_data.add("landing_page", (StringUtils.startsWith(landing_page, "http:") || StringUtils.startsWith(landing_page, "https:")) ? landing_page : "http://" + landing_page);

          return return_data;
     }

     public static JsonObject getAdvancedSearchPageLists(ServletContext context) throws IOException {
          JsonObject return_data = new JsonObject();
          String jsonPath = context.getRealPath("./json");
          return_data.add("affiliations_list", DOECODEUtils.getJsonList((jsonPath + "/" + DOECODEUtils.AVAILABILITIES_LIST_JSON), DOECODEUtils.AVAILABILITIES_LIST_JSON_KEY));
          return_data.add("licenses_list", DOECODEUtils.getJsonList((jsonPath + "/" + DOECODEUtils.LICENSE_OPTIONS_LIST_JSON), DOECODEUtils.LICENSE_JLIST_SON_KEY));
          return_data.add("research_org_list", DOECODEUtils.getJsonList((jsonPath + "/" + DOECODEUtils.RESEARCH_ORG_LIST_JSON), DOECODEUtils.RESEARCH_ORG_LIST_JSON_KEY));
          return_data.add("sponsor_org_list", DOECODEUtils.getJsonList((jsonPath + "/" + DOECODEUtils.SPONSOR_ORG_LIST_JSON), DOECODEUtils.SPONSOR_ORG_LIST_JSON_KEY));
          return_data.add("sort_list", DOECODEUtils.getJsonList((jsonPath + "/" + DOECODEUtils.SEARCH_SORT_OPTIONS_LIST_JSON), DOECODEUtils.SEARCH_SORT_LIST_JSON_KEY));

          return return_data;
     }

     public static JsonArray getSearchBreadcrumbTrailList(JsonObject search_form_data, long num_found) {
          JsonArray return_data = new JsonArray();
          return_data.add("<a title='DOE CODE Homepage' href='/doecode'> DOE CODE</a>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;");

          String all_fields_text = "Search for " + (StringUtils.isNotBlank(search_form_data.getString("all_fields", "")) ? search_form_data.getString("all_fields", "") : "All Projects");
          String filter_suffix = (getWasAnythingFilteredFor(search_form_data)) ? "<span class='search-for-filter-crumb'>(filtered)</span>" : "";
          return_data.add(all_fields_text + filter_suffix);

          if (num_found > 0) {
               long start = search_form_data.getLong("start", 0);
               long rows = search_form_data.getLong("rows", 10);

               long page = ((int) (start / rows) + 1);
               long max_pages = ((int) (num_found / rows) + 1);

               if (max_pages > 1) {
                    return_data.add("&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;Page&nbsp;" + Long.toString(page) + "&nbsp;of&nbsp;" + Long.toString(max_pages) + "&nbsp;");
               }
          }

          return return_data;
     }

     public static boolean getWasAnythingFilteredFor(JsonObject request_data) {
          return StringUtils.isNotBlank(request_data.getString("software_title", ""))
                  || StringUtils.isNotBlank(request_data.getString("developers_contributors", ""))
                  || StringUtils.isNotBlank(request_data.getString("biblio_data", ""))
                  || StringUtils.isNotBlank(request_data.getString("identifiers", ""))
                  || StringUtils.isNotBlank(request_data.getString("date_earliest", ""))
                  || StringUtils.isNotBlank(request_data.getString("date_latest", ""))
                  || (StringUtils.isNotBlank(request_data.getString("accessibility", ""))
                  && Json.parse(request_data.getString("accessibility", "")).asArray().size() > 0)
                  || (StringUtils.isNotBlank(request_data.getString("licenses", ""))
                  && Json.parse(request_data.getString("licenses", "")).asArray().size() > 0)
                  || (StringUtils.isNotBlank(request_data.getString("research_organization", ""))
                  && Json.parse(request_data.getString("research_organization", "")).asArray().size() > 0)
                  || (StringUtils.isNotBlank(request_data.getString("sponsoring_organization", ""))
                  && Json.parse(request_data.getString("sponsoring_organization", "")).asArray().size() > 0)
                  || StringUtils.isNotBlank(request_data.getString("orcid", ""));
     }

     public static JsonObject getBiblioSidebarData(JsonObject search_data, String api_url) {
          JsonObject return_data = new JsonObject();
          //DOI and release date
          return_data.add("has_doi_and_release", (StringUtils.isNotBlank(search_data.getString("doi", "")) && StringUtils.isNotBlank(search_data.getString("release_date", ""))));
          return_data.add("doi", search_data.getString("doi", ""));

          //Repository URL
          boolean is_publicly_accessible = StringUtils.isNotBlank(search_data.getString("repository_link", ""));
          String fulltextURL = is_publicly_accessible ? search_data.getString("repository_link", "") : search_data.getString("landing_page", "");
          String fulltextMsg = is_publicly_accessible ? "Publicly Accessible Repository" : "Project Landing Page";
          return_data.add("is_publicly_accessible", is_publicly_accessible);
          return_data.add("fulltextMsg", fulltextMsg);
          return_data.add("fulltextURL", (StringUtils.startsWith(fulltextURL, "https://") || StringUtils.startsWith(fulltextURL, "http://")) ? fulltextURL : "http://" + fulltextURL);

          //Code ID
          return_data.add("code_id", search_data.getLong("code_id", 0));

          //DOE CODE API URL
          return_data.add("api_url", api_url);

          return return_data;
     }

     public static JsonObject getSponsoringOrgData(JsonArray sponsoring_orgs) {
          JsonObject return_data = new JsonObject();
          JsonArray list = new JsonArray();

          for (int i = 0; i < sponsoring_orgs.size(); i++) {
               JsonObject sponsorOrgRow = sponsoring_orgs.get(i).asObject();
               JsonObject refinedSponsorOrgRow = new JsonObject();

               refinedSponsorOrgRow.add("org_name", sponsorOrgRow.getString("organization_name", ""));
               JsonArray AwardNums = new JsonArray();
               JsonArray FWPNums = new JsonArray();
               JsonArray BRCodes = new JsonArray();

               //Go through the array, look for the different types of numbers, and add them to the list
               for (JsonValue identifier : sponsorOrgRow.get("funding_identifiers").asArray()) {
                    JsonObject identifierRow = identifier.asObject();
                    String identifier_value = identifierRow.getString("identifier_value", "");
                    switch (identifierRow.getString("identifier_type", "")) {
                         case "AwardNumber":
                              AwardNums.add(identifier_value);
                              break;
                         case "FWPNumber":
                              FWPNums.add(identifier_value);
                              break;
                         case "BRCode":
                              BRCodes.add(identifier_value);
                              break;
                    }
               }

               //Primary Award
               String primary_award = sponsorOrgRow.getString("primary_award", "");
               refinedSponsorOrgRow.add("has_primary_award", StringUtils.isNotBlank(primary_award) && !StringUtils.equals(primary_award.toLowerCase(), "unknown"));
               refinedSponsorOrgRow.add("primary_award", primary_award);

               //Award Numbers
               refinedSponsorOrgRow.add("has_award_numbers", AwardNums.size() > 0);
               refinedSponsorOrgRow.add("award_nums", AwardNums);

               //FWP NumberS
               refinedSponsorOrgRow.add("has_fwp_numbers", FWPNums.size() > 0);
               refinedSponsorOrgRow.add("fwp_nums", FWPNums);

               //BR CODES
               refinedSponsorOrgRow.add("has_br_codes", BRCodes.size() > 0);
               refinedSponsorOrgRow.add("br_codes", BRCodes);

               //If this is the last row, note it, because that affects the UI of the template
               if ((i + 1) == sponsoring_orgs.size()) {
                    refinedSponsorOrgRow.add("is_last", true);
               }
               list.add(refinedSponsorOrgRow);
          }

          return_data.add("list", list);
          return_data.add("has_sponsoring_org", list.size() > 0);
          return return_data;
     }

     public static JsonArray getResearchOrganizations(JsonArray researchOrgs) {
          JsonArray return_data = new JsonArray();
          for (JsonValue v : researchOrgs) {
               return_data.add(v.asObject().getString("organization_name", ""));
          }
          return return_data;
     }

     public static JsonArray combineAuthorLists(JsonArray arr1, JsonArray arr2) {
          JsonArray return_data = new JsonArray();

          for (JsonValue v : arr1) {
               JsonObject row = v.asObject();

               String combinedName = combineName(row.getString("first_name", ""), row.getString("middle_name", ""), row.getString("last_name", ""));

               if (StringUtils.isNotBlank(combinedName)) {
                    return_data.add(combinedName);
               }
          }

          for (JsonValue v : arr2) {
               JsonObject row = v.asObject();

               String combinedName = combineName(row.getString("first_name", ""), row.getString("middle_name", ""), row.getString("last_name", ""));

               if (StringUtils.isNotBlank(combinedName)) {
                    return_data.add(combinedName);
               }
          }

          return return_data;
     }

     private static String combineName(String first_name, String middle_name, String last_name) {
          String fullname = "";

          if (StringUtils.isNotBlank(last_name)) {
               fullname += last_name;
          }

          if (StringUtils.isNotBlank(fullname) && StringUtils.isNotBlank(first_name)) {
               fullname += (", " + first_name);
          }

          if (StringUtils.isNotBlank(fullname) && StringUtils.isNotBlank(middle_name.trim()) && StringUtils.length(middle_name.trim()) > 0) {
               fullname += (" " + middle_name.substring(0, 1) + ".");
          }

          return fullname;
     }

     public static String joinWithDelimiters(JsonArray list, String delimiter, String lastDelimiter) {
          String return_string = "";
          String last_item = "";

          if (list.size() > 1 && StringUtils.isNotBlank(lastDelimiter)) {
               last_item = list.get(list.size() - 1).asString();
               list = list.remove(list.size() - 1);
          }

          for (int i = 0; i < list.size(); i++) {
               return_string += list.get(i).asString();

               if ((i + 1) < list.size()) {
                    return_string += delimiter;
               }
          }

          if (StringUtils.isNotBlank(last_item)) {
               return_string += (lastDelimiter + last_item);
          }

          return return_string;
     }

     private static JsonObject getAPAFormat(JsonObject biblio_data) {
          JsonObject return_data = new JsonObject();

          boolean needsSpacing = false;

          //Authors
          JsonArray authors_and_contributors = combineAuthorLists(biblio_data.get("contributors").asArray(), biblio_data.get("developers").asArray());
          String author_text = joinWithDelimiters(authors_and_contributors, ", ", ", & ");
          if (StringUtils.isNotBlank(author_text)) {
               author_text += (StringUtils.endsWith(author_text, ".") ? "" : ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(author_text);

          //Release Date
          String release_date = "";
          if (StringUtils.isNotBlank(biblio_data.getString("release_date", ""))) {
               release_date = ((needsSpacing ? " " : "") + "(" + LocalDate.parse(biblio_data.getString("release_date", ""), RELEASE_DATE_FORMAT).format(APA_DATE_FORMAT) + ").");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(release_date);

          //Software Title
          String software_title = "";
          if (StringUtils.isNotBlank(biblio_data.getString("software_title", ""))) {
               software_title = (needsSpacing ? " " : "") + biblio_data.getString("software_title", "") + ".";
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(software_title);

          //Computer Software
          String computer_software = needsSpacing ? " [Computer software]." : "[Computer software].";

          //URL
          String url = "";
          if (StringUtils.isNotBlank(biblio_data.getString("repository_link", ""))) {
               url = ((needsSpacing ? " " : "") + biblio_data.getString("repository_link", "") + ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(url);

          //DOI
          String doi = "";
          if (StringUtils.isNotBlank(biblio_data.getString("doi", ""))) {
               doi = ((needsSpacing ? " " : "") + "doi:" + biblio_data.getString("doi", "") + ".");
          }

          return_data.add("authors", author_text);
          return_data.add("release_date", release_date);
          return_data.add("software_title", software_title);
          return_data.add("computer_software", computer_software);
          return_data.add("url", url);
          return_data.add("doi", doi);

          return return_data;
     }

     private static JsonObject getBibtexFormat(JsonObject biblio_data) {
          JsonObject return_data = new JsonObject();

          //Software Title
          String software_title = "{" + biblio_data.getString("software_title", "") + "}";

          //Authors Text
          JsonArray authors_and_contributors = combineAuthorLists(biblio_data.get("contributors").asArray(), biblio_data.get("developers").asArray());
          String author_text = joinWithDelimiters(authors_and_contributors, " and ", null);
          if (StringUtils.isNotBlank(author_text)) {
               author_text = ("{" + author_text + "}");
          }

          //Description
          String description = "";
          if (StringUtils.isNotBlank(biblio_data.getString("description", ""))) {
               description = "{" + biblio_data.getString("description", "") + "}";
          }

          //URL 
          String url = "";
          if (StringUtils.isNotBlank(biblio_data.getString("repository_link", ""))) {
               url = "{" + biblio_data.getString("repository_link", "") + "}";
          }

          //DOI
          String doi = "";
          if (StringUtils.isNotBlank(biblio_data.getString("doi", ""))) {
               doi = "{" + biblio_data.getString("doi", "") + "}";
          }

          //Release Date
          String release_date_year = "";
          String release_date_month = "";
          if (StringUtils.isNotBlank(biblio_data.getString("release_date", ""))) {
               LocalDate release_date = LocalDate.parse(biblio_data.getString("release_date", ""), RELEASE_DATE_FORMAT);
               release_date_year = Integer.toString(release_date.getYear());
               release_date_month = Integer.toString(release_date.getMonthValue());
          }

          return_data.add("code_id", biblio_data.getLong("code_id", 0));

          return_data.add("software_title", software_title);

          return_data.add("has_authors", StringUtils.isNotBlank(author_text));
          return_data.add("authors_text", author_text);

          return_data.add("has_description", StringUtils.isNotBlank(description));
          return_data.add("description", description);

          return_data.add("has_url", StringUtils.isNotBlank(url));
          return_data.add("url", url);

          return_data.add("has_doi", StringUtils.isNotBlank(doi));
          return_data.add("doi", doi);

          return_data.add("has_release_date_year", StringUtils.isNotBlank(release_date_year));
          return_data.add("release_date_year", release_date_year);

          return_data.add("has_release_date_month", StringUtils.isNotBlank(release_date_month));
          return_data.add("release_date_month", release_date_month);
          return return_data;
     }

     private static JsonObject getChicagoFormat(JsonObject biblio_data) {
          JsonObject return_data = new JsonObject();

          boolean needsSpacing = false;

          //Authors
          JsonArray authors_and_contributors = combineAuthorLists(biblio_data.get("contributors").asArray(), biblio_data.get("developers").asArray());
          String author_text = joinWithDelimiters(authors_and_contributors, ", ", ", and ");
          if (StringUtils.isNotBlank(author_text)) {
               author_text += (StringUtils.endsWith(author_text, ".") ? "" : ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(author_text);

          //Software Title
          String software_title = "";
          if (StringUtils.isNotBlank(biblio_data.getString("software_title", ""))) {
               String after_title = StringUtils.endsWith(biblio_data.getString("software_title", ""), ".")
                       || StringUtils.endsWith(biblio_data.getString("software_title", ""), "!")
                       || StringUtils.endsWith(biblio_data.getString("software_title", ""), "?")
                       ? "" : ".";
               software_title = (needsSpacing ? " " : "") + "\"" + biblio_data.getString("software_title", "") + after_title + "\" Computer software.";
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(software_title);

          //Release Date
          String release_date = "";
          if (StringUtils.isNotBlank(biblio_data.getString("release_date", ""))) {
               release_date = (needsSpacing ? " " : "") + LocalDate.parse(biblio_data.getString("release_date", "")).format(CHICAGO_DATE_FORMAT) + ".";
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(release_date);

          //URL
          String url = "";
          if (StringUtils.isNotBlank(biblio_data.getString("repository_link", ""))) {
               url = ((needsSpacing ? " " : "") + biblio_data.getString("repository_link", "") + ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(url);

          //DOI
          String doi = "";
          if (StringUtils.isNotBlank(biblio_data.getString("doi", ""))) {
               doi = ((needsSpacing ? " " : "") + "doi:" + biblio_data.getString("doi", "") + ".");
          }

          return_data.add("authors", author_text);
          return_data.add("software_title", software_title);
          return_data.add("release_date", release_date);
          return_data.add("url", url);
          return_data.add("doi", doi);
          return return_data;
     }

     private static JsonObject getMLAFormat(JsonObject biblio_data) {
          JsonObject return_data = new JsonObject();
          boolean needsSpacing = false;

          //Authors
          JsonArray authors_and_contributors = combineAuthorLists(biblio_data.get("contributors").asArray(), biblio_data.get("developers").asArray());
          String author_text = joinWithDelimiters(authors_and_contributors, ", ", ", and ");
          if (StringUtils.isNotBlank(author_text)) {
               author_text += (StringUtils.endsWith(author_text, ".") ? "" : ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(author_text);

          //Software Title
          String software_title = "";
          if (StringUtils.isNotBlank(biblio_data.getString("software_title", ""))) {
               software_title = (needsSpacing ? " " : "") + biblio_data.getString("software_title", "") + ".";
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(software_title);

          //Computer Software
          String computer_software = needsSpacing ? " Computer Software." : "ComputerSoftware.";

          //URL
          String url = "";
          if (StringUtils.isNotBlank(biblio_data.getString("repository_link", ""))) {
               url = (needsSpacing ? " " : "") + biblio_data.getString("repository_link", "") + ".";
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(url);

          //Sponsor Orgs
          String sponsor_orgs = "";
          JsonArray sponsor_orgs_list = new JsonArray();
          for (JsonValue v : biblio_data.get("sponsoring_organizations").asArray()) {
               sponsor_orgs_list.add(v.asObject().getString("organization_name", ""));
          }
          if (sponsor_orgs_list.size() > 0) {
               sponsor_orgs = joinWithDelimiters(sponsor_orgs_list, ", ", null);
               sponsor_orgs = (needsSpacing ? " " : "") + sponsor_orgs + (StringUtils.endsWith(sponsor_orgs, ".") ? "" : ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(sponsor_orgs);

          //Release Date
          String release_date = "";
          if (StringUtils.isNotBlank(biblio_data.getString("release_date", ""))) {
               release_date = (needsSpacing ? " " : "") + LocalDate.parse(biblio_data.getString("release_date", ""), RELEASE_DATE_FORMAT).format(MLA_DATE_FORMAT);
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(release_date);

          //Web
          String web = needsSpacing ? "Web." : " Web.";

          //DOI
          String doi = "";
          if (StringUtils.isNotBlank(biblio_data.getString("doi", ""))) {
               doi = ((needsSpacing ? " " : "") + "doi:" + biblio_data.getString("doi", "") + ".");
          }
          return_data.add("authorsText", author_text);
          return_data.add("softwareTitle", software_title);
          return_data.add("computer_software", computer_software);
          return_data.add("url", url);
          return_data.add("sponsorOrgsText", sponsor_orgs);
          return_data.add("releaseDate", release_date);
          return_data.add("web", web);
          return_data.add("doi", doi);
          return return_data;
     }

     public static JsonObject getBiblioData(long osti_id, ServletContext context) {
          JsonObject return_data = new JsonObject();
          boolean is_valid = true;
          String api_url = context.getInitParameter("api_url");

          //Connect to the api and grab our needed data
          CloseableHttpClient hc = HttpClientBuilder.create().setDefaultRequestConfig(RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000).setConnectionRequestTimeout(5000).build()).build();
          HttpGet get = new HttpGet(api_url + "search/" + osti_id);
          get.setHeader("Content-Type", "application/json");
          get.setHeader("Accept", "application/json");
          get.setHeader(CoreProtocolPNames.HTTP_CONTENT_CHARSET, Consts.UTF_8.name());
          String raw_json = "";
          try {
               HttpResponse response = hc.execute(get);
               raw_json = EntityUtils.toString(response.getEntity());
          } catch (Exception e) {
               is_valid = false;
               log.severe("Error in getting json: " + e.getMessage());
          } finally {
               try {
                    hc.close();
               } catch (IOException ex) {
                    log.severe("Bad issue in closing search connection: " + ex.getMessage());
               }
          }

          //Grab the metadata object out of our search
          JsonObject biblio_data = new JsonObject();
          try {
               biblio_data = Json.parse(raw_json).asObject().get("metadata").asObject();
               log.info(biblio_data.toString());
          } catch (Exception e) {
               is_valid = false;
               log.severe("Invalid JSON: " + e.getMessage());
          }

          //Massage any data that needs it
          if (is_valid) {
               JsonArray meta_tags = new JsonArray();
               String jsonpath = context.getRealPath("./json");
               /*Title*/
               return_data.add("title", biblio_data.getString("software_title", ""));
               meta_tags.add(makeMetaTag("title", biblio_data.getString("software_title", "")));

               /*Description*/
               return_data.add("descriptionObj", getDescription(biblio_data.getString("description", ""), 200));
               meta_tags.add(makeMetaTag("description", biblio_data.getString("description", "")));

               /*Developers and contributors*/
               JsonArray developers_combined = combineDevContributorNames(biblio_data.get("developers").asArray(), null);
               return_data.add("developers_list", getDevAndContributorLink(developers_combined, true, false, true));
               JsonArray developerslist = new JsonArray();
               for (JsonValue v : developers_combined) {
                    developerslist.add(v.asObject().getString("combined_name", ""));
               }
               meta_tags.add(makeMetaTag("developers", DOECODEUtils.makeSpaceSeparatedList(developerslist)));

               //Release Date
               return_data.add("release_date", biblio_data.getString("release_date", ""));
               return_data.add("has_release_date", StringUtils.isNotBlank(biblio_data.getString("release_date", "")));
               meta_tags.add(makeMetaTag("release_date", biblio_data.getString("release_date", "")));

               /*Code Availability*/
               JsonArray availabilityList = new JsonArray();
               try {
                    availabilityList = DOECODEUtils.getJsonList(jsonpath + "/" + DOECODEUtils.AVAILABILITIES_LIST_JSON, DOECODEUtils.AVAILABILITIES_LIST_JSON_KEY);
               } catch (Exception e) {
               }
               JsonObject availabilityObj = DOECODEUtils.getJsonListItem(availabilityList, "value", biblio_data.getString("accessibility", ""));
               return_data.add("availability", availabilityObj.getString("label", ""));
               return_data.add("has_availability", StringUtils.isNotBlank(biblio_data.getString("accessibility", "")));
               meta_tags.add(makeMetaTag("availability", availabilityObj.getString("label", "")));

               /*Software Type*/
               JsonArray softwareTypeList = new JsonArray();
               try {
                    softwareTypeList = DOECODEUtils.getJsonList(jsonpath + "/" + DOECODEUtils.SOFTWARE_TYPES_LIST_JSON, DOECODEUtils.SOFTWARE_TYPES_LIST_JSON_KEY);
               } catch (Exception e) {
               }
               JsonObject softwareTypeObj = DOECODEUtils.getJsonListItem(softwareTypeList, "value", biblio_data.getString("software_type", ""));
               return_data.add("software_type", softwareTypeObj.getString("label", ""));
               meta_tags.add(makeMetaTag("software_type", softwareTypeObj.getString("label", "")));

               /*Licenses*/
               return_data.add("licenses", biblio_data.get("licenses").asArray());
               return_data.add("has_licenses", biblio_data.get("licenses").asArray().size() > 0);
               meta_tags.add(makeMetaTag("licenses", DOECODEUtils.makeSpaceSeparatedList(biblio_data.get("licenses").asArray())));

               /*Sponsoring Org*/
               JsonObject sponsor_orgs = getSponsoringOrgData(biblio_data.get("sponsoring_organizations").asArray());
               return_data.add("sponsoring_org", sponsor_orgs);
               return_data.add("has_sponsoring_org", sponsor_orgs.getBoolean("has_sponsoring_org", false));
               JsonArray sponsororgslist = new JsonArray();
               for (JsonValue v : sponsor_orgs.get("list").asArray()) {
                    sponsororgslist.add(v.asObject().getString("org_name", ""));
               }
               meta_tags.add(makeMetaTag("sponsoring_org", DOECODEUtils.makeSpaceSeparatedList(sponsororgslist)));

               /*Code ID*/
               return_data.add("code_id", biblio_data.getLong("code_id", 0));
               meta_tags.add(makeMetaTag("code_id", Long.toString(biblio_data.getLong("code_id", 0))));

               /*Site accession Number*/
               return_data.add("site_accession_number", biblio_data.getString("site_accession_number", ""));
               return_data.add("has_site_accession_number", StringUtils.isNotBlank(biblio_data.getString("site_accession_number", "")));
               meta_tags.add(makeMetaTag("site_accession_number", biblio_data.getString("site_accession_number", "")));

               /*Research Orgs*/
               JsonArray research_org_data = getResearchOrganizations(biblio_data.get("research_organizations").asArray());
               return_data.add("research_orgs", research_org_data);
               return_data.add("has_research_org", research_org_data.size() > 0);
               meta_tags.add(makeMetaTag("research_orgs", DOECODEUtils.makeSpaceSeparatedList(research_org_data)));

               /*Country of origin*/
               return_data.add("country_of_origin", biblio_data.getString("country_of_origin", ""));
               return_data.add("has_country_of_origin", StringUtils.isNotBlank(biblio_data.getString("country_of_origin", "")));
               meta_tags.add(makeMetaTag("country_of_origin", biblio_data.getString("country_of_origin", "")));

               /*Citation formats*/
               return_data.add("mla", getMLAFormat(biblio_data));
               return_data.add("apa", getAPAFormat(biblio_data));
               return_data.add("bibtex", getBibtexFormat(biblio_data));
               return_data.add("chicago", getChicagoFormat(biblio_data));

               /*Biblio sidebar data*/
               return_data.add("biblio_sidebar", getBiblioSidebarData(biblio_data, api_url));

               /*Meta tags*/
               //Before we send the meta tags down, let's go ahead and remove all of the ones that didn't have any actual content
               JsonArray refined_meta_tags = new JsonArray();
               for (JsonValue v : meta_tags) {
                    if (StringUtils.isNotBlank(v.asObject().getString("content", ""))) {
                         refined_meta_tags.add(v);
                    }
               }
               return_data.add("meta_tag", refined_meta_tags);
          }

          return_data.add("is_valid", is_valid);

          return return_data;
     }

     private static JsonObject makeMetaTag(String name, String value) {
          JsonObject return_data = new JsonObject();
          return_data.add("name", name);
          return_data.add("content", value);
          return return_data;
     }

}
