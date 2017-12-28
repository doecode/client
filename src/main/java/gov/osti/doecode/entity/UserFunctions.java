package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonObjectUtils;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import javax.servlet.ServletContext;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpResponse;
import org.apache.http.client.config.RequestConfig;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.util.EntityUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Whitelist;
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
     Looks for a user data cookie. If one is found, it takes it, parses the value as a json object, and returns it
      */
     public static ObjectNode getUserDataFromCookie(HttpServletRequest request) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          if (request.getCookies() != null) {
               for (Cookie c : request.getCookies()) {
                    if (StringUtils.equals(c.getName(), "user_data")) {
                         try {
                              byte[] decoded = Base64.decodeBase64(c.getValue());
                              if (StringUtils.isNotBlank(new String(decoded)) && JsonObjectUtils.isValidObjectNode(new String(decoded))) {
                                   return_data = JsonObjectUtils.parseObjectNode(new String(decoded));
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

     public static boolean isUserLoggedIn(HttpServletRequest request) {
          ObjectNode user_data = UserFunctions.getUserDataFromCookie(request);
          boolean is_logged_in = JsonObjectUtils.getBoolean(user_data, "is_logged_in", false);
          boolean is_within_time = false;
          if (DOECODEUtils.isValidDateOfPattern(SESSION_TIMEOUT_FORMAT, JsonObjectUtils.getString(user_data, "session_timeout", ""))) {
               LocalDateTime last_timeout = LocalDateTime.parse(JsonObjectUtils.getString(user_data, "session_timeout", ""), SESSION_TIMEOUT_FORMAT);
               LocalDateTime right_now = LocalDateTime.now();
               long minutes = ChronoUnit.MINUTES.between(right_now, last_timeout);
               is_within_time = Math.abs(minutes) < Init.SESSION_TIMEOUT_MINUTES;
          }

          return is_logged_in && is_within_time;
     }

     public static Cookie makeUserCookie(ObjectNode user_data) {
          String user_data_encoded = Base64.encodeBase64String(user_data.toString().getBytes());
          Cookie c = new Cookie("user_data", user_data_encoded);
          return c;
     }

     public static ObjectNode setUserDataForCookie(ObjectNode user_data) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          return_data.put("first_name", Jsoup.clean(JsonObjectUtils.getString(user_data, "first_name", ""), Whitelist.basic()));
          return_data.put("last_name", Jsoup.clean(JsonObjectUtils.getString(user_data, "last_name", ""), Whitelist.basic()));
          return_data.put("email", Jsoup.clean(JsonObjectUtils.getString(user_data, "email", ""), Whitelist.basic()));
          return_data.put("site", Jsoup.clean(JsonObjectUtils.getString(user_data, "site", ""), Whitelist.basic()));
          ArrayNode roles = JsonObjectUtils.parseArrayNode(JsonObjectUtils.getString(user_data, "roles", "[]"));
          ArrayNode pending_roles = JsonObjectUtils.parseArrayNode(JsonObjectUtils.getString(user_data, "pending_roles", "[]"));
          return_data.put("roles", roles);
          return_data.put("pending_roles", pending_roles);
          return_data.put("has_osti_role", hasRole(roles, "OSTI"));
          return_data.put("is_logged_in", true);
          return_data.put("session_timeout", LocalDateTime.now().plus(Init.SESSION_TIMEOUT_MINUTES, ChronoUnit.MINUTES).format(SESSION_TIMEOUT_FORMAT));
          return return_data;
     }

     public static Cookie updateUserSessionTimeout(HttpServletRequest request) {
          ObjectNode user_data = getUserDataFromCookie(request);
          String session_timeout = JsonObjectUtils.getString(user_data, "session_timeout", "");
          if (DOECODEUtils.isValidDateOfPattern(SESSION_TIMEOUT_FORMAT, session_timeout)) {
               user_data.put("session_timeout", LocalDateTime.now().plus(Init.SESSION_TIMEOUT_MINUTES, ChronoUnit.MINUTES).format(SESSION_TIMEOUT_FORMAT));
          }
          return makeUserCookie(user_data);
     }

     public static Cookie getLastLocationCookie(HttpServletRequest request) {
          Cookie return_cookie = null;
          if (request.getCookies() != null) {
               for (Cookie c : request.getCookies()) {
                    if (StringUtils.equals(c.getName(), "requested_url")) {
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
          //Add their last url to a cookie so we can redirect them later
          response.addCookie(new Cookie("requested_url", requested_url.toString()));
          response.addCookie(new Cookie("user_data", ""));
          response.sendRedirect(site_url + "login?redirect=true");
          return;
     }

     public static ObjectNode updateUserCookie(HttpServletRequest request, ObjectNode new_user_data) {
          ObjectNode return_data = getUserDataFromCookie(request);
          //If we have new data, let's go through each item in the new object, and set it in our current user cookie
          if (JsonObjectUtils.getKeys(new_user_data).size() > 0) {
               JsonObjectUtils.getKeys(new_user_data).forEach((s) -> {
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

     public static ObjectNode getUserRegistrationData(ServletContext context, String confirmation_code) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          String api_url = context.getInitParameter("api_url");

          CloseableHttpClient hc = HttpClientBuilder.create().setDefaultRequestConfig(RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000).setConnectionRequestTimeout(5000).build()).build();
          HttpGet get = new HttpGet(api_url + "user/confirm?confirmation=" + confirmation_code);
          get.setHeader("Content-Type", "application/json");
          get.setHeader("Accept", "application/json");

          ObjectNode response_json = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          try {
               HttpResponse response = hc.execute(get);
               String raw_json = EntityUtils.toString(response.getEntity());
               if (JsonObjectUtils.isValidObjectNode(raw_json)) {
                    response_json = JsonObjectUtils.parseObjectNode(raw_json);
               }

          } catch (Exception e) {
               log.error("Exception in getting user confirmation code: " + e.getMessage());
          } finally {
               try {
                    hc.close();
               } catch (Exception e) {
                    log.error("Couldn't close connection properly: " + e.getMessage());
               }
          }

          String api_key = JsonObjectUtils.getString(response_json, "apiKey", "");
          String url_key = StringUtils.substringBeforeLast(api_url, "/");

          return_data.put("url_key", url_key);
          return_data.put("api_key", api_key);
          return_data.put("successful_signup", StringUtils.isNotBlank(api_key));

          return return_data;
     }

     public static ObjectNode getAccountPageData(HttpServletRequest request) {
          ObjectNode return_data = UserFunctions.getUserDataFromCookie(request);
          ArrayNode roles = (ArrayNode) return_data.get("roles");
          ArrayNode pending_roles = (ArrayNode) return_data.get("pending_roles");
          String site = JsonObjectUtils.getString(return_data, "site", "");
          //See if their site is in their roles
          boolean site_in_roles = false;
          for (JsonNode v : roles) {
               if (StringUtils.equals(v.asText(), site)) {
                    site_in_roles = true;
                    break;
               }
          }
          //See if their site is in pending
          boolean site_in_pending = false;
          for (JsonNode v : pending_roles) {
               if (StringUtils.equals(v.asText(), site)) {
                    site_in_pending = true;
                    break;
               }
          }

          boolean showAdminRole = (!StringUtils.equals(site, "CONTR") && !site_in_roles);//If they aren't a contractor and the site they are a part of isn't in their roles list
          boolean hasAlreadyRequested = site_in_pending;

          return_data.put("can_request_admin_role", showAdminRole);
          return_data.put("has_already_requested", hasAlreadyRequested);

          return return_data;
     }
}
