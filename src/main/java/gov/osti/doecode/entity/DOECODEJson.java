package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;

import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import javax.servlet.ServletContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DOECODEJson {

    private final Logger log = LoggerFactory.getLogger(DOECODEJson.class.getName());

    public static final String AFFILIATIONS_KEY = "affiliations";
    public static final String AVAILABILITY_KEY = "availability";
    public static final String CONTRIBUTOR_KEY = "contributor";
    public static final String COUNTRIES_KEY = "countries";
    public static final String LICENSE_KEY = "license";
    public static final String RESEARCH_KEY = "research";
    public static final String SEARCH_SORT_KEY = "search";
    public static final String SOFTWARE_TYPE_KEY = "software";
    public static final String SPONSOR_ORG_KEY = "sponsor";
    public static final String STATES_KEY = "states";
    public static final String RELATION_TYPES_KEY = "relation_types";
    public static final String PROGRAMMING_LANGUAGES_KEY = "programming_languages";
    public static final String PROJECT_KEYWORDS_KEY = "project_keywords";

    // Json Array lists
    private ArrayNode affiliations_list;
    private ArrayNode availability_list;
    private ArrayNode contributor_types;
    private ArrayNode countries_list;
    private ArrayNode license_options_list;
    private ArrayNode research_org_list;
    private ArrayNode search_sort_options_list;
    private ArrayNode software_type_list;
    private ArrayNode sponsor_orgs_list;
    private ArrayNode states_list;
    private ArrayNode relation_types_list;
    private ArrayNode programming_languages_list;
    private ArrayNode project_keywords_list;

    /**
     * Initializes all of the json lists DOE CODE Uses. Fills up the lists that
     * don't pull data from OSTI's ELINK AUthority API
     */
    public DOECODEJson() {
        this.affiliations_list = JsonUtils.MAPPER.createArrayNode();
        this.availability_list = JsonUtils.MAPPER.createArrayNode();
        this.contributor_types = JsonUtils.MAPPER.createArrayNode();
        this.countries_list = JsonUtils.MAPPER.createArrayNode();
        this.license_options_list = JsonUtils.MAPPER.createArrayNode();
        this.research_org_list = JsonUtils.MAPPER.createArrayNode();
        this.search_sort_options_list = JsonUtils.MAPPER.createArrayNode();
        this.software_type_list = JsonUtils.MAPPER.createArrayNode();
        this.sponsor_orgs_list = JsonUtils.MAPPER.createArrayNode();
        this.states_list = JsonUtils.MAPPER.createArrayNode();
        this.relation_types_list = JsonUtils.MAPPER.createArrayNode();
        this.project_keywords_list = JsonUtils.MAPPER.createArrayNode();

        // Since some of the lists have content that isn't pulled from OSTI's Elink
        // Authority API, we'll go ahead and fill those lists up
        // Search Sort Options
        this.search_sort_options_list.add(makeListObj("Relevance", "score desc", "Relevance"));
        this.search_sort_options_list.add(
                makeListObj("Release Date (newest to oldest)", "releaseDate desc", "Release Date (newest to oldest)"));
        this.search_sort_options_list.add(
                makeListObj("Release Date (oldest to newest)", "releaseDate asc", "Release Date (oldest to newest)"));
        // Availability
        this.availability_list.add(makeListObj("Open Source, Publicly Available Repository", "OS",
                "Open Source, Publicly Available Repository"));
        this.availability_list.add(makeListObj("Open Source, No Publicly Available Repository", "ON",
                "Open Source, No Publicly Available Repository"));
        this.availability_list.add(makeListObj("Closed Source", "CS", "Closed Source"));
        // Contributor Types
        this.contributor_types.add(makeListObj("Contact Person", "ContactPerson", "Contact Person"));
        this.contributor_types.add(makeListObj("Data Collector", "DataCollector", "Data Collector"));
        this.contributor_types.add(makeListObj("Data Curator", "DataCurator", "Data Curator"));
        this.contributor_types.add(makeListObj("Data Manager", "DataManager", "Data Manager"));
        this.contributor_types.add(makeListObj("Distributor", "Distributor", "Distributor"));
        this.contributor_types.add(makeListObj("Editor", "Editor", "Editor"));
        this.contributor_types.add(makeListObj("Hosting Institution", "HostingInstitution", "Hosting Institution"));
        this.contributor_types.add(makeListObj("Other", "Other", "Other"));
        this.contributor_types.add(makeListObj("Producer", "Producer", "Producer"));
        this.contributor_types.add(makeListObj("Project Leader", "ProjectLeader", "Project Leader"));
        this.contributor_types.add(makeListObj("Project Manager", "ProjectManager", "Project Manager"));
        this.contributor_types.add(makeListObj("Project Member", "ProjectMember", "Project Member"));
        this.contributor_types.add(makeListObj("Registration Agency", "RegistrationAgency", "Registration Agency"));
        this.contributor_types
                .add(makeListObj("Registration Authority", "RegistrationAuthority", "Registration Authority"));
        this.contributor_types.add(makeListObj("Related Person", "RelatedPerson", "Related Person"));
        this.contributor_types.add(makeListObj("Research Group", "ResearchGroup", "Research Group"));
        this.contributor_types.add(makeListObj("Researcher", "Researcher", "Researcher"));
        this.contributor_types.add(makeListObj("Rights Holder", "RightsHolder", "Rights Holder"));
        this.contributor_types.add(makeListObj("Sponsor", "Sponsor", "Sponsor"));
        this.contributor_types.add(makeListObj("Supervisor", "Supervisor", "Supervisor"));
        this.contributor_types.add(makeListObj("Work Package Leader", "WorkPackageLeader", "Work Package Leader"));
        // License Options
        this.license_options_list.add(makeListObj("Other (Commercial or Open-Source)", "Other", "Other"));
        this.license_options_list.add(makeListObj("Apache License 2.0", "Apache License 2.0", "Apache License 2.0"));
        this.license_options_list.add(makeListObj("GNU General Public License v3.0", "GNU General Public License v3.0",
                "GNU General Public License v3.0"));
        this.license_options_list.add(makeListObj("MIT License", "MIT License", "MIT License"));
        this.license_options_list.add(makeListObj("BSD 2-clause \"Simplified\" License",
                "BSD 2-clause \"Simplified\" License", "BSD 2-clause \"Simplified\" License"));
        this.license_options_list.add(makeListObj("BSD 3-clause \"New\" or \"Revised\" License",
                "BSD 3-clause \"New\" or \"Revised\" License", "BSD 3-clause \"New\" or \"Revised\" License"));
        this.license_options_list.add(
                makeListObj("Eclipse Public License 1.0", "Eclipse Public License 1.0", "Eclipse Public License 1.0"));
        this.license_options_list.add(makeListObj("GNU Affero General Public License v3.0",
                "GNU Affero General Public License v3.0", "GNU Affero General Public License v3.0"));
        this.license_options_list.add(makeListObj("GNU General Public License v2.0", "GNU General Public License v2.0",
                "GNU General Public License v2.0"));
        this.license_options_list.add(makeListObj("GNU General Public License v2.1", "GNU General Public License v2.1",
                "GNU General Public License v2.1"));
        this.license_options_list.add(makeListObj("GNU Lesser General Public License v2.1",
                "GNU Lesser General Public License v2.1", "GNU Lesser General Public License v2.1"));
        this.license_options_list.add(makeListObj("GNU Lesser General Public License v3.0",
                "GNU Lesser General Public License v3.0", "GNU Lesser General Public License v3.0"));
        this.license_options_list.add(
                makeListObj("Mozilla Public License 2.0", "Mozilla Public License 2.0", "Mozilla Public License 2.0"));
        this.license_options_list.add(makeListObj("The Unlicense", "The Unlicense", "The Unlicense"));
        // Software Type
        this.software_type_list.add(makeListObj("Business", "B", "Business"));
        this.software_type_list.add(makeListObj("Scientific", "S", "Scientific"));
        // States List
        this.states_list.add(makeListObj("", "", ""));
        this.states_list.add(makeListObj("Alabama", "AL", "Alabama"));
        this.states_list.add(makeListObj("Alaska", "AK", "Alaska"));
        this.states_list.add(makeListObj("Arizona", "AZ", "Arizona"));
        this.states_list.add(makeListObj("Arkansas", "AR", "Arkansas"));
        this.states_list.add(makeListObj("California", "CA", "California"));
        this.states_list.add(makeListObj("Colorado", "CO", "Colorado"));
        this.states_list.add(makeListObj("Connecticut", "CT", "Connecticut"));
        this.states_list.add(makeListObj("Delaware", "DE", "Delaware"));
        this.states_list.add(makeListObj("District Of Columbia", "DC", "District Of Columbia"));
        this.states_list.add(makeListObj("Florida", "FL", "Florida"));
        this.states_list.add(makeListObj("Georgia", "GA", "Georgia"));
        this.states_list.add(makeListObj("Hawaii", "HI", "Hawaii"));
        this.states_list.add(makeListObj("Idaho", "ID", "Idaho"));
        this.states_list.add(makeListObj("Illinois", "IL", "Illinois"));
        this.states_list.add(makeListObj("Indiana", "IN", "Indiana"));
        this.states_list.add(makeListObj("Iowa", "IA", "Iowa"));
        this.states_list.add(makeListObj("Kansas", "KS", "Kansas"));
        this.states_list.add(makeListObj("Kentucky", "KY", "Kentucky"));
        this.states_list.add(makeListObj("Louisiana", "LA", "Louisiana"));
        this.states_list.add(makeListObj("Maine", "ME", "Maine"));
        this.states_list.add(makeListObj("Maryland", "MD", "Maryland"));
        this.states_list.add(makeListObj("Massachusetts", "MA", "Massachusetts"));
        this.states_list.add(makeListObj("Michigan", "MI", "Michigan"));
        this.states_list.add(makeListObj("Minnesota", "MN", "Minnesota"));
        this.states_list.add(makeListObj("Mississippi", "MS", "Mississippi"));
        this.states_list.add(makeListObj("Missouri", "MO", "Missouri"));
        this.states_list.add(makeListObj("Montana", "MT", "Montana"));
        this.states_list.add(makeListObj("Nebraska", "NE", "Nebraska"));
        this.states_list.add(makeListObj("Nevada", "NV", "Nevada"));
        this.states_list.add(makeListObj("New Hampshire", "NH", "New Hampshire"));
        this.states_list.add(makeListObj("New Jersey", "NJ", "New Jersey"));
        this.states_list.add(makeListObj("New Mexico", "NM", "New Mexico"));
        this.states_list.add(makeListObj("New York", "NY", "New York"));
        this.states_list.add(makeListObj("North Carolina", "NC", "North Carolina"));
        this.states_list.add(makeListObj("North Dakota", "ND", "North Dakota"));
        this.states_list.add(makeListObj("Ohio", "OH", "Ohio"));
        this.states_list.add(makeListObj("Oklahoma", "OK", "Oklahoma"));
        this.states_list.add(makeListObj("Oregon", "OR", "Oregon"));
        this.states_list.add(makeListObj("Pennsylvania", "PA", "Pennsylvania"));
        this.states_list.add(makeListObj("Rhode Island", "RI", "Rhode Island"));
        this.states_list.add(makeListObj("South Carolina", "SC", "South Carolina"));
        this.states_list.add(makeListObj("South Dakota", "SD", "South Dakota"));
        this.states_list.add(makeListObj("Tennessee", "TN", "Tennessee"));
        this.states_list.add(makeListObj("Texas", "TX", "Texas"));
        this.states_list.add(makeListObj("Utah", "UT", "Utah"));
        this.states_list.add(makeListObj("Vermont", "VT", "Vermont"));
        this.states_list.add(makeListObj("Virginia", "VA", "Virginia"));
        this.states_list.add(makeListObj("Washington", "WA", "Washington"));
        this.states_list.add(makeListObj("West Virginia", "WV", "West Virginia"));
        this.states_list.add(makeListObj("Wisconsin", "WI", "Wisconsin"));
        this.states_list.add(makeListObj("Wyoming", "WY", "Wyoming"));

    }

    private ObjectNode makeListObj(String label, String value, String title) {
        ObjectNode on = JsonUtils.MAPPER.createObjectNode();
        on.put("label", label);
        on.put("value", value);
        on.put("title", title);
        return on;
    }

    public final void UPDATE_REMOTE_LISTS(ServletContext context) throws Exception {
        String authorityapi_base_url = Init.authority_api_base;

        // Countries
        ArrayNode country = getItemFromElinkAuthority(authorityapi_base_url + "simple/countries-list?sort=description");
        if (country.size() > 0) {
            this.countries_list = translateElinkAuthorityList(country);
        } else {
            log.error("Country Json Array returned empty");
        }

        // Sponsoring Orgs
        ArrayNode sponsoring_orgs = JsonUtils.MAPPER.createArrayNode();
        // These two items have to be added to the top of the sponsoring org list
        ObjectNode blank = JsonUtils.MAPPER.createObjectNode();
        blank.put("name", "");
        blank.put("code", "");
        blank.put("status", "");
        ObjectNode usdoe = JsonUtils.MAPPER.createObjectNode();
        blank.put("name", "USDOE");
        blank.put("code", "USDOE");
        blank.put("status", "C");
        sponsoring_orgs.add(blank);
        sponsoring_orgs.add(usdoe);
        // Get the rest of the sponsoring org items
        ArrayNode sponsor_orgs_api = getItemFromElinkAuthority(authorityapi_base_url + "sponsor/sponsor-org-list");
        if (sponsor_orgs_api.size() > 0) {
            sponsoring_orgs = translateElinkAuthorityList(sponsoring_orgs);
            sponsor_orgs_api = translateElinkAuthorityList(sponsor_orgs_api);

            ArrayNode org_lists_combined = sponsoring_orgs;
            for (JsonNode n : sponsor_orgs_api) {
                org_lists_combined.add(n);
            }

            this.sponsor_orgs_list = org_lists_combined;
        } else {
            log.error("Sponsoring Orgs Json Array returned empty");
        }

        // Research Org
        ArrayNode research_orgs = getItemFromElinkAuthority(authorityapi_base_url + "research/orig-research-org-list");
        if (research_orgs.size() > 0) {
            this.research_org_list = translateElinkAuthorityList(research_orgs);
        } else {
            log.error("Research Orgs Json Array returned empty");
        }

        // Affiliations
        ArrayNode affiliations = getItemFromElinkAuthority(authorityapi_base_url + "affiliations/affiliations-list");
        if (affiliations.size() > 0) {
            this.affiliations_list = translateElinkAuthorityList(affiliations);
        } else {
            log.error("Affiliations Json Array returned empty");
        }

        // Relation Types
        ArrayNode relation_types = getItemFromElinkAuthority(
                authorityapi_base_url + "simple/relation-types-list?status=C");
        if (relation_types.size() > 0) {
            this.relation_types_list = translateElinkAuthorityList(relation_types);
        } else {
            log.error("Relation Types Json Array returned empty");
        }

        // Programming Languages
        ArrayNode programming_languages = getItemFromElinkAuthority(
                authorityapi_base_url + "simple/programming-languages-list");
        if (programming_languages.size() > 0) {
            this.programming_languages_list = translateElinkAuthorityList(programming_languages);
        } else {
            log.error("Programming Languages Json Array returned empty");
        }

        // Project Keywords
        ArrayNode project_keywords = getItemFromElinkAuthority(
                authorityapi_base_url + "simple/doecode-project-keywords-list");
        if (project_keywords.size() > 0) {
            this.project_keywords_list = translateElinkAuthorityList(project_keywords);
        } else {
            log.error("Project Keywords Json Array returned empty");
        }
    }

    private ArrayNode getItemFromElinkAuthority(String api_url) {
        ArrayNode arr = JsonUtils.MAPPER.createArrayNode();
        try {
            arr = DOECODEUtils.makeArrayGetRequest(api_url);
        } catch (Exception e) {
            log.error("An error has occurred in pulling Elink Authority API Data: " + e.getMessage());
        }
        return arr;
    }

    private ArrayNode translateElinkAuthorityList(ArrayNode original_list) {
        ArrayNode new_list = JsonUtils.MAPPER.createArrayNode();
        for (JsonNode n : original_list) {
            ObjectNode new_row = JsonUtils.MAPPER.createObjectNode();
            String name_val = "";
            if (n instanceof TextNode) {
                name_val = n.asText("");

            } else if (n instanceof ObjectNode) {
                name_val = ((ObjectNode) n).findPath("name").asText("");
                new_row.put("code", n.findPath("code").asText(""));

            }

            new_row.put("title", name_val);
            new_row.put("value", name_val);
            new_row.put("label", name_val);
            new_list.add(new_row);
        }
        return new_list;
    }

    public ArrayNode getAffiliationsList() {
        return this.affiliations_list;
    }

    public ArrayNode getAvailabilityList() {
        return this.availability_list;
    }

    public ArrayNode getContributorList() {
        return this.contributor_types;
    }

    public ArrayNode getCountriesList() {
        return this.countries_list;
    }

    public ArrayNode getLicenseOptionsList() {
        return this.license_options_list;
    }

    public ArrayNode getResearchOrgList() {
        return this.research_org_list;
    }

    public ArrayNode getSearchSortOptionsList() {
        return this.search_sort_options_list;
    }

    public ArrayNode getSoftwareTypeList() {
        return this.software_type_list;
    }

    public ArrayNode getSponsorOrgsList() {
        return this.sponsor_orgs_list;
    }

    public ArrayNode getStatesList() {
        return this.states_list;
    }

    public ArrayNode getRelationTypesList() {
        return this.relation_types_list;
    }

    public ArrayNode getProgrammingLanguagesList() {
        return this.programming_languages_list;
    }

    public ArrayNode getProjectKeywordsList() {
        return this.project_keywords_list;
    }
}
