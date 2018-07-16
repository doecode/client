package gov.osti.doecode.servlet;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.utils.JsonUtils;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author smithwa
 */
public class UserServlet extends HttpServlet {
     
     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          request.setCharacterEncoding("UTF-8");
          String remaining = StringUtils.substringAfterLast(request.getRequestURI(), "/" + Init.app_name + "/user-data/");
          
          ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);
          
          switch (remaining) {
               case "get-current-user-data":
                    return_data = UserFunctions.getUserDataFromCookie(request);
                    break;
          }
          
          JsonUtils.writeTo(return_data, response);
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
