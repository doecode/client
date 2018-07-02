package gov.osti.doecode.pagemappings;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

public class User extends HttpServlet {

     private Logger log = LoggerFactory.getLogger(User.class.getName());

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          request.setCharacterEncoding("UTF-8");
          String URI = request.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");

          if (StringUtils.containsIgnoreCase(request.getContentType(), "application/json")) {
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
               response.addCookie(UserFunctions.makeUserCookie(return_data));
               if (add_signin_html) {
                    return_data.put("signin_html", TemplateUtils.getNewSigninStatusHtml(getServletContext(), request_data));
               }
               JsonUtils.writeTo(return_data, response);
          } else {
               String page_title = "";
               String template = "";
               ObjectNode output_data = new ObjectNode(JsonUtils.INSTANCE);
               ArrayNode jsFilesList = new ArrayNode(JsonUtils.INSTANCE);

               switch (remaining) {
                    case "account":
                         page_title = "DOE CODE: Account";
                         template = TemplateUtils.TEMPLATE_USER_ACCOUNT;
                         //If they have a passcode, we need to let them on in, and then take care of things from there
                         if (StringUtils.isNotBlank(request.getParameter("passcode")) && !StringUtils.equals(UserFunctions.getOtherUserCookieValue(request, "needs_password_reset"), "true")) {
                              Cookie c = new Cookie("needs_password_reset", "true");
                              c.setMaxAge(Init.SESSION_TIMEOUT_MINUTES * 60);
                              response.addCookie(c);
                              output_data.put("passcode", request.getParameter("passcode"));
                              output_data.put("page_warning_message", "Please change your password");
                         } else {
                              output_data.put("current_user_data", UserFunctions.getAccountPageData(request));
                         }

                         if (StringUtils.equals(UserFunctions.getOtherUserCookieValue(request, "needs_password_reset"), "true")) {
                              output_data.put("page_warning_message", "Please change your password");
                         }
                         break;
                    case "user-admin":
                         page_title = "DOE CODE: User Administration";
                         template = TemplateUtils.TEMPLATE_USER_ADMIN;
                         break;
                    case "login":
                         page_title = "DOE CODE: Login";
                         template = TemplateUtils.TEMPLATE_USER_LOGIN;
                         if (StringUtils.isNotBlank(request.getParameter("redirect")) && request.getParameter("redirect").equals("true")) {
                              output_data.put("user_data", new ObjectNode(JsonUtils.INSTANCE));
                              output_data.put("is_redirected", true);
                              response.addCookie(new Cookie("user_data", null));
                         }
                         break;
                    case "register":
                         page_title = "DOE CODE: Register";
                         template = TemplateUtils.TEMPLATE_USER_REGISTRATION;
                         break;
                    case "forgot-password":
                         page_title = "DOE CODE: Forgot Password";
                         template = TemplateUtils.TEMPLATE_USER_FORGOT_PASSWORD;
                         break;
                    case "logout":
                         page_title = "DOE CODE: Logout";
                         template = TemplateUtils.TEMPLATE_USER_LOGOUT;
                         output_data.put("user_data", new ObjectNode(JsonUtils.INSTANCE));
                         response.addCookie(new Cookie("user_data", null));
                         response.addCookie(new Cookie("needs_password_reset", null));
                         response.addCookie(new Cookie("requested_url", null));
                         break;
                    case "confirmuser":
                         page_title = "DOE CODE: Confirm User";
                         template = TemplateUtils.TEMPLATE_USER_CONFIRMATION;
                         output_data = UserFunctions.getUserRegistrationData(request.getParameter("confirmation"));
                         break;
                    case "help":
                         page_title = "DOE CODE: Help";
                         template = TemplateUtils.TEMPLATE_HELP;
                         break;
                    default:
                         break;
               }

               jsFilesList.add("user");

               output_data = TemplateUtils.GET_COMMON_DATA(output_data, "", jsFilesList, null, request);
               TemplateUtils.writeOutTemplateData(page_title, template, response, output_data);
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
