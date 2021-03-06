package gov.osti.doecode.utils;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.util.LinkedHashMap;

import org.apache.commons.lang3.StringUtils;
import org.javalite.http.Get;
import org.javalite.http.Http;
import org.javalite.http.Post;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DOECODEUtils {

    public static final DateTimeFormatter MONTH_DAY_YEAR_TIME_FORMAT = DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss");

    public static final LinkedHashMap<String, String> CONTRIBUTORS_MAP = new LinkedHashMap<String, String>();

    static {//TODO consolidate with DOECODEJson later
        CONTRIBUTORS_MAP.put("ContactPerson", "Contact Person");
        CONTRIBUTORS_MAP.put("DataCollector", "Data Collector");
        CONTRIBUTORS_MAP.put("DataCurator", "Data Curator");
        CONTRIBUTORS_MAP.put("DataManager", "Data Manager");
        CONTRIBUTORS_MAP.put("Distributor", "Distributor");
        CONTRIBUTORS_MAP.put("Editor", "Editor");
        CONTRIBUTORS_MAP.put("HostingInstitution", "Hosting Institution");
        CONTRIBUTORS_MAP.put("Producer", "Producer");
        CONTRIBUTORS_MAP.put("ProjectLeader", "Project Leader");
        CONTRIBUTORS_MAP.put("ProjectManager", "Project Manager");
        CONTRIBUTORS_MAP.put("ProjectMember", "Project Member");
        CONTRIBUTORS_MAP.put("RegistrationAgency", "Registration Agency");
        CONTRIBUTORS_MAP.put("RegistrationAuthority", "Registration Authority");
        CONTRIBUTORS_MAP.put("RelatedPerson", "Related Person");
        CONTRIBUTORS_MAP.put("Researcher", "Researcher");
        CONTRIBUTORS_MAP.put("ResearchGroup", "Research Group");
        CONTRIBUTORS_MAP.put("RightsHolder", "Rights Holder");
        CONTRIBUTORS_MAP.put("Sponsor", "Sponsor");
        CONTRIBUTORS_MAP.put("Supervisor", "Supervisor");
        CONTRIBUTORS_MAP.put("WorkPackageLeader", "Work Package Leader");
        CONTRIBUTORS_MAP.put("Other", "Other");
    }

    private static Logger log = LoggerFactory.getLogger(DOECODEUtils.class);

    public static boolean isValidDateOfPattern(DateTimeFormatter format, String date) {
        boolean is_valid = true;
        try {
            LocalDate.parse(date, format);
        } catch (Exception e) {
            is_valid = false;
        }
        return is_valid;
    }

    public static boolean isValidLong(String num) {
        boolean isNum = true;

        try {
            Long.parseLong(num);
        } catch (Exception e) {
            isNum = false;
        }

        return isNum;
    }

    public static String makeSpaceSeparatedList(ArrayNode list) {
        return makeTokenSeparatedList(list, " ");
    }

    public static String makeTokenSeparatedList(ArrayNode list, String token) {
        String return_data = "";
        if (list != null) {
            String[] str_list = new String[list.size()];
            for (int i = 0; i < list.size(); i++) {
                str_list[i] = list.get(i).asText();
            }
            return_data = StringUtils.join(str_list, token);
        }
        return return_data;
    }

    public static String getDisplayVersionOfValue(ArrayNode array, String value) {
        String display_val = value;
        for (JsonNode n : array) {
            ObjectNode objNode = (ObjectNode) n;
            String nVal = objNode.findPath("value").asText("");
            if (StringUtils.equals(nVal, value)) {
                display_val = objNode.findPath("label").asText(value);
                break;
            }
        }
        return display_val;
    }

    public static String getShortMonth(String month_val, boolean isUpperCase) {
        String month = "";
        switch (month_val) {
            case "1":
                month = "jan";
                break;
            case "2":
                month = "feb";
                break;
            case "3":
                month = "mar";
                break;
            case "4":
                month = "apr";
                break;
            case "5":
                month = "may";
                break;
            case "6":
                month = "jun";
                break;
            case "7":
                month = "jul";
                break;
            case "8":
                month = "aug";
                break;
            case "9":
                month = "sep";
                break;
            case "10":
                month = "oct";
                break;
            case "11":
                month = "nov";
                break;
            case "12":
                month = "dec";
                break;

        }
        return (isUpperCase) ? month.toUpperCase() : month;
    }

    public static String getPretifiedTitle(String title) {
        return title.toLowerCase().replaceAll("[^a-zA-Z0-9\\s]", "").replaceAll("\\s{2,}", " ").replaceAll(" ", "-");
    }

    public static final String getStackTrace(Exception e) {
        StringWriter sw = new StringWriter();
        PrintWriter pw = new PrintWriter(sw);
        e.printStackTrace(pw);
        return sw.toString();
    }

    /*
        Looks through a list of labs that we have badges for. Returns a blank string if there isn't a badge for said lab.
     */
    public static String getLabBadge(String lab) {
        String badge_name = "";

        switch (lab) {
            case "AMES":
            case "ANL":
            case "BNL":
            case "FNAL":
            case "INL":
            case "LBNL":
            case "LLNL":
            case "LANL":
            case "NETL":
            case "NREL":
            case "ORNL":
            case "PNNL":
            case "PPPL":
            case "SNL":
            case "SRNL":
            case "SLAC":
            case "JLAB":
                badge_name = lab + "-badge-min.png";
                break;
        }

        return badge_name;
    }

    /*
        Looks through a list of projects that we have badges for. Returns a blank string if there isn't a badge for said project.
     */
    public static String getProjectBadge(String project_name) {
        String badge_name = "";

        switch (project_name) {
            case "ECP":
            case "ESnet":
            case "KBase":
            case "SciDAC":
                badge_name = project_name + "-badge-min.png";
                break;
        }

        return badge_name;
    }

    /**
     * Make a regular get request, no authentication needed
     */
    public static ObjectNode makeGetRequest(String url) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        Get get = Http.get(url).header("Accept", "application/json").header("Content-Type", "application/json");
        String response = get.text("UTF-8");
        try {
            return_data = JsonUtils.parseObjectNode(response);
        } catch (Exception e) {
            log.error("Exception in making get request: " + e.getMessage());
            return_data.put("invalid_object_parse", true);
        }
        return return_data;
    }

    /**
     * Makes a post request, with just the URL and the data we're posting
     */
    public static ObjectNode makePOSTRequest(String url, ObjectNode post_data) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        Post post = Http.post(url, post_data.toString()).header("Accept", "application/json").header("Content-Type", "application/json");
        String response = post.text("UTF-8");

        try {
            return_data = JsonUtils.parseObjectNode(response);
        } catch (Exception e) {
            log.error("Exception in making POST request: " + e.getMessage());
            return_data.put("invalid_object_parse", true);
        }
        return return_data;
    }

    /**
     * Makes a request for an array
     */
    public static ArrayNode makeArrayGetRequest(String url) {
        ArrayNode return_data = JsonUtils.MAPPER.createArrayNode();
        Get get = Http.get(url).header("Accept", "application/json").header("Content-Type", "application/json");
        String response = get.text("UTF-8");
        try {
            return_data = JsonUtils.parseArrayNode(response);
        } catch (Exception e) {
            log.error("Exception in making get request: " + e.getMessage());
        }
        return return_data;
    }

    private static String getAuthentictedGetRequestStr(String url, String xsrfToken, String accessToken) {
        Get get = Http.get(url).header("Accept", "application/json").header("Content-Type", "application/json").header("X-XSRF-TOKEN", xsrfToken).header("Cookie", "accessToken=" + accessToken);
        String response = get.text("UTF-8");
        return response;
    }

    public static ObjectNode makeAuthenticatedGetRequest(String url, String xsrfToken, String accessToken) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        String response = getAuthentictedGetRequestStr(url, xsrfToken, accessToken);
        try {
            return_data = JsonUtils.parseObjectNode(response);
        } catch (Exception e) {
            return_data.put("invalid_object_parse", true);
        }
        return return_data;
    }

    public static ArrayNode makeAuthenticatedGetArrRequest(String url, String xsrfToken, String accessToken) {
        ArrayNode return_data = JsonUtils.MAPPER.createArrayNode();
        String response = getAuthentictedGetRequestStr(url, xsrfToken, accessToken);
        try {
            return_data = JsonUtils.parseArrayNode(response);
        } catch (Exception e) {
        }
        return return_data;
    }

}
