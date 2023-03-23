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
    public static final String PROJECT_TYPE_KEY = "project_type";
    public static final String CONTRIBUTOR_PERSONAL_KEY = "contributor_personal";
    public static final String CONTRIBUTOR_ORG_KEY = "contributor_org";
    public static final String COUNTRIES_KEY = "countries";
    public static final String LICENSE_KEY = "license";
    public static final String ACCESS_LIMITATIONS_KEY = "access_limitations";
    public static final String PROTECTIONS_KEY = "protections";
    public static final String RESEARCH_KEY = "research";
    public static final String SEARCH_SORT_KEY = "search";
    public static final String SOFTWARE_TYPE_KEY = "software";
    public static final String SPONSOR_ORG_KEY = "sponsor";
    public static final String STATES_KEY = "states";
    public static final String RELATION_TYPES_KEY = "relation_types";
    public static final String PROGRAMMING_LANGUAGES_KEY = "programming_languages";
    public static final String PROJECT_KEYWORDS_KEY = "project_keywords";
    public static final String DOE_CODE_SITES_WITH_SOFTWARE_GROUP_EMAILS_KEY = "doe_code_sites_with_software_group_emails";

    // Json Array lists
    private final ArrayNode AFFILIATIONS_LIST = JsonUtils.createArrayNode();
    private final ArrayNode PROJECT_TYPE_LIST = JsonUtils.createArrayNode();
    private final ArrayNode CONTRIBUTOR_TYPES_PERSONAL = JsonUtils.createArrayNode();
    private final ArrayNode CONTRIBUTOR_TYPES_ORG = JsonUtils.createArrayNode();
    private final ArrayNode COUNTRIES_LIST = JsonUtils.createArrayNode();
    private final ArrayNode LICENSE_OPTIONS_LIST = JsonUtils.createArrayNode();
    private final ArrayNode ACCESS_LIMITATIONS_LIST = JsonUtils.createArrayNode();
    private final ArrayNode PROTECTIONS_LIST = JsonUtils.createArrayNode();
    private final ArrayNode RESEARCH_ORG_LIST = JsonUtils.createArrayNode();
    private final ArrayNode SEARCH_SORT_OPTIONS_LIST = JsonUtils.createArrayNode();
    private final ArrayNode SOFTWARE_TYPE_LIST = JsonUtils.createArrayNode();
    private final ArrayNode SPONSOR_ORGS_LIST = JsonUtils.createArrayNode();
    private final ArrayNode STATES_LIST = JsonUtils.createArrayNode();
    private final ArrayNode RELATION_TYPES_LIST = JsonUtils.createArrayNode();
    private final ArrayNode PROGRAMMING_LANGUAGES_LIST = JsonUtils.createArrayNode();
    private final ArrayNode PROJECT_KEYWORDS_LIST = JsonUtils.createArrayNode();
    private final ObjectNode DOE_CODE_SITES_WITH_SOFTARE_GROUP_EMAIL_LIST = JsonUtils.createObjectNode();

    /**
     * Initializes all of the json lists DOE CODE Uses. Fills up the lists that don't pull data from OSTI's ELINK AUthority API
     */
    public DOECODEJson() {
        // Since some of the lists have content that isn't pulled from OSTI's Elink
        // Authority API, we'll go ahead and fill those lists up
        // Search Sort Options
        this.SEARCH_SORT_OPTIONS_LIST.add(makeListObj("Relevance", "score desc", "Relevance"));
        this.SEARCH_SORT_OPTIONS_LIST.add(makeListObj("Release Date (newest to oldest)", "releaseDate desc", "Release Date (newest to oldest)"));
        this.SEARCH_SORT_OPTIONS_LIST.add(makeListObj("Release Date (oldest to newest)", "releaseDate asc", "Release Date (oldest to newest)"));
        // Project Type
        this.PROJECT_TYPE_LIST.add(makeListObj("Open Source, Publicly Available Repository", "OS", "Open Source, Publicly Available Repository"));
        this.PROJECT_TYPE_LIST.add(makeListObj("Open Source, No Publicly Available Repository", "ON", "Open Source, No Publicly Available Repository"));
        this.PROJECT_TYPE_LIST.add(makeListObj("Closed Source", "CS", "Closed Source"));
        // Contributor Types
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Contact Person", "ContactPerson", "Contact Person"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Data Collector", "DataCollector", "Data Collector"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Data Curator", "DataCurator", "Data Curator"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Data Manager", "DataManager", "Data Manager"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Editor", "Editor", "Editor"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Other", "Other", "Other"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Producer", "Producer", "Producer"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Project Leader", "ProjectLeader", "Project Leader"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Project Manager", "ProjectManager", "Project Manager"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Project Member", "ProjectMember", "Project Member"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Related Person", "RelatedPerson", "Related Person"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Researcher", "Researcher", "Researcher"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Rights Holder", "RightsHolder", "Rights Holder"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Sponsor", "Sponsor", "Sponsor"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Supervisor", "Supervisor", "Supervisor"));
        this.CONTRIBUTOR_TYPES_PERSONAL.add(makeListObj("Work Package Leader", "WorkPackageLeader", "Work Package Leader"));
        // Contributor Types
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Contact Person", "ContactPerson", "Contact Person"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Data Collector", "DataCollector", "Data Collector"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Data Curator", "DataCurator", "Data Curator"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Data Manager", "DataManager", "Data Manager"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Distributor", "Distributor", "Distributor"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Hosting Institution", "HostingInstitution", "Hosting Institution"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Other", "Other", "Other"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Producer", "Producer", "Producer"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Registration Agency", "RegistrationAgency", "Registration Agency"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Registration Authority", "RegistrationAuthority", "Registration Authority"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Research Group", "ResearchGroup", "Research Group"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Rights Holder", "RightsHolder", "Rights Holder"));
        this.CONTRIBUTOR_TYPES_ORG.add(makeListObj("Sponsor", "Sponsor", "Sponsor"));
        // License Options
        this.LICENSE_OPTIONS_LIST.add(makeListObj("Other (Commercial or Open-Source)", "Other", "Other"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("Apache License 2.0", "Apache License 2.0", "Apache License 2.0"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("GNU General Public License v3.0", "GNU General Public License v3.0", "GNU General Public License v3.0"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("MIT License", "MIT License", "MIT License"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("BSD 2-clause \"Simplified\" License", "BSD 2-clause \"Simplified\" License", "BSD 2-clause \"Simplified\" License"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("BSD 3-clause \"New\" or \"Revised\" License", "BSD 3-clause \"New\" or \"Revised\" License", "BSD 3-clause \"New\" or \"Revised\" License"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("Eclipse Public License 1.0", "Eclipse Public License 1.0", "Eclipse Public License 1.0"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("GNU Affero General Public License v3.0", "GNU Affero General Public License v3.0", "GNU Affero General Public License v3.0"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("GNU General Public License v2.0", "GNU General Public License v2.0", "GNU General Public License v2.0"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("GNU General Public License v2.1", "GNU General Public License v2.1", "GNU General Public License v2.1"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("GNU Lesser General Public License v2.1", "GNU Lesser General Public License v2.1", "GNU Lesser General Public License v2.1"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("GNU Lesser General Public License v3.0", "GNU Lesser General Public License v3.0", "GNU Lesser General Public License v3.0"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("Mozilla Public License 2.0", "Mozilla Public License 2.0", "Mozilla Public License 2.0"));
        this.LICENSE_OPTIONS_LIST.add(makeListObj("The Unlicense", "The Unlicense", "The Unlicense"));
        // Access Limitations
        this.ACCESS_LIMITATIONS_LIST.add(makeListObj("(UNL) Unlimited", "UNL", "Unlimited"));
        this.ACCESS_LIMITATIONS_LIST.add(makeListObj("(OUO) Official Use Only", "OUO", "Official Use Only"));
        this.ACCESS_LIMITATIONS_LIST.add(makeListObj("(OUO; ECI) Export Controlled Information", "ECI", "Export Controlled Information"));
        this.ACCESS_LIMITATIONS_LIST.add(makeListObj("(OUO; PAT) Patent Pending", "PAT", "Patent Pending"));
        this.ACCESS_LIMITATIONS_LIST.add(makeListObj("(OUO; PDOUO) Program-Determined Official Use Only", "PDOUO", "Program-Determined Official Use Only"));
        this.ACCESS_LIMITATIONS_LIST.add(makeListObj("(OUO; PROP) Limited Rights Data", "PROP", "Limited Rights Data"));
        this.ACCESS_LIMITATIONS_LIST.add(makeListObj("(OUO; PROT) Protected Data CRADA/EPACT/OTHER", "PROT", "Protected Data CRADA/EPACT/OTHER"));
        this.ACCESS_LIMITATIONS_LIST.add(makeListObj("(OUO; SSI) Security Sensitive Information", "SSI", "Security Sensitive Information"));
        // Protections
        this.PROTECTIONS_LIST.add(makeListObj("CRADA", "CRADA", "CRADA"));
        this.PROTECTIONS_LIST.add(makeListObj("EPACT", "EPACT", "EPACT"));
        this.PROTECTIONS_LIST.add(makeListObj("Other", "Other", "Other"));
        // Software Type
        this.SOFTWARE_TYPE_LIST.add(makeListObj("Business", "B", "Business"));
        this.SOFTWARE_TYPE_LIST.add(makeListObj("Scientific", "S", "Scientific"));
        // States List
        this.STATES_LIST.add(makeListObj("", "", ""));
        this.STATES_LIST.add(makeListObj("Alabama", "AL", "Alabama"));
        this.STATES_LIST.add(makeListObj("Alaska", "AK", "Alaska"));
        this.STATES_LIST.add(makeListObj("Arizona", "AZ", "Arizona"));
        this.STATES_LIST.add(makeListObj("Arkansas", "AR", "Arkansas"));
        this.STATES_LIST.add(makeListObj("California", "CA", "California"));
        this.STATES_LIST.add(makeListObj("Colorado", "CO", "Colorado"));
        this.STATES_LIST.add(makeListObj("Connecticut", "CT", "Connecticut"));
        this.STATES_LIST.add(makeListObj("Delaware", "DE", "Delaware"));
        this.STATES_LIST.add(makeListObj("District Of Columbia", "DC", "District Of Columbia"));
        this.STATES_LIST.add(makeListObj("Florida", "FL", "Florida"));
        this.STATES_LIST.add(makeListObj("Georgia", "GA", "Georgia"));
        this.STATES_LIST.add(makeListObj("Hawaii", "HI", "Hawaii"));
        this.STATES_LIST.add(makeListObj("Idaho", "ID", "Idaho"));
        this.STATES_LIST.add(makeListObj("Illinois", "IL", "Illinois"));
        this.STATES_LIST.add(makeListObj("Indiana", "IN", "Indiana"));
        this.STATES_LIST.add(makeListObj("Iowa", "IA", "Iowa"));
        this.STATES_LIST.add(makeListObj("Kansas", "KS", "Kansas"));
        this.STATES_LIST.add(makeListObj("Kentucky", "KY", "Kentucky"));
        this.STATES_LIST.add(makeListObj("Louisiana", "LA", "Louisiana"));
        this.STATES_LIST.add(makeListObj("Maine", "ME", "Maine"));
        this.STATES_LIST.add(makeListObj("Maryland", "MD", "Maryland"));
        this.STATES_LIST.add(makeListObj("Massachusetts", "MA", "Massachusetts"));
        this.STATES_LIST.add(makeListObj("Michigan", "MI", "Michigan"));
        this.STATES_LIST.add(makeListObj("Minnesota", "MN", "Minnesota"));
        this.STATES_LIST.add(makeListObj("Mississippi", "MS", "Mississippi"));
        this.STATES_LIST.add(makeListObj("Missouri", "MO", "Missouri"));
        this.STATES_LIST.add(makeListObj("Montana", "MT", "Montana"));
        this.STATES_LIST.add(makeListObj("Nebraska", "NE", "Nebraska"));
        this.STATES_LIST.add(makeListObj("Nevada", "NV", "Nevada"));
        this.STATES_LIST.add(makeListObj("New Hampshire", "NH", "New Hampshire"));
        this.STATES_LIST.add(makeListObj("New Jersey", "NJ", "New Jersey"));
        this.STATES_LIST.add(makeListObj("New Mexico", "NM", "New Mexico"));
        this.STATES_LIST.add(makeListObj("New York", "NY", "New York"));
        this.STATES_LIST.add(makeListObj("North Carolina", "NC", "North Carolina"));
        this.STATES_LIST.add(makeListObj("North Dakota", "ND", "North Dakota"));
        this.STATES_LIST.add(makeListObj("Ohio", "OH", "Ohio"));
        this.STATES_LIST.add(makeListObj("Oklahoma", "OK", "Oklahoma"));
        this.STATES_LIST.add(makeListObj("Oregon", "OR", "Oregon"));
        this.STATES_LIST.add(makeListObj("Pennsylvania", "PA", "Pennsylvania"));
        this.STATES_LIST.add(makeListObj("Rhode Island", "RI", "Rhode Island"));
        this.STATES_LIST.add(makeListObj("South Carolina", "SC", "South Carolina"));
        this.STATES_LIST.add(makeListObj("South Dakota", "SD", "South Dakota"));
        this.STATES_LIST.add(makeListObj("Tennessee", "TN", "Tennessee"));
        this.STATES_LIST.add(makeListObj("Texas", "TX", "Texas"));
        this.STATES_LIST.add(makeListObj("Utah", "UT", "Utah"));
        this.STATES_LIST.add(makeListObj("Vermont", "VT", "Vermont"));
        this.STATES_LIST.add(makeListObj("Virginia", "VA", "Virginia"));
        this.STATES_LIST.add(makeListObj("Washington", "WA", "Washington"));
        this.STATES_LIST.add(makeListObj("West Virginia", "WV", "West Virginia"));
        this.STATES_LIST.add(makeListObj("Wisconsin", "WI", "Wisconsin"));
        this.STATES_LIST.add(makeListObj("Wyoming", "WY", "Wyoming"));

    }

    private ObjectNode makeListObj(String label, String value, String title) {
        ObjectNode on = JsonUtils.createObjectNode();
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
            this.COUNTRIES_LIST.removeAll();
            this.COUNTRIES_LIST.addAll(translateElinkAuthorityList(country));
        } else {
            log.error("Country Json Array returned empty");
        }

        // Sponsoring Orgs
        ArrayNode sponsoring_orgs = JsonUtils.createArrayNode();
        // These two items have to be added to the top of the sponsoring org list
        ObjectNode blank = JsonUtils.createObjectNode();
        blank.put("name", "");
        blank.put("code", "");
        blank.put("status", "");
        ObjectNode usdoe = JsonUtils.createObjectNode();
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
            this.SPONSOR_ORGS_LIST.removeAll();
            this.SPONSOR_ORGS_LIST.addAll(org_lists_combined);
        } else {
            log.error("Sponsoring Orgs Json Array returned empty");
        }

        // Research Org
        ArrayNode research_orgs = getItemFromElinkAuthority(authorityapi_base_url + "research/orig-research-org-list");
        if (research_orgs.size() > 0) {
            this.RESEARCH_ORG_LIST.removeAll();
            this.RESEARCH_ORG_LIST.addAll(translateElinkAuthorityList(research_orgs));
        } else {
            log.error("Research Orgs Json Array returned empty");
        }

        // Affiliations
        ArrayNode affiliations = getItemFromElinkAuthority(authorityapi_base_url + "affiliations/affiliations-list");
        if (affiliations.size() > 0) {
            this.AFFILIATIONS_LIST.removeAll();
            this.AFFILIATIONS_LIST.addAll(translateElinkAuthorityList(affiliations));
        } else {
            log.error("Affiliations Json Array returned empty");
        }

        // Relation Types
        ArrayNode relation_types = getItemFromElinkAuthority(authorityapi_base_url + "simple/relation-types-list?status=C");
        if (relation_types.size() > 0) {
            this.RELATION_TYPES_LIST.removeAll();
            this.RELATION_TYPES_LIST.addAll(translateElinkAuthorityList(relation_types));
        } else {
            log.error("Relation Types Json Array returned empty");
        }

        // Programming Languages
        ArrayNode programming_languages = getItemFromElinkAuthority(authorityapi_base_url + "simple/programming-languages-list");
        if (programming_languages.size() > 0) {
            this.PROGRAMMING_LANGUAGES_LIST.removeAll();
            this.PROGRAMMING_LANGUAGES_LIST.addAll(translateElinkAuthorityList(programming_languages));
        } else {
            log.error("Programming Languages Json Array returned empty");
        }

        // Project Keywords
        ArrayNode project_keywords = getItemFromElinkAuthority(authorityapi_base_url + "simple/doecode-project-keywords-list");
        if (project_keywords.size() > 0) {
            this.PROJECT_KEYWORDS_LIST.removeAll();
            this.PROJECT_KEYWORDS_LIST.addAll(translateElinkAuthorityList(project_keywords));
        } else {
            log.error("Project Keywords Json Array returned empty");
        }

        // Sites with software group emails
        ArrayNode software_group_sites = DOECODEUtils.makeArrayGetRequest(Init.backend_api_url + "site/list");
        if (!software_group_sites.isEmpty()) {
            this.DOE_CODE_SITES_WITH_SOFTARE_GROUP_EMAIL_LIST.removeAll();
            for(JsonNode jn:software_group_sites){
                this.DOE_CODE_SITES_WITH_SOFTARE_GROUP_EMAIL_LIST.put(jn.findPath("site_code").asText(""),jn.findPath("software_group_email").asText(""));
            }
        } else {
            log.error("DOE Code software sites with software group emails returned empty");
        }
    }

    private ArrayNode getItemFromElinkAuthority(String api_url) {
        ArrayNode arr = JsonUtils.createArrayNode();
        try {
            arr = DOECODEUtils.makeArrayGetRequest(api_url);
        } catch (Exception e) {
            log.error("An error has occurred in pulling Elink Authority API Data: " + e.getMessage());
        }
        return arr;
    }

    private ArrayNode translateElinkAuthorityList(ArrayNode original_list) {
        ArrayNode new_list = JsonUtils.createArrayNode();
        for (JsonNode n : original_list) {
            ObjectNode new_row = JsonUtils.createObjectNode();
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
        return this.AFFILIATIONS_LIST;
    }

    public ArrayNode getProjectTypeList() {
        return this.PROJECT_TYPE_LIST;
    }

    public ArrayNode getContributorPersonalList() {
        return this.CONTRIBUTOR_TYPES_PERSONAL;
    }

    public ArrayNode getContributorOrgList() {
        return this.CONTRIBUTOR_TYPES_ORG;
    }

    public ArrayNode getCountriesList() {
        return this.COUNTRIES_LIST;
    }

    public ArrayNode getLicenseOptionsList() {
        return this.LICENSE_OPTIONS_LIST;
    }

    public ArrayNode getAccessLimitationsList() {
        return this.ACCESS_LIMITATIONS_LIST;
    }

    public ArrayNode getProtectionsList() {
        return this.PROTECTIONS_LIST;
    }

    public ArrayNode getResearchOrgList() {
        return this.RESEARCH_ORG_LIST;
    }

    public ArrayNode getSearchSortOptionsList() {
        return this.SEARCH_SORT_OPTIONS_LIST;
    }

    public ArrayNode getSoftwareTypeList() {
        return this.SOFTWARE_TYPE_LIST;
    }

    public ArrayNode getSponsorOrgsList() {
        return this.SPONSOR_ORGS_LIST;
    }

    public ArrayNode getStatesList() {
        return this.STATES_LIST;
    }

    public ArrayNode getRelationTypesList() {
        return this.RELATION_TYPES_LIST;
    }

    public ArrayNode getProgrammingLanguagesList() {
        return this.PROGRAMMING_LANGUAGES_LIST;
    }

    public ArrayNode getProjectKeywordsList() {
        return this.PROJECT_KEYWORDS_LIST;
    }

    public ObjectNode getDOESitesWithSoftwareGroupEmails() {
        return this.DOE_CODE_SITES_WITH_SOFTARE_GROUP_EMAIL_LIST;
    }
}
