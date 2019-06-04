package gov.osti.doecode.utils;

import java.io.PrintWriter;
import java.io.StringWriter;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.javalite.http.Get;
import org.javalite.http.Http;
import org.javalite.http.Post;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DOECODEUtils {

    private static Logger log = LoggerFactory.getLogger(DOECODEUtils.class);

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

    /**
     * //Makes a javalite GET request using the XSRF token from the user
     * cookie, and the access token from the cookie received from the API
     */
    public static ObjectNode makeAuthenticatedGetAjaxRequest(String url, HttpServletRequest request, HttpServletResponse servlet_response) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        //Check for xsrf and access tokens
        ObjectNode user_data = UserFunctions.getUserDataFromCookie(request);
        String xsrfToken = user_data.findPath("xsrfToken").asText("");
        String accessToken = UserFunctions.getOtherUserCookieValue(request, "accessToken");

        //Make the get object
        Get get = Http.get(url).header("Accept", "application/json").header("Content-Type", "application/json").header("X-XSRF-TOKEN", xsrfToken).header("Cookie", "accessToken=" + accessToken);

        //Make the call
        String response = get.text("UTF-8");
        if (JsonUtils.isValidObjectNode(response)) {
            return_data = JsonUtils.parseObjectNode(response);
        } else {
            return_data = JsonUtils.MAPPER.createObjectNode().put("error", "Didn't get valid json response.");
        }
        return return_data;
    }

    /**
     * Makes a javalite POST request using the XSRF token from the user cookie,
     * and the access token from the cookie received from the API
     */
    public static ObjectNode makeAuthenticatedPostAjaxRequest(String url, HttpServletRequest request, ObjectNode post_data, HttpServletResponse servlet_response) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();

        //Check for xsrf and access tokens
        ObjectNode user_data = UserFunctions.getUserDataFromCookie(request);
        String xsrfToken = user_data.findPath("xsrfToken").asText("");
        String accessToken = UserFunctions.getOtherUserCookieValue(request, "accessToken");

        Post post = Http.post(url, post_data.toString()).header("Accept", "application/json").header("Content-Type", "application/json").header("X-XSRF-TOKEN", xsrfToken).header("Cookie", "accessToken=" + accessToken);
        String response = post.text("UTF-8");
        if (JsonUtils.isValidObjectNode(response)) {
            return_data = JsonUtils.parseObjectNode(response);
        } else {
            return_data = JsonUtils.MAPPER.createObjectNode().put("error", "Didn't get valid json response.");
        }
        return return_data;
    }

    public static ObjectNode makeGetAjaxRequest(String url, HttpServletResponse servlet_response) {
        ObjectNode return_data = null;
        Get get = Http.get(url).header("Accept", "application/json").header("Content-Type", "application/json");
        String response = get.text("UTF-8");
        if (JsonUtils.isValidObjectNode(response)) {
            return_data = JsonUtils.parseObjectNode(response);
        } else {
            return_data = JsonUtils.MAPPER.createObjectNode().put("error", "Didn't get valid json response.");
        }
        return return_data;
    }

    public static ObjectNode makePostAjaxRequest(String url, ObjectNode post_data, HttpServletResponse servlet_response) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();

        Post post = Http.post(url, post_data.toString()).header("Accept", "application/json").header("Content-Type", "application/json");
        String response = post.text("UTF-8");
        if (JsonUtils.isValidObjectNode(response)) {
            return_data = JsonUtils.parseObjectNode(response);
            servlet_response.setStatus(post.responseCode());
            //If an access token cookie was sent, get the value out, and send it back, in case the calling funtion needs it
            if (post.headers().containsKey("Set-Cookie")) {
                return_data.put("access_token", StringUtils.substringBetween(post.headers().get("Set-Cookie").get(0), "accessToken=", ";"));
            }
        } else {
            return_data = JsonUtils.MAPPER.createObjectNode().put("error", "Didn't get valid json response.");
        }
        return return_data;
    }

    public static Cookie createAccessTokenCookie(String access_token) {
        //Now take care of the set cookie
        Cookie accessTokenCookie = new Cookie("accessToken", access_token);
        accessTokenCookie.setPath("/");
        accessTokenCookie.setHttpOnly(true);
        accessTokenCookie.setMaxAge(Init.SESSION_TIMEOUT_MINUTES * 60);
        return accessTokenCookie;
    }
}
