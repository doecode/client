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
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;

@WebServlet(urlPatterns = {"/gitlab-signup", "/gitlab-signup-result"})
public class Other extends HttpServlet {

    private static final long serialVersionUID = -6637956247980588309L;

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String URI = request.getRequestURI();
        String remaining = StringUtils.substringAfterLast(URI, "/" + Init.app_name + "/");

        HttpSession session = request.getSession(true);
        String page_title = "";
        String template = "";
        String current_page = "";
        ObjectNode output_data = JsonUtils.MAPPER.createObjectNode();
        ArrayNode jsFilesList = JsonUtils.MAPPER.createArrayNode();
        ArrayNode extraJSList = JsonUtils.MAPPER.createArrayNode();
        ServletContext context = getServletContext();
        switch (remaining) {
            case "gitlab-signup":
                session.removeAttribute("gitlab_requested");
                String gitlab_token = RandomStringUtils.randomAscii(30);
                session.setAttribute("gitlab-token", gitlab_token);
                page_title = "DOE CODE GitLab Repository Service Access Request";
                template = TemplateUtils.TEMPLATE_GITLAB_SIGNUP;
                output_data = OtherFunctions.getOtherLists(context);
                output_data.put("recaptcha_sitekey", Init.recaptcha_sitekey);
                output_data.put("gitlab_token", gitlab_token);
                break;
            case "gitlab-signup-result":
                page_title = "DOE CODE GitLab Repository Service Access Request";
                template = TemplateUtils.TEMPLATE_GITLAB_SIGNUP_RESULT;
                output_data = OtherFunctions.handleGitlabSubmissionForm(request);
                session.removeAttribute("gitlab-token");
                break;
        }

        // Add the common dissemination js file
        extraJSList.add("libraries/libphonenumber-js.min");
        jsFilesList.add("other");

        // Check if they're logged in, and only do something if they're not logged in
        if (!UserFunctions.isUserLoggedIn(request)) {
            output_data.set("user_data", JsonUtils.MAPPER.createObjectNode());
        } else {
            // Increment time
            response.addCookie(UserFunctions.updateUserSessionTimeout(request));
        }

        // Send in this object, and get a hold of the common data, like the classes
        // needed to render the homepage correctly and such
        output_data = TemplateUtils.GET_COMMON_DATA(output_data, current_page, jsFilesList, extraJSList,
                null, request);

        // Write the template out
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
