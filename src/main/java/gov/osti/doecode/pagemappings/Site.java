package gov.osti.doecode.pagemappings;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonObjectUtils;
import gov.osti.doecode.utils.TemplateUtils;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

public class Site extends HttpServlet {

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          request.setCharacterEncoding("UTF-8");
          String URI = request.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");

          String page_title = "";
          String template = "";
          ObjectNode output_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          ArrayNode jsFilesList = new ArrayNode(JsonObjectUtils.FACTORY_INSTANCE);

          switch (remaining) {
               case "site-admin":
                    page_title = "DOE CODE: Site Administration";
                    template = TemplateUtils.TEMPLATE_SITE_ADMIN;
                    break;
               case "poc-admin":
                    page_title = "DOECODE: Point of Contact Administration";
                    template = TemplateUtils.TEMPLATE_POC_ADMIN;
                    break;
          }
          
          jsFilesList.add("site");
          output_data = TemplateUtils.GET_COMMON_DATA(output_data, "", jsFilesList, null, request);
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
