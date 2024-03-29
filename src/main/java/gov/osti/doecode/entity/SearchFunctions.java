package gov.osti.doecode.entity;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;

import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;

public class SearchFunctions {

    private final static Logger log = LoggerFactory.getLogger(SearchFunctions.class.getName());
    public static final DateTimeFormatter RELEASE_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public static final DateTimeFormatter APA_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy, MMMM dd");
    public static final DateTimeFormatter CHICAGO_DATE_FORMAT = DateTimeFormatter.ofPattern("MMMM dd, yyyy");
    public static final DateTimeFormatter MLA_DATE_FORMAT = DateTimeFormatter.ofPattern("dd MMM. yyyy.");
    public static final DateTimeFormatter SEARCH_RESULTS_DESCRIPTION_FORMAT = DateTimeFormatter.ofPattern("MM-dd-yyyy");

    // MUST REMOVE "T" and "Z" from string
    public static final DateTimeFormatter SOLR_DATE_ONLY = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public static final DateTimeFormatter SOLR_TIME_ONLY = DateTimeFormatter.ofPattern("HH:mm:ss");
    public static final DateTimeFormatter SOLR_DATE_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-ddHH:mm:ss");

    public static int MAX_WORD_IN_FEATURED_ARTICLE = 75;

    public static ObjectNode conductSearch(HttpServletRequest request, ServletContext context, long page_num) {
        ObjectNode return_data = doSearchPost(request, Init.backend_api_url);

        // Get the search form data and get the page number
        ObjectNode search_form_data = (ObjectNode) return_data.get("search_form_data");
        search_form_data.put("pageNum", page_num);

        // Add together all of the data, send it out
        return_data.put("had_results", return_data.findPath("search_result_count").asLong(0) > 0);
        return_data.set("search_form_data", search_form_data);

        return return_data;
    }

    public static ObjectNode createPostDataObj(HttpServletRequest request, long start, long rows) {
        // Get all of the data into a postable object
        ObjectNode post_data = JsonUtils.MAPPER.createObjectNode();
        post_data.put("all_fields", StringUtils.defaultIfBlank(request.getParameter("all_fields"), ""));
        post_data.put("software_title", StringUtils.defaultIfBlank(request.getParameter("software_title"), ""));
        post_data.put("developers_contributors", StringUtils.defaultIfBlank(request.getParameter("developers_contributors"), ""));
        post_data.put("biblio_data", StringUtils.defaultIfBlank(request.getParameter("biblio_data"), ""));
        post_data.put("doi", StringUtils.defaultIfBlank(request.getParameter("doi"), ""));
        post_data.put("identifiers", StringUtils.defaultIfBlank(request.getParameter("identifier_numbers"), ""));
        post_data.put("date_earliest", StringUtils.defaultIfBlank(request.getParameter("date_earliest"), ""));
        post_data.put("date_latest", StringUtils.defaultIfBlank(request.getParameter("date_latest"), ""));
        post_data.put("start", start);
        post_data.put("rows", rows);
        post_data.put("sort", StringUtils.defaultIfBlank(request.getParameter("sort"), ""));
        post_data.put("orcid", StringUtils.defaultIfBlank(request.getParameter("orcid"), ""));

        post_data.set("project_type", handleRequestArray(request.getParameter("project_type")));
        post_data.set("licenses", handleRequestArray(request.getParameter("licenses")));
        post_data.put("programming_languages", StringUtils.defaultIfBlank(request.getParameter("programming_languages"), ""));
        post_data.put("research_organization", StringUtils.defaultIfBlank(request.getParameter("research_organization"), ""));
        post_data.put("sponsoring_organization", StringUtils.defaultIfBlank(request.getParameter("sponsoring_organization"), ""));
        post_data.set("software_type", handleRequestArray(request.getParameter("software_type")));
        post_data.put("show_facets", true);
        return post_data;
    }

    public static ObjectNode doSearchPost(HttpServletRequest request, String api_url) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        boolean had_error = false;
        boolean invalid_search_data = false;
        String error_message = "";

        long start = Long.parseLong(StringUtils.defaultIfBlank(request.getParameter("start"), "0"));
        long rows = Long.parseLong(StringUtils.defaultIfBlank(request.getParameter("rows"), "10"));

        ObjectNode post_data = createPostDataObj(request, start, rows);

        ObjectNode search_result_data = JsonUtils.MAPPER.createObjectNode();
        try {
            search_result_data = DOECODEUtils.makePOSTRequest(api_url + "search", post_data);
            if (search_result_data.findPath("invalid_object_parse").asBoolean(false)) {
                invalid_search_data = true;
            }
        } catch (Exception ex) {
            log.error("Exception in search: " + ex.getMessage());
            had_error = true;
            invalid_search_data = true;
            error_message = "An error has occurred that is preventing your search from working.";
        }

        // Get the num found
        long num_found = search_result_data.findPath("num_found").asLong(0);

        // Pull out the list of results and process the data so we only get what we
        // want, assume we got correct data
        ArrayNode search_results_list = JsonUtils.MAPPER.createArrayNode();
        if (search_result_data.get("docs") != null) {
            search_results_list = processSearchResultData(search_result_data.withArray("docs"), start, num_found);
        }

        // Go through, and stringify all of the json array values, so they can sit on
        // the page correctly
        ObjectNode search_form_data = post_data;
        for (String s : JsonUtils.getKeys(search_form_data)) {
            if (search_form_data.get(s).isArray()) {
                // search_form_data.set(s, search_form_data.get(s).asArray().toString());
                search_form_data.put(s, ((ArrayNode) search_form_data.get(s)).toString());
            }
        }

