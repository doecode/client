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

    private static Logger log = LoggerFactory.getLogger(UserFunctions.class.getName());

    /*
         * Looks for a user data cookie. If one is found, it takes it, parses the value
         * as a json object, and returns it
     */
    public static ObjectNode getUserDataFromCookie(HttpServletRequest request) {
        ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);
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
        if (DOECODEUtils.isValidDateOfPattern(SESSION_TIMEOUT_FORMAT, JsonUtils.getString(user_data, "session_timeout", ""))) {
            LocalDateTime last_timeout = LocalDateTime.parse(JsonUtils.getString(user_data, "session_timeout", ""), SESSION_TIMEOUT_FORMAT);
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
        ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);
        //TODO start pulling user_id
        return_data.put("first_name", JsonUtils.getString(user_data, "first_name", ""));
        return_data.put("last_name", JsonUtils.getString(user_data, "last_name", ""));
        return_data.put("email", JsonUtils.getString(user_data, "email", ""));
        return_data.put("site", JsonUtils.getString(user_data, "site", ""));
        ArrayNode roles = JsonUtils.parseArrayNode(JsonUtils.getString(user_data, "roles", "[]"));
        ArrayNode pending_roles = JsonUtils.parseArrayNode(JsonUtils.getString(user_data, "pending_roles", "[]"));
        //TODO get rejected roles
        return_data.set("roles", roles);
        return_data.set("pending_roles", pending_roles);
        //TODO set rejected roles 
        //TODO remove osti role
        return_data.put("has_osti_role", hasRole(roles, "OSTI"));
        //TODO Check for User Admin Role
        //TODO Check for Record Admin Role
        //TODO Chceck for Approver
        return_data.put("is_logged_in", true);
        return_data.put("session_timeout", LocalDateTime.now().plus(Init.SESSION_TIMEOUT_MINUTES, ChronoUnit.MINUTES).format(SESSION_TIMEOUT_FORMAT));
        return return_data;
    }

    public static boolean hasRecentlyDonePasswordReset(HttpServletRequest request) {
        String needs_password_reset = UserFunctions.getOtherUserCookieValue(request, "needs_password_reset");
        return StringUtils.equals(needs_password_reset, "true");
    }

    public static Cookie updateUserSessionTimeout(HttpServletRequest request) {
        ObjectNode user_data = getUserDataFromCookie(request);
        String session_timeout = JsonUtils.getString(user_data, "session_timeout", "");
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

    public static void redirectUserToLogin(HttpServletRequest request, HttpServletResponse response,
            String site_url) throws IOException {
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

    public static ObjectNode updateUserCookie(HttpServletRequest request, ObjectNode new_user_data) {
        ObjectNode return_data = getUserDataFromCookie(request);
        // If we have new data, let's go through each item in the new object, and set it
        // in our current user cookie
        if (JsonUtils.getKeys(new_user_data).size() > 0) {
            JsonUtils.getKeys(new_user_data).forEach((s) -> {
                return_data.set(s, new_user_data.get(s));
            });
        }
        return return_data;
    }

    public static boolean hasRole(ArrayNode roles, String role) {
        boolean has = false;

        for (JsonNode v : roles) {
            if (StringUtils.equals(v.asText(), role)) {
                has = true;
                break;
            }
        }

        return has;
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
        ArrayNode roles = (ArrayNode) return_data.get("roles");
        ArrayNode pending_roles = (ArrayNode) return_data.get("pending_roles");
        //TODO get rejected roles
        String site = JsonUtils.getString(return_data, "site", "");
        // See if their site is in their roles
        boolean site_in_roles = hasRole(roles, site);
        // See if their site is in pending
        boolean site_in_pending = hasRole(pending_roles, site);

        boolean showAdminRole = (!StringUtils.equals(site, "CONTR") && !site_in_roles);// If they aren't a contractor and the site they are a part of isn't in their
        // roles list
        boolean hasAlreadyRequested = site_in_pending;
        //TODO See if user's role request has been rejected
        return_data.put("can_request_admin_role", showAdminRole);
        return_data.put("has_already_requested", hasAlreadyRequested);

        return return_data;
    }

    public static boolean isCurrentlyLoggedInUserAnAdmin(HttpServletRequest request) {
        boolean is_admin = false;
        ObjectNode current_user_data = getUserDataFromCookie(request);
        is_admin = current_user_data.findPath("has_osti_role").asBoolean(false);
        //TODO Change this to is_record_admin
        return is_admin;
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
}
