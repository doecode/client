package gov.osti.doecode.servlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.fasterxml.jackson.databind.node.ObjectNode;

import org.apache.commons.io.IOUtils;
import org.apache.commons.lang3.StringUtils;

import gov.osti.doecode.entity.SearchFunctions;

public class FileDownloadServlet extends HttpServlet {

        private static final long serialVersionUID = 6971159895665994563L;

        protected void processRequest(HttpServletRequest request, HttpServletResponse response)
                        throws ServletException, IOException {
                // Get the code id and code_id_dir name from the URL
                String remaining = StringUtils.substringAfterLast(request.getRequestURI(),
                                Init.app_name + "/download-repository/");

                if (remaining.startsWith("container-download/")) {
                        String code_id = StringUtils.substringAfterLast(remaining, "container-download/");
                        if (!StringUtils.isNumeric(code_id)) {
                                response.sendError(HttpServletResponse.SC_BAD_REQUEST,
                                                "Your request contained an invalid code id.");
                                return;
                        }
                        // Get the json for the file
                        ObjectNode code_id_data = SearchFunctions.getBiblioJson(Long.parseLong(code_id));
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
