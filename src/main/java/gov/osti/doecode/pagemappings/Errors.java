package gov.osti.doecode.pagemappings;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;
import org.bigtesting.routd.Route;
import org.bigtesting.routd.Router;
import org.bigtesting.routd.TreeRouter;

import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;

@WebServlet(urlPatterns = { "/page-not-found", "/error" })
public class Errors extends HttpServlet {

        private static final long serialVersionUID = 5788017362238476487L;

        private final Router ERROR_PAGE_ROUTES = new TreeRouter();
        private Route PAGE_NOT_FOUND_ROUTE = new Route("/" + Init.app_name + "/page-not-found");
        private Route ERROR_ROUTE = new Route("/" + Init.app_name + "/error");

        @Override
        public void init() {
                ERROR_PAGE_ROUTES.add(PAGE_NOT_FOUND_ROUTE);
                ERROR_PAGE_ROUTES.add(ERROR_ROUTE);
        }

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                request.setCharacterEncoding("UTF-8");
                String path = request.getRequestURI();
                Route route = ERROR_PAGE_ROUTES.route(path);

                String page_title = "";
                String template = "";
                ObjectNode output_data = new ObjectNode(JsonUtils.INSTANCE);

                if (route.equals(PAGE_NOT_FOUND_ROUTE)) {
                        page_title = "Page Not Found";
                        template = TemplateUtils.TEMPLATE_404_PAGE;
                        response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                } else {
                        page_title = "Error Page";
                        template = TemplateUtils.TEMPLATE_ERROR_PAGE;
                        String error_msg = request.getParameter("message");
                        output_data.put("message",
                                        StringUtils.isNotBlank(error_msg) ? error_msg : "An error has occurred");
                        response.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
                }

                output_data = TemplateUtils.GET_COMMON_DATA(output_data, "", JsonUtils.MAPPER.createArrayNode(),
                                JsonUtils.MAPPER.createArrayNode(), null, request);
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
