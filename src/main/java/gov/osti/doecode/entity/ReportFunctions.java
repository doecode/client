package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import java.util.HashMap;
import java.util.ArrayList;
import org.apache.commons.lang3.StringUtils;
import org.apache.poi.hssf.usermodel.HSSFWorkbook;
import org.apache.poi.ss.usermodel.BorderStyle;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Font;
import org.apache.poi.ss.usermodel.HorizontalAlignment;
import org.apache.poi.ss.usermodel.IndexedColors;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;

public class ReportFunctions {

     //Gives the max number of records you can have with a search results export, based on type of export you're doing
     public static final HashMap<String, Integer> MAX_RECS_BY_TYPE = new HashMap();
     public static final ArrayList<String> SEARCH_RESULTS_HEADER_LIST = new ArrayList();

     static {
          MAX_RECS_BY_TYPE.put("json", 5000);
          MAX_RECS_BY_TYPE.put("csv", 5000);
          MAX_RECS_BY_TYPE.put("excel", 2000);

          SEARCH_RESULTS_HEADER_LIST.add("CODE ID");
          SEARCH_RESULTS_HEADER_LIST.add("Software Type");
          SEARCH_RESULTS_HEADER_LIST.add("Project Type");
          SEARCH_RESULTS_HEADER_LIST.add("Repository/Landing Page Link");
          SEARCH_RESULTS_HEADER_LIST.add("Software Title");
          SEARCH_RESULTS_HEADER_LIST.add("Description");
          SEARCH_RESULTS_HEADER_LIST.add("License(s)");
          SEARCH_RESULTS_HEADER_LIST.add("Programming Language(s)");
          SEARCH_RESULTS_HEADER_LIST.add("Version Number");
          SEARCH_RESULTS_HEADER_LIST.add("Documentation URL");
          SEARCH_RESULTS_HEADER_LIST.add("Developer(s)");
          SEARCH_RESULTS_HEADER_LIST.add("DOI");
          SEARCH_RESULTS_HEADER_LIST.add("Release date");
          SEARCH_RESULTS_HEADER_LIST.add("Short Title/Acronym");
          SEARCH_RESULTS_HEADER_LIST.add("Country of Origin");
          SEARCH_RESULTS_HEADER_LIST.add("Keywords");
          SEARCH_RESULTS_HEADER_LIST.add("Other Special Requirements");
          SEARCH_RESULTS_HEADER_LIST.add("Site Accession Number");
          SEARCH_RESULTS_HEADER_LIST.add("Sponsoring Org(s)");
          SEARCH_RESULTS_HEADER_LIST.add("Research Org(s)");
          SEARCH_RESULTS_HEADER_LIST.add("Contributor(s)");
          SEARCH_RESULTS_HEADER_LIST.add("Contributing Org(s)");
          SEARCH_RESULTS_HEADER_LIST.add("Related Identifiers");
     }

