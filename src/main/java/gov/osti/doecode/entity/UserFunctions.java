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
        return_data.put("user_id", user_data.findPath("user_id").asText(""));
        return_data.put("first_name", user_data.findPath("first_name").asText(""));
        return_data.put("last_name", user_data.findPath("last_name").asText(""));
        return_data.put("email", user_data.findPath("email").asText(""));
        return_data.put("site", user_data.findPath("site").asText(""));
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
        log.info("XSRF token: " + xsrfToken);
        String accessToken = UserFunctions.getOtherUserCookieValue(request, "accessToken");
        log.info("Access token: " + accessToken);
        //Get roles list
        ObjectNode roles_list = DOECODEUtils.makeAuthenticatedGetRequest(Init.backend_api_url + "user/roles", xsrfToken, accessToken);
        log.info("Roles list: " + roles_list.toString());
        return_data.set("roles_obj", roles_list);

        //Get user list
        ArrayNode users_list = DOECODEUtils.makeAuthenticatedGetArrRequest(Init.public_api_url + "user/users", xsrfToken, accessToken);
        log.info("Users list: " + users_list.toString());
        return_data.set("users_list", users_list);

        //Put a pending roles list together
        ArrayNode pending_roles_list = JsonUtils.MAPPER.createArrayNode();
        for (JsonNode user : users_list) {
            ObjectNode user_data = (ObjectNode) user;

            //If the user has any pending roles, add them to the list
            ArrayNode p_roles = user_data.withArray("pending_roles");
            if (p_roles.size() > 0) {
                ObjectNode row = JsonUtils.MAPPER.createObjectNode();

                //Get the user's name;
                row.put("name", user_data.findPath("first_name").asText("") + " " + user_data.findPath("last_name").asText(""));

                //Get the user's pending roles
                ArrayList<String> pending_roles = new ArrayList<String>();
                for (JsonNode jn : p_roles) {
                    pending_roles.add(jn.asText(""));
                }
                row.put("roles", StringUtils.join(pending_roles, ", "));
                pending_roles_list.add(row);
            }
        }
        return_data.set("pending_roles", pending_roles_list);
        return_data.put("has_pending_roles", pending_roles_list.size() > 0);

        return return_data;
    }
}
