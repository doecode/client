package gov.osti.doecode.pagemappings;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.bigtesting.routd.Route;
import org.bigtesting.routd.Router;
import org.bigtesting.routd.TreeRouter;

import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;

@WebServlet(urlPatterns = { "/site-admin", "/poc-admin" })
public class Site extends HttpServlet {

        private static final long serialVersionUID = 9211014467465771916L;
        private final Router SITE_ROUTER = new TreeRouter();
        private Route SITE_ADMIN = new Route("/" + Init.app_name + "/site-admin");
        private Route POC_ADMIN = new Route("/" + Init.app_name + "/poc-admin");

        @Override
        public void init() {
                SITE_ROUTER.add(SITE_ADMIN);
                SITE_ROUTER.add(POC_ADMIN);
        }

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                request.setCharacterEncoding("UTF-8");
                String path = request.getRequestURI();
                Route route = SITE_ROUTER.route(path);

                String page_title = "";
                String template = "";
                ObjectNode output_data = new ObjectNode(JsonUtils.INSTANCE);
                ArrayNode jsFilesList = new ArrayNode(JsonUtils.INSTANCE);

                if (route.equals(SITE_ADMIN)) {
                        page_title = "DOE CODE: Site Administration";
                        template = TemplateUtils.TEMPLATE_SITE_ADMIN;
                } else if (route.equals(POC_ADMIN)) {
                        page_title = "DOECODE: Point of Contact Administration";
                        template = TemplateUtils.TEMPLATE_POC_ADMIN;
                }

                jsFilesList.add("site");
                output_data = TemplateUtils.GET_COMMON_DATA(output_data, "", jsFilesList, null, null, request);
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
