package gov.osti.doecode.servlet;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

@WebServlet(name = "InputServlet", urlPatterns = {"/input-servlet/metadata/projects"})
public class InputServlet extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String remaining = StringUtils.substringAfterLast(request.getRequestURI(), "/" + Init.app_name + "/input-servlet/");

        ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);

        switch (remaining) {
            case "metadata/projects":
                return_data = DOECODEUtils.makeAuthenticatedGetAjaxRequest(Init.backend_api_url + "metadata/projects", request, response);
                
                break;
        }
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
