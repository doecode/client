package gov.osti.doecode.servlet;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@WebServlet(urlPatterns = {"/user-data/get-current-user-data", "/user-data/login"})
public class UserServlet extends HttpServlet {

    private Logger log = LoggerFactory.getLogger(UserServlet.class);

    private static final long serialVersionUID = -7558668872421453995L;

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String remaining = StringUtils.substringAfterLast(request.getRequestURI(), "/" + Init.app_name + "/user-data/");

        ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);

        switch (remaining) {
            case "get-current-user-data":
                return_data = UserFunctions.getUserDataFromCookie(request);
                break;
            case "login":
                ObjectNode login_request = JsonUtils.parseObjectNode(request.getReader());
                return_data = UserFunctions.doLogin(login_request);
                String response_code = return_data.findPath("response_code").asText("");
                //If we didn't get a proper 200, return with the status code that we got from the AJAX call
                if (StringUtils.isNumeric(response_code) && !StringUtils.equals(response_code, "200")) {
                    response.setStatus(Integer.parseInt(response_code));
                } else {
                    //Set the user cookie, because the login was successful
                    ObjectNode user_cookie_data = UserFunctions.setUserDataForCookie(return_data);
                    Cookie last_location = UserFunctions.getOtherUserCookie(request, "requested_url");
                    if (null != last_location) {
                        return_data.put("requested_url", last_location.getValue());
                    }
                    response.addCookie(UserFunctions.makeUserCookie(user_cookie_data));

                    //Add the access token
                    response.addCookie(DOECODEUtils.createAccessTokenCookie(return_data.findPath("access_token").asText("")));
                }
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
