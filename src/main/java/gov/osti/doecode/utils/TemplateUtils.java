package gov.osti.doecode.utils;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class TemplateUtils {

     private static Logger log = LoggerFactory.getLogger(TemplateUtils.class.getName());

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

     public static final ObjectNode GET_COMMON_DATA(boolean isHomepage, ObjectNode output_data, String current_page, ArrayNode jsFilesList, HttpServletRequest request) {
          //Set the wrapper classes for the header and footer
          if (isHomepage) {
               output_data.put("header_class", "homepage-wrapper");
               output_data.put("footer_class", "footer-homepage");
               output_data.put("nav_class", "navbar navbar-default main-header visible-xs hidden-sm hidden-md hidden-lg");
               output_data.put("footer_img_link", "/doecode/images/DOE_SC_OSTI_FFF.png");
               output_data.put("footer_link", "footer-link-homepage");
               output_data.put("linkColorClass", "white");
               output_data.put("outter_wrapper_style", "homepage-outtermost-style");
          } else {
               output_data.put("header_class", " wrapper ");
               output_data.put("footer_class", "footer footer-bottom");
               output_data.put("nav_class", "navbar navbar-default main-header");
               output_data.put("footer_img_link", "/doecode/images/DOE_SC_OSTI_666_sm.png");
               output_data.put("footer_link", "footer-link");
               output_data.put("linkColorClass", "footer-link");
          }

          output_data.put("active_page", current_page);
          output_data.put("isHomepage", isHomepage);
          if (!JsonObjectUtils.containsKey(output_data, "user_data")) {
               output_data.put("user_data", UserFunctions.getUserDataFromCookie(request));
          }
          output_data.put("jsFiles", jsFilesList);
          output_data.put("navbar", GET_NAVBAR_CLASSES(current_page));
          output_data.put("css", Init.css_string);
          output_data.put("app_name", Init.app_name);

          return output_data;
     }

     public static final ObjectNode GET_NAVBAR_CLASSES(String current_page) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          ObjectNode projects = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          projects.put("list_item", "nav-menu-item-special");
          projects.put("anchor", "nav-menu-item nav-menu-item-text");

          ObjectNode repositoryServices = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          repositoryServices.put("list_item", "nav-menu-item-special");
          repositoryServices.put("anchor", "nav-menu-item nav-menu-item-text");

          ObjectNode about = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          about.put("list_item", "nav-menu-item-special");
          about.put("anchor", "nav-menu-item nav-menu-item-text");

          ObjectNode policy = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          policy.put("list_item", "nav-menu-item-special");
          policy.put("anchor", "nav-menu-item nav-menu-item-text");

          ObjectNode newsResources = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          newsResources.put("list_item", "nav-menu-item-special");
          newsResources.put("anchor", "nav-menu-item nav-menu-item-text");

          ObjectNode faq = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          faq.put("list_item", "nav-menu-item-special");
          faq.put("anchor", "nav-menu-item nav-menu-item-text");

          switch (current_page) {
               case PAGE_PROJECTS:
                    projects.put("list_item", "nav-menu-item-special active-menu-item");
                    projects.put("anchor", "nav-menu-item active-menu-item-text");
                    projects.put("span", "active-menu-item-text");
                    break;
               case PAGE_REPOSITORY_SERVICES:
                    repositoryServices.put("list_item", "nav-menu-item-special active-menu-item");
                    repositoryServices.put("anchor", "nav-menu-item active-menu-item-text");
                    repositoryServices.put("span", "active-menu-item-text");
                    break;
               case PAGE_ABOUT:
                    about.put("list_item", "nav-menu-item-special active-menu-item");
                    about.put("anchor", "nav-menu-item active-menu-item-text");
                    about.put("span", "active-menu-item-text");
                    break;
               case PAGE_POLICY:
                    policy.put("list_item", "nav-menu-item-special active-menu-item");
                    policy.put("anchor", "nav-menu-item active-menu-item-text");
                    policy.put("span", "active-menu-item-text");
                    break;
               case PAGE_NEWS_RESOURCES:
                    newsResources.put("list_item", "nav-menu-item-special active-menu-item");
                    newsResources.put("anchor", "nav-menu-item active-menu-item-text");
                    newsResources.put("span", "active-menu-item-text");
                    break;
               case PAGE_FAQ:
                    faq.put("list_item", "nav-menu-item-special active-menu-item");
                    faq.put("anchor", "nav-menu-item active-menu-item-text");
                    faq.put("span", "active-menu-item-text");
                    break;
          }

          return_data.put("projects", projects);
          return_data.put("repository_services", repositoryServices);
          return_data.put("about", about);
          return_data.put("policy", policy);
          return_data.put("news_resources", newsResources);
          return_data.put("faq", faq);

          return return_data;
     }

     public static String getNewSigninStatusHtml(ServletContext context, ObjectNode data) {
          String template_data = "";
          HashMap user_data = new HashMap();
          user_data.put("first_name", JsonObjectUtils.getString(data, "first_name", ""));
          user_data.put("last_name", JsonObjectUtils.getString(data, "last_name", ""));
          user_data.put("is_logged_in", true);
          user_data.put("has_osti_role", JsonObjectUtils.getBoolean(data, "has_osti_role", false));
          HashMap data_for_template = new HashMap();
          data_for_template.put("user_data", user_data);

          try {
               Template t = Init.handlebarsUser.compile(TEMPLATE_SIGNIN_STATUS);
               template_data = t.apply(data_for_template);

          } catch (Exception e) {
               log.error("Exception: " + e);
          }

          return template_data;
     }

     public static void writeOutTemplateData(String page_title, String template, HttpServletResponse response, ObjectNode data) throws IOException {
          response.setContentType("text/html;charset=UTF-8");
          //Turn our json object into jackson
          data.put("page_title", page_title);
          //Put the jackson context together
          Context context = Context.newBuilder(data).resolver(JsonNodeValueResolver.INSTANCE, JavaBeanValueResolver.INSTANCE, FieldValueResolver.INSTANCE, MapValueResolver.INSTANCE, MethodValueResolver.INSTANCE).build();
          Template t = Init.handlebars.compile(template);
          PrintWriter out = response.getWriter();
          t.apply(context, out);
     }
}
