package gov.osti.doecode.utils;

import com.eclipsesource.json.JsonArray;
import com.eclipsesource.json.JsonObject;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.jknack.handlebars.Context;
import com.github.jknack.handlebars.JsonNodeValueResolver;
import com.github.jknack.handlebars.Template;
import com.github.jknack.handlebars.context.FieldValueResolver;
import com.github.jknack.handlebars.context.JavaBeanValueResolver;
import com.github.jknack.handlebars.context.MapValueResolver;
import com.github.jknack.handlebars.context.MethodValueResolver;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.HashMap;
import java.util.logging.Logger;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

public class TemplateUtils {

     private static Logger log = Logger.getLogger(TemplateUtils.class.getName());

     //Dissemination
     public static final String TEMPLATE_HOMEPAGE = "index";
     public static final String TEMPLATE_PROJECTS_PAGE = "projects";
     public static final String TEMPLATE_REPOSITORY_SERVICES_PAGE = "repository-services";
     public static final String TEMPLATE_ABOUT_PAGE = "about";
     public static final String TEMPLATE_POLICY_PAGE = "policy";
     public static final String TEMPLATE_NEWS_RESOURCES_PAGE = "news-resources";
     public static final String TEMPLATE_FAQ_PAGE = "faq";
     public static final String TEMPLATE_NOT_FOUND_PAGE = "page-not-found";
     public static final String TEMPLATE_SEARCH_RESULTS_PAGE = "search-results";
     public static final String TEMPLATE_ADVANCED_SEARCH = "advanced-search";
     public static final String TEMPLATE_BIBLIO_PAGE = "biblio";
     public static final String TEMPLATE_FORBIDDEN_PAGE = "forbidden";
     public static final String TEMPLATE_SECURITY_HOSTING_PAGE = "security-hosting";
     public static final String TEMPLATE_DISCLAIMER_PAGE = "disclaimer";
     public static final String TEMPLATE_CONTACT_PAGE = "contact";

     //Input
     public static final String TEMPLATE_INPUT_FORM = "input-form";
     public static final String TEMPLATE_CONFIRMATION_PAGE = "confirm";
     public static final String TEMPLATE_FORM_SELECT = "input-form-type-selector";

     //User
     public static final String TEMPLATE_USER_ACCOUNT = "account";
     public static final String TEMPLATE_USER_ADMIN = "user-admin";
     public static final String TEMPLATE_USER_LOGIN = "user-login";
     public static final String TEMPLATE_USER_REGISTRATION = "user-registration";
     public static final String TEMPLATE_USER_CONFIRMATION = "user-registration-confirmation";
     public static final String TEMPLATE_USER_FORGOT_PASSWORD = "forgot-password";
     public static final String TEMPLATE_USER_LOGOUT = "logout";
     public static final String TEMPLATE_MY_PROJECTS = "my-projects";
     public static final String TEMPLATE_PENDING_APPROVAL = "pending";
     public static final String TEMPLATE_SIGNIN_STATUS = "SigninStatus";
     public static final String TEMPLATE_HELP = "help";
     
     //Error Pages
     public static final String TEMPLATE_404_PAGE = "page-not-found";
     public static final String TEMPLATE_ERROR_PAGE = "error-page";

     //Deals with the navbar
     public static final String PAGE_PROJECTS = "projects";
     public static final String PAGE_REPOSITORY_SERVICES = "repository-services";
     public static final String PAGE_ABOUT = "about";
     public static final String PAGE_POLICY = "policy";
     public static final String PAGE_NEWS_RESOURCES = "news-resources";
     public static final String PAGE_FAQ = "faq";

     public static final JsonObject GET_COMMON_DATA(boolean isHomepage, JsonObject output_data, String current_page, JsonArray jsFilesList, HttpServletRequest request) {
          //Set the wrapper classes for the header and footer
          if (isHomepage) {
               output_data.add("header_class", "homepage-wrapper");
               output_data.add("footer_class", "footer-homepage");
               output_data.add("nav_class", "navbar navbar-default main-header visible-xs hidden-sm hidden-md hidden-lg");
               output_data.add("footer_img_link", "/doecode/images/DOE_SC_OSTI_FFF.png");
               output_data.add("footer_link", "footer-link-homepage");
               output_data.add("linkColorClass", "white");
               output_data.add("outter_wrapper_style", "homepage-outtermost-style");
          } else {
               output_data.add("header_class", " wrapper ");
               output_data.add("footer_class", "footer footer-bottom");
               output_data.add("nav_class", "navbar navbar-default main-header");
               output_data.add("footer_img_link", "/doecode/images/DOE_SC_OSTI_666_sm.png");
               output_data.add("footer_link", "footer-link");
               output_data.add("linkColorClass", "footer-link");
          }

          output_data.add("active_page", current_page);
          output_data.add("isHomepage", isHomepage);
          if (output_data.names().indexOf("user_data") < 0) {
               output_data.add("user_data", UserFunctions.getUserDataFromCookie(request));
          }
          output_data.add("jsFiles", jsFilesList);
          output_data.add("navbar", GET_NAVBAR_CLASSES(current_page));
          output_data.add("css", Init.css_string);

          return output_data;
     }

