package gov.osti.doecode.servlet;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ObjectNode;

import org.bigtesting.routd.Route;
import org.bigtesting.routd.Router;
import org.bigtesting.routd.TreeRouter;

import gov.osti.doecode.entity.UserFunctions;
import gov.osti.doecode.utils.JsonUtils;

/**
 *
 * @author smithwa
 */
@WebServlet(urlPatterns = { "/user-data/get-current-user-data" })
public class UserServlet extends HttpServlet {

        private static final long serialVersionUID = -7558668872421453995L;
        private final Router USER_SERVLET_ROUTES = new TreeRouter();
        private Route GET_CURRENT_USER_DATA_ROUTE = new Route("/" + Init.app_name + "/user-data/get-current-user-data");

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                request.setCharacterEncoding("UTF-8");
                String path = request.getRequestURI();
                Route route = USER_SERVLET_ROUTES.route(path);
                ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);

                if (route.equals(GET_CURRENT_USER_DATA_ROUTE)) {
                        return_data = UserFunctions.getUserDataFromCookie(request);
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
