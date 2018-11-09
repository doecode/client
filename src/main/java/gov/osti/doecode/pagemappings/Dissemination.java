/*
     Think of this class as a switchboard. It looks at any url mapped to it, and determines what that URL is, and loads up an appropriate 
 */
package gov.osti.doecode.pagemappings;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;
import org.bigtesting.routd.Route;
import org.bigtesting.routd.Router;
import org.bigtesting.routd.TreeRouter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.osti.doecode.entity.NewsFunctions;
import gov.osti.doecode.entity.SearchFunctions;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;

@WebServlet(urlPatterns = { "/Index", "/repository-services", "/about", "/policy", "/resources", "/news", "/faq",
                "/results", "/search", "/biblio/*", "/forbidden", "/security-hosting", "/contact", "/disclaimer" })
public class Dissemination extends HttpServlet {

        private static final long serialVersionUID = 282315618723126267L;
        protected Logger log = LoggerFactory.getLogger(Dissemination.class.getName());

        // Routes for this servlet
        private final Router PAGEMAPPING_ROUTES = new TreeRouter();
        private Route HOMEPAGE_ROUTE_ALT = new Route(Init.app_name);
        private Route HOMEPAGE_ROUTE = new Route("/" + Init.app_name + "/");
        private Route REPOSITORY_SERVICES_ROUTE = new Route("/" + Init.app_name + "/repository-services");
        private Route ABOUT_ROUTE = new Route("/" + Init.app_name + "/about");
        private Route POLICY_ROUTE = new Route("/" + Init.app_name + "/policy");
        private Route RESOURCES_ROUTE = new Route("/" + Init.app_name + "/resources");
        private Route NEWS_ROUTE = new Route("/" + Init.app_name + "/news");
        private Route FAQ_ROUTE = new Route("/" + Init.app_name + "/faq");
        private Route RESULTS_ROUTE = new Route("/" + Init.app_name + "/results");
        private Route SEARCH_ROUTE = new Route("/" + Init.app_name + "/search");
        private Route BIBLIO_ROUTE = new Route("/" + Init.app_name + "/biblio/:codeid");
        private Route FORBIDDEN_ROUTE = new Route("/" + Init.app_name + "/forbidden");
        private Route SECURITY_HOSTING_ROUTE = new Route("/" + Init.app_name + "/security-hosting");
        private Route CONTACT_ROUTE = new Route("/" + Init.app_name + "/contact");
        private Route DISCLAIMER_ROUTE = new Route("/" + Init.app_name + "/disclaimer");

        @Override
        public void init() {
                PAGEMAPPING_ROUTES.add(HOMEPAGE_ROUTE_ALT);
                PAGEMAPPING_ROUTES.add(HOMEPAGE_ROUTE);
                PAGEMAPPING_ROUTES.add(REPOSITORY_SERVICES_ROUTE);
                PAGEMAPPING_ROUTES.add(ABOUT_ROUTE);
                PAGEMAPPING_ROUTES.add(POLICY_ROUTE);
                PAGEMAPPING_ROUTES.add(RESOURCES_ROUTE);
                PAGEMAPPING_ROUTES.add(NEWS_ROUTE);
                PAGEMAPPING_ROUTES.add(FAQ_ROUTE);
                PAGEMAPPING_ROUTES.add(RESULTS_ROUTE);
                PAGEMAPPING_ROUTES.add(SEARCH_ROUTE);
                PAGEMAPPING_ROUTES.add(BIBLIO_ROUTE);
                PAGEMAPPING_ROUTES.add(FORBIDDEN_ROUTE);
                PAGEMAPPING_ROUTES.add(SECURITY_HOSTING_ROUTE);
                PAGEMAPPING_ROUTES.add(CONTACT_ROUTE);
                PAGEMAPPING_ROUTES.add(DISCLAIMER_ROUTE);
        }

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                request.setCharacterEncoding("UTF-8");
                String path = request.getRequestURI();
                Route route = PAGEMAPPING_ROUTES.route(path);
                String page_title = "";
                String template = "";
                String current_page = "";
                ObjectNode output_data = new ObjectNode(JsonUtils.INSTANCE);
                ArrayNode jsFilesList = new ArrayNode(JsonUtils.INSTANCE);
                ArrayNode extrasList = JsonUtils.MAPPER.createArrayNode();

