package gov.osti.doecode.entity;

import java.util.ArrayList;
import java.util.HashMap;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;

import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;

public class ReportFunctions {

    // Gives the max number of records you can have with a search results export,
    // based on type of export you're doing
    public static final HashMap<String, Integer> MAX_RECS_BY_TYPE = new HashMap<String, Integer>();
    public static final ArrayList<String> SEARCH_RESULTS_HEADER_LIST = new ArrayList<String>();

    static {
        MAX_RECS_BY_TYPE.put("json", 5000);
        MAX_RECS_BY_TYPE.put("csv", 5000);
        MAX_RECS_BY_TYPE.put("excel", 2000);

        SEARCH_RESULTS_HEADER_LIST.add("CODE ID");
        SEARCH_RESULTS_HEADER_LIST.add("Software Type");
        SEARCH_RESULTS_HEADER_LIST.add("Project Type");
        SEARCH_RESULTS_HEADER_LIST.add("Repository/Landing Page Link");
        SEARCH_RESULTS_HEADER_LIST.add("Software Title");
        SEARCH_RESULTS_HEADER_LIST.add("Description");
        SEARCH_RESULTS_HEADER_LIST.add("License(s)");
        SEARCH_RESULTS_HEADER_LIST.add("Programming Language(s)");
        SEARCH_RESULTS_HEADER_LIST.add("Version Number");
        SEARCH_RESULTS_HEADER_LIST.add("Documentation URL");
        SEARCH_RESULTS_HEADER_LIST.add("Developer(s)");
        SEARCH_RESULTS_HEADER_LIST.add("DOI");
        SEARCH_RESULTS_HEADER_LIST.add("Release date");
        SEARCH_RESULTS_HEADER_LIST.add("Short Title/Acronym");
        SEARCH_RESULTS_HEADER_LIST.add("Country of Origin");
        SEARCH_RESULTS_HEADER_LIST.add("Keywords");
        SEARCH_RESULTS_HEADER_LIST.add("Other Special Requirements");
        SEARCH_RESULTS_HEADER_LIST.add("Site Accession Number");
        SEARCH_RESULTS_HEADER_LIST.add("Sponsoring Org(s)");
        SEARCH_RESULTS_HEADER_LIST.add("Research Org(s)");
        SEARCH_RESULTS_HEADER_LIST.add("Contributor(s)");
        SEARCH_RESULTS_HEADER_LIST.add("Contributing Org(s)");
        SEARCH_RESULTS_HEADER_LIST.add("Related Identifiers");
    }

    public static String getCSVSearchExports(ArrayNode search_data) {

        ArrayNode docs_rows = JsonUtils.MAPPER.createArrayNode();
        for (int i = 0; i < search_data.size(); i++) {
            ObjectNode rec = getSearchResultsReportVersion((ObjectNode) search_data.get(i));

            ArrayNode row_vals = JsonUtils.MAPPER.createArrayNode();
            // Code ID
            row_vals.add("\"" + rec.findPath("code_id").asLong(0) + "\"");

            // Software type
            row_vals.add("\"" + rec.findPath("software_type").asText("") + "\"");

            // Project Type
            row_vals.add("\"" + rec.findPath("project_type").asText("").replaceAll("\"", "\"\"") + "\"");

            // Repository/Landing Page Link
            row_vals.add("\"" + rec.findPath("repository_link_landing_page").asText("").replaceAll("\"", "\"\"") + "\"");

            // Software Title
            row_vals.add("\"" + rec.findPath("software_title").asText("").replaceAll("\"", "\"\"") + "\"");

            // Description
            row_vals.add("\"" + rec.findPath("description").asText("").replaceAll("\"", "\"\"") + "\"");

            // License(s)
            row_vals.add("\"" + rec.findPath("licenses").asText("").replaceAll("\"", "\"\"") + "\"");

            // Programming Language(s)
            row_vals.add("\"" + rec.findPath("programming_languages").asText("").replaceAll("\"", "\"\"") + "\"");

            // Version Number
            row_vals.add("\"" + rec.findPath("version_number").asText("").replaceAll("\"", "\"\"") + "\"");

            // Documentation URL
            row_vals.add("\"" + rec.findPath("documentation_url").asText("").replaceAll("\"", "\"\"") + "\"");

            // Developer(s)
            row_vals.add("\"" + rec.findPath("developers_list").asText("").replaceAll("\"", "\"\"") + "\"");

            // Don't show the DOI unless we have a release date
            String doi = rec.findPath("doi").asText("");
            String release_date = rec.findPath("release_date").asText("");

            String display_doi = SearchFunctions.showDOI(doi, release_date) ? doi : "";
            // DOI
            row_vals.add("\"" + display_doi.replaceAll("\"", "\"\"") + "\"");

            // Release Date
            row_vals.add("\"" + release_date.replaceAll("\"", "\"\"") + "\"");

            // Short Title
            row_vals.add("\"" + rec.findPath("short_title").asText("").replaceAll("\"", "\"\"") + "\"");

            // Country of Origin
            row_vals.add("\"" + rec.findPath("country_of_origin").asText("").replaceAll("\"", "\"\"") + "\"");

            // Keywords
            row_vals.add("\"" + rec.findPath("keywords").asText("").replaceAll("\"", "\"\"") + "\"");

            // Other Special Requirements
            row_vals.add("\"" + rec.findPath("other_special_requirements").asText("").replaceAll("\"", "\"\"") + "\"");

            // Site Accession Number
            row_vals.add("\"" + rec.findPath("site_accession_number").asText("").replaceAll("\"", "\"\"") + "\"");

            // Sponsoring orgs
            row_vals.add("\"" + rec.findPath("sponsor_orgs").asText("").replaceAll("\"", "\"\"") + "\"");

            // Research Orgs
            row_vals.add("\"" + rec.findPath("research_orgs").asText("").replaceAll("\"", "\"\"") + "\"");

            // Contributors
            row_vals.add("\"" + rec.findPath("contributors").asText("").replaceAll("\"", "\"\"") + "\"");

            // Contributing Orgs
            row_vals.add("\"" + rec.findPath("contributing_orgs").asText("").replaceAll("\"", "\"\"") + "\"");

            // Related Identifiers
            row_vals.add("\"" + rec.findPath("related_identifiers").asText("").replaceAll("\"", "\"\"") + "\"");

            docs_rows.add(DOECODEUtils.makeTokenSeparatedList(row_vals, ","));
        }

        String return_data = StringUtils.join(SEARCH_RESULTS_HEADER_LIST, ",") + "\n";
        for (JsonNode j : docs_rows) {
            return_data += (j.asText() + "\n");
        }

        return return_data;
    }

