package gov.osti.doecode.pagemappings;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.DOECODEJson;
import gov.osti.doecode.entity.InputFunctions;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonObjectUtils;
import gov.osti.doecode.utils.TemplateUtils;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author smithwa
 */
public class Input extends HttpServlet {

     private Logger log = LoggerFactory.getLogger(Input.class.getName());

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          request.setCharacterEncoding("UTF-8");
          String URI = request.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");
          String site_url = Init.site_url;
          String page_title = "";
          String template = "";
          String current_page = "";

          ObjectNode output_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          ArrayNode jsFilesList = new ArrayNode(JsonObjectUtils.FACTORY_INSTANCE);
          ArrayNode cssFilesList = new ArrayNode(JsonObjectUtils.FACTORY_INSTANCE);
          boolean is_inputjs = false;
          boolean is_accordion = false;

          //Software type param
          String software_type_param = request.getParameter("software_type");

          //Default, if invalid type
          if (StringUtils.isBlank(software_type_param) || !(software_type_param.equalsIgnoreCase("Scientific") || software_type_param.equalsIgnoreCase("Business"))) {
               software_type_param = "Scientific";
          }

          //Some of the option steps, and whether or not we should hide them
          boolean show_optional_toggle = false;

          boolean is_logged_in = UserFunctions.isUserLoggedIn(request);

          if (!is_logged_in) {
               UserFunctions.redirectUserToLogin(request, response, site_url);
               return;
          } else {
               //Increment time
               response.addCookie(UserFunctions.updateUserSessionTimeout(request));
          }