     public static String getCSVSearchExports(ObjectNode search_data) {
          ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);
          return return_data.toString();
     }

     public static Workbook getExcelSearchExports(ObjectNode search_data) {
          Workbook book = new HSSFWorkbook();
          Sheet sheet1;
          Row row;
          Cell cell;
          sheet1 = book.createSheet();
          // Header Row
          // First set up a header header_style for labels
          Font hdrfont = book.createFont();
          hdrfont.setBold(true);
          CellStyle header_style = book.createCellStyle();
          header_style.setFont(hdrfont);
          header_style.setBorderBottom(BorderStyle.THICK);
          header_style.setBottomBorderColor(IndexedColors.BLACK.getIndex());
          header_style.setAlignment(HorizontalAlignment.CENTER);
          row = sheet1.createRow(0);
          //Put in all of the report header labels
          for (int i = 0; i < SEARCH_RESULTS_HEADER_LIST.size(); i++) {
               cell = row.createCell(i);
               cell.setCellStyle(header_style);
               cell.setCellValue(SEARCH_RESULTS_HEADER_LIST.get(i));
          }

          //Put out all of the data rows
          CellStyle cell_style = book.createCellStyle();
          cell_style.setAlignment(HorizontalAlignment.CENTER);
          ArrayNode docs = (ArrayNode) search_data.get("docs");
          for (int i = 1; i < docs.size(); i++) {
               ObjectNode rec = getSearchResultsReportVersion((ObjectNode) docs.get(i));

               //Code ID
               row = sheet1.createRow(i);
               cell = row.createCell(0);
               cell.setCellStyle(cell_style);
               cell.setCellValue(JsonUtils.getLong(rec, "code_id", 0));

               //Software type
               row = sheet1.createRow(i);
               cell = row.createCell(1);
               cell.setCellStyle(cell_style);
               cell.setCellValue(JsonUtils.getString(rec, "software_type", ""));

               //Project Type
               row = sheet1.createRow(i);
               cell = row.createCell(2);
               cell.setCellStyle(cell_style);
               //Repository/Landing Page Link
               row = sheet1.createRow(i);
               cell = row.createCell(3);
               cell.setCellStyle(cell_style);
               //Software Title
               row = sheet1.createRow(i);
               cell = row.createCell(4);
               cell.setCellStyle(cell_style);
               //Description
               row = sheet1.createRow(i);
               cell = row.createCell(5);
               cell.setCellStyle(cell_style);
               //License(s)
               row = sheet1.createRow(i);
               cell = row.createCell(6);
               cell.setCellStyle(cell_style);
               //Programming Language(s)
               row = sheet1.createRow(i);
               cell = row.createCell(7);
               cell.setCellStyle(cell_style);
               //Version Number
               row = sheet1.createRow(i);
               cell = row.createCell(8);
               cell.setCellStyle(cell_style);
               //Documentation URL
               row = sheet1.createRow(i);
               cell = row.createCell(9);
               cell.setCellStyle(cell_style);
               //Developer(s)
               row = sheet1.createRow(i);
               cell = row.createCell(10);
               cell.setCellStyle(cell_style);
               //DOI
               row = sheet1.createRow(i);
               cell = row.createCell(11);
               cell.setCellStyle(cell_style);
               //Release Date
               row = sheet1.createRow(i);
               cell = row.createCell(12);
               cell.setCellStyle(cell_style);
               //Short Title 
               row = sheet1.createRow(i);
               cell = row.createCell(13);
               cell.setCellStyle(cell_style);
               //Country of Origin
               row = sheet1.createRow(i);
               cell = row.createCell(14);
               cell.setCellStyle(cell_style);
               //Keywords
               row = sheet1.createRow(i);
               cell = row.createCell(15);
               cell.setCellStyle(cell_style);
               //Other Special Requirements
               row = sheet1.createRow(i);
               cell = row.createCell(16);
               cell.setCellStyle(cell_style);
               //Site Accession Number
               row = sheet1.createRow(i);
               cell = row.createCell(17);
               cell.setCellStyle(cell_style);
               //Sponsoring orgs
               row = sheet1.createRow(i);
               cell = row.createCell(18);
               cell.setCellStyle(cell_style);
               //Researh Orgs
               row = sheet1.createRow(i);
               cell = row.createCell(19);
               cell.setCellStyle(cell_style);
               //Contributors
               row = sheet1.createRow(i);
               cell = row.createCell(20);
               cell.setCellStyle(cell_style);
               //Contributing Orgs
               row = sheet1.createRow(i);
               cell = row.createCell(21);
               cell.setCellStyle(cell_style);
               //Related Identifiers
               row = sheet1.createRow(i);
               cell = row.createCell(22);
               cell.setCellStyle(cell_style);

          }
          return book;
     }

     public static String getJsonSearchExports(ObjectNode search_data) {
          ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);
          return return_data.toString();
     }

     private static ObjectNode getSearchResultsReportVersion(ObjectNode doc1) {
          ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);
          //code id
          return_data.put("code_id", JsonUtils.getLong(doc1, "code_id", 0));

          //Software type
          String software_type = JsonUtils.getString(doc1, "software_type", "");
          ArrayNode software_types = DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY);
          return_data.put("software_type", DOECODEUtils.getDisplayVersionOfValue(software_types, software_type));

          //Project Type
          String project_type = JsonUtils.getString(doc1, "accessibility", "");
          ArrayNode project_types = DOECODEServletContextListener.getJsonList(DOECODEJson.AVAILABILITY_KEY);
          return_data.put("project_type", DOECODEUtils.getDisplayVersionOfValue(project_types, project_type));

          //Repository/Landing Page Link
          String repos_landing_page_str = "";
          String landing_page = JsonUtils.getString(doc1, "landing_page", "");
          String repository_link = JsonUtils.getString(doc1, "repository_link", "");
          if (StringUtils.isNotBlank(landing_page)) {
               repos_landing_page_str += (landing_page + "; ");
          }
          if (StringUtils.isNotBlank(repository_link)) {
               repos_landing_page_str += repository_link;
          }
          return_data.put("repository_link_landing_page", repos_landing_page_str);

          //Software Title
          return_data.put("software_title", JsonUtils.getString(doc1, "software_title", ""));

          //Description
          return_data.put("description", JsonUtils.getString(doc1, "description", ""));

          //License(s)
          ArrayNode licenses = (ArrayNode) doc1.get("licenses");
          return_data.put("licenses", licenses);
          return_data.put("licenses_str", DOECODEUtils.makeTokenSeparatedList(licenses, ";"));

          //Programming Language(s)
          ArrayNode programming_languages = (ArrayNode) doc1.get("programming_languages");
          return_data.put("programming_languages", programming_languages);
          return_data.put("programming_languages_str", DOECODEUtils.makeTokenSeparatedList(licenses, ";"));

          //Version Number 
          //TODO: GET API to Return
          return_data.put("version_number", JsonUtils.getString(doc1, "version_number", ""));

          //Documentation URL 
          //TODO: GET API to Return
          return_data.put("documentation_url", JsonUtils.getString(doc1, "documentation_url", ""));

          //Developer(s)
          ArrayNode developers = (ArrayNode) doc1.get("developers");
          ArrayNode developer_displays = new ArrayNode(JsonUtils.INSTANCE);
          for (JsonNode n : developers) {
               ObjectNode row = (ObjectNode) n;
               String display = "";
               String first_name = JsonUtils.getString(row, "first_name", "");
               String last_name = JsonUtils.getString(row, "last_name", "");

               if (StringUtils.isNotBlank(last_name)) {
                    display += (last_name + ", ");
               }
               display += first_name;

               developer_displays.add(display);
          }
          return_data.put("developers_list", developer_displays);
          return_data.put("developers_list_str", DOECODEUtils.makeTokenSeparatedList(developer_displays, "; "));

          //DOI
          return_data.put("doi", JsonUtils.getString(doc1, "doi", ""));
          
          //Release Date
          return_data.put("release_date", JsonUtils.getString(doc1, "release_date", ""));
          
          //Short Title 
          return_data.put("short_title", JsonUtils.getString(doc1, "acronym", ""));
                    
          //Country of Origin
          return_data.put("country_of_origin", JsonUtils.getString(doc1, "country_of_origin", ""));
          
          //Keywords
          
          
          //Other Special Requirements
          
          //Site Accession Number
          
          //Sponsoring orgs
          
          //Researh Orgs
          
          //Contributors
          
          //Contributing Orgs
          
          //Related Identifiers
          
          return return_data;
     }
}
