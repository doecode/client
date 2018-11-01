package gov.osti.doecode.servlet;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.entity.DOECODEJson;
import gov.osti.doecode.entity.NewsFunctions;
import gov.osti.doecode.entity.ReportFunctions;
import gov.osti.doecode.entity.SearchFunctions;
import gov.osti.doecode.utils.JsonUtils;
import gov.osti.doecode.utils.TemplateUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.ss.usermodel.Workbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DisseminationServlet extends HttpServlet {

        private static final int BYTES_DOWNLOAD = 1024;
        private Logger log = LoggerFactory.getLogger(DisseminationServlet.class);

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                request.setCharacterEncoding("UTF-8");
                String remaining = StringUtils.substringAfterLast(request.getRequestURI(),
                                "/" + Init.app_name + "/dissemination/");

                if (remaining.equals("export-search-results")) {
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

                } else if (remaining.equals("export-biblio-results")) {
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
                } else if (remaining.equals("news-article-search")) {
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
