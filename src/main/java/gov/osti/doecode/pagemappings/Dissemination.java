/*
     Think of this class as a switchboard. It looks at any url mapped to it, and determines what that URL is, and loads up an appropriate 
 */
package gov.osti.doecode.pagemappings;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.NewsFunctions;
import gov.osti.doecode.entity.SearchFunctions;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@WebServlet(urlPatterns = {"/Index", "/repository-service", "/about", "/policy", "/resources", "/news", "/FAQs",
    "/results", "/search", "/biblio/*", "/forbidden", "/security-hosting", "/contact"})
public class Dissemination extends HttpServlet {

    private static final long serialVersionUID = 282315618723126267L;

    protected Logger log = LoggerFactory.getLogger(Dissemination.class.getName());

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String URI = request.getRequestURI();
        String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name);

        String page_title = "";
        String template = "";
        String current_page = "";
        ObjectNode output_data = JsonUtils.MAPPER.createObjectNode();
        ArrayNode jsFilesList = JsonUtils.MAPPER.createArrayNode();
        ArrayNode extrasList = JsonUtils.MAPPER.createArrayNode();

        /*
                 * Determine what page we're on, and load the appropriate title, template, etc
         */
        if (remaining.equals("") || remaining.equals("/")) {// HOMEPAGE
            page_title = "DOE CODE: Your software services platform and search tool to easily submit, announce, and discover code funded by the U.S. Department of Energy";
            template = TemplateUtils.TEMPLATE_HOMEPAGE;
            output_data.put("is_homepage", true);

        } else if (remaining.equals("/projects")) {
            page_title = "DOE CODE: Projects";
            template = TemplateUtils.TEMPLATE_PROJECTS_PAGE;
            current_page = TemplateUtils.PAGE_PROJECTS;

        } else if (remaining.equals("/repository-service")) {
            page_title = "DOE CODE: Repository Service";
            template = TemplateUtils.TEMPLATE_REPOSITORY_SERVICE_PAGE;
            current_page = TemplateUtils.PAGE_REPOSITORY_SERVICE;

        } else if (remaining.equals("/about")) {
            page_title = "DOE CODE: About";
            template = TemplateUtils.TEMPLATE_ABOUT_PAGE;
            current_page = TemplateUtils.PAGE_ABOUT;

        } else if (remaining.equals("/policy")) {
            page_title = "DOE CODE: Policy";
            template = TemplateUtils.TEMPLATE_POLICY_PAGE;
            current_page = TemplateUtils.PAGE_POLICY;

        } else if (remaining.equals("/resources")) {
            page_title = "DOE CODE: Resources";
            template = TemplateUtils.TEMPLATE_RESOURCES_PAGE;
            current_page = TemplateUtils.PAGE_RESOURCES;
            output_data.put("api_url", Init.public_api_url);

        } else if (remaining.equals("/news")) {
            page_title = "DOE CODE: News";
            template = TemplateUtils.TEMPLATE_NEWS_PAGE;
            current_page = TemplateUtils.PAGE_NEWS;
            //Get the params
            String article_type_query = StringUtils.defaultIfBlank(request.getParameter("articletype"), "");
            String year_query = StringUtils.defaultIfBlank(request.getParameter("year"), "");
            output_data = NewsFunctions.getNewsPageJson(article_type_query, year_query);

        } else if (remaining.equals("/FAQs")) {
            page_title = "DOE CODE: FAQs";
            template = TemplateUtils.TEMPLATE_FAQ_PAGE;
            current_page = TemplateUtils.PAGE_FAQ;
            output_data.put("api_url", Init.public_api_url);

        } else if (remaining.startsWith("/results")) {
            page_title = "DOE CODE: Search Results";
            template = TemplateUtils.TEMPLATE_SEARCH_RESULTS_PAGE;
            String page_num_param = request.getParameter("page");
            long page_num = StringUtils.isNumeric(page_num_param) ? Long.parseLong(page_num_param) : 1;
            output_data = SearchFunctions.conductSearch(request, getServletContext(), page_num);
            //Check the user agent. If it's of a specific type, we'll treat the page a little differently
            boolean is_pagespeed_insights = false;
            try {
                String userAgent = request.getHeader("User-Agent");
                is_pagespeed_insights = StringUtils.containsIgnoreCase(userAgent, "Chrome-Lighthouse") || StringUtils.containsIgnoreCase(userAgent, "Page Speed Insights");
            } catch (Exception e) {
                log.error("Exception in getting user agent: " + e.getMessage());
            }
            if (!is_pagespeed_insights) {
                extrasList.add("libraries/google-chart-loader.min");
            }
            output_data.put("is_pagespeed_insights", is_pagespeed_insights);
        } else if (remaining.equals("/search")) {
            page_title = "DOE CODE: Advanced Search";
            template = TemplateUtils.TEMPLATE_ADVANCED_SEARCH;

        } else if (remaining.trim().startsWith("/biblio/")) {
            template = TemplateUtils.TEMPLATE_BIBLIO_PAGE;

            String just_code_id = StringUtils.substringAfterLast(remaining, "/biblio/");
            if (DOECODEUtils.isValidLong(just_code_id)) {
                long code_id = Long.parseLong(just_code_id);
                page_title = "DOE CODE: Project Metadata for Code ID " + code_id;
                ObjectNode biblio_data = SearchFunctions.getBiblioData(code_id);

                // If, and only if, this is a valid code id
                if (biblio_data.findPath("is_valid").asBoolean(false)) {
                    extrasList.add("libraries/clipboard.min");
                    output_data = biblio_data;

                } else {
                    extrasList.add("libraries/clipboard.min");
                    output_data = biblio_data;
                    output_data.put("is_invalid_code_id", true);
                    output_data.put("is_tombstone", biblio_data.findPath("is_tombstone").asBoolean(false));
                    output_data.put("is_restricted", biblio_data.findPath("is_restricted").asBoolean(false));
                    response.setStatus(HttpServletResponse.SC_NOT_FOUND);

                }
            } else {
                output_data.put("is_invalid_code_id", true);
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
            }

        } else if (remaining.equals("/forbidden")) {
            page_title = "DOE CODE: Forbidden Access";
            template = TemplateUtils.TEMPLATE_FORBIDDEN_PAGE;
            String message = StringUtils.defaultIfBlank(request.getParameter("message"), "");
            message = Jsoup.clean(message, Safelist.basic());
            output_data.put("message", message);
            output_data.put("has_message", StringUtils.isNotBlank(message));

        } else if (remaining.equals("/security-hosting")) {
            page_title = "DOE CODE: Security Hosting";
            template = TemplateUtils.TEMPLATE_SECURITY_HOSTING_PAGE;

        } else if (remaining.equals("/contact")) {
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
            output_data.set("user_data", JsonUtils.MAPPER.createObjectNode());
        } else {
            // Increment time
            response.addCookie(UserFunctions.updateUserSessionTimeout(request));
        }

        // Send in this object, and get a hold of the common data, like the classes
        // needed to render the homepage correctly and such
        output_data = TemplateUtils.GET_COMMON_DATA(output_data, current_page, jsFilesList, extrasList, null, request);
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