          if (remaining.equals("submit")) {
               String code_id = request.getParameter("code_id");
               output_data = InputFunctions.getInputFormLists(getServletContext());
               cssFilesList.add("DataTables-1.10.16/css/jquery.dataTables.min");
               cssFilesList.add("Responsive-2.2.0/css/responsive.dataTables.min");

               page_title = "DOE CODE: Submit";
               template = TemplateUtils.TEMPLATE_INPUT_FORM;
               output_data.put("page", "submit");
               output_data.put("page_req_id", "sub");
               if (StringUtils.isNotBlank(code_id)) {
                    output_data.put("page_message", "Editing Software Project #" + code_id);
                    output_data.put("code_id", code_id);
               } else {
                    output_data.put("page_message", "Submit a New Software Project");
               }

               output_data.put("relation_type", DOECODEServletContextListener.getJsonList(DOECODEJson.RELATION_TYPES_KEY));

               //Toggle everything to not be shown, since we're on the submit page
               show_optional_toggle = true;

               current_page = TemplateUtils.PAGE_PROJECTS;
               is_inputjs = true;
               is_accordion = true;

          } else if (remaining.startsWith("announce")) {
               String code_id = request.getParameter("code_id");
               output_data = InputFunctions.getInputFormLists(getServletContext());
               cssFilesList.add("DataTables-1.10.16/css/jquery.dataTables.min");
               cssFilesList.add("Responsive-2.2.0/css/responsive.dataTables.min");

               page_title = "Announce";
               template = TemplateUtils.TEMPLATE_INPUT_FORM;
               output_data.put("page", "announce");
               output_data.put("page_req_id", "announ");
               if (StringUtils.isNotBlank(code_id)) {
                    output_data.put("page_message", "Editing Software Project #" + code_id);
                    output_data.put("code_id", code_id);
               } else {
                    output_data.put("page_message", "Submit a New Software Project");
               }

               output_data.put("relation_type", DOECODEServletContextListener.getJsonList(DOECODEJson.RELATION_TYPES_KEY));

               is_inputjs = true;
               current_page = TemplateUtils.PAGE_PROJECTS;

          } else if (remaining.startsWith("approve")) {
               String code_id = request.getParameter("code_id");
               output_data = InputFunctions.getInputFormLists(getServletContext());
               cssFilesList.add("DataTables-1.10.16/css/jquery.dataTables.min");
               cssFilesList.add("Responsive-2.2.0/css/responsive.dataTables.min");

               page_title = "Announce";
               template = TemplateUtils.TEMPLATE_INPUT_FORM;
               output_data.put("page", "approve");
               output_data.put("page_req_id", "announ");
               if (StringUtils.isNotBlank(code_id)) {
                    output_data.put("page_message", "Approving Software Project #" + code_id);
                    output_data.put("code_id", code_id);
               } else {
                    output_data.put("page_message", "Submit a New Software Project");
               }
               output_data.put("show_owner_message", true);

               output_data.put("relation_type", DOECODEServletContextListener.getJsonList(DOECODEJson.RELATION_TYPES_KEY));
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
               output_data.put("is_submitted", is_submitted);
               output_data.put("action_phrase", action_phrase);
               output_data.put("code_id", code_id);

               //Minted doi
               output_data.put("minted_doi", minted_doi);
               output_data.put("has_minted_doi", StringUtils.isNotBlank(minted_doi));

               //Get some json for the page
               ArrayNode availabilityList = DOECODEServletContextListener.getJsonList(DOECODEJson.AVAILABILITY_KEY);
               output_data.put("availabilities_list_json", availabilityList.toString());

               output_data.put("relation_type", DOECODEServletContextListener.getJsonList(DOECODEJson.RELATION_TYPES_KEY));

               current_page = TemplateUtils.PAGE_PROJECTS;
          } else if (remaining.startsWith("projects")) {
               page_title = "DOE CODE: Projects";
               template = TemplateUtils.TEMPLATE_MY_PROJECTS;
               current_page = TemplateUtils.PAGE_PROJECTS;
               jsFilesList.add("input-other");
               cssFilesList.add("DataTables-1.10.16/css/jquery.dataTables.min");
               cssFilesList.add("Responsive-2.2.0/css/responsive.dataTables.min");

          } else if (remaining.startsWith("pending")) {
               page_title = "DOE CODE: Pending";
               template = TemplateUtils.TEMPLATE_PENDING_APPROVAL;
               current_page = TemplateUtils.PAGE_PROJECTS;
               jsFilesList.add("input-other");
               cssFilesList.add("DataTables-1.10.16/css/jquery.dataTables.min");
               cssFilesList.add("Responsive-2.2.0/css/responsive.dataTables.min");

          } else if (remaining.equals("form-select")) {
               page_title = "DOE CODE: Form Select";
               template = TemplateUtils.TEMPLATE_FORM_SELECT;
               current_page = TemplateUtils.PAGE_PROJECTS;
               jsFilesList.add("input-other");

          }

          //Add all of the hide/shows for the panels
          output_data.put("show_optional_toggle", show_optional_toggle);

          output_data.put("software_type", software_type_param.substring(0, 1).toUpperCase());

          //These js files are needed on all input pages
          jsFilesList.add("libraries/jquery.dataTables.min");
          jsFilesList.add("libraries/dataTables.responsive.min");
          //Only on the input form (Not on the projects or pending pages)
          if (is_inputjs) {
               jsFilesList = getInputFormJsFiles(jsFilesList);
               cssFilesList = getInputFormCssFiles(cssFilesList);
          }

          //We'll set whether or not this is a collection of collapsible panels 
          output_data.put("is_accordion", true);

          log.info("OUtput data: " + output_data);
          //get common data, like the classes needed for the header and footer
          output_data = TemplateUtils.GET_COMMON_DATA(output_data, current_page, jsFilesList, cssFilesList, request);

          //Write it out
          TemplateUtils.writeOutTemplateData(page_title, template, response, output_data);
     }

     private ArrayNode getInputFormJsFiles(ArrayNode array) {
          ArrayNode return_data = array;
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

     private ArrayNode getInputFormCssFiles(ArrayNode array) {
          ArrayNode return_data = array;
          return_data.add("dropzone/basic.min");
          return_data.add("dropzone/dropzone.min");

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
