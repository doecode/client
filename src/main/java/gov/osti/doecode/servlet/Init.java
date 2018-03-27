package gov.osti.doecode.servlet;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Jackson2Helper;
import com.github.jknack.handlebars.io.ServletContextTemplateLoader;
import com.github.jknack.handlebars.io.TemplateLoader;
import gov.osti.doecode.utils.JsonObjectUtils;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

public class Init extends HttpServlet {

     private static final long serialVersionUID = 1L;
     private static Logger log = LoggerFactory.getLogger(Init.class.getName());
     public static Handlebars handlebars;
     public static Handlebars handlebarsUser;
     public static String app_name;
     public static String google_analytics_id;
     public static String google_analytics_domain;
     public static String public_api_url;
     public static String backend_api_url;
     public static String authority_api_base;
     public static String site_url;
     public static ArrayNode availabilities_list;
     public static ArrayNode licenses_list;
     public static ArrayNode software_type;
     public static ArrayNode research_org_list;
     public static ArrayNode sponsor_org_list;
     public static ArrayNode sort_list;
     public static ArrayNode affiliations_list;
     public static ArrayNode countries_list;
     public static ArrayNode contributor_type_list;
     public static ArrayNode states_list;

     public static int SESSION_TIMEOUT_MINUTES;

     public Init() {
     }

     public void init(ServletConfig config) throws ServletException {
          super.init(config);

          //Get the servlet context
          ServletContext context = getServletContext();

          //Initialize the main template loader
          TemplateLoader loader = new ServletContextTemplateLoader(
                  context, "/WEB-INF/classes/templates", ".mustache");
          handlebars = new Handlebars(loader);
          handlebars.registerHelper("json", Jackson2Helper.INSTANCE);

          //Initialize the user template loader
          TemplateLoader loader2 = new ServletContextTemplateLoader(context, "/WEB-INF/classes/templates/user", ".mustache");
          handlebarsUser = new Handlebars(loader2);

          //Get the URL's used for searching and validation
          public_api_url = context.getInitParameter("api_url");
          backend_api_url = context.getInitParameter("api_backend_url");
          authority_api_base = context.getInitParameter("authority_base_url");

          //Get the name of the app from the web.xml
          app_name = context.getInitParameter("app_name");
          site_url = context.getInitParameter("site_url");

          //Google analytics info
          google_analytics_id = context.getInitParameter("ga_id");
          google_analytics_domain = context.getInitParameter("ga_domain");
          
          //Get the session timeout from the web.xml
          SESSION_TIMEOUT_MINUTES = Integer.parseInt(context.getInitParameter("session_timeout"));

          //Get the most commonly used json files, and load them into objects
          String jsonPath = context.getRealPath("./json");
          try {
               availabilities_list = JsonObjectUtils.getJsonList((jsonPath + "/" + JsonObjectUtils.AVAILABILITIES_LIST_JSON), JsonObjectUtils.AVAILABILITIES_LIST_JSON_KEY);
               licenses_list = JsonObjectUtils.getJsonList((jsonPath + "/" + JsonObjectUtils.LICENSE_OPTIONS_LIST_JSON), JsonObjectUtils.LICENSE_JLIST_SON_KEY);
               software_type = JsonObjectUtils.getJsonList((jsonPath + "/" + JsonObjectUtils.SOFTWARE_TYPES_LIST_JSON), JsonObjectUtils.SOFTWARE_TYPES_LIST_JSON_KEY);
               research_org_list = JsonObjectUtils.getJsonList((jsonPath + "/" + JsonObjectUtils.RESEARCH_ORG_LIST_JSON), JsonObjectUtils.RESEARCH_ORG_LIST_JSON_KEY);
               sponsor_org_list = JsonObjectUtils.getJsonList((jsonPath + "/" + JsonObjectUtils.SPONSOR_ORG_LIST_JSON), JsonObjectUtils.SPONSOR_ORG_LIST_JSON_KEY);
               sort_list = JsonObjectUtils.getJsonList((jsonPath + "/" + JsonObjectUtils.SEARCH_SORT_OPTIONS_LIST_JSON), JsonObjectUtils.SEARCH_SORT_LIST_JSON_KEY);
               affiliations_list = JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.AFFILIATIONS_LIST_JSON, JsonObjectUtils.AFFILIATIONS_LIST_JSON_KEY);
               countries_list = JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.COUNTRIES_LIST_JSON, JsonObjectUtils.COUNTRIES_LIST_JSON_KEY);
               contributor_type_list = JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.CONTRIBUTOR_TYPES_LIST_JSON, JsonObjectUtils.CONTRIBUTOR_TYPES_LIST_JSON_KEY);
               states_list = JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.STATE_LIST_JSON, JsonObjectUtils.STATE_LIST_JSON_KEY);
          } catch (IOException ex) {
               log.error("Error in loading json lists while initializing: " + ex.getMessage());
          }

          log.info("DOE CODE Application Started");
     }
}
