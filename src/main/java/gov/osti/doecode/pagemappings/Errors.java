package gov.osti.doecode.pagemappings;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;

import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;

@WebServlet(urlPatterns = { "/page-not-found", "/error" })
public class Errors extends HttpServlet {

        private static final long serialVersionUID = 5788017362238476487L;

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                String URI = request.getRequestURI();
                String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");

                String page_title = "";
                String template = "";
                ObjectNode output_data = new ObjectNode(JsonUtils.INSTANCE);

                switch (remaining) {
                case "page-not-found":
                        page_title = "Page Not Found";
                        template = TemplateUtils.TEMPLATE_404_PAGE;
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);

                        break;
                default:
                        page_title = "Error Page";
                        template = TemplateUtils.TEMPLATE_ERROR_PAGE;
                        String error_msg = request.getParameter("message");
                        output_data.put("message",
                                        StringUtils.isNotBlank(error_msg) ? error_msg : "An error has occurred");
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

                        break;
                }

                output_data = TemplateUtils.GET_COMMON_DATA(output_data, "", JsonUtils.MAPPER.createArrayNode(),
                                JsonUtils.MAPPER.createArrayNode(), null, request);
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
