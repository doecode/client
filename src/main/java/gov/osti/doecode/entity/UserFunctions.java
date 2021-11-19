package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 *
 * @author smithwa
 */
public class UserFunctions {

    public static final DateTimeFormatter SESSION_TIMEOUT_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-ddHH:mm:ss");
    public static final String USER_ADMIN_ROLE = "UserAdmin";
    public static final String RECORD_ADMIN_ROLE = "RecordAdmin";
    public static final String SITE_ADMIN_ROLE = "SiteAdmin";
    public static final String APPROVAL_ADMIN_ROLE = "ApprovalAdmin";
    public static final String CONTENT_ADMIN_ROLE = "ContentAdmin";
    private static Logger log = LoggerFactory.getLogger(UserFunctions.class.getName());

    /*
         * Looks for a user data cookie. If one is found, it takes it, parses the value
         * as a json object, and returns it
     */
    public static ObjectNode getUserDataFromCookie(HttpServletRequest request) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if (StringUtils.equals(c.getName(), "user_data")) {
                    try {
                        byte[] decoded = Base64.decodeBase64(c.getValue());
                        if (StringUtils.isNotBlank(new String(decoded)) && JsonUtils.isValidObjectNode(new String(decoded))) {
                            return_data = JsonUtils.parseObjectNode(new String(decoded));
                            break;
                        }
                    } catch (Exception ex) {
                        log.error("Couldn't decode: " + ex.getMessage());
                    }
                }
            }
        }
        return return_data;
    }

    public static String getOtherUserCookieValue(HttpServletRequest request, String key) {
        String return_data = "";
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if (StringUtils.equals(c.getName(), key)) {
                    return_data = c.getValue();
                    break;
                }
            }
        }
        return return_data;
    }

    public static boolean isUserLoggedIn(HttpServletRequest request) {
        ObjectNode user_data = UserFunctions.getUserDataFromCookie(request);
        boolean is_logged_in = user_data.findPath("is_logged_in").asBoolean(false);
        boolean is_within_time = false;
        if (DOECODEUtils.isValidDateOfPattern(SESSION_TIMEOUT_FORMAT, user_data.findPath("session_timeout").asText(""))) {
            LocalDateTime last_timeout = LocalDateTime.parse(user_data.findPath("session_timeout").asText(""), SESSION_TIMEOUT_FORMAT);
            LocalDateTime right_now = LocalDateTime.now();
            long minutes = ChronoUnit.MINUTES.between(right_now, last_timeout);
            is_within_time = Math.abs(minutes) < Init.SESSION_TIMEOUT_MINUTES;
        }

        return is_logged_in && is_within_time;
    }

    public static Cookie makeUserCookie(ObjectNode user_data) {
        String user_data_encoded = Base64.encodeBase64String(user_data.toString().getBytes());

        Cookie c = makeCookie("user_data", user_data_encoded);
        return c;
    }

    public static ObjectNode setUserDataForCookie(ObjectNode user_data) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        return_data.put("user_id", user_data.findPath("userid").asText(""));
        return_data.put("first_name", user_data.findPath("first_name").asText(""));
        return_data.put("last_name", user_data.findPath("last_name").asText(""));
        return_data.put("display_name", user_data.findPath("display_name").asText(""));
        return_data.put("display_name_lastname_first", user_data.findPath("display_name_lastname_first").asText(""));
        return_data.put("email", user_data.findPath("email").asText(""));
        return_data.put("site", user_data.findPath("site").asText(""));
        return_data.put("software_group_email", user_data.findPath("software_group_email").asText(""));
        ArrayNode roles = user_data.withArray("roles");
        ArrayNode pending_roles = user_data.withArray("pending_roles");
        //TODO get rejected roles
        return_data.set("roles", roles);
        return_data.set("pending_roles", pending_roles);
        //TODO set rejected roles 
        return_data.put("has_user_admin_role", hasRole(roles, USER_ADMIN_ROLE));
        return_data.put("has_record_admin_role", hasRole(roles, RECORD_ADMIN_ROLE));
        return_data.put("has_site_admin_role", hasRole(roles, SITE_ADMIN_ROLE));
        return_data.put("has_approval_admin_role", hasRole(roles, APPROVAL_ADMIN_ROLE));
        return_data.put("has_content_admin_role", hasRole(roles, CONTENT_ADMIN_ROLE));
        return_data.put("is_logged_in", true);
        return_data.put("xsrfToken", user_data.findPath("xsrfToken").asText(""));
        return_data.put("session_timeout", LocalDateTime.now().plus(Init.SESSION_TIMEOUT_MINUTES, ChronoUnit.MINUTES).format(SESSION_TIMEOUT_FORMAT));
        return return_data;
    }

    public static boolean hasRecentlyDonePasswordReset(HttpServletRequest request) {
        String needs_password_reset = UserFunctions.getOtherUserCookieValue(request, "needs_password_reset");
        return StringUtils.equals(needs_password_reset, "true");
    }

    public static Cookie updateUserSessionTimeout(HttpServletRequest request) {
        ObjectNode user_data = getUserDataFromCookie(request);
        String session_timeout = user_data.findPath("session_timeout").asText("");
        if (DOECODEUtils.isValidDateOfPattern(SESSION_TIMEOUT_FORMAT, session_timeout)) {
            user_data.put("session_timeout", LocalDateTime.now().plus(Init.SESSION_TIMEOUT_MINUTES, ChronoUnit.MINUTES).format(SESSION_TIMEOUT_FORMAT));
        }

        return makeUserCookie(user_data);
    }

    public static Cookie getOtherUserCookie(HttpServletRequest request, String cookie_name) {
        Cookie return_cookie = null;
        if (request.getCookies() != null) {
            for (Cookie c : request.getCookies()) {
                if (StringUtils.equals(c.getName(), cookie_name)) {
                    return_cookie = c;
                    break;
                }
            }
        }
        return return_cookie;
    }

    public static void redirectUserToLogin(HttpServletRequest request, HttpServletResponse response, String site_url) throws IOException {
        StringBuilder requested_url = new StringBuilder();
        String after_server = request.getRequestURI();
        requested_url.append(after_server);
        if (StringUtils.isNotBlank(request.getQueryString())) {
            requested_url.append("?");
            requested_url.append(request.getQueryString());
        }
        // Add their last url to a cookie so we can redirect them later
        response.addCookie(makeCookie("requested_url", requested_url.toString()));
        response.addCookie(deleteCookie("user_data"));
        response.sendRedirect(site_url + "login?redirect=true");
    }

    /**
     * Take the current user data, and update it with teh contents of
     * new_user_data
     */
    public static ObjectNode updateUserCookie(HttpServletRequest request, ObjectNode new_user_data) {
        //Get the current user data
        ObjectNode current_user_data = getUserDataFromCookie(request);
        //Get each of the fields (keys) from new_user_data. We'll use this to know what in return_data needs updating
        ArrayList<String> new_user_keys = JsonUtils.getKeys(new_user_data);
        for (String key : new_user_keys) {
            JsonNode new_field_val = new_user_data.get(key);
            //If it's an arraynode,we have to use set to set the new value. Otherwise, we can do put
            if (new_field_val instanceof ArrayNode) {
                current_user_data.set(key, new_field_val);
            } else {
                current_user_data.put(key, new_field_val);
            }
        }

        //Create a new user cookie, using the newly modified user data
        ObjectNode return_data = setUserDataForCookie(current_user_data);

        return return_data;
    }

    /*
        Checks to see if the user has a given role, based on the roles list passed in.
     */
    public static boolean hasRole(ArrayNode roles, String role) {
        return JsonUtils.arrayContains(roles, role);
    }

    /*
     * Directly checks the API to see if a user has a given role. Should only be
     * used in scenarios where integrity is key, such as visiting a page with
     * sensitive data (ie User Admin)
     */
    public static boolean hasRole(String xsrfToken, String access_token, String role) {
        //Get user's data
        ObjectNode user_data = DOECODEUtils.makeAuthenticatedGetRequest(Init.backend_api_url + "user/hasrole/" + role, xsrfToken, access_token);
        //If the object didn't parse, it means we got a 403. 
        return StringUtils.equals(user_data.findPath("status").asText(""), "success");
    }

    public static ObjectNode getUserRegistrationData(String confirmation_code) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();

        ObjectNode response_json = DOECODEUtils.makeGetRequest(Init.backend_api_url + "user/confirm?confirmation=" + confirmation_code);

        String api_key = response_json.findPath("apiKey").asText("");
        String url_key = Init.public_api_url + "docs";

        return_data.put("url_key", url_key);
        return_data.put("api_key", api_key);
        return_data.put("successful_signup", StringUtils.isNotBlank(api_key));

        return return_data;
    }

    public static ObjectNode getAccountPageData(HttpServletRequest request) {
        ObjectNode return_data = UserFunctions.getUserDataFromCookie(request);
        ArrayNode roles = return_data.withArray("roles");
        ArrayNode pending_roles = return_data.withArray("pending_roles");
        //TODO get rejected roles
        String site = return_data.findPath("site").asText("");
        // See if their site is in their roles
        boolean site_in_roles = hasRole(roles, site);
        // See if their site is in pending
        boolean site_in_pending = hasRole(pending_roles, site);

        boolean showAdminRole = (!StringUtils.equals(site, "CONTR") && !site_in_roles);// If they aren't a contractor and the site they are a part of isn't in their
        boolean hasAlreadyRequested = site_in_pending;
        //TODO See if user's role request has been rejected
        return_data.put("can_request_admin_role", showAdminRole);
        return_data.put("has_already_requested", hasAlreadyRequested);

        return return_data;
    }

    public static boolean isCurrentlyLoggedInUserAnAdmin(HttpServletRequest request) {
        boolean is_admin = false;
        ObjectNode current_user_data = getUserDataFromCookie(request);
        is_admin = hasRole(current_user_data.withArray("roles"), RECORD_ADMIN_ROLE);

        return is_admin;
    }

    public static boolean isCurrentlyLoggedInUserAnApprover(HttpServletRequest request) {
        boolean is_approver = false;
        ObjectNode current_user_data = getUserDataFromCookie(request);
        is_approver = hasRole(current_user_data.withArray("roles"), APPROVAL_ADMIN_ROLE);

        return is_approver;
    }

    public static Cookie makeCookie(String name, String value) {
        Cookie c = new Cookie(name, value);
        c.setPath("/" + Init.app_name + "/");
        return c;
    }

    public static Cookie deleteCookie(String name) {
        Cookie c = makeCookie(name, "");
        c.setMaxAge(0);
        return c;
    }

    public static ObjectNode getUserAdminPageData(HttpServletRequest request) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        ObjectNode current_user = UserFunctions.getUserDataFromCookie(request);
        //Get xsrf token
        String xsrfToken = current_user.findPath("xsrfToken").asText("");
        String accessToken = UserFunctions.getOtherUserCookieValue(request, "accessToken");
        //Get roles list
        ObjectNode roles_list = DOECODEUtils.makeAuthenticatedGetRequest(Init.backend_api_url + "user/roles", xsrfToken, accessToken);
        return_data.set("roles_obj", roles_list);

        //Get user list
        ArrayNode users_list = DOECODEUtils.makeAuthenticatedGetArrRequest(Init.backend_api_url + "user/users", xsrfToken, accessToken);
        return_data.set("users_list", users_list);

        //Get pending roles list
        ObjectNode pending_roles_obj = DOECODEUtils.makeAuthenticatedGetRequest(Init.backend_api_url + "user/requests", xsrfToken, accessToken);
        ArrayNode pending_roles_list = pending_roles_obj.withArray("requests");
        return_data.set("pending_roles_list", pending_roles_list);
        return_data.put("has_pending_roles_list", pending_roles_list.size() > 0);
        return return_data;
    }

    public static ObjectNode getRegistrationPageData() {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        ObjectNode roles_list = DOECODEUtils.makeGetRequest(Init.backend_api_url + "user/roles");
        return_data.set("hq_roles", roles_list.withArray("hq"));
        return return_data;
    }
}
