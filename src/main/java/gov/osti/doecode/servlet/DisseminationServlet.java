package gov.osti.doecode.servlet;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.SearchFunctions;
import gov.osti.doecode.utils.JsonUtils;
import java.io.IOException;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DisseminationServlet extends HttpServlet {

     private Logger log = LoggerFactory.getLogger(DisseminationServlet.class);

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          String remaining = StringUtils.substringAfterLast(request.getRequestURI(), "/" + Init.app_name + "/dissemination/");

          if (remaining.equals("export-search-results")) {
               String format = StringUtils.defaultIfBlank(request.getParameter("format"), "json");
               //Get search results
               ObjectNode search_request_data = SearchFunctions.createPostDataObj(request, 0, 2000);
               ObjectNode search_result_data = new ObjectNode(JsonUtils.INSTANCE);

               try {
                    String result = SearchFunctions.getRawSearchResultData(Init.backend_api_url, search_request_data);
                    if (JsonUtils.isValidObjectNode(result)) {
                         search_result_data = JsonUtils.parseObjectNode(result);
                    }
               } catch (Exception e) {
                    log.error("Exception in getting exported search results: " + e.getMessage());
               }

               log.info(search_result_data.toString());
               ServletOutputStream out = response.getOutputStream();
               //Format search results data
               switch (format) {
                    case "excel":
                         response.setContentType("application/vnd.ms-excel");
                         response.setHeader("Expires", "0");
                         response.setHeader("Content-Disposition", "attachment; filename=Search-Results.xls");
                         
                         out.flush();
                         out.close();
                         break;
                    case "csv":
                         response.setContentType("text/csv");
                         response.setHeader("Content-Disposition","attachment; filename=Search-results.csv");
                         break;
                    default:
                         response.setContentType("application/json");
                         response.setHeader("Content-Disposition", "attachment; filename=Search-results.json");
                         PrintWriter p = response.getWriter();
                         p.print(search_result_data.toString());
                         p.flush();
                         p.close();
                         break;
               }

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
