package gov.osti.doecode.pagemappings;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;
import org.bigtesting.routd.Route;
import org.bigtesting.routd.Router;
import org.bigtesting.routd.TreeRouter;

import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;

@WebServlet(urlPatterns = { "/set-login-status-name", "/update-login-status-name", "/account", "/user-admin", "/login",
                "/register", "/forgot-password", "/logout", "/confirmuser", "/help" })
public class User extends HttpServlet {

        private static final long serialVersionUID = 1546530624730778400L;

        private final Router USER_ROUTES = new TreeRouter();
        private Route LOGIN_NAME_STATUS_ROUTE = new Route("/" + Init.app_name + "/set-login-status-name");
        private Route UPDATE_LOGIN_STATUS_NAME_ROUTE = new Route("/" + Init.app_name + "/update-login-status-name");
        private Route ACCOUNT_ROUTE = new Route("/" + Init.app_name + "/account");
        private Route USER_ADMIN_ROUTE = new Route("/" + Init.app_name + "/user-admin");
        private Route LOGIN_ROUTE = new Route("/" + Init.app_name + "/login");
        private Route REGISTER_ROUTE = new Route("/" + Init.app_name + "/register");
        private Route FORGOT_PASSWORD_ROUTE = new Route("/" + Init.app_name + "/forgot-password");
        private Route LOGOUT_ROUTE = new Route("/" + Init.app_name + "/logout");
        private Route CONFIRM_USER_ROUTE = new Route("/" + Init.app_name + "/confirmuser");
        private Route HELP_ROUTE = new Route("/" + Init.app_name + "/help");

        @Override
        public void init() {
                USER_ROUTES.add(LOGIN_NAME_STATUS_ROUTE);
                USER_ROUTES.add(UPDATE_LOGIN_STATUS_NAME_ROUTE);
                USER_ROUTES.add(ACCOUNT_ROUTE);
                USER_ROUTES.add(USER_ADMIN_ROUTE);
                USER_ROUTES.add(LOGIN_ROUTE);
                USER_ROUTES.add(REGISTER_ROUTE);
                USER_ROUTES.add(FORGOT_PASSWORD_ROUTE);
                USER_ROUTES.add(LOGOUT_ROUTE);
                USER_ROUTES.add(CONFIRM_USER_ROUTE);
                USER_ROUTES.add(HELP_ROUTE);

        }

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                request.setCharacterEncoding("UTF-8");
                String path = request.getRequestURI();
                Route route = USER_ROUTES.route(path);

                if (StringUtils.containsIgnoreCase(request.getContentType(), "application/json")) {
                        ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);
                        ObjectNode request_data = JsonUtils.parseObjectNode(request.getReader());
                        boolean add_signin_html = false;
                        if (route.equals(LOGIN_NAME_STATUS_ROUTE)) {
                                return_data = UserFunctions.setUserDataForCookie(request_data);
                                Cookie last_location = UserFunctions.getOtherUserCookie(request, "requested_url");
                                if (null != last_location) {
                                        return_data.put("requested_url", last_location.getValue());
                                }
                                add_signin_html = true;
                        } else if (route.equals(UPDATE_LOGIN_STATUS_NAME_ROUTE)) {
                                return_data = UserFunctions.updateUserCookie(request, request_data);
                                // If this is being called, and there are values for needs_password_reset &
                                // passcode, clear them out
                                if (UserFunctions.hasRecentlyDonePasswordReset(request)) {
                                        response.addCookie(new Cookie("needs_password_reset", null));
                                }
                                add_signin_html = true;
                        }

                        response.addCookie(UserFunctions.makeUserCookie(return_data));
                        if (add_signin_html) {
                                return_data.put("signin_html", TemplateUtils.getNewSigninStatusHtml(getServletContext(),
                                                request_data));
                        }
                        JsonUtils.writeTo(return_data, response);
                } else {
                        String page_title = "";
                        String template = "";
                        ObjectNode output_data = new ObjectNode(JsonUtils.INSTANCE);
                        ArrayNode jsFilesList = new ArrayNode(JsonUtils.INSTANCE);

                        if (route.equals(ACCOUNT_ROUTE)) {
                                page_title = "DOE CODE: Account";
                                template = TemplateUtils.TEMPLATE_USER_ACCOUNT;
                                // If they have a passcode, we need to let them on in, and then take care of
                                // things from there
                                if (StringUtils.isNotBlank(request.getParameter("passcode")) && !StringUtils.equals(
                                                UserFunctions.getOtherUserCookieValue(request, "needs_password_reset"),
                                                "true")) {
                                        Cookie c = new Cookie("needs_password_reset", "true");
                                        c.setMaxAge(Init.SESSION_TIMEOUT_MINUTES * 60);
                                        response.addCookie(c);
                                        output_data.put("passcode", request.getParameter("passcode"));
                                        output_data.put("page_warning_message", "Please change your password");
                                } else {
                                        output_data.set("current_user_data", UserFunctions.getAccountPageData(request));
                                }

                                if (StringUtils.equals(
                                                UserFunctions.getOtherUserCookieValue(request, "needs_password_reset"),
                                                "true")) {
                                        output_data.put("page_warning_message", "Please change your password");
                                }
                        } else if (route.equals(USER_ADMIN_ROUTE)) {
                                page_title = "DOE CODE: User Administration";
                                template = TemplateUtils.TEMPLATE_USER_ADMIN;
                        } else if (route.equals(LOGIN_ROUTE)) {
                                page_title = "DOE CODE: Login";
                                template = TemplateUtils.TEMPLATE_USER_LOGIN;
                                if (StringUtils.isNotBlank(request.getParameter("redirect"))
                                                && request.getParameter("redirect").equals("true")) {
                                        output_data.set("user_data", new ObjectNode(JsonUtils.INSTANCE));
                                        output_data.put("is_redirected", true);
                                        response.addCookie(new Cookie("user_data", null));
                                }
                        } else if (route.equals(REGISTER_ROUTE)) {
                                page_title = "DOE CODE: Register";
                                template = TemplateUtils.TEMPLATE_USER_REGISTRATION;
                        } else if (route.equals(FORGOT_PASSWORD_ROUTE)) {
                                page_title = "DOE CODE: Forgot Password";
                                template = TemplateUtils.TEMPLATE_USER_FORGOT_PASSWORD;
                        } else if (route.equals(LOGOUT_ROUTE)) {
                                page_title = "DOE CODE: Logout";
                                template = TemplateUtils.TEMPLATE_USER_LOGOUT;
                                output_data.set("user_data", new ObjectNode(JsonUtils.INSTANCE));
                                response.addCookie(new Cookie("user_data", null));
                                response.addCookie(new Cookie("needs_password_reset", null));
                                response.addCookie(new Cookie("requested_url", null));
                        } else if (route.equals(CONFIRM_USER_ROUTE)) {
                                page_title = "DOE CODE: Confirm User";
                                template = TemplateUtils.TEMPLATE_USER_CONFIRMATION;
                                output_data = UserFunctions
                                                .getUserRegistrationData(request.getParameter("confirmation"));
                        } else if (route.equals(HELP_ROUTE)) {
                                page_title = "DOE CODE: Help";
                                template = TemplateUtils.TEMPLATE_HELP;
                        }

                        jsFilesList.add("user");

                        output_data = TemplateUtils.GET_COMMON_DATA(output_data, "", jsFilesList, null, null, request);
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
