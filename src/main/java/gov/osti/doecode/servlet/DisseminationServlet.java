package gov.osti.doecode.servlet;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.bigtesting.routd.Route;
import org.bigtesting.routd.Router;
import org.bigtesting.routd.TreeRouter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.osti.doecode.entity.NewsFunctions;
import gov.osti.doecode.entity.ReportFunctions;
import gov.osti.doecode.entity.SearchFunctions;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;

@WebServlet(urlPatterns = { "/dissemination/export-search-results", "/dissemination/export-biblio-results",
                "/dissemination/news-article-search" })
public class DisseminationServlet extends HttpServlet {

        private static final long serialVersionUID = -7808019940521145092L;
        private static final int BYTES_DOWNLOAD = 1024;
        private Logger log = LoggerFactory.getLogger(DisseminationServlet.class);

        // Routes for this servlet
        private final Router DISSEMINATION_ROUTES = new TreeRouter();
        private Route EXPORT_SEARCH_ROUTE = new Route("/" + Init.app_name + "/dissemination/export-search-results");
        private Route EXPORT_BIBLIO_ROUTE = new Route("/" + Init.app_name + "/dissemination/export-biblio-results");
        private Route EXPORT_NEWS_ROUTE = new Route("/" + Init.app_name + "/dissemination/news-article-search");

        @Override
        public void init() {
                DISSEMINATION_ROUTES.add(EXPORT_SEARCH_ROUTE);
                DISSEMINATION_ROUTES.add(EXPORT_BIBLIO_ROUTE);
                DISSEMINATION_ROUTES.add(EXPORT_NEWS_ROUTE);
        }

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                request.setCharacterEncoding("UTF-8");
                String path = request.getRequestURI();
                Route route = DISSEMINATION_ROUTES.route(path);

                if (route.equals(EXPORT_SEARCH_ROUTE)) {
                        String format = StringUtils.defaultIfBlank(request.getParameter("format"), "json");

                        // Get search results
                        ObjectNode search_request_data = SearchFunctions.createPostDataObj(request, 0,
                                        ReportFunctions.MAX_RECS_BY_TYPE.get(format));
                        ObjectNode search_result_data = new ObjectNode(JsonUtils.INSTANCE);

                        try {
                                String result = SearchFunctions.getRawSearchResultData(Init.backend_api_url,
                                                search_request_data);
                                if (JsonUtils.isValidObjectNode(result)) {
                                        search_result_data = JsonUtils.parseObjectNode(result);
                                }
                        } catch (Exception e) {
                                log.error("Exception in getting exported search results: " + e.getMessage());
                        }

                        ArrayNode docs = (ArrayNode) search_result_data.get("docs");

                        // Format search results data
                        switch (format) {
                        case "excel":
                                response.setContentType("application/vnd.ms-excel; charset=utf-8");
                                response.setHeader("Content-Disposition",
                                                "attachment; filename=DOECODE-SearchResults.xls");
                                ServletOutputStream out = response.getOutputStream();
                                Workbook excel_doc = ReportFunctions.getExcelSearchExports(docs);
                                excel_doc.write(response.getOutputStream());
                                out.flush();
                                out.close();
                                break;
                        case "csv":
                                response.setContentType("text/csv; charset=utf-8");
                                response.setHeader("Content-Disposition",
                                                "attachment; filename=DOECODE-SearchResults.csv");
                                PrintWriter p = response.getWriter();
                                p.write(ReportFunctions.getCSVSearchExports(docs));
                                p.flush();
                                p.close();
                                break;
                        default:
                                response.setContentType("application/json; charset=utf-8");
                                response.setHeader("Content-Disposition",
                                                "attachment; filename=DOECODE-SearchResults.json");

                                InputStream input = new ByteArrayInputStream(
                                                ReportFunctions.getJsonSearchExports(docs).getBytes("UTF-8"));
                                int read = 0;
                                byte[] bytes = new byte[BYTES_DOWNLOAD];
                                OutputStream os = response.getOutputStream();
                                while ((read = input.read(bytes)) != -1) {
                                        os.write(bytes, 0, read);
                                }
                                os.flush();
                                os.close();
                                break;
                        }

                } else if (route.equals(EXPORT_BIBLIO_ROUTE)) {
                        String format = StringUtils.defaultIfBlank(request.getParameter("format"), "");
                        String code_id = StringUtils.defaultIfBlank(request.getParameter("code_id"), "");

                        ObjectNode biblio_data = SearchFunctions.getBiblioJson(Long.parseLong(code_id));
                        if (JsonUtils.getBoolean(biblio_data, "is_valid_record", false)) {
                                switch (format) {
                                default:
                                        ArrayNode doc_list = new ArrayNode(JsonUtils.INSTANCE);
                                        doc_list.add(biblio_data);
                                        response.setContentType("application/vnd.ms-excel; charset=utf-8");
                                        response.setHeader("Content-Disposition",
                                                        "attachment; filename=DOECODE-" + code_id + ".xls");
                                        ServletOutputStream out = response.getOutputStream();
                                        Workbook excel_doc = ReportFunctions.getExcelSearchExports(doc_list);
                                        excel_doc.write(response.getOutputStream());
                                        out.flush();
                                        out.close();
                                        break;
                                }
                        }
                } else if (route.equals(EXPORT_NEWS_ROUTE)) {
                        ObjectNode request_data = JsonUtils.parseObjectNode(request.getReader());
                        ObjectNode output_data = NewsFunctions.getNewsPageData(Init.news_page_data_url, request_data);

                        TemplateUtils.writeOutTemplateData("", "news-article", Init.handlebarsSearch, response,
                                        output_data);
                        return;
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
