package gov.osti.doecode.pagemappings;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.SitesFunctions;
import gov.osti.doecode.entity.UserFunctions;

import org.apache.commons.lang3.StringUtils;

import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;
import javax.servlet.annotation.WebServlet;

@WebServlet(urlPatterns = {"/site-admin"})
public class Site extends HttpServlet {

    private static final long serialVersionUID = 9211014467465771916L;

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String URI = request.getRequestURI();
        String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");

        String page_title = "";
        String template = "";
        ObjectNode output_data = JsonUtils.MAPPER.createObjectNode();
        ArrayNode jsFilesList = JsonUtils.MAPPER.createArrayNode();

        ObjectNode current_user = UserFunctions.getUserDataFromCookie(request);
        //Get xsrf token
        String xsrfToken = current_user.findPath("xsrfToken").asText("");
        String accessToken = UserFunctions.getOtherUserCookieValue(request, "accessToken");

        switch (remaining) {
            case "site-admin":
                page_title = "DOE CODE: Site Administration";
                template = TemplateUtils.TEMPLATE_SITE_ADMIN;
                output_data = SitesFunctions.getSitesList(xsrfToken, accessToken);
                break;
        }

        jsFilesList.add("site");
        output_data = TemplateUtils.GET_COMMON_DATA(output_data, "", jsFilesList, null, null, request);
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
