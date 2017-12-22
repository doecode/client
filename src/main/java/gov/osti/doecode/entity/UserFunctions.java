package gov.osti.doecode.entity;

import com.eclipsesource.json.Json;
import com.eclipsesource.json.JsonArray;
import com.eclipsesource.json.JsonObject;
import com.eclipsesource.json.JsonValue;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.DOECODEUtils;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.logging.Logger;
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

/**
 *
 * @author smithwa
 */
public class UserFunctions {

     public static final DateTimeFormatter SESSION_TIMEOUT_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-ddHH:mm:ss");

     private static Logger log = Logger.getLogger(UserFunctions.class.getName());

     /*
     Looks for a user data cookie. If one is found, it takes it, parses the value as a json object, and returns it
      */
     public static JsonObject getUserDataFromCookie(HttpServletRequest request) {
          JsonObject return_data = new JsonObject();
          if (request.getCookies() != null) {
               for (Cookie c : request.getCookies()) {
                    if (StringUtils.equals(c.getName(), "user_data")) {
                         try {
                              byte[] decoded = Base64.decodeBase64(c.getValue());
                              if (StringUtils.isNotBlank(new String(decoded)) && DOECODEUtils.isValidJsonObject(new String(decoded))) {
                                   return_data = Json.parse(new String(decoded)).asObject();
                                   break;
                              }
                         } catch (Exception ex) {
                              log.severe("Couldn't decode: " + ex.getMessage());
                         }
                    }
               }
          }
          return return_data;
     }

     public static boolean isUserLoggedIn(HttpServletRequest request) {
          JsonObject user_data = UserFunctions.getUserDataFromCookie(request);
          boolean is_logged_in = user_data.getBoolean("is_logged_in", false);
          boolean is_within_time = false;
          if (DOECODEUtils.isValidDateOfPattern(SESSION_TIMEOUT_FORMAT, user_data.getString("session_timeout", ""))) {
               LocalDateTime last_timeout = LocalDateTime.parse(user_data.getString("session_timeout", ""), SESSION_TIMEOUT_FORMAT);
               LocalDateTime right_now = LocalDateTime.now();
               long minutes = ChronoUnit.MINUTES.between(right_now, last_timeout);
               is_within_time = Math.abs(minutes) < Init.SESSION_TIMEOUT_MINUTES;
          }

          return is_logged_in && is_within_time;
     }

     public static Cookie makeUserCookie(JsonObject user_data) {
          String user_data_encoded = Base64.encodeBase64String(user_data.toString().getBytes());
          Cookie c = new Cookie("user_data", user_data_encoded);
          return c;
     }

     public static JsonObject setUserDataForCookie(JsonObject user_data) {
          JsonObject return_data = new JsonObject();
          return_data.add("first_name", Jsoup.clean(user_data.getString("first_name", ""), Whitelist.basic()));
          return_data.add("last_name", Jsoup.clean(user_data.getString("last_name", ""), Whitelist.basic()));
          return_data.add("email", Jsoup.clean(user_data.getString("email", ""), Whitelist.basic()));
          return_data.add("site", Jsoup.clean(user_data.getString("site", ""), Whitelist.basic()));
          JsonArray roles = Json.parse(user_data.getString("roles", "[]")).asArray();
          JsonArray pending_roles = Json.parse(user_data.getString("pending_roles", "[]")).asArray();
          return_data.add("roles", roles);
          return_data.add("pending_roles", pending_roles);
          return_data.add("has_osti_role", hasRole(roles, "OSTI"));
          return_data.add("is_logged_in", true);
          return_data.add("session_timeout", LocalDateTime.now().plus(Init.SESSION_TIMEOUT_MINUTES, ChronoUnit.MINUTES).format(SESSION_TIMEOUT_FORMAT));

          return return_data;
     }

     public static Cookie updateUserSessionTimeout(HttpServletRequest request) {
          JsonObject user_data = getUserDataFromCookie(request);
          String session_timeout = user_data.getString("session_timeout", "");
          if (DOECODEUtils.isValidDateOfPattern(SESSION_TIMEOUT_FORMAT, session_timeout)) {
               user_data.set("session_timeout", LocalDateTime.now().plus(Init.SESSION_TIMEOUT_MINUTES, ChronoUnit.MINUTES).format(SESSION_TIMEOUT_FORMAT));
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

     public static JsonObject updateUserCookie(HttpServletRequest request, JsonObject new_user_data) {
          JsonObject return_data = getUserDataFromCookie(request);
          //If we have new data, let's go through each item in the new object, and set it in our current user cookie
          if (new_user_data.names().size() > 0) {
               new_user_data.names().forEach((s) -> {
                    return_data.set(s, new_user_data.get(s));
               });
          }
          return return_data;
     }

     public static boolean hasRole(JsonArray roles, String role) {
          boolean has = false;

          for (JsonValue v : roles) {
               if (StringUtils.equals(v.asString(), role)) {
                    has = true;
                    break;
               }
          }

          return has;
     }

     public static JsonObject getUserRegistrationData(ServletContext context, String confirmation_code) {
          JsonObject return_data = new JsonObject();
          String api_url = context.getInitParameter("api_url");

          CloseableHttpClient hc = HttpClientBuilder.create().setDefaultRequestConfig(RequestConfig.custom().setSocketTimeout(5000).setConnectTimeout(5000).setConnectionRequestTimeout(5000).build()).build();
          HttpGet get = new HttpGet(api_url + "user/confirm?confirmation=" + confirmation_code);
          get.setHeader("Content-Type", "application/json");
          get.setHeader("Accept", "application/json");

          JsonObject response_json = new JsonObject();
          try {
               HttpResponse response = hc.execute(get);
               String raw_json = EntityUtils.toString(response.getEntity());
               if (DOECODEUtils.isValidJsonObject(raw_json)) {
                    response_json = Json.parse(raw_json).asObject();
               }

          } catch (Exception e) {
               log.severe("Exception in getting user confirmation code: " + e.getMessage());
          } finally {
               try {
                    hc.close();
               } catch (Exception e) {
                    log.severe("Couldn't close connection properly: " + e.getMessage());
               }
          }

          String api_key = response_json.getString("apiKey", "");
          String url_key = StringUtils.substringBeforeLast(api_url, "/");

          return_data.add("url_key", url_key);
          return_data.add("api_key", api_key);
          return_data.add("successful_signup", StringUtils.isNotBlank(api_key));

          return return_data;
     }

     public static JsonObject getAccountPageData(HttpServletRequest request) {
          JsonObject return_data = UserFunctions.getUserDataFromCookie(request);
          JsonArray roles = return_data.get("roles").asArray();
          JsonArray pending_roles = return_data.get("pending_roles").asArray();
          String site = return_data.getString("site", "");
          //See if their site is in their roles
          boolean site_in_roles = false;
          for (JsonValue v : roles) {
               if (StringUtils.equals(v.asString(), site)) {
                    site_in_roles = true;
                    break;
               }
          }
          //See if their site is in pending
          boolean site_in_pending = false;
          for (JsonValue v : pending_roles) {
               if (StringUtils.equals(v.asString(), site)) {
                    site_in_pending = true;
                    break;
               }
          }

          boolean showAdminRole = (!StringUtils.equals(site, "CONTR") && !site_in_roles);//If they aren't a contractor and the site they are a part of isn't in their roles list
          boolean hasAlreadyRequested = site_in_pending;

          return_data.add("can_request_admin_role", showAdminRole);
          return_data.add("has_already_requested", hasAlreadyRequested);

          return return_data;
     }
}
