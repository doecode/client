package gov.osti.doecode.pagemappings;

import com.eclipsesource.json.JsonArray;
import com.eclipsesource.json.JsonObject;
import gov.osti.doecode.entity.InputFunctions;
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

/**
 *
 * @author smithwa
 */
public class Input extends HttpServlet {

     private Logger log = Logger.getLogger(Input.class.getName());

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          String URI = request.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/doecode/");
          String site_url = getServletConfig().getServletContext().getInitParameter("site_url");
          String page_title = "";
          String template = "";
          String current_page = "";
          JsonObject output_data = new JsonObject();
          JsonArray jsFilesList = new JsonArray();
          boolean is_inputjs = false;
          boolean is_accordion = false;

          boolean is_logged_in = UserFunctions.isUserLoggedIn(request);

          if (!is_logged_in) {
               UserFunctions.redirectUserToLogin(request, response, site_url);
          } else {
               //Increment time
               response.addCookie(UserFunctions.updateUserSessionTimeout(request));
          }

          if (remaining.equals("submit")) {
               String code_id = request.getParameter("code_id");
               output_data = InputFunctions.getInputFormLists(getServletContext());

               page_title = "DOE CODE: Submit";
               template = TemplateUtils.TEMPLATE_INPUT_FORM;
               output_data.add("page", "submit");
               output_data.add("page_req_id", "sub");
               if (StringUtils.isNotBlank(code_id)) {
                    output_data.add("page_message", "Editing Software Project #" + code_id);
                    output_data.add("code_id", code_id);
               } else {
                    output_data.add("page_message", "Submit a New Software Project");
               }
               output_data.add("show_optional_toggle", true);
               current_page = TemplateUtils.PAGE_PROJECTS;
               is_inputjs = true;
               is_accordion = true;

          } else if (remaining.startsWith("announce")) {
               String code_id = request.getParameter("code_id");
               output_data = InputFunctions.getInputFormLists(getServletContext());

               page_title = "Announce";
               template = TemplateUtils.TEMPLATE_INPUT_FORM;
               output_data.add("page", "announce");
               output_data.add("page_req_id", "announ");
               if (StringUtils.isNotBlank(code_id)) {
                    output_data.add("page_message", "Editing Software Project #" + code_id);
                    output_data.add("code_id", code_id);
               } else {
                    output_data.add("page_message", "Submit a New Software Project");
               }
               output_data.add("show_optional_toggle", false);
               is_inputjs = true;
               current_page = TemplateUtils.PAGE_PROJECTS;

          } else if (remaining.startsWith("approve")) {
               String code_id = request.getParameter("code_id");
               output_data = InputFunctions.getInputFormLists(getServletContext());

               page_title = "Announce";
               template = TemplateUtils.TEMPLATE_INPUT_FORM;
               output_data.add("page", "approve");
               output_data.add("page_req_id", "announ");
               if (StringUtils.isNotBlank(code_id)) {
                    output_data.add("page_message", "Approving Software Project #" + code_id);
                    output_data.add("code_id", code_id);
               } else {
                    output_data.add("page_message", "Submit a New Software Project");
               }
               output_data.add("show_optional_toggle", false);
               is_inputjs = true;
               current_page = TemplateUtils.PAGE_PROJECTS;

          } else if (remaining.startsWith("confirm")) {
               String code_id = request.getParameter("code_id");
               String workflow = request.getParameter("workflow");
               String minted_doi = request.getParameter("mintedDoi");
               jsFilesList.add("input-other");

               boolean is_submitted = false;
               //Template
               template = TemplateUtils.TEMPLATE_CONFIRMATION_PAGE;
               //Action phrase
               String action_phrase = "";
               switch (workflow) {
                    case "submitted":
                         action_phrase = "Project Successfully Submitted to DOE CODE";
                         page_title = "Project Successfully Submitted to DOE CODE";
                         is_submitted = true;
                         break;
                    case "announced":
                         action_phrase = "Project Successfully Announced to E-Link";
                         page_title = "Project Successfully Announced to E-Link";
                         break;
               }
               output_data.add("is_submitted", is_submitted);
               output_data.add("action_phrase", action_phrase);
               output_data.add("code_id", code_id);
               //Minted doi
               output_data.add("minted_doi", minted_doi);
               output_data.add("has_minted_doi", StringUtils.isNotBlank(minted_doi));

               //Get some json for the page
               JsonArray availabilityList = new JsonArray();
               try {
                    availabilityList = DOECODEUtils.getJsonList(getServletContext().getRealPath("./json") + "/" + DOECODEUtils.AVAILABILITIES_LIST_JSON, DOECODEUtils.AVAILABILITIES_LIST_JSON_KEY);
                    output_data.add("availabilities_list_json", availabilityList.toString());
               } catch (Exception e) {
               }
               current_page = TemplateUtils.PAGE_PROJECTS;
          } else if (remaining.startsWith("projects")) {
               page_title = "DOE CODE: Projects";
               template = TemplateUtils.TEMPLATE_MY_PROJECTS;
               current_page = TemplateUtils.PAGE_PROJECTS;
               jsFilesList.add("input-other");
          } else if (remaining.startsWith("pending")) {
               page_title = "DOE CODE: Pending";
               template = TemplateUtils.TEMPLATE_PENDING_APPROVAL;
               current_page = TemplateUtils.PAGE_PROJECTS;
               jsFilesList.add("input-other");
          }

          //These js files are needed on all input pages
          jsFilesList.add("libraries/jquery.dataTables.min");
          jsFilesList.add("libraries/dataTables.responsive.min");
          //Only on the input form (Not on the projects or pending pages)
          if (is_inputjs) {
               jsFilesList = getInputFormJsFiles(jsFilesList);
          }

          //We'll set whether or not this is a collection of collapsible panels 
          output_data.add("is_accordion", true);
          //get common data, like the classes needed for the header and footer
          output_data = TemplateUtils.GET_COMMON_DATA(false, output_data, current_page, jsFilesList, request);

          //Write it out
          TemplateUtils.writeOutTemplateData(page_title, template, response, output_data);
     }

     private JsonArray getInputFormJsFiles(JsonArray array) {
          JsonArray return_data = array;
          //We need this js file for various input type things 
          return_data.add("libraries/mobx.umd-3.3.1");
          return_data.add("libraries/validator.min-9.1.1");
          return_data.add("libraries/libphonenumber-js.min-0.4.39");
          return_data.add("libraries/dropzone-5.2.0-IEfix.min"); // NOTE: custom "handlefiles" function fix for IE issue.  Test in IE if library is updated.
          return_data.add("utils/Validation");
          return_data.add("stores/MetadataStore");
          return_data.add("stores/BaseData");
          return_data.add("stores/Contributor");
          return_data.add("stores/Developer");
          return_data.add("stores/SponsoringOrganization");
          return_data.add("stores/ResearchOrganization");
          return_data.add("stores/ContributingOrganization");
          return_data.add("stores/RelatedIdentifier");
          return_data.add("stores/Metadata");

          return_data.add("input");
          return return_data;
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
