package gov.osti.doecode.servlet;

import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Jackson2Helper;
import com.github.jknack.handlebars.io.ServletContextTemplateLoader;
import com.github.jknack.handlebars.io.TemplateLoader;
import java.io.File;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import org.apache.commons.io.FileUtils;

public class Init extends HttpServlet {

     private static final long serialVersionUID = 1L;
     private static Logger log = LoggerFactory.getLogger(Init.class.getName());
     public static Handlebars handlebars;
     public static Handlebars handlebarsUser;
     public static String css_string;
     public static String app_name;
     public static int SESSION_TIMEOUT_MINUTES;

     public Init() {
     }

     public void init(ServletConfig config) throws ServletException {
          super.init(config);

          /**
           * init template handler *
           */
          TemplateLoader loader = new ServletContextTemplateLoader(
                  getServletContext(), "/WEB-INF/templates", ".mustache");
          handlebars = new Handlebars(loader);
          handlebars.registerHelper("json", Jackson2Helper.INSTANCE);

          TemplateLoader loader2 = new ServletContextTemplateLoader(getServletContext(), "/WEB-INF/templates/user", ".mustache");
          handlebarsUser = new Handlebars(loader2);

          String css_path = getServletContext().getRealPath("./css/");
          File servlet_path = new File(css_path);
          if (servlet_path.exists() && servlet_path.isDirectory()) {
               css_string = getFileData(new File(css_path + "doecode-css.css"));
          }
          
          app_name = getServletContext().getInitParameter("app_name_prefix");
          
          SESSION_TIMEOUT_MINUTES = Integer.parseInt(getServletContext().getInitParameter("session_timeout"));

          log.info("DOE CODE Application Started");
     }

     private String getFileData(File f) {
          String return_data = "";
          try {
               return_data = FileUtils.readFileToString(f);
          } catch (IOException ex) {
               log.error("Can't read file for css: " + ex.getMessage());
          }
          return return_data;
     }
}