    public static String getJsonSearchExports(ArrayNode search_data) {
        ArrayNode return_data = JsonUtils.MAPPER.createArrayNode();
        for (JsonNode doc : search_data) {
            return_data.add(getSearchResultsReportVersion((ObjectNode) doc));
        }

        return return_data.toString();
    }

    private static ObjectNode getSearchResultsReportVersion(ObjectNode docs) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        // code id
        return_data.put("code_id", docs.findPath("code_id").asLong(0));

        // Software type
        String software_type = docs.findPath("software_type").asText("");
        ArrayNode software_types = DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY);
        return_data.put("software_type", DOECODEUtils.getDisplayVersionOfValue(software_types, software_type));

        // Project Type
        String project_type = docs.findPath("project_type").asText("");
        ArrayNode project_types = DOECODEServletContextListener.getJsonList(DOECODEJson.PROJECT_TYPE_KEY);
        return_data.put("project_type", DOECODEUtils.getDisplayVersionOfValue(project_types, project_type));

        // Repository/Landing Page Link
        String repos_landing_page_str = "";
        String landing_page = docs.findPath("landing_page").asText("");
        String repository_link = docs.findPath("repository_link").asText("");
        if (StringUtils.isNotBlank(landing_page)) {
            repos_landing_page_str += (landing_page + "; ");
        }
        if (StringUtils.isNotBlank(repository_link)) {
            repos_landing_page_str += repository_link;
        }
        return_data.put("repository_link_landing_page", repos_landing_page_str);

        // Software Title
        return_data.put("software_title", docs.findPath("software_title").asText(""));

        // Description
        return_data.put("description", docs.findPath("description").asText(""));

        // License(s)
        ArrayNode licenses = (ArrayNode) docs.get("licenses");
        return_data.put("licenses", DOECODEUtils.makeTokenSeparatedList(licenses, "; "));

        // Programming Language(s)
        ArrayNode programming_languages = (ArrayNode) docs.get("programming_languages");
        return_data.put("programming_languages", DOECODEUtils.makeTokenSeparatedList(programming_languages, "; "));

        // Version Number
        return_data.put("version_number", docs.findPath("version_number").asText(""));

        // Documentation URL
        return_data.put("documentation_url", docs.findPath("documentation_url").asText(""));

        // Developer(s)
        ArrayNode developers = (ArrayNode) docs.get("developers");
        ArrayNode developer_displays = JsonUtils.MAPPER.createArrayNode();
        for (JsonNode n : developers) {
            ObjectNode row = (ObjectNode) n;
            ArrayNode name_parts = JsonUtils.MAPPER.createArrayNode();
            String last_name = row.findPath("last_name").asText("");
            if (StringUtils.isNotBlank(last_name)) {
                name_parts.add(last_name);
            }
            String first_name = row.findPath("first_name").asText("");
            if (StringUtils.isNotBlank(first_name)) {
                name_parts.add(first_name);
            }
            String name = DOECODEUtils.makeTokenSeparatedList(name_parts, ", ");

            ArrayNode other_parts = JsonUtils.MAPPER.createArrayNode();
            String orc_id = row.findPath("orcid").asText("");
            if (StringUtils.isNotBlank(orc_id)) {
                other_parts.add("ORCID: " + orc_id);
            }
            ArrayNode affiliations = (ArrayNode) row.get("affiliations");
            String affiliations_str = (null != affiliations && affiliations.size() > 0) ? DOECODEUtils.makeTokenSeparatedList(affiliations, "; ") : "";
            if (StringUtils.isNotBlank(affiliations_str)) {
                other_parts.add("Affiliations: " + affiliations_str);
            }
            String other_parts_str = DOECODEUtils.makeTokenSeparatedList(other_parts, ", ");

            String display = name;
            if (StringUtils.isNotBlank(other_parts_str)) {
                display += " (" + other_parts_str + ")";
            }

            developer_displays.add(display);
        }
        return_data.put("developers_list", DOECODEUtils.makeTokenSeparatedList(developer_displays, "; "));

        // Don't show the DOI unless there is a doi and a release date
        String doi = docs.findPath("doi").asText("");
        String release_date = docs.findPath("release_date").asText("");
        // DOI
        return_data.put("doi", SearchFunctions.showDOI(doi, release_date) ? "https://doi.org/" + doi : "");

        // Release Date
        return_data.put("release_date", release_date);

        // Short Title
        return_data.put("short_title", docs.findPath("acronym").asText(""));

        // Country of Origin
        return_data.put("country_of_origin", docs.findPath("country_of_origin").asText(""));

        // Keywords
        return_data.put("keywords", docs.findPath("keywords").asText(""));

        // Other Special Requirements
        return_data.put("other_special_requirements", docs.findPath("other_special_requirements").asText(""));

        // Site Accession Number
        return_data.put("site_accession_number", docs.findPath("site_accession_number").asText(""));

        // Sponsoring orgs
        ArrayNode sponsor_orgs_list = JsonUtils.MAPPER.createArrayNode();
        for (JsonNode j : (ArrayNode) docs.get("sponsoring_organizations")) {
            ObjectNode row = (ObjectNode) j;

            // Gather all of the values we'll put in the array
            // Name
            String org_name = row.findPath("organization_name").asText("");
            // is doe
            boolean is_doe = row.findPath("DOE").asBoolean(false);
            // Contrat num
            String primary_award = row.findPath("primary_award").asText("");

            ArrayNode additional_rewards = JsonUtils.MAPPER.createArrayNode();
            ArrayNode br_codes = JsonUtils.MAPPER.createArrayNode();
            ArrayNode fwp_nums = JsonUtils.MAPPER.createArrayNode();
            for (JsonNode jn : (ArrayNode) row.get("funding_identifiers")) {
                ObjectNode f_identifiers = (ObjectNode) jn;
                String value = f_identifiers.findPath("identifier_value").asText("");
                switch (f_identifiers.findPath("identifier_type").asText("")) {
                    case "AwardNumber":
                        additional_rewards.add(value);
                        break;
                    case "FWPNumber":
                        fwp_nums.add(value);
                        break;
                    case "BRCode":
                        br_codes.add(value);
                        break;
                }
            }

            // Assemble the string
            ArrayNode value_str = JsonUtils.MAPPER.createArrayNode();
            value_str.add("DOE Organization (" + (is_doe ? "Y" : "N"));
            value_str.add("Primary Award/Contract: " + primary_award);

            if (additional_rewards.size() > 0) {
                value_str.add("Additional Awards/Contracts: " + DOECODEUtils.makeTokenSeparatedList(additional_rewards, "; "));
            }
            if (fwp_nums.size() > 0) {
                value_str.add("FWP Numbers: " + DOECODEUtils.makeTokenSeparatedList(fwp_nums, "; "));
            }
            if (br_codes.size() > 0) {
                value_str.add("B&R Codes: " + DOECODEUtils.makeTokenSeparatedList(br_codes, "; "));
            }

            sponsor_orgs_list.add(org_name + " (" + DOECODEUtils.makeTokenSeparatedList(value_str, ", ") + ")");
        }
        return_data.put("sponsor_orgs", DOECODEUtils.makeTokenSeparatedList(sponsor_orgs_list, "; "));

        // Researh Orgs
        ArrayNode research_orgs_list = JsonUtils.MAPPER.createArrayNode();
        for (JsonNode j : (ArrayNode) docs.get("research_organizations")) {
            ObjectNode row = (ObjectNode) j;
            String organization_name = row.findPath("organization_name").asText("");
            boolean is_doe = row.findPath("DOE").asBoolean(false);
            if (StringUtils.isNotBlank(organization_name)) {
                organization_name += " (DOE Organization: " + (is_doe ? "Y" : "N") + ")";
            }
            research_orgs_list.add(organization_name);
        }
        return_data.put("research_orgs", DOECODEUtils.makeTokenSeparatedList(research_orgs_list, "; "));

        // Contributors
        ArrayNode contributors_list = JsonUtils.MAPPER.createArrayNode();
        ArrayNode contributors = (ArrayNode) docs.get("contributors");
        for (JsonNode j : contributors) {
            ObjectNode row = (ObjectNode) j;
            // Name
            ArrayNode name_parts = JsonUtils.MAPPER.createArrayNode();
            String last_name = row.findPath("last_name").asText("");
            if (StringUtils.isNotBlank(last_name)) {
                name_parts.add(last_name);
            }
            String first_name = row.findPath("first_name").asText("");
            if (StringUtils.isNotBlank(first_name)) {
                name_parts.add(first_name);
            }
            String name = DOECODEUtils.makeTokenSeparatedList(name_parts, ", ");
            // Other Info
            ArrayNode other_parts = JsonUtils.MAPPER.createArrayNode();
            String orc_id = row.findPath("orcid").asText("");
            if (StringUtils.isNotBlank(orc_id)) {
                other_parts.add("ORCID: " + orc_id);
            }
            ArrayNode affiliations = (ArrayNode) row.get("affiliations");
            String affiliations_str = (null != affiliations && affiliations.size() > 0) ? DOECODEUtils.makeTokenSeparatedList(affiliations, "; ") : "";
            if (StringUtils.isNotBlank(affiliations_str)) {
                other_parts.add("Affiliations: " + affiliations_str);
            }
            String contributor_type_per = row.findPath("contributor_type").asText("");
            if (StringUtils.isNotBlank(contributor_type_per)) {
                contributor_type_per = DOECODEUtils.getDisplayVersionOfValue(DOECODEServletContextListener.getJsonList(DOECODEJson.CONTRIBUTOR_PERSONAL_KEY), contributor_type_per);
                other_parts.add("Contributor Type: " + contributor_type_per);
            }
            String other_parts_str = DOECODEUtils.makeTokenSeparatedList(other_parts, ", ");

            String display = name;
            if (StringUtils.isNotBlank(other_parts_str)) {
                display += " (" + other_parts_str + ")";
            }
            contributors_list.add(display);
            String contributor_type_org = row.findPath("contributor_type").asText("");
            contributor_type_org = DOECODEUtils.getDisplayVersionOfValue(DOECODEServletContextListener.getJsonList(DOECODEJson.CONTRIBUTOR_ORG_KEY), contributor_type_org);
        }
        return_data.put("contributors", DOECODEUtils.makeTokenSeparatedList(contributors_list, "; "));

        // Contributing Orgs
        ArrayNode contributing_orgs_list = JsonUtils.MAPPER.createArrayNode();
        
        for (JsonNode j : (ArrayNode) docs.get("contributing_organizations")) {
            ObjectNode row = (ObjectNode) j;
            String name = row.findPath("organization_name").asText("");
            String contributor_type_org = row.findPath("contributor_type").asText("");
            boolean is_doe = row.findPath("DOE").asBoolean(false);
            contributing_orgs_list.add(name + " (DOE Organization: " + (is_doe ? "Y" : "N") + ", Contributor Type: " + contributor_type_org + ")");
        }
        return_data.put("contributing_orgs", DOECODEUtils.makeTokenSeparatedList(contributing_orgs_list, "; "));

        // Related Identifiers
        ArrayNode related_identifiers_list = JsonUtils.MAPPER.createArrayNode();
        for (JsonNode j : (ArrayNode) docs.get("related_identifiers")) {
            ObjectNode row = (ObjectNode) j;
            String value = row.findPath("identifier_value").asText("");
            String type = row.findPath("identifier_type").asText("");
            String relation_type = row.findPath("relation_type").asText("");

            related_identifiers_list.add(value + " (Identifier Type: " + type + ", Relation Type: " + relation_type + ")");
        }
        return_data.put("related_identifiers", DOECODEUtils.makeTokenSeparatedList(related_identifiers_list, "; "));

        return return_data;
    }
}
