package gov.osti.doecode.utils;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;

public class DOECODEUtils {

    public static final DateTimeFormatter MONTH_DAY_YEAR_TIME_FORMAT = DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss");

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
            String nVal = JsonUtils.getString(objNode, "value", "");
            if (StringUtils.equals(nVal, value)) {
                display_val = JsonUtils.getString(objNode, "label", value);
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
            case "ECP-CI":
            case "ESnet":
            case "SciDAC":
                badge_name = project_name + "-badge-min.png";
                break;
        }

        return badge_name;
    }
}
