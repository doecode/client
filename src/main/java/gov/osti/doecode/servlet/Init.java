package gov.osti.doecode.servlet;

import com.github.jknack.handlebars.Handlebars;
import com.github.jknack.handlebars.Jackson2Helper;
import com.github.jknack.handlebars.io.ServletContextTemplateLoader;
import com.github.jknack.handlebars.io.TemplateLoader;
import gov.osti.doecode.entity.NewsFunctions;
import gov.osti.doecode.utils.DOECODEUtils;
import java.util.HashMap;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;

@WebServlet(urlPatterns = {"/init"}, loadOnStartup = 1)
public class Init extends HttpServlet {

    private static final long serialVersionUID = 1L;
    private static final Logger log = LoggerFactory.getLogger(Init.class.getName());
    public static Handlebars handlebars;
    public static Handlebars handlebarsUser;
    public static Handlebars handlebarsSearch;
    public static String app_name; //The actual name of the application build. This can be different, based on some switches with maven
    public static String google_analytics_4_id; //The ID your google analytics 4 account has for this application
    public static String public_api_url; //The front-end, usually proxied URL to the DOE CODE API
    public static String backend_api_url; //The back-end, usually un-proxied URL to the DOE CODE API
    public static String authority_api_base; //The URL to the Elink Authority API
    public static String site_url; //The actual full URL (proxied) to this instance of DOE CODE
    public static String containers_dir; //The directory that containers are in
    public static String news_environment_url; //The URL that news article links need to go to (prefix)
    public static String recaptcha_secretkey; //THe secret key given by google when using recaptcha
    public static String recaptcha_sitekey; //The public key given by google hwen using recaptcha
    public static String gitlab_from_email; //The from email address used in gitlab signups
    public static String gitlab_submit_email; //The email that gitlab signups are sent to
    public static String smtp_host; //The mail host needed to send gitlab emails
    public static String ostigov_news_xml; //The URL to the OSTI.gov news data feed

    public static final HashMap<String, String> NEWS_ARTICLE_TYPES_OBJ = new HashMap<String, String>();
    public static final HashMap<String, String> NEWS_ARTICLE_TYPES_INVERSE_OBJ = new HashMap<String, String>();
    public static int SESSION_TIMEOUT_MINUTES;
    private static final Properties PROPS = new Properties();

    static {
        // Load up the properties file
        try {
            PROPS.load(Init.class.getResourceAsStream("/params.properties"));
            news_environment_url = PROPS.getProperty("news_environment_url", "");
            // Get the URL's used for searching and validation
            public_api_url = PROPS.getProperty("api_url");
            backend_api_url = PROPS.getProperty("api_backend_url");
            authority_api_base = PROPS.getProperty("authority_base_url");

            // Get the name of the app from the web.xml
            app_name = PROPS.getProperty("app_name");
            site_url = PROPS.getProperty("site_url");

            // Google analytics info
            google_analytics_4_id = PROPS.getProperty("ga4_id");

            // Set the container upload directory
            containers_dir = PROPS.getProperty("containers_dir");

            // Recaptcha
            recaptcha_secretkey = PROPS.getProperty("recaptcha_secretkey");
            recaptcha_sitekey = PROPS.getProperty("recaptcha_sitekey");

            // Gitlab
            gitlab_from_email = PROPS.getProperty("gitlab_from_email");
            gitlab_submit_email = PROPS.getProperty("gitlab_submit_email");

            // SMTP Host
            smtp_host = PROPS.getProperty("smtpHost");

            //OSTI GOV News XML
            ostigov_news_xml = PROPS.getProperty("ostigov_news_xml");

            // Get the session timeout from the web.xml
            SESSION_TIMEOUT_MINUTES = Integer.parseInt(PROPS.getProperty("session_timeout"));
        } catch (Exception e) {
            log.error("Exception in loading properties: " + DOECODEUtils.getStackTrace(e));
        }
    }

    public Init() {
    }

    public void init(ServletConfig config) throws ServletException {
        super.init(config);

        // Get the servlet context
        ServletContext context = getServletContext();

        // Initialize the main template loader
        TemplateLoader loader = new ServletContextTemplateLoader(context, "/WEB-INF/classes/templates", ".mustache");
        handlebars = new Handlebars(loader);
        handlebars.registerHelper("json", Jackson2Helper.INSTANCE);

        // Initialize the user template loader
        TemplateLoader loader2 = new ServletContextTemplateLoader(context, "/WEB-INF/classes/templates/user", ".mustache");
        handlebarsUser = new Handlebars(loader2);

        TemplateLoader loader3 = new ServletContextTemplateLoader(context, "/WEB-INF/classes/templates/search", ".mustache");
        handlebarsSearch = new Handlebars(loader3);

        //Load some news data
        try {
            NewsFunctions.getNewsTermsData();
        } catch (Exception ex) {
            log.error("Exception in getting news term data: " + ex.getMessage());
        }

        log.info("DOE CODE Application Started");
    }
}