        // Give everything back
        return_data.put("search_result_count", num_found);
        return_data.put("had_error", had_error);
        return_data.put("error_message", error_message);
        return_data.set("search_form_data", search_form_data);
        return_data.set("search_results_list", search_results_list);
        return_data.set("pagination_btn", getPaginationData(search_form_data, num_found));
        return_data.set("breadcrumbTrail", getSearchBreadcrumbTrailList(post_data, num_found));
        return_data.set("search_sort_dropdown", sort_dropdownOptions(post_data.findPath("sort").asText("")));
        return_data.set("project_type_list", getSearchDropdownList(DOECODEServletContextListener.getJsonList(DOECODEJson.PROJECT_TYPE_KEY), handleRequestArray(request.getParameter("project_type"))));
        return_data.set("license_options_list", getSearchDropdownList(DOECODEServletContextListener.getJsonList(DOECODEJson.LICENSE_KEY), handleRequestArray(request.getParameter("licenses"))));
        return_data.set("software_type_options_list", getSearchDropdownList(DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY), handleRequestArray(request.getParameter("software_type"))));
        return_data.set("search_description", getSearchResultsDescription(post_data));

        // If the search was valid, and had no errors, pull out the facet data
        if (!invalid_search_data) {
            // Get the facet data for release dates
            return_data.set("year_facets_data", getYearFacetsData((ObjectNode) search_result_data.get("facets")));

            // Pull out the facet counts fields
            ObjectNode facet_fields = (ObjectNode) search_result_data.get("facet_counts").get("facet_fields");

            // Research Organization Facets
            ObjectNode facet_research_orgs = (ObjectNode) facet_fields.get("fResearchOrganizations");
            ArrayList<String> fResearchOrgsKeys = JsonUtils.getKeys(facet_research_orgs);
            ArrayNode research_orgs_counts = JsonUtils.MAPPER.createArrayNode();
            ArrayNode research_orgs_counts_additional = JsonUtils.MAPPER.createArrayNode();
            // Put the facet counts in
            // Get the value that was searched for in the research_organization field
            String requested_research_org = search_form_data.findPath("research_organization").asText("");

            // If the research org sent in is found in the facet data, then we only want to
            // render that particular organization
            if (StringUtils.isNotBlank(requested_research_org) && fResearchOrgsKeys.contains(requested_research_org)) {
                ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                row.put("label", requested_research_org);
                row.put("value", facet_research_orgs.findPath(requested_research_org).asInt());
                row.put("value_compressed", requested_research_org.replaceAll("\\s", "-"));
                row.put("is_checked", true);
                research_orgs_counts.add(row);
            } else {// Otherwise, show all available research orgs, if available
                int max_orgs = fResearchOrgsKeys.size() >= 8 ? 8 : fResearchOrgsKeys.size();
                for (int i = 0; i < max_orgs; i++) {
                    ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                    row.put("label", fResearchOrgsKeys.get(i));
                    row.put("value", facet_research_orgs.findPath(fResearchOrgsKeys.get(i)).asInt());
                    row.put("value_compressed", fResearchOrgsKeys.get(i).replaceAll("\\s", "-"));
                    research_orgs_counts.add(row);
                }
                // If our list is more than 5 organizations long, then we need to remove the
                // first 5, and put the others in a separate list
                if (research_orgs_counts.size() > 5) {
                    int research_orgs_length = research_orgs_counts.size() - 1;
                    // Copy any past 5 (or index 4) to the additional array
                    for (int i = 5; i < research_orgs_counts.size(); i++) {
                        research_orgs_counts_additional.add(research_orgs_counts.get(i));
                    }
                    // Remove the ones that we copied from the original array
                    for (int i = research_orgs_length; i > 4; i--) {
                        research_orgs_counts.remove(i);
                    }
                    return_data.put("had_additional_orgs", true);
                    return_data.set("research_orgs_counts_additional", research_orgs_counts_additional);
                }
            }

            return_data.set("research_orgs_facets", research_orgs_counts);
        }

        return return_data;
    }

    private static ArrayNode getYearFacetsData(ObjectNode facets) {
        ArrayNode return_data = JsonUtils.MAPPER.createArrayNode();

        for (String key : JsonUtils.getKeys(facets)) {
            // Get our needed values
            ObjectNode row = JsonUtils.MAPPER.createObjectNode();
            int year = Integer.parseInt(StringUtils.substring(key, 0, 4));
            int count = facets.get(key).asInt();
            row.put("year", year);
            row.put("count", count);

            return_data.add(row);
        }
        return return_data;
    }

    private static ObjectNode getSearchResultsDescription(ObjectNode post_data) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        ArrayNode search_description_list = JsonUtils.MAPPER.createArrayNode();

        // All Fields
        String all_fields = post_data.findPath("all_fields").asText("");
        if (StringUtils.isNotBlank(all_fields)) {
            search_description_list.add(makeSearchDescriptionObject("Keywords", all_fields, "all_fields"));
        }

        // Software Title
        String software_title = post_data.findPath("software_title").asText("");
        if (StringUtils.isNotBlank(software_title)) {
            search_description_list.add(makeSearchDescriptionObject("Software Title", software_title, "software_title"));
        }

        // Developers/Contributors
        String developers_contributors = post_data.findPath("developers_contributors").asText("");
        if (StringUtils.isNotBlank(developers_contributors)) {
            search_description_list.add(makeSearchDescriptionObject("Developers/Contributors", developers_contributors,
                    "developers_contributors"));
        }

        // Biblio Data
        String biblio_data = post_data.findPath("biblio_data").asText("");
        if (StringUtils.isNotBlank(biblio_data)) {
            search_description_list.add(makeSearchDescriptionObject("Bibliographic Data", biblio_data, "biblio_data"));
        }

        // DOI
        String doi = post_data.findPath("doi").asText("");
        if (StringUtils.isNotBlank(doi)) {
            search_description_list.add(makeSearchDescriptionObject("DOI", doi, "doi"));
        }

        // Identifiers
        String identifiers = post_data.findPath("identifiers").asText("");
        if (StringUtils.isNotBlank(identifiers)) {
            search_description_list.add(makeSearchDescriptionObject("Identifiers", identifiers, "identifier_numbers"));
        }

        // Date Earliest
        String date_earliest = post_data.findPath("date_earliest").asText("");
        if (StringUtils.isNotBlank(date_earliest)) {
            String date_earliest_trimmed = date_earliest;
            // Remove everything T and after
            date_earliest_trimmed = date_earliest_trimmed.substring(0, date_earliest_trimmed.indexOf("T"));
            // Test the date, and see whether it's valid or not
            if (DOECODEUtils.isValidDateOfPattern(RELEASE_DATE_FORMAT, date_earliest_trimmed)) {
                // Format it to a date that we want to see
                date_earliest_trimmed = LocalDate.parse(date_earliest_trimmed, RELEASE_DATE_FORMAT).format(SEARCH_RESULTS_DESCRIPTION_FORMAT);
            }
            // Now, we show it
            search_description_list.add(makeSearchDescriptionObject("Earliest Release Date", date_earliest_trimmed, "date_earliest"));
        }

        // Date Latest
        String date_latest = post_data.findPath("date_latest").asText("");
        if (StringUtils.isNotBlank(date_latest)) {
            String date_latest_trimmed = date_latest;
            // Remove everythign T and after
            date_latest_trimmed = date_latest_trimmed.substring(0, date_latest_trimmed.indexOf("T"));
            // Test the date, and see whether it's valid or not
            if (DOECODEUtils.isValidDateOfPattern(RELEASE_DATE_FORMAT, date_latest_trimmed)) {
                // Format it to a date that we want to see
                date_latest_trimmed = LocalDate.parse(date_latest_trimmed, RELEASE_DATE_FORMAT).format(SEARCH_RESULTS_DESCRIPTION_FORMAT);
            }
            // Show it
            search_description_list.add(makeSearchDescriptionObject("Latest Release Date", date_latest_trimmed, "date_latest"));
        }

        // Project Type
        String project_type_array = post_data.findPath("project_type").asText("");
        if (StringUtils.isNotBlank(project_type_array) && JsonUtils.parseArrayNode(project_type_array).size() > 0) {
            // Get the project_type array so we can get some display values
            ArrayNode project_type_display_vals = DOECODEServletContextListener.getJsonList(DOECODEJson.PROJECT_TYPE_KEY);

            search_description_list.add(makeSearchDescriptionObjectArray("Project Type", JsonUtils.parseArrayNode(project_type_array), "project_type", project_type_display_vals));
        }

        // Software Type
        String software_type_array = post_data.findPath("software_type").asText("");
        if (StringUtils.isNotBlank(software_type_array) && JsonUtils.parseArrayNode(software_type_array).size() > 0) {
            // Get the software_type array so we can get display values
            ArrayNode software_type_display_vals = DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY);

            search_description_list.add(makeSearchDescriptionObjectArray("Software Type", JsonUtils.parseArrayNode(software_type_array), "software_type", software_type_display_vals));
        }

        // Licenses
        String license_array = post_data.findPath("licenses").asText("");
        if (StringUtils.isNotBlank(license_array) && JsonUtils.parseArrayNode(license_array).size() > 0) {
            search_description_list.add(makeSearchDescriptionObjectArray("Licenses", JsonUtils.parseArrayNode(license_array), "licenses", null));
        }

        // Programming Languages
        String programming_languages_array = post_data.findPath("programming_languages").asText("");
        if (StringUtils.isNotBlank(programming_languages_array)) {
            search_description_list.add(makeSearchDescriptionObject("Programming Languages", programming_languages_array, "programming_languages"));
        }

        // Research Organization
        String research_org_array = post_data.findPath("research_organization").asText("");
        if (StringUtils.isNotBlank(research_org_array)) {
            search_description_list.add(makeSearchDescriptionObject("Research Organization", research_org_array, "research_organization"));
        }

        // Sponsoring Organization
        String sponsoring_organization = post_data.findPath("sponsoring_organization").asText("");
        if (StringUtils.isNotBlank(sponsoring_organization)) {
            search_description_list.add(makeSearchDescriptionObject("Sponsoring Organization", sponsoring_organization, "sponsoring_organization"));
        }

        // ORCID
        String orcid = post_data.findPath("orcid").asText("");
        if (StringUtils.isNotBlank(orcid)) {
            search_description_list.add(makeSearchDescriptionObject("ORCID", orcid, "orcid"));
        }
        return_data.set("search_description_list", search_description_list);
        return_data.put("is_targeted_search", StringUtils.isNotBlank(post_data.findPath("all_fields").asText("")));
        return_data.put("had_things_to_search_by", search_description_list.size() > 0);
        return return_data;
    }

    private static ObjectNode makeSearchDescriptionObject(String displayField, String display_value, String field) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        return_data.put("displayField", displayField);
        return_data.put("value", display_value);
        return_data.put("field", field);
        return return_data;
    }

    private static ObjectNode makeSearchDescriptionObjectArray(String displayField, ArrayNode values, String field,
            ArrayNode display_vals_array) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        return_data.put("displayField", displayField);

        ArrayNode values_to_show = values; 
        // If we have a display vals array, we'll through there and grab the display
        // values we actually want to show
        if (display_vals_array != null) {
            ArrayNode new_vals = JsonUtils.MAPPER.createArrayNode();
            for (JsonNode v : values) {
                String val = v.asText();
                // Go through array we passed in, and find the label, which is the display value
                // we want to show
                for (JsonNode disp : display_vals_array) {
                    ObjectNode dispObj = (ObjectNode) disp;
                    if (StringUtils.equals(dispObj.findPath("value").asText(""), val)) {
                        new_vals.add(dispObj.findPath("label").asText(""));
                        break;
                    }
                }
            }
            values_to_show = new_vals;
        }

        // Add some content to the objects in the array we send back
        ArrayNode values_arr = JsonUtils.MAPPER.createArrayNode();
        for (int i = 0; i < values_to_show.size(); i++) {
            ObjectNode row = JsonUtils.MAPPER.createObjectNode();
            row.put("value", values_to_show.get(i).asText());
            row.put("orig_value", values.get(i).asText());
            row.put("field", field);
            row.put("is_first", i == 0);
            values_arr.add(row);
        }
        return_data.set("value", values_arr);

        return_data.put("field", field);
        return_data.put("is_array", true);
        return return_data;
    }

    private static ArrayNode getSearchDropdownList(ArrayNode list, ArrayNode selected) {
        ArrayNode return_data = JsonUtils.parseArrayNode(list.toString()); // Had to put this to string followed
        // by parse because assigning
        // return_data directly to list was
        // causing a pass by reference issue

        /*
         * Go through the array, and if we have that selected, we'll set a flag that
         * says it's checked
         */
        for (int i = 0; i < return_data.size(); i++) {
            ObjectNode row = (ObjectNode) return_data.get(i);

            String current_row_val = row.findPath("value").asText("");
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
        ObjectNode options_obj = JsonUtils.MAPPER.createObjectNode();
        ArrayNode options = DOECODEServletContextListener.getJsonList(DOECODEJson.SEARCH_SORT_KEY);
        String current = "";

        for (JsonNode j : options) {
            ObjectNode jObj = (ObjectNode) j;
            if (StringUtils.equals(jObj.findPath("value").asText(""), sort_value)) {
                current = jObj.findPath("label").asText("");
                break;
            }
        }

        options_obj.set("sort_dropdown_options", options);
        options_obj.put("current", current);
        return options_obj;
    }

    private static ObjectNode getPaginationData(ObjectNode search_form_data, long num_found) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        long start = search_form_data.findPath("start").asLong(0);
        long rows = search_form_data.findPath("rows").asLong(0);

        long page = ((int) (start / rows) + 1);
        long max_pages = ((int) java.lang.Math.ceil(num_found / (double) rows));

        return_data.put("pagination_btn_prev_disabled", page < 2);
        return_data.put("pagination_btn_next_disabled", (start + rows >= num_found));
        return_data.put("pagination_btn_choose_disabled", max_pages < 2);
        return_data.put("min_pages", 1);
        return_data.put("max_pages", max_pages);
        return_data.put("current_page", page);

        return return_data;
    }

    private static ArrayNode handleRequestArray(String value) {
        ArrayNode request_array = JsonUtils.MAPPER.createArrayNode();
        if (StringUtils.isNotBlank(value) && !StringUtils.equals("[]", value)) {
            ArrayNode temp_array = JsonUtils.MAPPER.createArrayNode();
            for (JsonNode v : JsonUtils.parseArrayNode(value)) {
                temp_array.add(Jsoup.clean(v.asText(), Safelist.basic()));
            }
            request_array = temp_array;
        }

        return request_array;
    }

    private static ArrayNode processSearchResultData(ArrayNode search_result_list, long start, long num_found) {
        ArrayNode return_data = JsonUtils.MAPPER.createArrayNode();

        for (int i = 0; i < search_result_list.size(); i++) {
            ObjectNode row = (ObjectNode) search_result_list.get(i);

            ObjectNode newRow = JsonUtils.MAPPER.createObjectNode();
            Long code_id = row.findPath("code_id").asLong(0);
            String software_type = row.findPath("software_type").asText("");
            ArrayNode software_types = DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY);
            String software_type_display = DOECODEUtils.getDisplayVersionOfValue(software_types, software_type);

            newRow.put("code_id", code_id);
            newRow.put("release_date", row.findPath("release_date").asText(""));
            newRow.put("show_release_date", StringUtils.isNotBlank(row.findPath("release_date").asText("")));
            newRow.put("software_title", row.findPath("software_title").asText(""));

            // Devs and contributors
            /*
             * We need to remove all but 3 of the devs and contributors, since this is the
             * search page
             */
            ArrayNode devContributors = combineDevContributorNames((ArrayNode) row.get("developers"), (ArrayNode) row.get("contributors"));
            ArrayNode devContributorsTrimmed = JsonUtils.MAPPER.createArrayNode();
            boolean is_more_than_3 = false;
            if (devContributors.size() > 3) {// If we have more than 3, then we want to trim the list down
                // to just 3
                for (int x = 0; x < 3; x++) {// If we have 3 or less, we'll just set the list directly
                    devContributorsTrimmed.add(devContributors.get(x));
                }
                is_more_than_3 = true;
            } else {
                devContributorsTrimmed = devContributors;
            }

            newRow.set("dev_contributors", getDevAndContributorLink(devContributorsTrimmed, is_more_than_3));
            newRow.set("descriptionObj", getDescription(row.findPath("description").asText(""), 100));
            newRow.set("repository_links_list", getDoiReposLinks(code_id.toString(), software_type_display, row.findPath("doi").asText(""), row.findPath("repository_link").asText(""), row.findPath("landing_page").asText(""), row.findPath("release_date").asText("")));

            // Get the sponsorOrgRow number. The sponsorOrgRow number is where we start,
            // plus 1, plus the index we're on
            newRow.put("list_number", ((start + 1) + i));

            // Get the classes that will contain the result sponsorOrgRow
            newRow.put("result_column_classes", (num_found > 9999) ? "col-sm-2 col-xs-12 search-result-count-column" : "col-sm-1 col-xs-2 search-result-count-column");
            newRow.put("result_subrow_classes", (num_found > 9999) ? "col-sm-10 col-xs-12 search-result-sub-row" : "col-sm-11 col-xs-10 search-result-sub-row");

            return_data.add(newRow);
        }

        return return_data;
    }

    private static ArrayNode combineDevContributorNames(ArrayNode developers, ArrayNode contributors) {
        ArrayNode return_data = JsonUtils.MAPPER.createArrayNode();

        if (developers != null) {
            for (JsonNode v : developers) {
                ObjectNode row = (ObjectNode) v;
                // Get the first and last names, strip out any nulls, undefineds, and such from
                // bad, old data
                String first_name = row.findPath("first_name").asText("").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");
                String last_name = row.findPath("last_name").asText("").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");

                // Combine the names
                String combined_name = last_name + ", " + first_name;

                // Allow "last name only" for Group names
                if (StringUtils.equalsIgnoreCase(first_name, "none") && !StringUtils.equalsIgnoreCase(last_name, "none")) {
                    combined_name = last_name;
                }

                // If we still had anything left over, we'll assume we have a properly combined
                // name
                if (StringUtils.isNotBlank(combined_name.replaceAll(" ", "").replaceAll(",", "")) && !last_name.equalsIgnoreCase("none")) {
                    row.put("combined_name", combined_name);
                    row.put("author_type", "developer");
                    return_data.add(row);
                }
            }
        }

        if (contributors != null) {
            for (JsonNode v : contributors) {
                ObjectNode row = (ObjectNode) v;
                // Get the first and last names, strip out any nulls, undefineds, and such from
                // bad, old data
                String first_name = row.findPath("first_name").asText("").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");
                String last_name = row.findPath("last_name").asText("").replaceAll("(undefined), ", "").replaceAll(" (undefined)", "").replaceAll(" null", "").replaceAll("null ", "");

                // Combine the names
                String combined_name = last_name + ", " + first_name;

                // Allow "last name only" for Group names
                if (StringUtils.equalsIgnoreCase(first_name, "none") && !StringUtils.equalsIgnoreCase(last_name, "none")) {
                    combined_name = last_name;
                }

                // If we still had anything left over, we'll assume we have a properly combined
                // name
                if (StringUtils.isNotBlank(combined_name.replaceAll(" ", "").replaceAll(",", "")) && !last_name.equalsIgnoreCase("none")) {
                    row.put("combined_name", combined_name);
                    row.put("author_type", "contributor");
                    return_data.add(row);
                }
            }
        }

        return return_data;
    }

    private static ObjectNode getDevAndContributorLink(ArrayNode authorlist, boolean showEllipsis) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        // We need to go ahead and tack on the lack of a need of a semi-colon after a
        // given author
        if (authorlist.size() > 0) {
            ObjectNode last_row = (ObjectNode) authorlist.get(authorlist.size() - 1);
            last_row.put("is_last", true);
            authorlist.set(authorlist.size() - 1, last_row);
        }

        return_data.put("had_list", authorlist.size() > 0);
        return_data.set("list", authorlist);
        return_data.put("show_ellipsis", showEllipsis);
        return return_data;
    }

    private static ObjectNode getDescription(String description, int moreLessValue) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        String description_pt1 = description;
        String description_pt2 = "";

        // Now, let's do some parsing
        String[] description_words = StringUtils.split(description, " ");
        boolean needs_toggle = description_words.length > moreLessValue;
        if (needs_toggle) {
            // Take out only the first moreLessValue words. Man, this is easier in javascript
            description_pt1 = String.join(" ", Arrays.asList(description_words).subList(0, moreLessValue));
            description_pt2 = String.join(" ", Arrays.asList(description_words).subList(moreLessValue, description_words.length));
        }

        return_data.put("description_pt1", description_pt1);
        return_data.put("description_pt2", description_pt2);
        return_data.put("needs_toggle", needs_toggle);
        return return_data;
    }

    private static ArrayNode getDoiReposLinks(String code_id, String software_type, String doi, String repository_link, String landing_page,
            String release_date) {
        ArrayNode return_data = JsonUtils.MAPPER.createArrayNode();

        // doi
        if (StringUtils.isNotBlank(release_date) && StringUtils.isNotBlank(doi)) {
            String fixed_doi = "https://doi.org/" + doi;
            return_data.add(makeDOIRepoLinkObj("", "DOI for Code ID " + code_id, code_id, software_type, fixed_doi, "https://doi.org/" + doi, "download-link"));
        }

        // Repository URL
        if (StringUtils.isNotBlank(repository_link)) {
            repository_link = (StringUtils.startsWith(repository_link, "http:") || StringUtils.startsWith(repository_link, "https:")) ? repository_link : "http://" + repository_link;
            return_data.add(makeDOIRepoLinkObj("", "Repository URL for Code ID", code_id, software_type, repository_link, "Repository URL", "download-link"));
        }

        // Landing page
        if (StringUtils.isNotBlank(landing_page)) {
            landing_page = (StringUtils.startsWith(landing_page, "http:") || StringUtils.startsWith(landing_page, "https:")) ? landing_page : "http://" + landing_page;
            return_data.add(makeDOIRepoLinkObj("", "Landing Page for Code ID", code_id, software_type, landing_page, "Landing Page", "download-link"));
        }

        // Mark the last one as "is_last"
        if (return_data.size() > 0) {
            int last_index = return_data.size() - 1;
            ObjectNode last_item = (ObjectNode) return_data.get(last_index);
            last_item.put("is_last", true);
            return_data.set(last_index, last_item);
        }
        return return_data;
    }

    private static ObjectNode makeDOIRepoLinkObj(String pretext, String title, String code_id, String software_type, String href, String display, String css_class) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        return_data.put("pretext", pretext);
        return_data.put("title", title);
        return_data.put("code_id", code_id);
        return_data.put("software_type", software_type);
        return_data.put("href", href);
        return_data.put("display", display);
        return_data.put("css_class", css_class);
        return return_data;
    }

    public static ObjectNode getAdvancedSearchPageLists() {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        return_data.set("project_type_list", DOECODEServletContextListener.getJsonList(DOECODEJson.PROJECT_TYPE_KEY));
        return_data.set("licenses_list", DOECODEServletContextListener.getJsonList(DOECODEJson.LICENSE_KEY));
        return_data.set("software_type", DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY));
        return_data.set("sort_list", DOECODEServletContextListener.getJsonList(DOECODEJson.SEARCH_SORT_KEY));

        return return_data;
    }

    public static ObjectNode getSearchBreadcrumbTrailList(ObjectNode search_form_data, long num_found) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();

        return_data.put("homepage", "<a title='DOE CODE Homepage' href='/" + Init.app_name
                + "/'> DOE CODE</a>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;");

        String all_fields_text = "Search for " + (StringUtils.isNotBlank(search_form_data.findPath("all_fields").asText("")) ? search_form_data.findPath("all_fields").asText("") : "All Projects");
        String filter_suffix = (getWasAnythingFilteredFor(search_form_data)) ? "<span class='search-for-filter-crumb'>&nbsp;(filtered)</span>" : "";
        return_data.put("searchTerm", all_fields_text);
        return_data.put("filterText", filter_suffix);

        if (num_found > 0) {
            long start = search_form_data.findPath("start").asLong(0);
            long rows = search_form_data.findPath("rows").asLong(0);

            long page = ((int) (start / rows) + 1);
            long max_pages = ((int) java.lang.Math.ceil(num_found / (double) rows));

            if (max_pages > 1) {
                return_data.put("pages", "&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;Page&nbsp;" + Long.toString(page) + "&nbsp;of&nbsp;" + Long.toString(max_pages) + "&nbsp;");
            }
        }

        return return_data;
    }

    public static boolean getWasAnythingFilteredFor(ObjectNode request_data) {
        return StringUtils.isNotBlank(request_data.findPath("software_title").asText(""))
                || StringUtils.isNotBlank(request_data.findPath("developers_contributors").asText(""))
                || StringUtils.isNotBlank(request_data.findPath("biblio_data").asText(""))
                || StringUtils.isNotBlank(request_data.findPath("doi").asText(""))
                || StringUtils.isNotBlank(request_data.findPath("identifiers").asText(""))
                || StringUtils.isNotBlank(request_data.findPath("date_earliest").asText(""))
                || StringUtils.isNotBlank(request_data.findPath("date_latest").asText(""))
                || (StringUtils.isNotBlank(request_data.findPath("project_type").asText(""))
                && JsonUtils.parseArrayNode(request_data.findPath("project_type").asText("")).size() > 0)
                || (StringUtils.isNotBlank(request_data.findPath("licenses").asText(""))
                && JsonUtils.parseArrayNode(request_data.findPath("licenses").asText("")).size() > 0)
                || StringUtils.isNotBlank(request_data.findPath("programming_languages").asText(""))
                || StringUtils.isNotBlank(request_data.findPath("research_organization").asText(""))
                || StringUtils.isNotBlank(request_data.findPath("sponsoring_organization").asText(""))
                || (StringUtils.isNotBlank(request_data.findPath("software_type").asText(""))
                && JsonUtils.parseArrayNode(request_data.findPath("software_type").asText("")).size() > 0)
                || StringUtils.isNotBlank(request_data.findPath("orcid").asText(""));
    }

    public static ObjectNode getBiblioSidebarData(ObjectNode search_data, String public_api_url) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        // DOI and release date
        return_data.put("has_doi_and_release", showDOI(search_data.findPath("doi").asText(""), search_data.findPath("release_date").asText("")));
        return_data.put("doi", search_data.findPath("doi").asText(""));

        // Repository URL
        String repository_link = search_data.findPath("repository_link").asText("");
        String landing_page = search_data.findPath("landing_page").asText("");
        String landing_contact = search_data.findPath("landing_contact").asText("");
        String doc_link = search_data.findPath("documentation_url").asText("");

        //SEe if we need to show the repository link
        if (StringUtils.isNotBlank(repository_link)) {
            return_data.put("has_repo_link", true);
            return_data.put("repo_link", (StringUtils.startsWith(repository_link, "https://") || StringUtils.startsWith(repository_link, "http://")) ? repository_link : "http://" + repository_link);
        }

        //See if this has a landing page
        if (StringUtils.isNotBlank(landing_page)) {
            return_data.put("has_landing_page", true);
            return_data.put("landing_page", (StringUtils.startsWith(landing_page, "https://") || StringUtils.startsWith(landing_page, "http://")) ? landing_page : "http://" + landing_page);
        }

        //See if we need to show the software group email
        if (StringUtils.equals(search_data.findPath("project_type").asText(""), "CS") && StringUtils.isBlank(landing_page) && !StringUtils.isBlank(landing_contact)) {
            return_data.put("needs_software_group_email", true);
            return_data.put("software_group_email", landing_contact);
        }

        // Code ID
        return_data.put("code_id", search_data.findPath("code_id").asLong(0));

        // DOE CODE API URL
        return_data.put("api_url", public_api_url);

        // Documentation URL
        if (StringUtils.isNotBlank(doc_link)) {
            return_data.put("has_documentation_url", true);
            return_data.put("documentation_url", doc_link);
        }

        // Previous/Next version
        // Go through the related identifiers list. If we can find any DOI's that are
        // "IsNewVersionOf" or "IsPreviousVersionOf". If so, list them, and put them
        // into the template
        ArrayNode related_identifiers = (ArrayNode) search_data.get("related_identifiers");
        if (null != related_identifiers && related_identifiers.size() > 0) {
            // The names of the arrays contents will be stored in are the inverse. So,
            // anything in "IsNewVersionOf" will be stored in "prev_versions".
            ArrayNode new_versions = JsonUtils.MAPPER.createArrayNode();
            ArrayNode prev_versions = JsonUtils.MAPPER.createArrayNode();

            for (JsonNode j : related_identifiers) {
                ObjectNode row = (ObjectNode) j;
                // If this particular related identifier is a doi
                if (StringUtils.equals("DOI", row.findPath("identifier_type").asText(""))) {
                    // Get the value, and put it into the correct array, if it's one of the types we
                    // want
                    String identifier_value = row.findPath("identifier_value").asText("");
                    switch (row.findPath("relation_type").asText("")) {
                        case "IsNewVersionOf":
                            prev_versions.add(identifier_value);
                            break;
                        case "IsPreviousVersionOf":
                            new_versions.add(identifier_value);
                            break;
                    }
                }
            }
            return_data.put("has_new_version", new_versions.size() > 0);
            return_data.set("new_version", new_versions);
            return_data.put("more_than_one_new", new_versions.size() > 1);
            return_data.put("has_prev_version", prev_versions.size() > 0);
            return_data.set("prev_version", prev_versions);
            return_data.put("more_than_one_previous", prev_versions.size() > 1);
        }

        // See if this record has a downloadable file
        String container_name = search_data.findPath("container_name").asText("");
        boolean has_file_to_download = StringUtils.isNotBlank(container_name);
        return_data.put("has_file_to_download", has_file_to_download);
        return_data.put("container_name", container_name);
        return return_data;
    }

    public static boolean showDOI(String doi, String release_date) {
        return StringUtils.isNotBlank(doi) && StringUtils.isNotBlank(release_date);
    }

    public static ObjectNode getSponsoringOrgData(ArrayNode sponsoring_orgs) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        ArrayNode list = JsonUtils.MAPPER.createArrayNode();

        for (int i = 0; i < sponsoring_orgs.size(); i++) {
            ObjectNode sponsorOrgRow = (ObjectNode) sponsoring_orgs.get(i);
            ObjectNode refinedSponsorOrgRow = JsonUtils.MAPPER.createObjectNode();

            refinedSponsorOrgRow.put("org_name", sponsorOrgRow.findPath("organization_name").asText(""));
            ArrayNode AwardNums = JsonUtils.MAPPER.createArrayNode();
            ArrayNode FWPNums = JsonUtils.MAPPER.createArrayNode();
            ArrayNode BRCodes = JsonUtils.MAPPER.createArrayNode();

            // Go through the array, look for the different types of numbers, and add them
            // to the list
            for (JsonNode identifier : (ArrayNode) sponsorOrgRow.get("funding_identifiers")) {
                ObjectNode identifierRow = (ObjectNode) identifier;
                String identifier_value = identifierRow.findPath("identifier_value").asText("");
                switch (identifierRow.findPath("identifier_type").asText("")) {
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

            // Primary Award
            String primary_award = sponsorOrgRow.findPath("primary_award").asText("");
            refinedSponsorOrgRow.put("has_primary_award", StringUtils.isNotBlank(primary_award) && !StringUtils.equals(primary_award.toLowerCase(), "unknown"));
            refinedSponsorOrgRow.put("primary_award", primary_award);

            // Award Numbers
            refinedSponsorOrgRow.put("has_award_numbers", AwardNums.size() > 0);
            refinedSponsorOrgRow.set("award_nums", AwardNums);

            // FWP NumberS
            refinedSponsorOrgRow.put("has_fwp_numbers", FWPNums.size() > 0);
            refinedSponsorOrgRow.set("fwp_nums", FWPNums);

            // BR CODES
            refinedSponsorOrgRow.put("has_br_codes", BRCodes.size() > 0);
            refinedSponsorOrgRow.set("br_codes", BRCodes);

            // If this is the last row, note it, because that affects the UI of the template
            if ((i + 1) == sponsoring_orgs.size()) {
                refinedSponsorOrgRow.put("is_last", true);
            }
            list.add(refinedSponsorOrgRow);
        }

        return_data.set("list", list);
        return_data.put("has_sponsoring_org", list.size() > 0);
        return return_data;
    }

    public static ObjectNode getAwardDois(ArrayNode award_dois) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        ArrayNode list = JsonUtils.MAPPER.createArrayNode();
        if(award_dois != null) {
            for (int i = 0; i < award_dois.size(); i++) {
                ObjectNode awardDoisRow = (ObjectNode) award_dois.get(i);
                ObjectNode refinedAwardDoisRow = JsonUtils.MAPPER.createObjectNode();
                
                refinedAwardDoisRow.put("funder_name", awardDoisRow.findPath("funder_name").asText(""));
                refinedAwardDoisRow.put("award_doi", awardDoisRow.findPath("award_doi").asText(""));
                
                // If this is the last row, note it, because that affects the UI of the template
                if ((i + 1) == award_dois.size()) {
                    refinedAwardDoisRow.put("is_last", true);
                }
                list.add(refinedAwardDoisRow);
            }
        }

        return_data.set("list", list);
        return_data.put("has_award_dois", list.size() > 0);
        return return_data;
    }

    public static ObjectNode getContributingOrganizations(ArrayNode contributing_orgs) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        ArrayNode list = JsonUtils.MAPPER.createArrayNode();

        for (int i = 0; i < contributing_orgs.size(); i++) {
            ObjectNode contributingOrgRow = (ObjectNode) contributing_orgs.get(i);
            ObjectNode refinedContributingOrgRow = JsonUtils.MAPPER.createObjectNode();

            refinedContributingOrgRow.put("org_name", contributingOrgRow.findPath("organization_name").asText(""));

            String contributor_type = StringUtils.defaultIfBlank(DOECODEUtils.CONTRIBUTORS_MAP.get(contributingOrgRow.findPath("contributor_type").asText("")), "Unknown");
            refinedContributingOrgRow.put("contributor_type", contributor_type);

            // If this is the last row, note it, because that affects the UI of the template
            if ((i + 1) == contributing_orgs.size()) {
                refinedContributingOrgRow.put("is_last", true);
            }
            list.add(refinedContributingOrgRow);
        }

        return_data.set("list", list);
        return_data.put("has_contributing_org", list.size() > 0);
        return return_data;
    }

    public static ArrayNode getResearchOrganizations(ArrayNode researchOrgs) {
        ArrayNode return_data = JsonUtils.MAPPER.createArrayNode();
        for (JsonNode v : researchOrgs) {
            ObjectNode vObj = (ObjectNode) v;
            return_data.add(vObj.findPath("organization_name").asText(""));
        }
        return return_data;
    }

    public static ArrayNode combineAuthorLists(ArrayNode arr1, ArrayNode arr2) {
        ArrayNode return_data = JsonUtils.MAPPER.createArrayNode();

        for (JsonNode v : arr1) {
            ObjectNode row = (ObjectNode) v;
            String first_name = row.findPath("first_name").asText("");
            String middle_name = row.findPath("middle_name").asText("");
            String last_name = row.findPath("last_name").asText("");
            // Make sure they're not a "none" entry
            if (!last_name.equalsIgnoreCase("none")) {
                String combinedName = combineName(first_name, middle_name, last_name);

                if (StringUtils.isNotBlank(combinedName)) {
                    return_data.add(combinedName);
                }
            }
        }

        for (JsonNode v : arr2) {
            ObjectNode row = (ObjectNode) v;
            String first_name = row.findPath("first_name").asText("");
            String middle_name = row.findPath("middle_name").asText("");
            String last_name = row.findPath("last_name").asText("");

            if (!last_name.equalsIgnoreCase("none")) {
                String combinedName = combineName(first_name, middle_name, last_name);

                if (StringUtils.isNotBlank(combinedName)) {
                    return_data.add(combinedName);
                }
            }
        }

        return return_data;
    }

    private static String combineName(String first_name, String middle_name, String last_name) {
        boolean showLastNameOnly = first_name.equalsIgnoreCase("none");
        boolean ignoreMiddleName = middle_name.equalsIgnoreCase("none");
        String fullname = "";

        if (showLastNameOnly) {
            first_name = "";
        }

        if (showLastNameOnly || ignoreMiddleName) {
            middle_name = "";
        }

        if (StringUtils.isNotBlank(last_name)) {
            fullname += last_name;
        }

        if (StringUtils.isNotBlank(fullname) && StringUtils.isNotBlank(first_name)) {
            fullname += (", " + first_name);
        }

        if (StringUtils.isNotBlank(fullname) && StringUtils.isNotBlank(middle_name.trim())
                && StringUtils.length(middle_name.trim()) > 0) {
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
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();

        boolean needsSpacing = false;

        // Authors
        ArrayNode authors_and_contributors = combineAuthorLists((ArrayNode) biblio_data.get("developers"), (ArrayNode) biblio_data.get("contributors"));
        String author_text = joinWithDelimiters(authors_and_contributors, ", ", ", & ");
        if (StringUtils.isNotBlank(author_text)) {
            author_text += (StringUtils.endsWith(author_text, ".") ? "" : ".");
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(author_text);

        // Release Date
        String release_date = biblio_data.findPath("release_date").asText("");
        if (StringUtils.isNotBlank(release_date)) {
            release_date = ((needsSpacing ? " " : "") + "(" + LocalDate.parse(release_date, RELEASE_DATE_FORMAT).format(APA_DATE_FORMAT) + ").");
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(release_date);

        // Software Title
        String software_title = biblio_data.findPath("software_title").asText("");
        if (StringUtils.isNotBlank(software_title)) {
            software_title = (needsSpacing ? " " : "") + software_title + ".";
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(software_title);

        // Computer Software
        String computer_software = needsSpacing ? " [Computer software]." : "[Computer software].";

        // URL
        String url = biblio_data.findPath("repository_link").asText("");
        if (StringUtils.isNotBlank(url)) {
            url = ((needsSpacing ? " " : "") + url + ".");
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(url);

        // DOI
        String doi = biblio_data.findPath("doi").asText("");
        if (StringUtils.isNotBlank(doi)) {
            doi = ((needsSpacing ? " " : "") + "https://doi.org/" + doi + ".");
        }
        boolean showDoi = showDOI(biblio_data.findPath("doi").asText(""), biblio_data.findPath("release_date").asText(""));

        return_data.put("show_doi", showDoi);
        return_data.put("authors", author_text);
        return_data.put("release_date", release_date);
        return_data.put("software_title", software_title);
        return_data.put("computer_software", computer_software);
        return_data.put("url", url);
        return_data.put("doi", doi);

        return return_data;
    }

    private static ObjectNode getOptionalBibtexObj(String label, String value) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        return_data.put("label", label);
        return_data.put("value", value);
        return return_data;
    }

    private static ObjectNode getBibtexFormat(ObjectNode biblio_data) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        ArrayNode optional_data = JsonUtils.MAPPER.createArrayNode();

        // Software Title
        String software_title = "{" + biblio_data.findPath("software_title").asText("") + "}";

        // Authors Text
        ArrayNode authors_and_contributors = combineAuthorLists((ArrayNode) biblio_data.get("developers"), (ArrayNode) biblio_data.get("contributors"));
        String author_text = joinWithDelimiters(authors_and_contributors, " and ", null);
        if (StringUtils.isNotBlank(author_text)) {
            author_text = ("{" + author_text + "}");
        }

        // Description
        String description = "{" + biblio_data.findPath("description").asText("") + "}";

        // DOI
        boolean showDoi = showDOI(biblio_data.findPath("doi").asText(""), biblio_data.findPath("release_date").asText(""));
        if (showDoi) {
            String doi = biblio_data.findPath("doi").asText("");
            optional_data.add(getOptionalBibtexObj("doi", "{" + doi.replaceAll("_", "{_}") + "}"));
            optional_data.add(getOptionalBibtexObj("url", "{https://doi.org/" + doi + "}"));
            optional_data.add(getOptionalBibtexObj("howpublished", "{[Computer Software] \\url{https://doi.org/" + doi + "}}"));
        }

        // Release Date
        String release_date_year = "";
        String release_date_month = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("release_date").asText(""))) {
            LocalDate release_date = LocalDate.parse(biblio_data.findPath("release_date").asText(""), RELEASE_DATE_FORMAT);
            release_date_year = Integer.toString(release_date.getYear());
            release_date_month = Integer.toString(release_date.getMonthValue());
            optional_data.add(getOptionalBibtexObj("year", "{" + release_date_year + "}"));
            optional_data.add(getOptionalBibtexObj("month", "{" + DOECODEUtils.getShortMonth(release_date_month, false) + "}"));
        }

        return_data.put("show_doi", showDOI(biblio_data.findPath("doi").asText(""), biblio_data.findPath("release_date").asText("")));
        return_data.put("code_id", biblio_data.findPath("code_id").asLong(0));
        return_data.put("authors_text", author_text);
        return_data.put("description", description);
        return_data.put("software_title", software_title);

        // If there was anything in the optional_data array, and its size is more than
        // 1, we will add an indicator saying that it's the last, so we won't want a
        // comma
        if (optional_data.size() > 0) {
            int last_item_index = optional_data.size() - 1;

            ObjectNode last_item = (ObjectNode) optional_data.get(last_item_index);
            last_item.put("is_last", true);
            optional_data.set(last_item_index, last_item);
        }

        return_data.set("optional", optional_data);
        return return_data;
    }

    private static ObjectNode getChicagoFormat(ObjectNode biblio_data) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();

        boolean needsSpacing = false;

        // Authors
        ArrayNode authors_and_contributors = combineAuthorLists((ArrayNode) biblio_data.get("developers"), (ArrayNode) biblio_data.get("contributors"));
        String author_text = joinWithDelimiters(authors_and_contributors, ", ", ", and ");
        if (StringUtils.isNotBlank(author_text)) {
            author_text += (StringUtils.endsWith(author_text, ".") ? "" : ".");
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(author_text);

        // Software Title
        String software_title = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("software_title").asText(""))) {
            String after_title = StringUtils.endsWith(biblio_data.findPath("software_title").asText(""), ".")
                    || StringUtils.endsWith(biblio_data.findPath("software_title").asText(""), "!")
                    || StringUtils.endsWith(biblio_data.findPath("software_title").asText(""), "?") ? "" : ".";
            software_title = (needsSpacing ? " " : "") + "\"" + biblio_data.findPath("software_title").asText("") + after_title + "\" Computer software.";
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(software_title);

        // Release Date
        String release_date = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("release_date").asText(""))) {
            release_date = (needsSpacing ? " " : "")
                    + LocalDate.parse(biblio_data.findPath("release_date").asText("")).format(CHICAGO_DATE_FORMAT)
                    + ".";
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(release_date);

        // URL
        String url = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("repository_link").asText(""))) {
            url = ((needsSpacing ? " " : "") + biblio_data.findPath("repository_link").asText("") + ".");
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(url);

        // DOI
        String doi = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("doi").asText(""))) {
            doi = ((needsSpacing ? " " : "") + "https://doi.org/" + biblio_data.findPath("doi").asText("") + ".");
        }
        boolean showDoi = showDOI(biblio_data.findPath("doi").asText(""), biblio_data.findPath("release_date").asText(""));

        return_data.put("show_doi", showDoi);
        return_data.put("authors", author_text);
        return_data.put("software_title", software_title);
        return_data.put("release_date", release_date);
        return_data.put("url", url);
        return_data.put("doi", doi);
        return return_data;
    }

    private static ObjectNode getMLAFormat(ObjectNode biblio_data) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        boolean needsSpacing = false;

        // Authors
        ArrayNode authors_and_contributors = combineAuthorLists((ArrayNode) biblio_data.get("developers"), (ArrayNode) biblio_data.get("contributors"));
        String author_text = joinWithDelimiters(authors_and_contributors, ", ", ", and ");
        if (StringUtils.isNotBlank(author_text)) {
            author_text += (StringUtils.endsWith(author_text, ".") ? "" : ".");
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(author_text);

        // Software Title
        String software_title = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("software_title").asText(""))) {
            software_title = (needsSpacing ? " " : "") + biblio_data.findPath("software_title").asText("") + ".";
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(software_title);

        // Computer Software
        String computer_software = needsSpacing ? " Computer Software." : "ComputerSoftware.";

        // URL
        String url = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("repository_link").asText(""))) {
            url = (needsSpacing ? " " : "") + biblio_data.findPath("repository_link").asText("") + ".";
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(url);

        // Sponsor Orgs
        String sponsor_orgs = "";
        ArrayNode sponsor_orgs_list = JsonUtils.MAPPER.createArrayNode();
        for (JsonNode v : (ArrayNode) biblio_data.get("sponsoring_organizations")) {
            ObjectNode vObj = (ObjectNode) v;
            sponsor_orgs_list.add(vObj.findPath("organization_name").asText(""));
        }
        if (sponsor_orgs_list.size() > 0) {
            sponsor_orgs = joinWithDelimiters(sponsor_orgs_list, ", ", null);
            sponsor_orgs = (needsSpacing ? " " : "") + sponsor_orgs                    + (StringUtils.endsWith(sponsor_orgs, ".") ? "" : ".");
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(sponsor_orgs);

        // Release Date
        String release_date = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("release_date").asText(""))) {
            release_date = (needsSpacing ? " " : "")                    + LocalDate.parse(biblio_data.findPath("release_date").asText(""), RELEASE_DATE_FORMAT)                            .format(MLA_DATE_FORMAT);
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(release_date);

        // Web
        String web = needsSpacing ? "Web." : " Web.";
        needsSpacing = needsSpacing || StringUtils.isNotBlank(web);

        // DOI
        String doi = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("doi").asText(""))) {
            doi = ((needsSpacing ? " " : "") + "doi:" + biblio_data.findPath("doi").asText("") + ".");
        }
        boolean showDoi = showDOI(biblio_data.findPath("doi").asText(""), biblio_data.findPath("release_date").asText(""));

        return_data.put("show_doi", showDoi);
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

    private static ObjectNode getTombstoneFormat(ObjectNode biblio_data) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        boolean needsSpacing = false;

        // Authors
        ArrayNode authors_and_contributors = combineAuthorLists((ArrayNode) biblio_data.get("developers"), (ArrayNode) biblio_data.get("contributors"));
        String author_text = joinWithDelimiters(authors_and_contributors, ", ", ", and ");
        if (StringUtils.isNotBlank(author_text)) {
            author_text += (StringUtils.endsWith(author_text, ".") ? "" : ".");
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(author_text);

        // Release Date
        String release_date = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("release_date").asText(""))) {
            release_date = (needsSpacing ? " " : "")                    + LocalDate.parse(biblio_data.findPath("release_date").asText(""), RELEASE_DATE_FORMAT)                            .format(MLA_DATE_FORMAT);
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(release_date);

        // Software Title
        String software_title = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("software_title").asText(""))) {
            software_title = (needsSpacing ? " " : "") + biblio_data.findPath("software_title").asText("") + ".";
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(software_title);

        // Computer Software
        String computer_software = needsSpacing ? " Computer Software." : "ComputerSoftware.";

        // Sponsor Orgs
        String sponsor_orgs = "";
        ArrayNode sponsor_orgs_list = JsonUtils.MAPPER.createArrayNode();
        for (JsonNode v : (ArrayNode) biblio_data.get("sponsoring_organizations")) {
            ObjectNode vObj = (ObjectNode) v;
            sponsor_orgs_list.add(vObj.findPath("organization_name").asText(""));
        }
        if (sponsor_orgs_list.size() > 0) {
            sponsor_orgs = joinWithDelimiters(sponsor_orgs_list, ", ", null);
            sponsor_orgs = (needsSpacing ? " " : "") + sponsor_orgs                    + (StringUtils.endsWith(sponsor_orgs, ".") ? "" : ".");
        }
        needsSpacing = needsSpacing || StringUtils.isNotBlank(sponsor_orgs);

        // DOI
        String doi = "";
        if (StringUtils.isNotBlank(biblio_data.findPath("doi").asText(""))) {
            doi = ((needsSpacing ? " " : "") + "doi:" + biblio_data.findPath("doi").asText("") + ".");
        }

        return_data.put("show_doi", showDOI(biblio_data.findPath("doi").asText(""), biblio_data.findPath("release_date").asText("")));
        return_data.put("authorsText", author_text);
        return_data.put("releaseDate", release_date);
        return_data.put("softwareTitle", software_title);
        return_data.put("computer_software", computer_software);
        return_data.put("sponsorOrgsText", sponsor_orgs);
        return_data.put("doi", doi);
        return return_data;
    }

    public static ObjectNode getBiblioData(long code_id) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        ObjectNode biblio_data = JsonUtils.MAPPER.createObjectNode();

        boolean isValidRecord = false;
        boolean isTombstoneRecord = false;
        boolean isRestrictedMetadata = false;

        // Get the biblio data
        ObjectNode raw_biblio_call = DOECODEUtils.makeGetRequest(Init.backend_api_url + "search/" + code_id);
        if (raw_biblio_call.has("metadata")) {
            biblio_data = (ObjectNode) raw_biblio_call.get("metadata");
            isValidRecord = true;
            biblio_data.put("is_valid_record", isValidRecord);
        }
        else {
            raw_biblio_call = DOECODEUtils.makeGetRequest(Init.backend_api_url + "search/tombstone/" + code_id);
            if (raw_biblio_call.has("metadata")) {
                biblio_data = (ObjectNode) raw_biblio_call.get("metadata");
                isTombstoneRecord = true;
                biblio_data.put("is_tombstone_record", isTombstoneRecord);

                isRestrictedMetadata = raw_biblio_call.get("metadata").has("is_restricted_metadata");
            }  
        }

        log.debug(biblio_data.toString());
        // Massage any data that needs it
        if (isValidRecord) {
            ArrayNode meta_tags = JsonUtils.MAPPER.createArrayNode();
            /* Title */
            return_data.put("title", biblio_data.findPath("software_title").asText(""));
            meta_tags.add(makeMetaTag("title", biblio_data.findPath("software_title").asText("")));

            /* Description */
            return_data.set("descriptionObj", getDescription(biblio_data.findPath("description").asText(""), 200));
            meta_tags.add(makeMetaTag("citation_abstract", biblio_data.findPath("description").asText("")));

            /* Developers and their Affiliations */
            LinkedHashMap<String, Integer> dev_affiliations_map = new LinkedHashMap<String, Integer>();
            int dev_affiliations_pointer = 1;

            //Make a list that we'll end up going through and listing out a bunch of developer-based meta information
            ArrayNode developers_meta_list = JsonUtils.createArrayNode();

            // Go through the developer list, and gather some information
            ArrayNode refined_developers_list = JsonUtils.createArrayNode();
            for (JsonNode developer : biblio_data.withArray("developers")) {
                ObjectNode row = JsonUtils.createObjectNode();
                // Get their name (combined)
                String first_name = developer.findPath("first_name").asText("").trim();
                String last_name = developer.findPath("last_name").asText("").trim();
                String name = last_name + ", " + first_name;
                // Allow "last name only" for Group names
                if (StringUtils.equalsIgnoreCase(first_name, "none") && !StringUtils.equalsIgnoreCase(last_name, "none")) {
                    name = last_name;
                }
                //See if the name isn't blank or a "none, none" situation. If it isn't, then we'll add them to the object that shows on the biblio page
                if (StringUtils.isNotBlank(name.replaceAll(" ", "").replaceAll(",", "")) && !StringUtils.equalsIgnoreCase(last_name, "none")) {
                    row.put("name", name);
                    developers_meta_list.addAll(makeDeveloperContributorMetaTag("developer", developer, developers_meta_list.toString()));

                    // Orcid
                    if (StringUtils.isNotBlank(developer.findPath("orcid").asText(""))) {
                        row.put("show_orcid", true);
                        row.put("orcid", developer.findPath("orcid").asText(""));
                    }

                    // Go through this user's affiliations, and add them to the affiliations map (if
                    // they're unique)
                    ArrayNode dev_affiliations = developer.withArray("affiliations");
                    if (dev_affiliations.size() > 0) {
                        ArrayList<Integer> superscript_list = new ArrayList<Integer>(); // Store all of the affiliations
                        // they'll have here
                        for (JsonNode aff : dev_affiliations) {
                            if (!dev_affiliations_map.containsKey(aff.asText(""))) {
                                dev_affiliations_map.put(aff.asText(""), dev_affiliations_pointer);
                                superscript_list.add(dev_affiliations_pointer);
                                dev_affiliations_pointer++;
                            } else {
                                superscript_list.add(dev_affiliations_map.get(aff.asText("")));
                            }
                        }

                        // Now, if the superscript list has anything, sort it, and stick the data in our
                        // row object
                        if (superscript_list.size() > 0) {
                            Collections.sort(superscript_list);// Numerical sort, 1-n
                            // Create an affiliations string
                            String supersscript_str = "[" + StringUtils.join(superscript_list, "][") + "]";
                            // Add it to this developer object
                            row.put("superscript_str", supersscript_str);
                            row.put("show_superscript", true);
                        }
                    }
                    refined_developers_list.add(row);
                }
            }

            // If we have any developers, we need to mark teh last one as last, so we don't
            // put too many ";" on the page
            if (refined_developers_list.size() > 0) {
                ObjectNode last_item = (ObjectNode) refined_developers_list.get(refined_developers_list.size() - 1);
                last_item.put("is_last", true);
                refined_developers_list.set(refined_developers_list.size() - 1, last_item);
            }
            // Put the affiliation list together. Since we used a LinkedHashMap, the
            // insertion order was stored, meaning if we get the keyset, it should come out
            // in numerical order
            ArrayNode dev_distinct_affiliations_list = JsonUtils.MAPPER.createArrayNode();
            for (String key : dev_affiliations_map.keySet()) {
                dev_distinct_affiliations_list.add(key);
            }
            return_data.put("developers", refined_developers_list);
            return_data.put("has_developers", refined_developers_list.size() > 0);
            return_data.put("dev_affiliations_list", dev_distinct_affiliations_list);
            return_data.put("show_dev_affiliations_list", dev_distinct_affiliations_list.size() > 0);

            /* Contributors */
            // Contributors affiliations list
            LinkedHashMap<String, Integer> contr_affiliations_map = new LinkedHashMap<String, Integer>();
            int contr_affiliations_pointer = 1;

            //Make a list for our contributor meta tags
            ArrayNode contributor_meta_list = JsonUtils.createArrayNode();

            // Contributor types list. This will be useful for something we will use later
            ArrayList<String> contributor_types = new ArrayList<String>();
            // Store a list of contributors in a map, with the keys being contributor types
            HashMap<String, ArrayNode> contrib_map = new HashMap<String, ArrayNode>();
            for (JsonNode contributor : biblio_data.withArray("contributors")) {
                ObjectNode row = JsonUtils.MAPPER.createObjectNode();

                // Name
                String last_name = contributor.findPath("last_name").asText("");
                String first_name = contributor.findPath("first_name").asText("");
                String name = last_name + ", " + first_name;
                // Allow "last name only" for Group names
                if (StringUtils.equalsIgnoreCase(first_name, "none") && !StringUtils.equalsIgnoreCase(last_name, "none")) {
                    name = last_name;
                }
                if (StringUtils.isNotBlank(name.replaceAll(" ", "").replaceAll(",", "")) && !StringUtils.equalsIgnoreCase(last_name, "none")) {
                    row.put("name", name);
                    contributor_meta_list.addAll(makeDeveloperContributorMetaTag("contributor", contributor, contributor_meta_list.toString()));
                    // Orcid
                    if (StringUtils.isNotBlank(contributor.findPath("orcid").asText(""))) {
                        row.put("show_orcid", true);
                        row.put("orcid", contributor.findPath("orcid").asText(""));
                    }

                    // Map affiliations
                    ArrayNode contrib_affiliations = contributor.withArray("affiliations");
                    if (contrib_affiliations.size() > 0) {
                        ArrayList<Integer> superscript_list = new ArrayList<Integer>(); // Store all of the affiliations
                        // they'll have here
                        for (JsonNode aff : contrib_affiliations) {
                            // If we don't already have this affiliation(and its pointer), add it to the map
                            // and increment the pointer
                            if (!contr_affiliations_map.containsKey(aff.asText(""))) {
                                contr_affiliations_map.put(aff.asText(""), contr_affiliations_pointer);
                                superscript_list.add(contr_affiliations_pointer);
                                contr_affiliations_pointer++;
                            } else {
                                superscript_list.add(contr_affiliations_map.get(aff.asText("")));
                            }
                        }

                        // Now, if there is anything in the superscript list, sort it, and stick the
                        // data in our new row object
                        if (superscript_list.size() > 0) {
                            Collections.sort(superscript_list);// Numerical sort, 1-n
                            // Create a string of affiliations
                            String superscript_str = "[" + StringUtils.join(superscript_list, "][") + "]";
                            // Add it to the contributor object
                            row.put("superscript_str", superscript_str);
                            row.put("show_superscript", true);
                        }
                    }

                    // Contributor type
                    String contributor_type = StringUtils.defaultIfBlank(DOECODEUtils.CONTRIBUTORS_MAP.get(contributor.findPath("contributor_type").asText("")), "Unknown");
                    row.put("contributor_type", contributor_type);
                    contributor_types.add(contributor_type);

                    // Add this to our map
                    if (contrib_map.containsKey(contributor_type)) {
                        contrib_map.get(contributor_type).add(row);
                    } else {
                        ArrayNode new_row = JsonUtils.MAPPER.createArrayNode();
                        new_row.add(row);
                        contrib_map.put(contributor_type, new_row);
                    }
                }

            }

            // Contributors object (this one will end up being compiled into the template)
            ObjectNode contributors_obj = JsonUtils.MAPPER.createObjectNode();
            // if we had any contributors, go through and do some refinement
            if (contrib_map.keySet().size() > 0) {// If we had any contributors
                // Add an "is_last" flag to every row
                for (String key : contrib_map.keySet()) {
                    int last_index = contrib_map.get(key).size() - 1;
                    ObjectNode last_obj = (ObjectNode) contrib_map.get(key).get(last_index);
                    last_obj.put("is_last", true);
                    contrib_map.get(key).set(last_index, last_obj);
                }

                // Now, sort the contributor type keys, and then add them to our contributors
                // object that will be put into the page template
                ArrayList<String> contrib_keys = new ArrayList(contrib_map.keySet());// I didn't know you could make an
                // arraylist with a set. Weird,
                // right?
                Collections.sort(contrib_keys);

                ArrayNode contributors_list = JsonUtils.MAPPER.createArrayNode();
                for (String key : contrib_keys) {
                    ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                    row.put("label", key);
                    row.set("list", contrib_map.get(key));
                    contributors_list.add(row);
                }
                contributors_obj.set("contributors_list", contributors_list);
                contributors_obj.put("has_contributors", true);

                // Affiliations
                ArrayNode distinct_contrib_affiliations = JsonUtils.MAPPER.createArrayNode();
                for (String key : contr_affiliations_map.keySet()) {
                    distinct_contrib_affiliations.add(key);
                }
                contributors_obj.set("affiliations_list", distinct_contrib_affiliations);
                contributors_obj.put("has_affiliations", distinct_contrib_affiliations.size() > 0);
            }
            return_data.set("contributors_obj", contributors_obj);

            /* Contributing Orgs */
            ObjectNode contributing_orgs = getContributingOrganizations((ArrayNode) biblio_data.get("contributing_organizations"));
            return_data.set("contributing_orgs", contributing_orgs);
            return_data.put("has_contributing_org", contributing_orgs.findPath("has_contributing_org").asBoolean(false));
            ArrayNode contributingorgslist = JsonUtils.MAPPER.createArrayNode();
            for (JsonNode v : (ArrayNode) contributing_orgs.get("list")) {
                ObjectNode vObj = (ObjectNode) v;
                contributingorgslist.add(vObj.findPath("org_name").asText(""));
            }
            meta_tags.add(makeMetaTag("contributing_org", DOECODEUtils.makeSpaceSeparatedList(contributingorgslist)));

            // Release Date
            return_data.put("release_date", biblio_data.findPath("release_date").asText(""));
            return_data.put("has_release_date", StringUtils.isNotBlank(biblio_data.findPath("release_date").asText("")));
            meta_tags.add(makeMetaTag("release_date", biblio_data.findPath("release_date").asText("")));

            /* Project Type */
            ArrayNode projectTypeList = DOECODEServletContextListener.getJsonList(DOECODEJson.PROJECT_TYPE_KEY);

            ObjectNode projectTypeObj = JsonUtils.getJsonListItem(projectTypeList, "value", biblio_data.findPath("project_type").asText(""));
            return_data.put("project_type", projectTypeObj.findPath("label").asText(""));
            return_data.put("has_project_type", StringUtils.isNotBlank(biblio_data.findPath("project_type").asText("")));
            meta_tags.add(makeMetaTag("project_type", projectTypeObj.findPath("label").asText("")));

            /* Software Type */
            ArrayNode softwareTypeList = DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY);
            ObjectNode softwareTypeObj = JsonUtils.getJsonListItem(softwareTypeList, "value", biblio_data.findPath("software_type").asText(""));
            return_data.put("software_type", softwareTypeObj.findPath("label").asText(""));
            meta_tags.add(makeMetaTag("software_type", softwareTypeObj.findPath("label").asText("")));

            /* Award DOI */
            ObjectNode award_dois = getAwardDois((ArrayNode) biblio_data.get("award_dois"));
            return_data.set("award_dois", award_dois);
            return_data.put("has_award_dois", award_dois.findPath("has_award_dois").asBoolean(false));
            ArrayNode award_doislist = JsonUtils.MAPPER.createArrayNode();
            for (JsonNode v : (ArrayNode) award_dois.get("list")) {
                ObjectNode vObj = (ObjectNode) v;
                award_doislist.add(vObj.findPath("funder_name").asText(""));
            }
            meta_tags.add(makeMetaTag("award_dois", DOECODEUtils.makeSpaceSeparatedList(award_doislist)));

            /* Licenses */
            ArrayNode licenses = (ArrayNode) biblio_data.get("licenses");
            ArrayNode license_displays = JsonUtils.MAPPER.createArrayNode();
            if (licenses != null) {
                for (JsonNode row : licenses) {
                    String rowVal = row.asText();
                    String displyText = DOECODEUtils.getDisplayVersionOfValue(DOECODEServletContextListener.getJsonList(DOECODEJson.LICENSE_KEY), rowVal);

                    if (rowVal.equalsIgnoreCase("other")) {
                        // there is only ever one single "Other" type
                        String url = biblio_data.findPath("proprietary_url").asText("");

                        return_data.put("has_other_license", true);
                        return_data.put("other_license_display", displyText);
                        return_data.put("other_license", url);
                    } else {
                        license_displays.add(displyText);
                    }
                }
            }
            return_data.set("licenses", license_displays);
            return_data.put("has_licenses", licenses != null && licenses.size() > 0);
            meta_tags.add(makeMetaTag("licenses", DOECODEUtils.makeSpaceSeparatedList((ArrayNode) biblio_data.get("licenses"))));

            /* Sponsoring Org */
            ObjectNode sponsor_orgs = getSponsoringOrgData((ArrayNode) biblio_data.get("sponsoring_organizations"));
            return_data.set("sponsoring_org", sponsor_orgs);
            return_data.put("has_sponsoring_org", sponsor_orgs.findPath("has_sponsoring_org").asBoolean(false));
            ArrayNode sponsororgslist = JsonUtils.MAPPER.createArrayNode();
            for (JsonNode v : (ArrayNode) sponsor_orgs.get("list")) {
                ObjectNode vObj = (ObjectNode) v;
                sponsororgslist.add(vObj.findPath("org_name").asText(""));
            }
            meta_tags.add(makeMetaTag("sponsoring_org", DOECODEUtils.makeSpaceSeparatedList(sponsororgslist)));

            /* Code ID */
            return_data.put("code_id", biblio_data.findPath("code_id").asLong(0));
            meta_tags.add(makeMetaTag("code_id", Long.toString(biblio_data.findPath("code_id").asLong(0))));

            /* Site accession Number */
            return_data.put("site_accession_number", biblio_data.findPath("site_accession_number").asText(""));
            return_data.put("has_site_accession_number", StringUtils.isNotBlank(biblio_data.findPath("site_accession_number").asText("")));
            meta_tags.add(makeMetaTag("site_accession_number", biblio_data.findPath("site_accession_number").asText("")));

            /* Research Orgs */
            ArrayNode research_org_data = getResearchOrganizations((ArrayNode) biblio_data.get("research_organizations"));
            return_data.set("research_orgs", research_org_data);
            return_data.put("has_research_org", research_org_data.size() > 0);
            meta_tags.add(makeMetaTag("research_orgs", DOECODEUtils.makeSpaceSeparatedList(research_org_data)));

            /* Country of origin */
            return_data.put("country_of_origin", biblio_data.findPath("country_of_origin").asText(""));
            return_data.put("has_country_of_origin", StringUtils.isNotBlank(biblio_data.findPath("country_of_origin").asText("")));
            meta_tags.add(makeMetaTag("country_of_origin", biblio_data.findPath("country_of_origin").asText("")));

            /* Programming Languages */
            ArrayNode programming_languages = (ArrayNode) biblio_data.get("programming_languages");
            return_data.set("programming_languages_list", programming_languages);
            return_data.put("has_programming_languages", programming_languages != null && programming_languages.size() > 0);

            /* Version Number */
            return_data.put("version_number", biblio_data.findPath("version_number").asText(""));
            return_data.put("has_version_number", StringUtils.isNotBlank(biblio_data.findPath("version_number").asText("")));

            /* Keywords */
            return_data.put("keywords", biblio_data.findPath("keywords").asText(""));
            return_data.put("has_keywords", StringUtils.isNotBlank(biblio_data.findPath("keywords").asText("")));

            /* Project Keywords */
            ArrayNode project_keywords_list = JsonUtils.MAPPER.createArrayNode();
            if (biblio_data.has("project_keywords")) {
                project_keywords_list = (ArrayNode) biblio_data.get("project_keywords");
                String project_keywords = DOECODEUtils.makeTokenSeparatedList(project_keywords_list, "; ");
                return_data.put("project_keywords", project_keywords);
                return_data.put("has_project_keywords", StringUtils.isNotBlank(project_keywords));
            }

            /* Citation formats */
            return_data.set("mla", getMLAFormat(biblio_data));
            return_data.set("apa", getAPAFormat(biblio_data));
            return_data.set("bibtex", getBibtexFormat(biblio_data));
            return_data.set("chicago", getChicagoFormat(biblio_data));

            /* Biblio sidebar data */
            return_data.set("biblio_sidebar", getBiblioSidebarData(biblio_data, Init.public_api_url));

            /* Meta tags */
            // Before we send the meta tags down, let's go ahead and remove all of the ones
            // that didn't have any actual content
            ArrayNode refined_meta_tags = JsonUtils.MAPPER.createArrayNode();
            for (JsonNode v : meta_tags) {
                ObjectNode vObj = (ObjectNode) v;
                if (StringUtils.isNotBlank(vObj.findPath("content").asText(""))) {
                    refined_meta_tags.add(v);
                }
            }
            return_data.set("meta_tag", refined_meta_tags);

            /* Badges */
            // Check for the site ownership badge
            boolean has_lab_badge = false;
            String site_ownership_code = biblio_data.findPath("site_ownership_code").asText("");
            String lab_badge_link = DOECODEUtils.getLabBadge(site_ownership_code);
            if (StringUtils.isNotBlank(lab_badge_link)) {
                has_lab_badge = true;
                return_data.put("has_lab_badge", true);
                return_data.put("lab_badge_link", lab_badge_link);
                return_data.put("site_ownership_code", site_ownership_code);
            }
            // Check for project badges
            boolean has_project_badges = false;
            if (project_keywords_list.size() > 0) {
                has_project_badges = true;
                ArrayNode badge_link_list = JsonUtils.MAPPER.createArrayNode();

                // Get a list of the keywords in an arraylist, so we have a sortable version.
                ArrayList<String> keywords_list = new ArrayList<String>();
                for (JsonNode jn : project_keywords_list) {
                    keywords_list.add(jn.asText(""));
                }
                // Sort the list alphabetically, and get everything together for the template
                Collections.sort(keywords_list);
                for (String keyword : keywords_list) {
                    // Get teh badge link, if we have it
                    String badge_link = DOECODEUtils.getProjectBadge(keyword);
                    // If we have it, add it to teh list
                    if (StringUtils.isNotBlank(badge_link)) {
                        ObjectNode row = JsonUtils.MAPPER.createObjectNode();
                        row.put("link", badge_link);
                        row.put("project_keyword", keyword);
                        badge_link_list.add(row);
                    }
                }
                return_data.set("project_badges", badge_link_list);
            }
            // IF we have any badge, whether it be lab or site code, we will want to show the container
            return_data.put("has_badges", has_lab_badge || has_project_badges);

            //Put in developer and contributor meta lists
            ArrayNode author_meta_tags = JsonUtils.createArrayNode();
            if (developers_meta_list.size() > 0) {
                author_meta_tags.addAll(developers_meta_list);
            }
            if (contributor_meta_list.size() > 0) {
                author_meta_tags.addAll(contributor_meta_list);
            }
            return_data.set("author_meta_tag", author_meta_tags);
        }
        else if (isTombstoneRecord) {
            return_data.set("doi", biblio_data.get("doi"));
            if (!isRestrictedMetadata) {
                return_data.set("tombstone", getTombstoneFormat(biblio_data));
            }
        }

        return_data.put("is_valid", isValidRecord);
        return_data.put("is_tombstone", isTombstoneRecord);
        return_data.put("is_restricted", isRestrictedMetadata);

        log.debug("Biblio data refined: " + return_data.toString());
        return return_data;
    }

    private static ObjectNode makeMetaTag(String name, String value) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        return_data.put("name", name);
        return_data.put("content", value);
        return return_data;
    }

    private static ArrayNode makeDeveloperContributorMetaTag(String author_type, JsonNode devel_obj, String existing_list_str) {
        //Make the prefix for the meta tags
        String tag_prefix = "citation_" + author_type;

        ArrayNode return_data = JsonUtils.createArrayNode();
        //Name
        String name = devel_obj.findPath("last_name").asText("") + ", " + devel_obj.findPath("first_name").asText("");
        if (StringUtils.isNotBlank(devel_obj.findPath("middle_name").asText(""))) {
            name += (" " + devel_obj.findPath("middle_name").asText(""));
        }
        return_data.add(makeMetaTag(tag_prefix, name));

        //Orcid
        if (StringUtils.isNotBlank(devel_obj.findPath("orcid").asText(""))) {
            return_data.add(makeMetaTag(tag_prefix + "_orcid", devel_obj.findPath("orcid").asText("")));
        }

        //Affiliation(s)
        if (devel_obj.has("affiliations") && devel_obj.withArray("affiliations").size() > 0) {
            //Go through each affiliation, and if our existing list of affilations doesn't contain a given one, add it to the list
            for (JsonNode jn : devel_obj.withArray("affiliations")) {
                if (!StringUtils.containsIgnoreCase(existing_list_str, jn.asText(""))) {
                    return_data.add(makeMetaTag(tag_prefix + "_institution", jn.asText("")));
                }
            }
        }

        return return_data;
    }
}
