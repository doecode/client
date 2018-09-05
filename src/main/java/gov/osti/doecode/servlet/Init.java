package gov.osti.doecode.servlet;

import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Jackson2Helper;
import com.github.jknack.handlebars.io.ServletContextTemplateLoader;
import com.github.jknack.handlebars.io.TemplateLoader;
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
     public static String containers_dir;

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

          //Set the file upload directory
          containers_dir = context.getInitParameter("containers_dir");

          //Get the session timeout from the web.xml
          SESSION_TIMEOUT_MINUTES = Integer.parseInt(context.getInitParameter("session_timeout"));

          log.info("DOE CODE Application Started");
     }
}
