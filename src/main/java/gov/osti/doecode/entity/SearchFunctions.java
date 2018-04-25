package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SearchFunctions {

     private final static Logger log = LoggerFactory.getLogger(SearchFunctions.class.getName());
     public static final DateTimeFormatter RELEASE_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
     public static final DateTimeFormatter APA_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy, MMMM dd");
     public static final DateTimeFormatter CHICAGO_DATE_FORMAT = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
     public static final DateTimeFormatter MLA_DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMM. yyyy.");
     public static final DateTimeFormatter SEARCH_RESULTS_DESCRIPTION_FORMAT = DateTimeFormatter.ofPattern("MM-dd-yyyy");

     public static ObjectNode conductSearch(HttpServletRequest request, ServletContext context, long page_num) {
          ObjectNode return_data = doSearchPost(request, Init.backend_api_url);

          //Get the search form data and get teh page number
          ObjectNode search_form_data = (ObjectNode) return_data.get("search_form_data");
          search_form_data.put("pageNum", page_num);

          //Add together all of the data, send it out
          return_data.put("had_results", JsonUtils.getLong(return_data, "search_result_count", 0) > 0);
          return_data.put("search_form_data", search_form_data);

          return return_data;
     }

     private static ObjectNode doSearchPost(HttpServletRequest request, String api_url) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          boolean had_error = false;
          boolean invalid_search_data = false;
          String error_message = "";

          long start = Long.parseLong(StringUtils.defaultIfBlank(request.getParameter("start"), "0"));
          long rows = Long.parseLong(StringUtils.defaultIfBlank(request.getParameter("rows"), "10"));

          //Get all of the data into a postable object
          ObjectNode post_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          post_data.put("all_fields", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("all_fields"), ""), Whitelist.basic()));
          post_data.put("software_title", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("software_title"), ""), Whitelist.basic()));
          post_data.put("developers_contributors", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("developers_contributors"), ""), Whitelist.basic()));
          post_data.put("biblio_data", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("biblio_data"), ""), Whitelist.basic()));
          post_data.put("identifiers", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("identifiers"), ""), Whitelist.basic()));
          post_data.put("date_earliest", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("date_earliest"), ""), Whitelist.basic()));
          post_data.put("date_latest", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("date_latest"), ""), Whitelist.basic()));
          post_data.put("start", start);
          post_data.put("rows", rows);
          post_data.put("sort", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("sort"), ""), Whitelist.basic()));
          post_data.put("orcid", Jsoup.clean(StringUtils.defaultIfBlank(request.getParameter("orcid"), ""), Whitelist.basic()));

          post_data.put("accessibility", handleRequestArray(request.getParameter("accessibility")));
          post_data.put("licenses", handleRequestArray(request.getParameter("licenses")));
          post_data.put("programming_languages", handleRequestArray(request.getParameter("programming_languages")));
          post_data.put("research_organization", handleRequestArray(request.getParameter("research_organization")));
          post_data.put("sponsoring_organization", handleRequestArray(request.getParameter("sponsoring_organization")));
          post_data.put("software_type", handleRequestArray(request.getParameter("software_type")));

          ObjectNode search_result_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          try {
               URL url = new URL(api_url + "search");
               HttpURLConnection conn = (HttpURLConnection) url.openConnection();
               conn.setConnectTimeout(5000);
               conn.setRequestProperty("Content-Type", "application/json; charset=UTF-8");
               conn.setDoOutput(true);
               conn.setDoInput(true);
               conn.setRequestMethod("POST");

               BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(conn.getOutputStream(), "UTF-8"));
               bw.write(post_data.toString());
               bw.flush();
               bw.close();

               BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
               StringBuilder result = new StringBuilder();
               String line;
               while ((line = rd.readLine()) != null) {
                    result.append(line);
               }

               conn.disconnect();

               if (JsonUtils.isValidObjectNode(result.toString())) {
                    search_result_data = JsonUtils.parseObjectNode(result.toString());
               } else {
                    invalid_search_data = true;
               }
          } catch (Exception ex) {
               log.error("Exception in search: " + ex.getMessage());
               had_error = true;
               invalid_search_data = true;
               error_message = "An error has occurred that is preventing your search from working.";
          }

          //Get the num found
          long num_found = JsonUtils.getLong(search_result_data, "num_found", 0);

          //Pull out the list of results and process the data so we only get what we want, assume we got correct data
          ArrayNode search_results_list = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
          if (search_result_data.get("docs") != null) {
               search_results_list = processSearchResultData((ArrayNode) search_result_data.get("docs"), start, num_found);
          }

          //Go through, and stringify all of the json array values, so they can sit on the page correctly
          ObjectNode search_form_data = post_data;
          for (String s : JsonUtils.getKeys(search_form_data)) {
               if (search_form_data.get(s).isArray()) {
                    //search_form_data.set(s, search_form_data.get(s).asArray().toString());
                    search_form_data.put(s, ((ArrayNode) search_form_data.get(s)).toString());
               }
          }

          //Give everything back
          return_data.put("search_result_count", num_found);
          return_data.put("had_error", had_error);
          return_data.put("error_message", error_message);
          return_data.put("search_form_data", search_form_data);
          return_data.put("search_results_list", search_results_list);
          return_data.put("pagination_btn", getPaginationData(search_form_data, num_found));
          return_data.put("breadcrumbTrailItem", getSearchBreadcrumbTrailList(post_data, num_found));
          return_data.put("search_sort_dropdown", sort_dropdownOptions(JsonUtils.getString(post_data, "sort", "")));
          return_data.put("availabilities_list", getSearchDropdownList(DOECODEServletContextListener.getJsonList(DOECODEJson.AVAILABILITY_KEY), handleRequestArray(request.getParameter("accessibility"))));
          return_data.put("license_options_list", getSearchDropdownList(DOECODEServletContextListener.getJsonList(DOECODEJson.LICENSE_KEY), handleRequestArray(request.getParameter("licenses"))));
          return_data.put("software_type_options_list", getSearchDropdownList(DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY), handleRequestArray(request.getParameter("software_type"))));
          return_data.put("search_description", getSearchResultsDescription(post_data));
          if (!invalid_search_data) {
               return_data.put("search_facets_data", search_result_data.get("facets"));
               return_data.put("year_facets_data", getYearFacetsData((ObjectNode) search_result_data.get("facets")));
          }

          return return_data;
     }

     private static ArrayNode getYearFacetsData(ObjectNode facets) {
          ArrayNode return_data = new ArrayNode(JsonUtils.FACTORY_INSTANCE);

          for (String key : JsonUtils.getKeys(facets)) {
               //Get our needed values
               ObjectNode row = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
               int year = Integer.parseInt(StringUtils.substring(key, 0, 4));
               int count = facets.get(key).asInt();
               row.put("year", year);
               row.put("count", count);

               return_data.add(row);
          }
          return return_data;
     }

     private static ObjectNode getSearchResultsDescription(ObjectNode post_data) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          ArrayNode search_description_list = new ArrayNode(JsonUtils.FACTORY_INSTANCE);

          //All Fields
          if (StringUtils.isNotBlank(JsonUtils.getString(post_data, "all_fields", ""))) {
               search_description_list.add(makeSearchDescriptionObject("Keywords", JsonUtils.getString(post_data, "all_fields", ""), "all_fields"));
          }

          //Software Title
          if (StringUtils.isNotBlank(JsonUtils.getString(post_data, "software_title", ""))) {
               search_description_list.add(makeSearchDescriptionObject("Software Title", JsonUtils.getString(post_data, "software_title", ""), "software_title"));
          }

          //Developers/Contributors
          if (StringUtils.isNotBlank(JsonUtils.getString(post_data, "developers_contributors", ""))) {
               search_description_list.add(makeSearchDescriptionObject("Developers/Contributors", JsonUtils.getString(post_data, "developers_contributors", ""), "developers_contributors"));
          }

          //Biblio Data
          if (StringUtils.isNotBlank(JsonUtils.getString(post_data, "biblio_data", ""))) {
               search_description_list.add(makeSearchDescriptionObject("Bibliographic Data", JsonUtils.getString(post_data, "biblio_data", ""), "biblio_data"));
          }

          //Identifiers
          if (StringUtils.isNotBlank(JsonUtils.getString(post_data, "identifiers", ""))) {
               search_description_list.add(makeSearchDescriptionObject("Identifiers", JsonUtils.getString(post_data, "identifiers", ""), "identifiers"));
          }

          //Date Earliest
          if (StringUtils.isNotBlank(JsonUtils.getString(post_data, "date_earliest", ""))) {
               String date_earliest_trimmed = JsonUtils.getString(post_data, "date_earliest", "");
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
          if (StringUtils.isNotBlank(JsonUtils.getString(post_data, "date_latest", ""))) {
               String date_latest_trimmed = JsonUtils.getString(post_data, "date_latest", "");
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
          String accessibility_array = JsonUtils.getString(post_data, "accessibility", "");
          if (StringUtils.isNotBlank(accessibility_array) && JsonUtils.parseArrayNode(accessibility_array).size() > 0) {
               //Get teh accessibility array so we can get some display values
               ArrayNode accessiblity_display_vals = DOECODEServletContextListener.getJsonList(DOECODEJson.AVAILABILITY_KEY);

               search_description_list.add(makeSearchDescriptionObjectArray("Accessibility", JsonUtils.parseArrayNode(accessibility_array), "accessibility", accessiblity_display_vals));
          }

          //Software Type
          String software_type_array = JsonUtils.getString(post_data, "software_type", "");
          if (StringUtils.isNotBlank(software_type_array) && JsonUtils.parseArrayNode(software_type_array).size() > 0) {
               //Get the software_type array so we can get display values
               ArrayNode software_type_display_vals = DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY);

               search_description_list.add(makeSearchDescriptionObjectArray("Software Type", JsonUtils.parseArrayNode(software_type_array), "software_type", software_type_display_vals));
          }

          //Licenses
          String license_array = JsonUtils.getString(post_data, "licenses", "");
          if (StringUtils.isNotBlank(license_array) && JsonUtils.parseArrayNode(license_array).size() > 0) {
               search_description_list.add(makeSearchDescriptionObjectArray("Licenses", JsonUtils.parseArrayNode(license_array), "licenses", null));
          }

          //Programming Languages
          String programming_languages_array = JsonUtils.getString(post_data, "programming_languages", "");
          if (StringUtils.isNotBlank(programming_languages_array) && JsonUtils.parseArrayNode(programming_languages_array).size() > 0) {
               search_description_list.add(makeSearchDescriptionObjectArray("Programming Language:", JsonUtils.parseArrayNode(programming_languages_array), "programming_languages", null));
          }

          //Research Organization
          String research_org_array = JsonUtils.getString(post_data, "research_organization", "");
          if (StringUtils.isNotBlank(research_org_array) && JsonUtils.parseArrayNode(research_org_array).size() > 0) {
               search_description_list.add(makeSearchDescriptionObjectArray("Research Organization", JsonUtils.parseArrayNode(research_org_array), "research_organization", null));
          }

          //Sponsoring Organization
          String sponsoring_organization = JsonUtils.getString(post_data, "sponsoring_organization", "");
          if (StringUtils.isNotBlank(sponsoring_organization) && JsonUtils.parseArrayNode(sponsoring_organization).size() > 0) {
               search_description_list.add(makeSearchDescriptionObjectArray("Sponsoring Organization", JsonUtils.parseArrayNode(sponsoring_organization), "sponsoring_organization", null));
          }

          //ORCID
          if (StringUtils.isNotBlank(JsonUtils.getString(post_data, "orcid", ""))) {
               search_description_list.add(makeSearchDescriptionObject("ORCID", JsonUtils.getString(post_data, "orcid", ""), "orcid"));
          }
          return_data.put("search_description_list", search_description_list);
          return_data.put("is_targeted_search", StringUtils.isNotBlank(JsonUtils.getString(post_data, "all_fields", "")));
          return_data.put("had_things_to_search_by", search_description_list.size() > 0);
          return return_data;
     }

     private static ObjectNode makeSearchDescriptionObject(String displayField, String display_value, String field) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          return_data.put("displayField", displayField);
          return_data.put("value", display_value);
          return_data.put("field", field);
          return return_data;
     }

     private static ObjectNode makeSearchDescriptionObjectArray(String displayField, ArrayNode values, String field, ArrayNode display_vals_array) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          return_data.put("displayField", displayField);

          ArrayNode values_to_show = values;
          //If we have a display vals array, we'll through there and grab the display values we actually want to show
          if (display_vals_array != null) {
               ArrayNode new_vals = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
               for (JsonNode v : values) {
                    String val = v.asText();
                    //Go through array we passed in, and find the label, which is the display value we want to show
                    for (JsonNode disp : display_vals_array) {
                         ObjectNode dispObj = (ObjectNode) disp;
                         if (JsonUtils.getString(dispObj, "value", "").equals(val)) {
                              new_vals.add(JsonUtils.getString(dispObj, "label", ""));
                              break;
                         }
                    }
               }
               values_to_show = new_vals;
          }

          //Add some content to the objects in the array we send back
          ArrayNode values_arr = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
          for (int i = 0; i < values_to_show.size(); i++) {
               ObjectNode row = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
               row.put("value", values_to_show.get(i).asText());
               row.put("orig_value", values.get(i).asText());
               row.put("field", field);
               row.put("is_first", i == 0);
               values_arr.add(row);
          }
          return_data.put("value", values_arr);

          return_data.put("field", field);
          return_data.put("is_array", true);
          return return_data;
     }

     private static ArrayNode getSearchDropdownList(ArrayNode list, ArrayNode selected) {
          ArrayNode return_data = JsonUtils.parseArrayNode(list.toString()); //Had to put this to string followed by parse because assigning return_data directly to list was causing a pass by reference issue

          /*Go through the array, and if we have that selected, we'll set a flag that says it's checked*/
          for (int i = 0; i < return_data.size(); i++) {
               ObjectNode row = (ObjectNode) return_data.get(i);

               String current_row_val = JsonUtils.getString(row, "value", "");
               for (JsonNode v : selected) {
                    if (v.asText().equals(current_row_val)) {
                         row.put("is_checked", true);
                         return_data.set(i, row);
                         break;
                    }
               }

          }

          return return_data;
     }

     private static ObjectNode sort_dropdownOptions(String sort_value) {
          ObjectNode options_obj = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          ArrayNode options = DOECODEServletContextListener.getJsonList(DOECODEJson.SEARCH_SORT_KEY);
          String current = "";

          for (JsonNode j : options) {
               ObjectNode jObj = (ObjectNode) j;
               if (JsonUtils.getString(jObj, "value", "").equals(sort_value)) {
                    current = JsonUtils.getString(jObj, "label", "");
                    break;
               }
          }

          options_obj.put("sort_dropdown_options", options);
          options_obj.put("current", current);
          return options_obj;
     }

     private static ObjectNode getPaginationData(ObjectNode search_form_data, long num_found) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          long start = JsonUtils.getLong(search_form_data, "start", 0);
          long rows = JsonUtils.getLong(search_form_data, "rows", 10);

          long page = ((int) (start / rows) + 1);
          long max_pages = ((int) (num_found / rows) + 1);

          return_data.put("pagination_btn_prev_disabled", page < 2);
          return_data.put("pagination_btn_next_disabled", (start + rows >= num_found));
          return_data.put("pagination_btn_choose_disabled", max_pages < 2);
          return_data.put("min_pages", 1);
          return_data.put("max_pages", max_pages);
          return_data.put("current_page", page);

          return return_data;
     }

     private static ArrayNode handleRequestArray(String value) {
          ArrayNode request_array = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
          if (StringUtils.isNotBlank(value) && !StringUtils.equals("[]", value)) {
               ArrayNode temp_array = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
               for (JsonNode v : JsonUtils.parseArrayNode(value)) {
                    temp_array.add(Jsoup.clean(v.asText(), Whitelist.basic()));
               }
               request_array = temp_array;
          }

          return request_array;
     }

     private static ArrayNode processSearchResultData(ArrayNode search_result_list, long start, long num_found) {
          ArrayNode return_data = new ArrayNode(JsonUtils.FACTORY_INSTANCE);

          for (int i = 0; i < search_result_list.size(); i++) {
               ObjectNode row = (ObjectNode) search_result_list.get(i);

               ObjectNode newRow = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
               Long code_id = JsonUtils.getLong(row, "code_id", 0);
               newRow.put("code_id", code_id);
               newRow.put("release_date", JsonUtils.getString(row, "release_date", ""));
               newRow.put("show_release_date", StringUtils.isNotBlank(JsonUtils.getString(row, "release_date", "")));
               newRow.put("software_title", JsonUtils.getString(row, "software_title", ""));

               //Devs and contributors
               /*We need to remove all but 3 of the devs and contributors, since this is the search page*/
               ArrayNode devContributors = combineDevContributorNames((ArrayNode) row.get("developers"), (ArrayNode) row.get("contributors"));
               ArrayNode devContributorsTrimmed = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
               boolean is_more_than_3 = false;
               if (devContributors.size() > 3) {//If we have more than 3, then we want to trim the list down to just 3
                    for (int x = 0; x < 3; x++) {//If we have 3 or less, we'll just set the list directly
                         devContributorsTrimmed.add(devContributors.get(x));
                    }
                    is_more_than_3 = true;
               } else {
                    devContributorsTrimmed = devContributors;
               }

               newRow.put("dev_contributors", getDevAndContributorLink(devContributorsTrimmed, false, is_more_than_3, false));
               newRow.put("descriptionObj", getDescription(JsonUtils.getString(row, "description", ""), 100));
               newRow.put("repository_links_list", getDoiReposLinks(code_id.toString(), JsonUtils.getString(row, "doi", ""), JsonUtils.getString(row, "repository_link", ""), JsonUtils.getString(row, "landing_page", ""), JsonUtils.getString(row, "release_date", "")));

               //Get the sponsorOrgRow number. The sponsorOrgRow number is where we start, plus 1, plus the index we're on
               newRow.put("list_number", ((start + 1) + i));

               //Get the classes that will contain the result sponsorOrgRow
               newRow.put("result_column_classes", (num_found > 9999) ? "col-sm-2 col-xs-12 search-result-count-column" : "col-sm-1 col-xs-2 search-result-count-column");
               newRow.put("result_subrow_classes", (num_found > 9999) ? "col-sm-10 col-xs-12 search-result-sub-row" : "col-sm-11 col-xs-10 search-result-sub-row");

               return_data.add(newRow);
          }

          return return_data;
     }

     private static ArrayNode combineDevContributorNames(ArrayNode developers, ArrayNode contributors) {
          ArrayNode return_data = new ArrayNode(JsonUtils.FACTORY_INSTANCE);

          if (developers != null) {
               for (JsonNode v : developers) {
                    ObjectNode row = (ObjectNode) v;
                    //Get the first and last names, strip out any nulls, undefineds, and such from bad, old data
                    String first_name = JsonUtils.getString(row, "first_name", "").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");
                    String last_name = JsonUtils.getString(row, "last_name", "").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");

                    //Combine the names
                    String combined_name = last_name + ", " + first_name;

                    //If we still had anything left over, we'll assume we have a properly combined name
                    if (StringUtils.isNotBlank(combined_name.replaceAll(" ", "").replaceAll(",", "")) && !first_name.equalsIgnoreCase("none") && !last_name.equalsIgnoreCase("none")) {
                         row.put("combined_name", combined_name);
                         row.put("author_type", "developer");
                         return_data.add(row);
                    }
               }
          }

          if (contributors != null) {
               for (JsonNode v : contributors) {
                    ObjectNode row = (ObjectNode) v;
                    //Get the first and last names, strip out any nulls, undefineds, and such from bad, old data
                    String first_name = JsonUtils.getString(row, "first_name", "").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");
                    String last_name = JsonUtils.getString(row, "last_name", "").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");

                    //Combine the names
                    String combined_name = last_name + ", " + first_name;

                    //If we still had anything left over, we'll assume we have a properly combined name
                    if (StringUtils.isNotBlank(combined_name.replaceAll(" ", "").replaceAll(",", "")) && !first_name.equalsIgnoreCase("none") && !last_name.equalsIgnoreCase("none")) {
                         row.put("combined_name", combined_name);
                         row.put("author_type", "contributor");
                         return_data.add(row);
                    }
               }
          }

          return return_data;
     }

     private static ObjectNode getDevAndContributorLink(ArrayNode authorlist, boolean showAffiliations, boolean showEllipsis, boolean showOrcid) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          //We need to go ahead and tack on the lack of a need of a semi-colon after a given author
          if (authorlist.size() > 0) {
               ObjectNode last_row = (ObjectNode) authorlist.get(authorlist.size() - 1);
               last_row.put("is_last", true);
               authorlist.set(authorlist.size() - 1, last_row);
          }

          //Now, we have a lot to do with each author
          int affiliations_count = 1;
          ArrayNode affiliations_list = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
          for (int i = 0; i < authorlist.size(); i++) {
               ObjectNode current_row = (ObjectNode) authorlist.get(i);

               //We need to know whether this author has an orcid or not
               current_row.put("showOrcid", StringUtils.isNotBlank(JsonUtils.getString(current_row, "orcid", "")) && showOrcid);

               if (showAffiliations) {
                    ArrayNode countArray = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
                    List<Integer> countList = new ArrayList<Integer>();
                    //Go through each affiliation. If it's a valid one, tack on another number to show in the superscript thing in the link
                    if (current_row.get("affiliations") != null && ((ArrayNode) current_row.get("affiliations")).size() > 0) {
                         //Go through each affiliation, and if it's not "null", add a number for it to the authorlist of developers/contributors
                         for (JsonNode v : (ArrayNode) current_row.get("affiliations")) {
                              if (!v.isNull() && !StringUtils.equalsIgnoreCase(v.asText(), "null")) {
                                   // if affiliation is already in the list, use previous
                                   boolean matchFound = false;
                                   for (int j = 0; j < affiliations_list.size(); j++) {
                                        if (StringUtils.equalsIgnoreCase(affiliations_list.get(j).asText(), v.asText())) {
                                             matchFound = true;
                                             //countArray.add(j + 1);
                                             countList.add(j + 1);
                                             break;
                                        }
                                   }

                                   if (!matchFound) {
                                        //countArray.add(affiliations_count);
                                        countList.add(affiliations_count);
                                        affiliations_list.add(v.asText());
                                        affiliations_count++;
                                   }
                              }
                         }
                    }
                    //Add the counts needed to this given developer/contributor
                    countList.sort(null);
                    for (Integer value : countList) {
                         countArray.add(value);
                    }
                    current_row.put("sup_count", countArray);
                    current_row.put("show_sup", countArray.size() > 0);
               }

               authorlist.set(i, current_row);
          }

          return_data.put("had_list", authorlist.size() > 0);
          return_data.put("affiliations_list", affiliations_list);
          return_data.put("list", authorlist);
          return_data.put("show_ellipsis", showEllipsis);
          return_data.put("show_affiliations", showAffiliations && affiliations_list.size() > 0);
          return return_data;
     }

     private static ObjectNode getDescription(String description, int moreLessValue) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
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

          return_data.put("description_pt1", description_pt1);
          return_data.put("description_pt2", description_pt2);
          return_data.put("needs_toggle", needs_toggle);
          return return_data;
     }

     private static ArrayNode getDoiReposLinks(String code_id, String doi, String repository_link, String landing_page, String release_date) {
          ArrayNode return_data = new ArrayNode(JsonUtils.FACTORY_INSTANCE);

          //doi
          if (StringUtils.isNotBlank(release_date) && StringUtils.isNotBlank(doi)) {
               String fixed_doi = "https://doi.org/" + doi;
               return_data.add(makeDOIRepoLinkObj("DOI: ", "DOI for Code ID " + code_id, code_id, fixed_doi, doi));
          }

          //repository link
          if (StringUtils.isNotBlank(repository_link)) {
               repository_link = (StringUtils.startsWith(repository_link, "http:") || StringUtils.startsWith(repository_link, "https:")) ? repository_link : "http://" + repository_link;
               return_data.add(makeDOIRepoLinkObj("", "Repository Link for Code ID", code_id, repository_link, "Repository Link"));
          }

          //Landing page
          if (StringUtils.isNotBlank(landing_page)) {
               landing_page = (StringUtils.startsWith(landing_page, "http:") || StringUtils.startsWith(landing_page, "https:")) ? landing_page : "http://" + landing_page;
               return_data.add(makeDOIRepoLinkObj("", "Landing Page for Code ID", code_id, landing_page, "Landing Page"));
          }

          //Mark the last one as "is_last"
          if (return_data.size() > 0) {
               int last_index = return_data.size() - 1;
               ObjectNode last_item = (ObjectNode) return_data.get(last_index);
               last_item.put("is_last", true);
               return_data.set(last_index, last_item);
          }
          return return_data;
     }

     private static ObjectNode makeDOIRepoLinkObj(String pretext, String title, String code_id, String href, String display) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          return_data.put("pretext", pretext);
          return_data.put("title", title);
          return_data.put("code_id", code_id);
          return_data.put("href", href);
          return_data.put("display", display);
          return return_data;
     }

     public static ObjectNode getAdvancedSearchPageLists() {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          return_data.put("availabilities_list", DOECODEServletContextListener.getJsonList(DOECODEJson.AVAILABILITY_KEY));
          return_data.put("licenses_list", DOECODEServletContextListener.getJsonList(DOECODEJson.LICENSE_KEY));
          return_data.put("software_type", DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY));
          return_data.put("research_org_list", DOECODEServletContextListener.getJsonList(DOECODEJson.RESEARCH_KEY));
          return_data.put("sponsor_org_list", DOECODEServletContextListener.getJsonList(DOECODEJson.SPONSOR_ORG_KEY));
          return_data.put("sort_list", DOECODEServletContextListener.getJsonList(DOECODEJson.SEARCH_SORT_KEY));
          return_data.put("programming_languages_list", DOECODEServletContextListener.getJsonList(DOECODEJson.PROGRAMMING_LANGUAGES_KEY));

          return return_data;
     }

     public static ArrayNode getSearchBreadcrumbTrailList(ObjectNode search_form_data, long num_found) {
          ArrayNode return_data = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
          return_data.add("<a title='DOE CODE Homepage' href='/" + Init.app_name + "/'> DOE CODE</a>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;");

          String all_fields_text = "Search for " + (StringUtils.isNotBlank(JsonUtils.getString(search_form_data, "all_fields", "")) ? JsonUtils.getString(search_form_data, "all_fields", "") : "All Projects");
          String filter_suffix = (getWasAnythingFilteredFor(search_form_data)) ? "<span class='search-for-filter-crumb'>(filtered)</span>" : "";
          return_data.add(all_fields_text + filter_suffix);

          if (num_found > 0) {
               long start = JsonUtils.getLong(search_form_data, "start", 0);
               long rows = JsonUtils.getLong(search_form_data, "rows", 10);

               long page = ((int) (start / rows) + 1);
               long max_pages = ((int) (num_found / rows) + 1);

               if (max_pages > 1) {
                    return_data.add("&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;Page&nbsp;" + Long.toString(page) + "&nbsp;of&nbsp;" + Long.toString(max_pages) + "&nbsp;");
               }
          }

          return return_data;
     }

     public static boolean getWasAnythingFilteredFor(ObjectNode request_data) {
          return StringUtils.isNotBlank(JsonUtils.getString(request_data, "software_title", ""))
                  || StringUtils.isNotBlank(JsonUtils.getString(request_data, "developers_contributors", ""))
                  || StringUtils.isNotBlank(JsonUtils.getString(request_data, "biblio_data", ""))
                  || StringUtils.isNotBlank(JsonUtils.getString(request_data, "identifiers", ""))
                  || StringUtils.isNotBlank(JsonUtils.getString(request_data, "date_earliest", ""))
                  || StringUtils.isNotBlank(JsonUtils.getString(request_data, "date_latest", ""))
                  || (StringUtils.isNotBlank(JsonUtils.getString(request_data, "accessibility", ""))
                  && JsonUtils.parseArrayNode(JsonUtils.getString(request_data, "accessibility", "")).size() > 0)
                  || (StringUtils.isNotBlank(JsonUtils.getString(request_data, "licenses", ""))
                  && JsonUtils.parseArrayNode(JsonUtils.getString(request_data, "licenses", "")).size() > 0)
                  || (StringUtils.isNotBlank(JsonUtils.getString(request_data, "research_organization", ""))
                  && JsonUtils.parseArrayNode(JsonUtils.getString(request_data, "research_organization", "")).size() > 0)
                  || (StringUtils.isNotBlank(JsonUtils.getString(request_data, "sponsoring_organization", ""))
                  && JsonUtils.parseArrayNode(JsonUtils.getString(request_data, "sponsoring_organization", "")).size() > 0)
                  || StringUtils.isNotBlank(JsonUtils.getString(request_data, "orcid", ""));
     }

     public static ObjectNode getBiblioSidebarData(ObjectNode search_data, String public_api_url) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          //DOI and release date
          return_data.put("has_doi_and_release", (StringUtils.isNotBlank(JsonUtils.getString(search_data, "doi", "")) && StringUtils.isNotBlank(JsonUtils.getString(search_data, "release_date", ""))));
          return_data.put("doi", JsonUtils.getString(search_data, "doi", ""));

          //Repository URL
          String repository_link = JsonUtils.getString(search_data, "repository_link", "");
          String landing_page = JsonUtils.getString(search_data, "landing_page", "");

          if (StringUtils.isNotBlank(repository_link)) {
               return_data.put("has_repo_link", true);
               return_data.put("repo_link", (StringUtils.startsWith(repository_link, "https://") || StringUtils.startsWith(repository_link, "http://")) ? repository_link : "http://" + repository_link);
          }

          if (StringUtils.isNotBlank(landing_page)) {
               return_data.put("has_landing_page", true);
               return_data.put("landing_page", (StringUtils.startsWith(landing_page, "https://") || StringUtils.startsWith(landing_page, "http://")) ? landing_page : "http://" + landing_page);
          }

          //Code ID
          return_data.put("code_id", JsonUtils.getLong(search_data, "code_id", 0));

          //DOE CODE API URL
          return_data.put("api_url", public_api_url);

          //Documentation URL
          return_data.put("documentation_url", JsonUtils.getString(search_data, "documentation_url", ""));
          return_data.put("has_documentation_url", StringUtils.isNotBlank(JsonUtils.getString(search_data, "documentation_url", "")));
          return return_data;
     }

     public static ObjectNode getSponsoringOrgData(ArrayNode sponsoring_orgs) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          ArrayNode list = new ArrayNode(JsonUtils.FACTORY_INSTANCE);

          for (int i = 0; i < sponsoring_orgs.size(); i++) {
               ObjectNode sponsorOrgRow = (ObjectNode) sponsoring_orgs.get(i);
               ObjectNode refinedSponsorOrgRow = new ObjectNode(JsonUtils.FACTORY_INSTANCE);

               refinedSponsorOrgRow.put("org_name", JsonUtils.getString(sponsorOrgRow, "organization_name", ""));
               ArrayNode AwardNums = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
               ArrayNode FWPNums = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
               ArrayNode BRCodes = new ArrayNode(JsonUtils.FACTORY_INSTANCE);

               //Go through the array, look for the different types of numbers, and add them to the list
               for (JsonNode identifier : (ArrayNode) sponsorOrgRow.get("funding_identifiers")) {
                    ObjectNode identifierRow = (ObjectNode) identifier;
                    String identifier_value = JsonUtils.getString(identifierRow, "identifier_value", "");
                    switch (JsonUtils.getString(identifierRow, "identifier_type", "")) {
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
               String primary_award = JsonUtils.getString(sponsorOrgRow, "primary_award", "");
               refinedSponsorOrgRow.put("has_primary_award", StringUtils.isNotBlank(primary_award) && !StringUtils.equals(primary_award.toLowerCase(), "unknown"));
               refinedSponsorOrgRow.put("primary_award", primary_award);

               //Award Numbers
               refinedSponsorOrgRow.put("has_award_numbers", AwardNums.size() > 0);
               refinedSponsorOrgRow.put("award_nums", AwardNums);

               //FWP NumberS
               refinedSponsorOrgRow.put("has_fwp_numbers", FWPNums.size() > 0);
               refinedSponsorOrgRow.put("fwp_nums", FWPNums);

               //BR CODES
               refinedSponsorOrgRow.put("has_br_codes", BRCodes.size() > 0);
               refinedSponsorOrgRow.put("br_codes", BRCodes);

               //If this is the last row, note it, because that affects the UI of the template
               if ((i + 1) == sponsoring_orgs.size()) {
                    refinedSponsorOrgRow.put("is_last", true);
               }
               list.add(refinedSponsorOrgRow);
          }

          return_data.put("list", list);
          return_data.put("has_sponsoring_org", list.size() > 0);
          return return_data;
     }

     public static ArrayNode getResearchOrganizations(ArrayNode researchOrgs) {
          ArrayNode return_data = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
          for (JsonNode v : researchOrgs) {
               ObjectNode vObj = (ObjectNode) v;
               return_data.add(JsonUtils.getString(vObj, "organization_name", ""));
          }
          return return_data;
     }

     public static ArrayNode combineAuthorLists(ArrayNode arr1, ArrayNode arr2) {
          ArrayNode return_data = new ArrayNode(JsonUtils.FACTORY_INSTANCE);

          for (JsonNode v : arr1) {
               ObjectNode row = (ObjectNode) v;
               String first_name = JsonUtils.getString(row, "first_name", "");
               String middle_name = JsonUtils.getString(row, "middle_name", "");
               String last_name = JsonUtils.getString(row, "last_name", "");
               //Make sure they're not a "none" entry
               if (!first_name.equalsIgnoreCase("none") && !middle_name.equalsIgnoreCase("none") && !last_name.equalsIgnoreCase("none")) {
                    String combinedName = combineName(first_name, middle_name, last_name);

                    if (StringUtils.isNotBlank(combinedName)) {
                         return_data.add(combinedName);
                    }
               }
          }

          for (JsonNode v : arr2) {
               ObjectNode row = (ObjectNode) v;
               String first_name = JsonUtils.getString(row, "first_name", "");
               String middle_name = JsonUtils.getString(row, "middle_name", "");
               String last_name = JsonUtils.getString(row, "last_name", "");

               if (!first_name.equalsIgnoreCase("none") && !middle_name.equalsIgnoreCase("none") && !last_name.equalsIgnoreCase("none")) {
                    String combinedName = combineName(first_name, middle_name, last_name);

                    if (StringUtils.isNotBlank(combinedName)) {
                         return_data.add(combinedName);
                    }
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

     public static String joinWithDelimiters(ArrayNode list, String delimiter, String lastDelimiter) {
          String return_string = "";
          String last_item = "";

          if (list.size() > 1 && StringUtils.isNotBlank(lastDelimiter)) {
               last_item = list.get(list.size() - 1).asText();
               list.remove(list.size() - 1);

          }

          for (int i = 0; i < list.size(); i++) {
               return_string += list.get(i).asText();

               if ((i + 1) < list.size()) {
                    return_string += delimiter;
               }
          }

          if (StringUtils.isNotBlank(last_item)) {
               return_string += (lastDelimiter + last_item);
          }

          return return_string;
     }

     private static ObjectNode getAPAFormat(ObjectNode biblio_data) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);

          boolean needsSpacing = false;

          //Authors
          ArrayNode authors_and_contributors = combineAuthorLists((ArrayNode) biblio_data.get("contributors"), (ArrayNode) biblio_data.get("developers"));
          String author_text = joinWithDelimiters(authors_and_contributors, ", ", ", & ");
          if (StringUtils.isNotBlank(author_text)) {
               author_text += (StringUtils.endsWith(author_text, ".") ? "" : ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(author_text);

          //Release Date
          String release_date = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "release_date", ""))) {
               release_date = ((needsSpacing ? " " : "") + "(" + LocalDate.parse(JsonUtils.getString(biblio_data, "release_date", ""), RELEASE_DATE_FORMAT).format(APA_DATE_FORMAT) + ").");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(release_date);

          //Software Title
          String software_title = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "software_title", ""))) {
               software_title = (needsSpacing ? " " : "") + JsonUtils.getString(biblio_data, "software_title", "") + ".";
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(software_title);

          //Computer Software
          String computer_software = needsSpacing ? " [Computer software]." : "[Computer software].";

          //URL
          String url = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "repository_link", ""))) {
               url = ((needsSpacing ? " " : "") + JsonUtils.getString(biblio_data, "repository_link", "") + ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(url);

          //DOI
          String doi = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "doi", ""))) {
               doi = ((needsSpacing ? " " : "") + "doi:" + JsonUtils.getString(biblio_data, "doi", "") + ".");
          }

          return_data.put("authors", author_text);
          return_data.put("release_date", release_date);
          return_data.put("software_title", software_title);
          return_data.put("computer_software", computer_software);
          return_data.put("url", url);
          return_data.put("doi", doi);

          return return_data;
     }

     private static ObjectNode getOptionalBibtexObj(String label, String value) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          return_data.put("label", label);
          return_data.put("value", value);
          return return_data;
     }

     private static ObjectNode getBibtexFormat(ObjectNode biblio_data) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          ArrayNode optional_data = new ArrayNode(JsonUtils.FACTORY_INSTANCE);

          //Software Title
          String software_title = "{" + JsonUtils.getString(biblio_data, "software_title", "") + "}";

          //Authors Text
          ArrayNode authors_and_contributors = combineAuthorLists((ArrayNode) biblio_data.get("contributors"), (ArrayNode) biblio_data.get("developers"));
          String author_text = joinWithDelimiters(authors_and_contributors, " and ", null);
          if (StringUtils.isNotBlank(author_text)) {
               author_text = ("{" + author_text + "}");
          }

          //Description
          String description = "{" + JsonUtils.getString(biblio_data, "description", "") + "}";

          //DOI
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "doi", ""))) {
               String doi = JsonUtils.getString(biblio_data, "doi", "");
               optional_data.add(getOptionalBibtexObj("url", "{https://dx.doi.org/" + doi + "}"));
               optional_data.add(getOptionalBibtexObj("howpublished", "{[Computer Software] \\url{https://dx.doi.org/" + doi + "}}"));
          }

          //Release Date
          String release_date_year = "";
          String release_date_month = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "release_date", ""))) {
               LocalDate release_date = LocalDate.parse(JsonUtils.getString(biblio_data, "release_date", ""), RELEASE_DATE_FORMAT);
               release_date_year = Integer.toString(release_date.getYear());
               release_date_month = Integer.toString(release_date.getMonthValue());
               optional_data.add(getOptionalBibtexObj("year", "{" + release_date_year + "}"));
               optional_data.add(getOptionalBibtexObj("month", "{" + DOECODEUtils.getShortMonth(release_date_month, false) + "}"));
          }

          return_data.put("code_id", JsonUtils.getLong(biblio_data, "code_id", 0));
          return_data.put("authors_text", author_text);
          return_data.put("description", description);
          return_data.put("software_title", software_title);

          //If there was anything in the optional_data array, and its size is more than 1, we will add an indicator saying that it's the last, so we won't want a comma
          if (optional_data.size() > 0) {
               int last_item_index = optional_data.size() - 1;

               ObjectNode last_item = (ObjectNode) optional_data.get(last_item_index);
               last_item.put("is_last", true);
               optional_data.set(last_item_index, last_item);
          }

          return_data.put("optional", optional_data);
          return return_data;
     }

     private static ObjectNode getChicagoFormat(ObjectNode biblio_data) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);

          boolean needsSpacing = false;

          //Authors
          ArrayNode authors_and_contributors = combineAuthorLists((ArrayNode) biblio_data.get("contributors"), (ArrayNode) biblio_data.get("developers"));
          String author_text = joinWithDelimiters(authors_and_contributors, ", ", ", and ");
          if (StringUtils.isNotBlank(author_text)) {
               author_text += (StringUtils.endsWith(author_text, ".") ? "" : ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(author_text);

          //Software Title
          String software_title = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "software_title", ""))) {
               String after_title = StringUtils.endsWith(JsonUtils.getString(biblio_data, "software_title", ""), ".")
                       || StringUtils.endsWith(JsonUtils.getString(biblio_data, "software_title", ""), "!")
                       || StringUtils.endsWith(JsonUtils.getString(biblio_data, "software_title", ""), "?")
                       ? "" : ".";
               software_title = (needsSpacing ? " " : "") + "\"" + JsonUtils.getString(biblio_data, "software_title", "") + after_title + "\" Computer software.";
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(software_title);

          //Release Date
          String release_date = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "release_date", ""))) {
               release_date = (needsSpacing ? " " : "") + LocalDate.parse(JsonUtils.getString(biblio_data, "release_date", "")).format(CHICAGO_DATE_FORMAT) + ".";
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(release_date);

          //URL
          String url = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "repository_link", ""))) {
               url = ((needsSpacing ? " " : "") + JsonUtils.getString(biblio_data, "repository_link", "") + ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(url);

          //DOI
          String doi = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "doi", ""))) {
               doi = ((needsSpacing ? " " : "") + "doi:" + JsonUtils.getString(biblio_data, "doi", "") + ".");
          }

          return_data.put("authors", author_text);
          return_data.put("software_title", software_title);
          return_data.put("release_date", release_date);
          return_data.put("url", url);
          return_data.put("doi", doi);
          return return_data;
     }

     private static ObjectNode getMLAFormat(ObjectNode biblio_data) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          boolean needsSpacing = false;

          //Authors
          ArrayNode authors_and_contributors = combineAuthorLists((ArrayNode) biblio_data.get("contributors"), (ArrayNode) biblio_data.get("developers"));
          String author_text = joinWithDelimiters(authors_and_contributors, ", ", ", and ");
          if (StringUtils.isNotBlank(author_text)) {
               author_text += (StringUtils.endsWith(author_text, ".") ? "" : ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(author_text);

          //Software Title
          String software_title = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "software_title", ""))) {
               software_title = (needsSpacing ? " " : "") + JsonUtils.getString(biblio_data, "software_title", "") + ".";
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(software_title);

          //Computer Software
          String computer_software = needsSpacing ? " Computer Software." : "ComputerSoftware.";

          //URL
          String url = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "repository_link", ""))) {
               url = (needsSpacing ? " " : "") + JsonUtils.getString(biblio_data, "repository_link", "") + ".";
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(url);

          //Sponsor Orgs
          String sponsor_orgs = "";
          ArrayNode sponsor_orgs_list = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
          for (JsonNode v : (ArrayNode) biblio_data.get("sponsoring_organizations")) {
               ObjectNode vObj = (ObjectNode) v;
               sponsor_orgs_list.add(JsonUtils.getString(vObj, "organization_name", ""));
          }
          if (sponsor_orgs_list.size() > 0) {
               sponsor_orgs = joinWithDelimiters(sponsor_orgs_list, ", ", null);
               sponsor_orgs = (needsSpacing ? " " : "") + sponsor_orgs + (StringUtils.endsWith(sponsor_orgs, ".") ? "" : ".");
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(sponsor_orgs);

          //Release Date
          String release_date = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "release_date", ""))) {
               release_date = (needsSpacing ? " " : "") + LocalDate.parse(JsonUtils.getString(biblio_data, "release_date", ""), RELEASE_DATE_FORMAT).format(MLA_DATE_FORMAT);
          }
          needsSpacing = needsSpacing || StringUtils.isNotBlank(release_date);

          //Web
          String web = needsSpacing ? "Web." : " Web.";

          //DOI
          String doi = "";
          if (StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "doi", ""))) {
               doi = ((needsSpacing ? " " : "") + "doi:" + JsonUtils.getString(biblio_data, "doi", "") + ".");
          }
          return_data.put("authorsText", author_text);
          return_data.put("softwareTitle", software_title);
          return_data.put("computer_software", computer_software);
          return_data.put("url", url);
          return_data.put("sponsorOrgsText", sponsor_orgs);
          return_data.put("releaseDate", release_date);
          return_data.put("web", web);
          return_data.put("doi", doi);
          return return_data;
     }

     public static ObjectNode getBiblioData(long osti_id) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          boolean is_valid = true;
          String api_url = Init.backend_api_url;

          ObjectNode biblio_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          try {
               StringBuilder result = new StringBuilder();
               URL url = new URL(api_url + "search/" + osti_id);
               HttpURLConnection conn = (HttpURLConnection) url.openConnection();
               conn.setRequestMethod("GET");
               BufferedReader rd = new BufferedReader(new InputStreamReader(conn.getInputStream(), "UTF-8"));
               String line;
               while ((line = rd.readLine()) != null) {
                    result.append(line);
               }
               rd.close();
               conn.disconnect();
               biblio_data = (ObjectNode) JsonUtils.parseObjectNode(result.toString()).get("metadata");

          } catch (Exception e) {
               log.error("Error: " + e.getMessage());
               is_valid = false;
          }

          //Massage any data that needs it
          if (is_valid) {
               ArrayNode meta_tags = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
               /*Title*/
               return_data.put("title", JsonUtils.getString(biblio_data, "software_title", ""));
               meta_tags.add(makeMetaTag("title", JsonUtils.getString(biblio_data, "software_title", "")));

               /*Description*/
               return_data.put("descriptionObj", getDescription(JsonUtils.getString(biblio_data, "description", ""), 200));
               meta_tags.add(makeMetaTag("description", JsonUtils.getString(biblio_data, "description", "")));

               /*Developers and contributors*/
               ArrayNode developers_combined = combineDevContributorNames((ArrayNode) biblio_data.get("developers"), null);
               ObjectNode devs_contributors_obj = getDevAndContributorLink(developers_combined, true, false, true);
               return_data.put("developers_list", devs_contributors_obj);
               return_data.put("has_developers", JsonUtils.getBoolean(devs_contributors_obj, "had_list", false));
               ArrayNode developerslist = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
               for (JsonNode v : developers_combined) {
                    ObjectNode vObj = (ObjectNode) v;
                    developerslist.add(JsonUtils.getString(vObj, "combined_name", ""));
               }
               meta_tags.add(makeMetaTag("developers", DOECODEUtils.makeSpaceSeparatedList(developerslist)));

               //Release Date
               return_data.put("release_date", JsonUtils.getString(biblio_data, "release_date", ""));
               return_data.put("has_release_date", StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "release_date", "")));
               meta_tags.add(makeMetaTag("release_date", JsonUtils.getString(biblio_data, "release_date", "")));

               /*Code Availability*/
               ArrayNode availabilityList = DOECODEServletContextListener.getJsonList(DOECODEJson.AVAILABILITY_KEY);

               ObjectNode availabilityObj = JsonUtils.getJsonListItem(availabilityList, "value", JsonUtils.getString(biblio_data, "accessibility", ""));
               return_data.put("availability", JsonUtils.getString(availabilityObj, "label", ""));
               return_data.put("has_availability", StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "accessibility", "")));
               meta_tags.add(makeMetaTag("availability", JsonUtils.getString(availabilityObj, "label", "")));

               /*Software Type*/
               ArrayNode softwareTypeList = DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY);
               ObjectNode softwareTypeObj = JsonUtils.getJsonListItem(softwareTypeList, "value", JsonUtils.getString(biblio_data, "software_type", ""));
               return_data.put("software_type", JsonUtils.getString(softwareTypeObj, "label", ""));
               meta_tags.add(makeMetaTag("software_type", JsonUtils.getString(softwareTypeObj, "label", "")));

               /*Licenses*/
               ArrayNode licenses = (ArrayNode) biblio_data.get("licenses");
               ArrayNode license_displays = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
               if (licenses != null) {
                    for (JsonNode row : licenses) {
                         String rowVal = row.asText();
                         license_displays.add(DOECODEUtils.getDisplayVersionOfValue(DOECODEServletContextListener.getJsonList(DOECODEJson.LICENSE_KEY), rowVal));
                    }
               }
               return_data.put("licenses", license_displays);
               return_data.put("has_licenses", licenses != null && licenses.size() > 0);
               meta_tags.add(makeMetaTag("licenses", DOECODEUtils.makeSpaceSeparatedList((ArrayNode) biblio_data.get("licenses"))));

               /*Sponsoring Org*/
               ObjectNode sponsor_orgs = getSponsoringOrgData((ArrayNode) biblio_data.get("sponsoring_organizations"));
               return_data.put("sponsoring_org", sponsor_orgs);
               return_data.put("has_sponsoring_org", JsonUtils.getBoolean(sponsor_orgs, "has_sponsoring_org", false));
               ArrayNode sponsororgslist = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
               for (JsonNode v : (ArrayNode) sponsor_orgs.get("list")) {
                    ObjectNode vObj = (ObjectNode) v;
                    sponsororgslist.add(JsonUtils.getString(vObj, "org_name", ""));
               }
               meta_tags.add(makeMetaTag("sponsoring_org", DOECODEUtils.makeSpaceSeparatedList(sponsororgslist)));

               /*Code ID*/
               return_data.put("code_id", JsonUtils.getLong(biblio_data, "code_id", 0));
               meta_tags.add(makeMetaTag("code_id", Long.toString(JsonUtils.getLong(biblio_data, "code_id", 0))));

               /*Site accession Number*/
               return_data.put("site_accession_number", JsonUtils.getString(biblio_data, "site_accession_number", ""));
               return_data.put("has_site_accession_number", StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "site_accession_number", "")));
               meta_tags.add(makeMetaTag("site_accession_number", JsonUtils.getString(biblio_data, "site_accession_number", "")));

               /*Research Orgs*/
               ArrayNode research_org_data = getResearchOrganizations((ArrayNode) biblio_data.get("research_organizations"));
               return_data.put("research_orgs", research_org_data);
               return_data.put("has_research_org", research_org_data.size() > 0);
               meta_tags.add(makeMetaTag("research_orgs", DOECODEUtils.makeSpaceSeparatedList(research_org_data)));

               /*Country of origin*/
               return_data.put("country_of_origin", JsonUtils.getString(biblio_data, "country_of_origin", ""));
               return_data.put("has_country_of_origin", StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "country_of_origin", "")));
               meta_tags.add(makeMetaTag("country_of_origin", JsonUtils.getString(biblio_data, "country_of_origin", "")));

               /*Programming Languages*/
               ArrayNode programming_languages = (ArrayNode) biblio_data.get("programming_languages");
               return_data.put("programming_languages_list", programming_languages);
               return_data.put("has_programming_languages", programming_languages != null && programming_languages.size() > 0);

               /*Version Number*/
               return_data.put("version_number", JsonUtils.getString(biblio_data, "version_number", ""));
               return_data.put("has_version_number", StringUtils.isNotBlank(JsonUtils.getString(biblio_data, "version_number", "")));

               /*Citation formats*/
               return_data.put("mla", getMLAFormat(biblio_data));
               return_data.put("apa", getAPAFormat(biblio_data));
               return_data.put("bibtex", getBibtexFormat(biblio_data));
               return_data.put("chicago", getChicagoFormat(biblio_data));

               /*Biblio sidebar data*/
               return_data.put("biblio_sidebar", getBiblioSidebarData(biblio_data, Init.public_api_url));

               /*Meta tags*/
               //Before we send the meta tags down, let's go ahead and remove all of the ones that didn't have any actual content
               ArrayNode refined_meta_tags = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
               for (JsonNode v : meta_tags) {
                    ObjectNode vObj = (ObjectNode) v;
                    if (StringUtils.isNotBlank(JsonUtils.getString(vObj, "content", ""))) {
                         refined_meta_tags.add(v);
                    }
               }
               return_data.put("meta_tag", refined_meta_tags);
          }

          return_data.put("is_valid", is_valid);

          return return_data;
     }

     private static ObjectNode makeMetaTag(String name, String value) {
          ObjectNode return_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          return_data.put("name", name);
          return_data.put("content", value);
          return return_data;
     }

}
