package gov.osti.doecode.pagemappings;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.OtherFunctions;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonObjectUtils;
import gov.osti.doecode.utils.TemplateUtils;
import java.io.IOException;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

public class Other extends HttpServlet {

     protected void processRequest(HttpServletRequest request, HttpServletResponse response)
             throws ServletException, IOException {
          String URI = request.getRequestURI();
          String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");

          String page_title = "";
          String template = "";
          String current_page = "";
          ObjectNode output_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          ArrayNode jsFilesList = new ArrayNode(JsonObjectUtils.FACTORY_INSTANCE);
          ServletContext context = getServletContext();
          switch (remaining) {
               case "gitlab-signup":
                    page_title = "DOECODE: Gitlab Signup";
                    template = TemplateUtils.TEMPLATE_GITLAB_SIGNUP;
                    output_data = OtherFunctions.getOtherLists(context);
                    output_data.put("recaptcha_sitekey", context.getInitParameter("recaptcha_sitekey"));
                    break;
               case "gitlab-signup-result":
                    page_title = "DOECODE: Gitlab Signup Result";
                    template = TemplateUtils.TEMPLATE_GITLAB_SINGUP_RESULT;
                    output_data = OtherFunctions.handleGitlabSubmissionForm(request);

                    break;
          }

          //Add the common dissemination js file
          jsFilesList.add("other");

          //Check if they're logged in, and only do something if they're not logged in
          if (!UserFunctions.isUserLoggedIn(request)) {
               output_data.put("user_data", new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE));
          } else {
               //Increment time
               response.addCookie(UserFunctions.updateUserSessionTimeout(request));
          }

          //Send in this object, and get a hold of the common data, like the classes needed to render the homepage correctly and such
          output_data = TemplateUtils.GET_COMMON_DATA(output_data, current_page, jsFilesList, request);

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