                /*
                 * Determine what page we're on, and load the appropriate title, template, etc
                 */
                if (route.equals(HOMEPAGE_ROUTE_ALT) || route.equals(HOMEPAGE_ROUTE)) {// HOMEPAGE
                        page_title = "DOE CODE: Your software services platform and search tool to easily submit, announce, and discover code funded by the U.S. Department of Energy";
                        template = TemplateUtils.TEMPLATE_HOMEPAGE;

                } else if (route.equals(REPOSITORY_SERVICES_ROUTE)) {
                        page_title = "DOE CODE: Repository Services";
                        template = TemplateUtils.TEMPLATE_REPOSITORY_SERVICES_PAGE;
                        current_page = TemplateUtils.PAGE_REPOSITORY_SERVICES;

                } else if (route.equals(ABOUT_ROUTE)) {
                        page_title = "DOE CODE: About";
                        template = TemplateUtils.TEMPLATE_ABOUT_PAGE;
                        current_page = TemplateUtils.PAGE_ABOUT;

                } else if (route.equals(POLICY_ROUTE)) {
                        page_title = "DOE CODE: Policy";
                        template = TemplateUtils.TEMPLATE_POLICY_PAGE;
                        current_page = TemplateUtils.PAGE_POLICY;

                } else if (route.equals(RESOURCES_ROUTE)) {
                        page_title = "DOE CODE:Resources";
                        template = TemplateUtils.TEMPLATE_RESOURCES_PAGE;
                        current_page = TemplateUtils.PAGE_RESOURCES;
                        output_data.put("api_url", Init.public_api_url);

                } else if (route.equals(NEWS_ROUTE)) {
                        page_title = "DOE CODE: News";
                        template = TemplateUtils.TEMPLATE_NEWS_PAGE;
                        current_page = TemplateUtils.PAGE_NEWS;
                        output_data = NewsFunctions.getNewsPageData(Init.news_page_data_url,
                                        JsonUtils.MAPPER.createObjectNode());

                } else if (route.equals(FAQ_ROUTE)) {
                        page_title = "DOE CODE: FAQ's";
                        template = TemplateUtils.TEMPLATE_FAQ_PAGE;
                        current_page = TemplateUtils.PAGE_FAQ;
                        output_data.put("api_url", Init.public_api_url);

                } else if (route.equals(RESULTS_ROUTE)) {
                        page_title = "DOE CODE: Search Results";
                        template = TemplateUtils.TEMPLATE_SEARCH_RESULTS_PAGE;
                        String page_num_param = request.getParameter("page");
                        long page_num = StringUtils.isNumeric(page_num_param) ? Long.parseLong(page_num_param) : 1;
                        output_data = SearchFunctions.conductSearch(request, getServletContext(), page_num);
                        extrasList.add("libraries/google-chart-loader.min");

                } else if (route.equals(SEARCH_ROUTE)) {
                        page_title = "DOE CODE: Advanced Search";
                        template = TemplateUtils.TEMPLATE_ADVANCED_SEARCH;

                } else if (route.equals(BIBLIO_ROUTE)) {
                        template = TemplateUtils.TEMPLATE_BIBLIO_PAGE;
                        String raw_code_and_title = StringUtils.defaultIfBlank(route.getNamedParameter("codeid", path),
                                        "");
                        String just_code_id = StringUtils.substringBefore(raw_code_and_title, "-");
                        if (StringUtils.isNumeric(just_code_id)) {
                                page_title = "DOE CODE: Project Metadata for Code ID " + just_code_id;
                                ObjectNode biblio_data = SearchFunctions.getBiblioData(Long.parseLong(just_code_id));

                                // If, and only if, this is a valid code id
                                if (JsonUtils.getBoolean(biblio_data, "is_valid", false)) {
                                        extrasList.add("libraries/clipboard.min");
                                        output_data = biblio_data;
                                } else {
                                        output_data.put("is_invalid_code_id", true);
                                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                                }
                        } else {
                                output_data.put("is_invalid_code_id", true);
                                response.setStatus(HttpServletResponse.SC_NOT_FOUND);

                        }

                } else if (route.equals(FORBIDDEN_ROUTE)) {
                        page_title = "DOE CODE: Forbidden Access";
                        template = TemplateUtils.TEMPLATE_FORBIDDEN_PAGE;

                } else if (route.equals(SECURITY_HOSTING_ROUTE)) {
                        page_title = "DOE CODE: Security Hosting";
                        template = TemplateUtils.TEMPLATE_SECURITY_HOSTING_PAGE;

                } else if (route.equals(DISCLAIMER_ROUTE)) {
                        page_title = "DOE CODE: Disclaimer";
                        template = TemplateUtils.TEMPLATE_DISCLAIMER_PAGE;

                } else if (route.equals(CONTACT_ROUTE)) {
                        page_title = "DOE CODE: Contact Us";
                        template = TemplateUtils.TEMPLATE_CONTACT_PAGE;

                } else {
                        page_title = "DOE CODE: Page Not Found";
                        template = TemplateUtils.TEMPLATE_404_PAGE;
                }

                // Add the common dissemination js file
                jsFilesList.add("dissemination");

                // Check if they're logged in, and only do something if they're not logged in
                if (!UserFunctions.isUserLoggedIn(request)) {
                        output_data.set("user_data", new ObjectNode(JsonUtils.INSTANCE));
                } else {
                        // Increment time
                        response.addCookie(UserFunctions.updateUserSessionTimeout(request));
                        if (StringUtils.equals(UserFunctions.getOtherUserCookieValue(request, "needs_password_reset"),
                                        "true")) {
                                Cookie needs_reset_cookie = UserFunctions.getOtherUserCookie(request,
                                                "needs_password_reset");
                                needs_reset_cookie.setMaxAge(Init.SESSION_TIMEOUT_MINUTES * 60);
                                response.addCookie(needs_reset_cookie);
                        }
                }

                // Send in this object, and get a hold of the common data, like the classes
                // needed to render the homepage correctly and such
                output_data = TemplateUtils.GET_COMMON_DATA(output_data, current_page, jsFilesList, extrasList, null,
                                request);

                // Write the template out
                TemplateUtils.writeOutTemplateData(page_title, template, response, output_data);
        }

        @Override
        protected void doGet(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                processRequest(request, response);
        }

        @Override
        protected void doPost(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                processRequest(request, response);
        }

}
