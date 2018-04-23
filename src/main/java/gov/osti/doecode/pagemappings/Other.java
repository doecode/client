package gov.osti.doecode.pagemappings;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.OtherFunctions;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;
import java.io.IOException;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

public class Other extends HttpServlet {

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          request.setCharacterEncoding("UTF-8");
          String URI = request.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");

          String page_title = "";
          String template = "";
          String current_page = "";
          ObjectNode output_data = new ObjectNode(JsonUtils.FACTORY_INSTANCE);
          ArrayNode jsFilesList = new ArrayNode(JsonUtils.FACTORY_INSTANCE);
          ServletContext context = getServletContext();
          switch (remaining) {
               case "gitlab-signup":
                    page_title = "DOECODE: Gitlab Signup";
                    template = TemplateUtils.TEMPLATE_GITLAB_SIGNUP;
                    output_data = OtherFunctions.getOtherLists(context);
                    output_data.put("recaptcha_sitekey", context.getInitParameter("recaptcha_sitekey"));
                    break;
               case "gitlab-signup-result":
                    page_title = "DOECODE: DOE CODE Repositories Services Access Request";
                    template = TemplateUtils.TEMPLATE_GITLAB_SIGNUP_RESULT;
                    output_data = OtherFunctions.handleGitlabSubmissionForm(request);
                    break;
          }

          //Add the common dissemination js file
          jsFilesList.add("other");

          //Check if they're logged in, and only do something if they're not logged in
          if (!UserFunctions.isUserLoggedIn(request)) {
               output_data.put("user_data", new ObjectNode(JsonUtils.FACTORY_INSTANCE));
          } else {
               //Increment time
               response.addCookie(UserFunctions.updateUserSessionTimeout(request));
               if (StringUtils.equals(UserFunctions.getOtherUserCookieValue(request, "needs_password_reset"), "true")) {
                    Cookie needs_reset_cookie = UserFunctions.getOtherUserCookie(request, "needs_password_reset");
                    needs_reset_cookie.setMaxAge(Init.SESSION_TIMEOUT_MINUTES * 60);
                    response.addCookie(needs_reset_cookie);
               }
          }

          //Send in this object, and get a hold of the common data, like the classes needed to render the homepage correctly and such
          output_data = TemplateUtils.GET_COMMON_DATA(output_data, current_page, jsFilesList, null, request);

          //Write the template out
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
