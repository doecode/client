package gov.osti.doecode.pagemappings;

import com.eclipsesource.json.JsonArray;
import com.eclipsesource.json.JsonObject;
import gov.osti.doecode.utils.TemplateUtils;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang.StringUtils;

public class Errors extends HttpServlet {
     private Logger log = Logger.getLogger(Errors.class.getName());

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          String URI = request.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/doecode/");

          String page_title = "";
          String template = "";
          JsonObject output_data = new JsonObject();

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
                    output_data.add("message", StringUtils.isNotBlank(error_msg) ? error_msg : "An error has occurred");
                    response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);

                    break;
          }
          
          output_data = TemplateUtils.GET_COMMON_DATA(false, output_data, "", new JsonArray(), request);
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