     public static final JsonObject GET_NAVBAR_CLASSES(String current_page) {
          JsonObject return_data = new JsonObject();
          JsonObject projects = new JsonObject();
          projects.add("list_item", "nav-menu-item-special");
          projects.add("anchor", "nav-menu-item nav-menu-item-text");

          JsonObject repositoryServices = new JsonObject();
          repositoryServices.add("list_item", "nav-menu-item-special");
          repositoryServices.add("anchor", "nav-menu-item nav-menu-item-text");

          JsonObject about = new JsonObject();
          about.add("list_item", "nav-menu-item-special");
          about.add("anchor", "nav-menu-item nav-menu-item-text");

          JsonObject policy = new JsonObject();
          policy.add("list_item", "nav-menu-item-special");
          policy.add("anchor", "nav-menu-item nav-menu-item-text");

          JsonObject newsResources = new JsonObject();
          newsResources.add("list_item", "nav-menu-item-special");
          newsResources.add("anchor", "nav-menu-item nav-menu-item-text");

          JsonObject faq = new JsonObject();
          faq.add("list_item", "nav-menu-item-special");
          faq.add("anchor", "nav-menu-item nav-menu-item-text");

          switch (current_page) {
               case PAGE_PROJECTS:
                    projects.set("list_item", "nav-menu-item-special active-menu-item");
                    projects.set("anchor", "nav-menu-item active-menu-item-text");
                    projects.set("span", "active-menu-item-text");
                    break;
               case PAGE_REPOSITORY_SERVICES:
                    repositoryServices.set("list_item", "nav-menu-item-special active-menu-item");
                    repositoryServices.set("anchor", "nav-menu-item active-menu-item-text");
                    repositoryServices.set("span", "active-menu-item-text");
                    break;
               case PAGE_ABOUT:
                    about.set("list_item", "nav-menu-item-special active-menu-item");
                    about.set("anchor", "nav-menu-item active-menu-item-text");
                    about.set("span", "active-menu-item-text");
                    break;
               case PAGE_POLICY:
                    policy.set("list_item", "nav-menu-item-special active-menu-item");
                    policy.set("anchor", "nav-menu-item active-menu-item-text");
                    policy.set("span", "active-menu-item-text");
                    break;
               case PAGE_NEWS_RESOURCES:
                    newsResources.set("list_item", "nav-menu-item-special active-menu-item");
                    newsResources.set("anchor", "nav-menu-item active-menu-item-text");
                    newsResources.set("span", "active-menu-item-text");
                    break;
               case PAGE_FAQ:
                    faq.set("list_item", "nav-menu-item-special active-menu-item");
                    faq.set("anchor", "nav-menu-item active-menu-item-text");
                    faq.set("span", "active-menu-item-text");
                    break;
          }

          return_data.add("projects", projects);
          return_data.add("repository_services", repositoryServices);
          return_data.add("about", about);
          return_data.add("policy", policy);
          return_data.add("news_resources", newsResources);
          return_data.add("faq", faq);

          return return_data;
     }

     public static String getNewSigninStatusHtml(ServletContext context, JsonObject data) {
          String template_data = "";
          HashMap user_data = new HashMap();
          user_data.put("first_name", data.getString("first_name", ""));
          user_data.put("last_name", data.getString("last_name", ""));
          user_data.put("is_logged_in", true);
          user_data.put("has_osti_role", data.getBoolean("has_osti_role", false));
          HashMap data_for_template = new HashMap();
          data_for_template.put("user_data", user_data);

          try {
               Template t = Init.handlebarsUser.compile(TEMPLATE_SIGNIN_STATUS);
               template_data = t.apply(data_for_template);

          } catch (Exception e) {
               log.severe("Exception: " + e);
          }

          return template_data;
     }

     public static void writeOutTemplateData(String page_title, String template, HttpServletResponse response, JsonObject data) throws IOException {
          response.setContentType("text/html;charset=UTF-8");
          //Turn our json object into jackson
          data.add("page_title", page_title);
          JsonNode jsonNode = new ObjectMapper().readValue(data.toString(), JsonNode.class);
          //Put the jackson context together
          Context context = Context.newBuilder(jsonNode).resolver(JsonNodeValueResolver.INSTANCE, JavaBeanValueResolver.INSTANCE, FieldValueResolver.INSTANCE, MapValueResolver.INSTANCE, MethodValueResolver.INSTANCE).build();
          Template t = Init.handlebars.compile(template);
          PrintWriter out = response.getWriter();
          t.apply(context, out);
     }
}
