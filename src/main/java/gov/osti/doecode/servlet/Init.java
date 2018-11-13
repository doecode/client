package gov.osti.doecode.servlet;

import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Jackson2Helper;
import com.github.jknack.handlebars.io.ServletContextTemplateLoader;
import com.github.jknack.handlebars.io.TemplateLoader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

@WebServlet(urlPatterns = { "/init" }, loadOnStartup = 1)
public class Init extends HttpServlet {

        private static final long serialVersionUID = 1L;
        private static Logger log = LoggerFactory.getLogger(Init.class.getName());
        public static Handlebars handlebars;
        public static Handlebars handlebarsUser;
        public static Handlebars handlebarsSearch;
        public static String app_name;
        public static String google_analytics_id;
        public static String google_analytics_domain;
        public static String public_api_url;
        public static String backend_api_url;
        public static String news_page_data_url;
        public static String authority_api_base;
        public static String site_url;
        public static String containers_dir;
        public static String news_environment_url;
        public static String recaptcha_secretkey;
        public static String recaptcha_sitekey;
        public static String gitlab_from_email;
        public static String gitlab_submit_email;
        public static String smtp_host;

        public static int SESSION_TIMEOUT_MINUTES;
        private static Properties props = new Properties();
        static {
                // Load up the properties file
                try {
                        log.info("Loading Properties");
                        props.load(Init.class.getResourceAsStream("/params.properties"));
                        news_page_data_url = props.getProperty("news_page_data_url", "");
                        news_environment_url = props.getProperty("news_environment_url", "");
                        // Get the URL's used for searching and validation
                        public_api_url = props.getProperty("api_url");
                        backend_api_url = props.getProperty("api_backend_url");
                        authority_api_base = props.getProperty("authority_base_url");

                        // Get the name of the app from the web.xml
                        app_name = props.getProperty("app_name");
                        site_url = props.getProperty("site_url");

                        // Google analytics info
                        google_analytics_id = props.getProperty("ga_id");
                        google_analytics_domain = props.getProperty("ga_domain");

                        // Set the container upload directory
                        containers_dir = props.getProperty("containers_dir");

                        // Recaptcha
                        recaptcha_secretkey = props.getProperty("recaptcha_secretkey");
                        recaptcha_sitekey = props.getProperty("recaptcha_sitekey");

                        // Gitlab
                        gitlab_from_email = props.getProperty("gitlab_from_email");
                        gitlab_submit_email = props.getProperty("gitlab_submit_email");

                        // SMTP Host
                        smtp_host = props.getProperty("smtpHost");

                        // Get the session timeout from the web.xml
                        SESSION_TIMEOUT_MINUTES = Integer.parseInt(props.getProperty("session_timeout"));
                        log.info("Done loading properties");
                } catch (Exception e) {

                }
        }

        public Init() {
        }

        public void init(ServletConfig config) throws ServletException {
                super.init(config);

                // Get the servlet context
                ServletContext context = getServletContext();

                // Initialize the main template loader
                TemplateLoader loader = new ServletContextTemplateLoader(context, "/WEB-INF/classes/templates",
                                ".mustache");
                handlebars = new Handlebars(loader);
                handlebars.registerHelper("json", Jackson2Helper.INSTANCE);

                // Initialize the user template loader
                TemplateLoader loader2 = new ServletContextTemplateLoader(context, "/WEB-INF/classes/templates/user",
                                ".mustache");
                handlebarsUser = new Handlebars(loader2);

                TemplateLoader loader3 = new ServletContextTemplateLoader(context, "/WEB-INF/classes/templates/search",
                                ".mustache");
                handlebarsSearch = new Handlebars(loader3);

                log.info("DOE CODE Application Started");
        }
}
