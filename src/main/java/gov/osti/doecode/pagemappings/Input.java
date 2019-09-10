package gov.osti.doecode.pagemappings;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;

import gov.osti.doecode.entity.DOECODEJson;
import gov.osti.doecode.entity.InputFunctions;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;

@WebServlet(urlPatterns = {"/submit", "/form-select", "/announce", "/approve", "/confirm", "/projects", "/pending"})
public class Input extends HttpServlet {

    private static final long serialVersionUID = -557715523485856278L;

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String URI = request.getRequestURI();
        String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");
        String page_title = "";
        String template = "";
        String current_page = "";

        ObjectNode output_data = JsonUtils.MAPPER.createObjectNode();
        ArrayNode jsFilesList = JsonUtils.MAPPER.createArrayNode();
        ArrayNode extraJSList = JsonUtils.MAPPER.createArrayNode();
        ArrayNode cssFilesList = JsonUtils.MAPPER.createArrayNode();
        boolean is_inputjs = false;

        // Software type param
        String software_type_param = request.getParameter("software_type");

        // Default, if invalid type
        if (StringUtils.isBlank(software_type_param) || !(software_type_param.equalsIgnoreCase("Scientific") || software_type_param.equalsIgnoreCase("Business"))) {
            software_type_param = "Scientific";
        }

        // Some of the option steps, and whether or not we should hide them
        boolean show_optional_toggle = true;
        //TODO put in check to ensure that if they are submitting or editing, and it's not a record for their site, and they're not a record admin, send them to the forbidden page
        if (remaining.equals("submit")) {
            String code_id = request.getParameter("code_id");
            String load_id = request.getParameter("load_id");
            String version_type = request.getParameter("version_type");
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

            } else if (StringUtils.isNotBlank(load_id)) {
                String version_type_display = StringUtils.equals(version_type, "Prev") ? "Previous" : "New";
                output_data.put("page_message", version_type_display + " Version of Project #" + load_id);
                output_data.put("load_id", load_id);
                output_data.put("version_type", version_type);
                show_optional_toggle = false;

            } else {
                output_data.put("page_message", "Submit a New Software Project");

            }

            output_data.set("programming_languages_list", DOECODEServletContextListener.getJsonList(DOECODEJson.PROGRAMMING_LANGUAGES_KEY));
            output_data.set("relation_type", DOECODEServletContextListener.getJsonList(DOECODEJson.RELATION_TYPES_KEY));
            output_data.set("project_keywords_list", DOECODEServletContextListener.getJsonList(DOECODEJson.PROJECT_KEYWORDS_KEY));

            current_page = TemplateUtils.PAGE_PROJECTS;
            is_inputjs = true;

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

            output_data.set("programming_languages_list", DOECODEServletContextListener.getJsonList(DOECODEJson.PROGRAMMING_LANGUAGES_KEY));
            output_data.set("relation_type", DOECODEServletContextListener.getJsonList(DOECODEJson.RELATION_TYPES_KEY));
            output_data.set("project_keywords_list", DOECODEServletContextListener.getJsonList(DOECODEJson.PROJECT_KEYWORDS_KEY));

            is_inputjs = true;
            current_page = TemplateUtils.PAGE_PROJECTS;

        } else if (remaining.startsWith("approve")) {
            String code_id = request.getParameter("code_id");
            output_data = InputFunctions.getInputFormLists(getServletContext());
            cssFilesList.add("DataTables-1.10.16/css/jquery.dataTables.min");
            cssFilesList.add("Responsive-2.2.0/css/responsive.dataTables.min");

            page_title = "Approve";
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

            output_data.set("programming_languages_list", DOECODEServletContextListener.getJsonList(DOECODEJson.PROGRAMMING_LANGUAGES_KEY));
            output_data.set("relation_type", DOECODEServletContextListener.getJsonList(DOECODEJson.RELATION_TYPES_KEY));
            output_data.set("project_keywords_list", DOECODEServletContextListener.getJsonList(DOECODEJson.PROJECT_KEYWORDS_KEY));
            is_inputjs = true;
            current_page = TemplateUtils.PAGE_PROJECTS;

        } else if (remaining.startsWith("confirm")) {
            String code_id = request.getParameter("code_id");
            String workflow = request.getParameter("workflow");
            String minted_doi = request.getParameter("mintedDoi");
            jsFilesList.add("input-other");

            boolean is_submitted = false;
            // Template
            template = TemplateUtils.TEMPLATE_CONFIRMATION_PAGE;
            // Action phrase
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

            // Minted doi
            output_data.put("minted_doi", minted_doi);
            output_data.put("has_minted_doi", StringUtils.isNotBlank(minted_doi));

            // Get some json for the page
            ArrayNode availabilityList = DOECODEServletContextListener.getJsonList(DOECODEJson.AVAILABILITY_KEY);
            output_data.put("availabilities_list_json", availabilityList.toString());

            output_data.set("relation_type", DOECODEServletContextListener.getJsonList(DOECODEJson.RELATION_TYPES_KEY));

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

        // Add all of the hide/shows for the panels
        output_data.put("show_optional_toggle", show_optional_toggle);

        output_data.put("software_type", software_type_param.substring(0, 1).toUpperCase());

        // These js files are needed on all input pages
        extraJSList.add("libraries/jquery.dataTables.min");
        extraJSList.add("libraries/dataTables.responsive.min");
        // Only on the input form (Not on the projects or pending pages)
        if (is_inputjs) {
            extraJSList.add("libraries/mobx.umd-3.3.1");
            extraJSList.add("libraries/validator.min-9.1.1");
            extraJSList.add("libraries/libphonenumber-js.min");
            extraJSList.add("libraries/dropzone-5.2.0-IEfix.min"); // NOTE: custom "handlefiles" function
            // fix for IE issue. Test in IE if
            // library is updated.
            extraJSList.add("utils/Validation");
            extraJSList.add("stores/MetadataStore");
            extraJSList.add("stores/BaseData");
            extraJSList.add("stores/Contributor");
            extraJSList.add("stores/Developer");
            extraJSList.add("stores/SponsoringOrganization");
            extraJSList.add("stores/ResearchOrganization");
            extraJSList.add("stores/ContributingOrganization");
            extraJSList.add("stores/RelatedIdentifier");
            extraJSList.add("stores/Metadata");
            jsFilesList.add("input");

            cssFilesList = getInputFormCssFiles(cssFilesList);
        }

        // We'll set whether or not this is a collection of collapsible panels
        output_data.put("is_accordion", true);
        output_data.put("is_logged_in_user_an_admin", UserFunctions.isCurrentlyLoggedInUserAnAdmin(request));

        // get common data, like the classes needed for the header and footer
        output_data = TemplateUtils.GET_COMMON_DATA(output_data, current_page, jsFilesList, extraJSList, cssFilesList, request);

        // Write it out
        TemplateUtils.writeOutTemplateData(page_title, template, response, output_data);
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
