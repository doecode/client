package gov.osti.doecode.servlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.math.NumberUtils;
import org.bigtesting.routd.Route;
import org.bigtesting.routd.Router;
import org.bigtesting.routd.TreeRouter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import gov.osti.doecode.entity.SearchFunctions;

@WebServlet(urlPatterns = { "/download-repository/container-download/*" })
public class FileDownloadServlet extends HttpServlet {

        private static final long serialVersionUID = 6971159895665994563L;
        private Logger log = LoggerFactory.getLogger(FileDownloadServlet.class);
        private final Router FILE_DOWNLOAD_ROUTES = new TreeRouter();
        private Route CONTAINER_DOWNLOAD = new Route(
                        "/" + Init.app_name + "/download-repository/container-download/:id<[0-9]+>");

        @Override
        public void init() {
                FILE_DOWNLOAD_ROUTES.add(CONTAINER_DOWNLOAD);
        }

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                request.setCharacterEncoding("UTF-8");
                String path = request.getRequestURI();
                Route route = FILE_DOWNLOAD_ROUTES.route(path);

                if (route.equals(CONTAINER_DOWNLOAD)) {
                        long code_id = NumberUtils.toInt(route.getNamedParameter("id", path));
                        // Get the json for the file
                        ObjectNode code_id_data = SearchFunctions.getBiblioJson(code_id);
                        String container_name = code_id_data.findPath("container_name").asText("");
                        if (StringUtils.isBlank(container_name)) {
                                response.sendError(HttpServletResponse.SC_NOT_FOUND,
                                                "No container file found for your requested code id.");
                                return;
                        }

                        // Now, to grab the file
                        File file_to_serve = new File(Init.containers_dir + "/" + code_id + "/" + container_name);
                        if (!file_to_serve.exists()) {
                                response.sendError(HttpServletResponse.SC_NOT_FOUND,
                                                "Your requested file no longer exists");
                                return;
                        }

                        // Get the mime type
                        String mime_type = Files.probeContentType(Paths.get(file_to_serve.getAbsolutePath()));
                        try ( // Write the file out
                                        FileInputStream input = new FileInputStream(file_to_serve)) {
                                response.setContentType(mime_type);
                                response.setContentLength((int) file_to_serve.length());
                                response.setHeader("Content-Disposition", "filename=" + file_to_serve.getName());
                                IOUtils.copy(input, response.getOutputStream());
                        }
                } else {
                        response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                                        "Your request contained an invalid URL.");
                        log.error("Invalid ur: " + request.getRequestURI());
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
