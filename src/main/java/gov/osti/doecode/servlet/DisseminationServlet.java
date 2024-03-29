package gov.osti.doecode.servlet;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.osti.doecode.entity.ReportFunctions;
import gov.osti.doecode.entity.SearchFunctions;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;

@WebServlet(urlPatterns = {"/dissemination/export-search-results"})
public class DisseminationServlet extends HttpServlet {

    private static final long serialVersionUID = -7808019940521145092L;

    private static final int BYTES_DOWNLOAD = 1024;
    private Logger log = LoggerFactory.getLogger(DisseminationServlet.class);

    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        request.setCharacterEncoding("UTF-8");
        String remaining = StringUtils.substringAfterLast(request.getRequestURI(), "/" + Init.app_name + "/dissemination/");

        if (remaining.equals("export-search-results")) {
            String format = StringUtils.defaultIfBlank(request.getParameter("format"), "json");

            // Get search results
            ObjectNode search_request_data = SearchFunctions.createPostDataObj(request, 0, ReportFunctions.MAX_RECS_BY_TYPE.get(format));
            ObjectNode search_result_data = JsonUtils.MAPPER.createObjectNode();

            try {
                search_result_data = DOECODEUtils.makePOSTRequest(Init.backend_api_url + "search", search_request_data);
            } catch (Exception e) {
                log.error("Exception in getting exported search results: " + e.getMessage());
            }

            ArrayNode docs = (ArrayNode) search_result_data.get("docs");

            // Format search results data
            switch (format) {
                case "csv":
                    response.setContentType("text/csv; charset=UTF-8");
                    response.setHeader("Content-Disposition", "attachment; filename=DOECODE-SearchResults.csv");
                    PrintWriter p = response.getWriter();
                    p.write(ReportFunctions.getCSVSearchExports(docs));
                    p.flush();
                    p.close();
                    break;
                default:
                    response.setContentType("application/json; UTF-8");
                    response.setHeader("Content-Disposition", "attachment; filename=DOECODE-SearchResults.json");

                    InputStream input = new ByteArrayInputStream(ReportFunctions.getJsonSearchExports(docs).getBytes("UTF-8"));
                    int read = 0;
                    byte[] bytes = new byte[BYTES_DOWNLOAD];
                    OutputStream os = response.getOutputStream();
                    while ((read = input.read(bytes)) != -1) {
                        os.write(bytes, 0, read);
                    }
                    os.flush();
                    os.close();
                    input.close();
                    break;
            }

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
