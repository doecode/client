package gov.osti.doecode.pagemappings;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
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

public class Errors extends HttpServlet {

     private Logger log = LoggerFactory.getLogger(Errors.class.getName());

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          String URI = request.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");

          String page_title = "";
          String template = "";
          ObjectNode output_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);

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
                    output_data.put("message", StringUtils.isNotBlank(error_msg) ? error_msg : "An error has occurred");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

                    break;
          }

          output_data = TemplateUtils.GET_COMMON_DATA(false, output_data, "", new ArrayNode(JsonObjectUtils.FACTORY_INSTANCE), request);
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
