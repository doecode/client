/*
     Think of this class as a switchboard. It looks at any url mapped to it, and determines what that URL is, and loads up an appropriate 
 */
package gov.osti.doecode.pagemappings;

import com.eclipsesource.json.Json;
import com.eclipsesource.json.JsonArray;
import com.eclipsesource.json.JsonObject;
import gov.osti.doecode.entity.SearchFunctions;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.TemplateUtils;
import java.io.IOException;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringUtils;
import org.apache.http.HttpStatus;

public class Dissemination extends HttpServlet {

     protected Logger log = Logger.getLogger(Dissemination.class.getName());

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {

          String URI = request.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/doecode");

          String page_title = "";
          String template = "";
          String current_page = "";
          JsonObject output_data = new JsonObject();
          JsonArray jsFilesList = new JsonArray();
          boolean isHomepage = false;

          /*Determine what page we're on, and load the appropriate title, template, etc*/
          if (remaining.equals("") || remaining.equals("/")) {//HOMEPAGE
               isHomepage = true;
               page_title = "DOE CODE: Your software services platform and search tool to easily submit, announce, and discover code funded by the U.S. Department of Energy";
               template = TemplateUtils.TEMPLATE_HOMEPAGE;

          } else if (remaining.equals("/projects")) {
               page_title = "DOE CODE: Projects";
               template = TemplateUtils.TEMPLATE_PROJECTS_PAGE;
               current_page = TemplateUtils.PAGE_PROJECTS;

          } else if (remaining.equals("/repository-services")) {
               page_title = "DOE CODE: Repository Services";
               template = TemplateUtils.TEMPLATE_REPOSITORY_SERVICES_PAGE;
               current_page = TemplateUtils.PAGE_REPOSITORY_SERVICES;

          } else if (remaining.equals("/about")) {
               page_title = "DOE CODE: About";
               template = TemplateUtils.TEMPLATE_ABOUT_PAGE;
               current_page = TemplateUtils.PAGE_ABOUT;

          } else if (remaining.equals("/policy")) {
               page_title = "DOE CODE: Policy";
               template = TemplateUtils.TEMPLATE_POLICY_PAGE;
               current_page = TemplateUtils.PAGE_POLICY;

          } else if (remaining.equals("/news-resources")) {
               page_title = "DOE CODE: News Resources";
               template = TemplateUtils.TEMPLATE_NEWS_RESOURCES_PAGE;
               current_page = TemplateUtils.PAGE_NEWS_RESOURCES;

          } else if (remaining.equals("/faq")) {
               page_title = "DOE CODE: FAQ's";
               template = TemplateUtils.TEMPLATE_FAQ_PAGE;
               current_page = TemplateUtils.PAGE_FAQ;

          } else if (remaining.startsWith("/results")) {
               page_title = "DOE CODE: Search Results";
               template = TemplateUtils.TEMPLATE_SEARCH_RESULTS_PAGE;
               String page_num_param = request.getParameter("page");
               long page_num = StringUtils.isNumeric(page_num_param) ? Long.parseLong(page_num_param) : 1;
               output_data = SearchFunctions.conductSearch(request, getServletContext(), page_num);
               jsFilesList.add("libraries/google-chart-loader.min");

          } else if (remaining.equals("/search")) {
               page_title = "DOE CODE: Advanced Search";
               template = TemplateUtils.TEMPLATE_ADVANCED_SEARCH;
               output_data.add("adv_search_lists", SearchFunctions.getAdvancedSearchPageLists(getServletContext()));

          } else if (remaining.trim().startsWith("/biblio/")) {
               page_title = "DOE CODE: Project Metadata";
               template = TemplateUtils.TEMPLATE_BIBLIO_PAGE;

               if (DOECODEUtils.isValidLong(remaining.replace("/biblio/", ""))) {
                    long code_id = Long.parseLong(remaining.replace("/biblio/", ""));
                    JsonObject biblio_data = SearchFunctions.getBiblioData(code_id, getServletContext());

                    //If, and only if, this is a valid code id
                    if (biblio_data.getBoolean("is_valid", false)) {
                         jsFilesList.add("libraries/clipboard.min");
                         output_data = biblio_data;

                    } else {
                         output_data.add("is_invalid_code_id", true);
                         response.setStatus(HttpStatus.SC_NOT_FOUND);

                    }
               } else {
                    output_data.add("is_invalid_code_id", true);
                    response.setStatus(HttpStatus.SC_NOT_FOUND);
               }

          } else if (remaining.equals("/forbidden")) {
               page_title = "DOE CODE: Forbidden Access";
               template = TemplateUtils.TEMPLATE_FORBIDDEN_PAGE;

          } else if (remaining.equals("/security-hosting")) {
               page_title = "DOE CODE: Security Hosting";
               template = TemplateUtils.TEMPLATE_SECURITY_HOSTING_PAGE;

          } else if (remaining.equals("/disclaimer")) {
               page_title = "DOE CODE: Disclaimer";
               template = TemplateUtils.TEMPLATE_DISCLAIMER_PAGE;

          } else if (remaining.equals("/contact")) {
               page_title = "DOE CODE: Contact Us";
               template = TemplateUtils.TEMPLATE_CONTACT_PAGE;
          }

          //Add the common dissemination js file
          jsFilesList.add("dissemination");

          //Check if they're logged in, and only do something if they're not logged in
          if (!UserFunctions.isUserLoggedIn(request)) {
               output_data.add("user_data", Json.object());
          } else {
               //Increment time
               response.addCookie(UserFunctions.updateUserSessionTimeout(request));
          }

          //Send in this object, and get a hold of the common data, like the classes needed to render the homepage correctly and such
          output_data = TemplateUtils.GET_COMMON_DATA(isHomepage, output_data, current_page, jsFilesList, request);

          //Write the template out
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
