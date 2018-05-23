package gov.osti.doecode.servlet;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class UserServlet extends HttpServlet {

     private Logger log = LoggerFactory.getLogger(UserServlet.class);

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          request.setCharacterEncoding("UTF-8");
          log.info("In user servlet");
          String URI = request.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/user/");
          ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);
          ObjectNode request_data = JsonUtils.parseObjectNode(request.getReader());
          boolean add_signin_html = false;
          switch (remaining) {
               case "set-login-status-name":
                    return_data = UserFunctions.setUserDataForCookie(request_data);
                    Cookie last_location = UserFunctions.getOtherUserCookie(request, "requested_url");
                    if (null != last_location) {
                         return_data.put("requested_url", last_location.getValue());
                    }
                    add_signin_html = true;
                    break;
               case "update-login-status-name":
                    return_data = UserFunctions.updateUserCookie(request, request_data);
                    //If this is being called, and there are values for needs_password_reset & passcode, clear them out
                    if (UserFunctions.hasRecentlyDonePasswordReset(request)) {
                         response.addCookie(new Cookie("needs_password_reset", null));
                    }
                    add_signin_html = true;
                    break;
          }
          log.info("User data: " + return_data);
          response.addCookie(UserFunctions.makeUserCookie(return_data));
          if (add_signin_html) {
               return_data.put("signin_html", TemplateUtils.getNewSigninStatusHtml(getServletContext(), request_data));
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
