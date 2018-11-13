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
import org.bigtesting.routd.Route;
import org.bigtesting.routd.Router;
import org.bigtesting.routd.TreeRouter;

@WebServlet(urlPatterns = { "/gitlab-signup", "/gitlab-signup-result" })
public class Other extends HttpServlet {

        private static final long serialVersionUID = -6637956247980588309L;

        private final Router OTHER_ROUTES = new TreeRouter();
        private Route GITLAB_SIGNUP_ROUTE = new Route("/" + Init.app_name + "/gitlab-signup");
        private Route GITLAB_SIGNUP_RESULT_ROUTE = new Route("/" + Init.app_name + "/gitlab-signup-result");

        public void init() {
                OTHER_ROUTES.add(GITLAB_SIGNUP_ROUTE);
                OTHER_ROUTES.add(GITLAB_SIGNUP_RESULT_ROUTE);
        }

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                request.setCharacterEncoding("UTF-8");
                String path = request.getRequestURI();
                Route route = OTHER_ROUTES.route(path);

                HttpSession session = request.getSession(true);
                String page_title = "";
                String template = "";
                String current_page = "";
                ObjectNode output_data = new ObjectNode(JsonUtils.INSTANCE);
                ArrayNode jsFilesList = new ArrayNode(JsonUtils.INSTANCE);
                ArrayNode extraJSList = JsonUtils.MAPPER.createArrayNode();
                ServletContext context = getServletContext();
                if (route.equals(GITLAB_SIGNUP_ROUTE)) {
                        String gitlab_token = RandomStringUtils.randomAscii(30);
                        session.setAttribute("gitlab-token", gitlab_token);
                        page_title = "DOECODE: Gitlab Signup";
                        template = TemplateUtils.TEMPLATE_GITLAB_SIGNUP;
                        output_data = OtherFunctions.getOtherLists(context);
                        output_data.put("recaptcha_sitekey", Init.recaptcha_sitekey);
                        output_data.put("gitlab_token", gitlab_token);
                } else if (route.equals(GITLAB_SIGNUP_RESULT_ROUTE)) {
                        page_title = "DOECODE: DOE CODE Repositories Services Access Request";
                        template = TemplateUtils.TEMPLATE_GITLAB_SIGNUP_RESULT;
                        output_data = OtherFunctions.handleGitlabSubmissionForm(request);
                        session.removeAttribute("gitlab-token");
                }

                // Add the common dissemination js file
                jsFilesList.add("other");

                // Check if they're logged in, and only do something if they're not logged in
                if (!UserFunctions.isUserLoggedIn(request)) {
                        output_data.set("user_data", new ObjectNode(JsonUtils.INSTANCE));
                } else {
                        // Increment time
                        response.addCookie(UserFunctions.updateUserSessionTimeout(request));
                        if (StringUtils.equals(UserFunctions.getOtherUserCookieValue(request, "needs_password_reset"),
                                        "true")) {
                                Cookie needs_reset_cookie = UserFunctions.getOtherUserCookie(request,
                                                "needs_password_reset");
                                needs_reset_cookie.setMaxAge(Init.SESSION_TIMEOUT_MINUTES * 60);
                                response.addCookie(needs_reset_cookie);
                        }
                }

                // Send in this object, and get a hold of the common data, like the classes
                // needed to render the homepage correctly and such
                output_data = TemplateUtils.GET_COMMON_DATA(output_data, current_page, jsFilesList, extraJSList, null,
                                request);

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
