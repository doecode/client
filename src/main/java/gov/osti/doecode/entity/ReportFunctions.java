package gov.osti.doecode.entity;

import java.util.ArrayList;
import java.util.HashMap;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

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

import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;

public class ReportFunctions {

   // Gives the max number of records you can have with a search results export,
   // based on type of export you're doing
   public static final HashMap<String, Integer> MAX_RECS_BY_TYPE = new HashMap<String, Integer>();
   public static final ArrayList<String> SEARCH_RESULTS_HEADER_LIST = new ArrayList<String>();

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

   public static String getCSVSearchExports(ArrayNode search_data) {

      ArrayNode docs_rows = new ArrayNode(JsonUtils.INSTANCE);
      for (int i = 0; i < search_data.size(); i++) {
         ObjectNode rec = getSearchResultsReportVersion((ObjectNode) search_data.get(i));

         ArrayNode row_vals = new ArrayNode(JsonUtils.INSTANCE);
         // Code ID
         row_vals.add("\"" + JsonUtils.getLong(rec, "code_id", 0) + "\"");

         // Software type
         row_vals.add("\"" + JsonUtils.getString(rec, "software_type", "") + "\"");

         // Project Type
         row_vals.add("\"" + JsonUtils.getString(rec, "project_type", "").replaceAll("\"", "\"\"") + "\"");

         // Repository/Landing Page Link
         row_vals.add(
               "\"" + JsonUtils.getString(rec, "repository_link_landing_page", "").replaceAll("\"", "\"\"") + "\"");

         // Software Title
         row_vals.add("\"" + JsonUtils.getString(rec, "software_title", "").replaceAll("\"", "\"\"") + "\"");

         // Description
         row_vals.add("\"" + JsonUtils.getString(rec, "description", "").replaceAll("\"", "\"\"") + "\"");

         // License(s)
         row_vals.add("\"" + JsonUtils.getString(rec, "licenses", "").replaceAll("\"", "\"\"") + "\"");

         // Programming Language(s)
         row_vals.add("\"" + JsonUtils.getString(rec, "programming_languages", "").replaceAll("\"", "\"\"") + "\"");

         // Version Number
         row_vals.add("\"" + JsonUtils.getString(rec, "version_number", "").replaceAll("\"", "\"\"") + "\"");

         // Documentation URL
         row_vals.add("\"" + JsonUtils.getString(rec, "documentation_url", "").replaceAll("\"", "\"\"") + "\"");

         // Developer(s)
         row_vals.add("\"" + JsonUtils.getString(rec, "developers_list", "").replaceAll("\"", "\"\"") + "\"");

         // Don't show the DOI unless we have a release date
         String doi = JsonUtils.getString(rec, "doi", "");
         String release_date = JsonUtils.getString(rec, "release_date", "");

         String display_doi = SearchFunctions.showDOI(doi, release_date) ? doi : "";
         // DOI
         row_vals.add("\"" + display_doi.replaceAll("\"", "\"\"") + "\"");

         // Release Date
         row_vals.add("\"" + release_date.replaceAll("\"", "\"\"") + "\"");

         // Short Title
         row_vals.add("\"" + JsonUtils.getString(rec, "short_title", "").replaceAll("\"", "\"\"") + "\"");

         // Country of Origin
         row_vals.add("\"" + JsonUtils.getString(rec, "country_of_origin", "").replaceAll("\"", "\"\"") + "\"");

         // Keywords
         row_vals.add("\"" + JsonUtils.getString(rec, "keywords", "").replaceAll("\"", "\"\"") + "\"");

         // Other Special Requirements
         row_vals
               .add("\"" + JsonUtils.getString(rec, "other_special_requirements", "").replaceAll("\"", "\"\"") + "\"");

         // Site Accession Number
         row_vals.add("\"" + JsonUtils.getString(rec, "site_accession_number", "").replaceAll("\"", "\"\"") + "\"");

         // Sponsoring orgs
         row_vals.add("\"" + JsonUtils.getString(rec, "sponsor_orgs", "").replaceAll("\"", "\"\"") + "\"");

         // Research Orgs
         row_vals.add("\"" + JsonUtils.getString(rec, "research_orgs", "").replaceAll("\"", "\"\"") + "\"");

         // Contributors
         row_vals.add("\"" + JsonUtils.getString(rec, "contributors", "").replaceAll("\"", "\"\"") + "\"");

         // Contributing Orgs
         row_vals.add("\"" + JsonUtils.getString(rec, "contributing_orgs", "").replaceAll("\"", "\"\"") + "\"");

         // Related Identifiers
         row_vals.add("\"" + JsonUtils.getString(rec, "related_identifiers", "").replaceAll("\"", "\"\"") + "\"");

         docs_rows.add(DOECODEUtils.makeTokenSeparatedList(row_vals, ","));
      }

      String return_data = StringUtils.join(SEARCH_RESULTS_HEADER_LIST, ",") + "\n";
      for (JsonNode j : docs_rows) {
         return_data += (j.asText() + "\n");
      }

      return return_data;
   }

   public static Workbook getExcelSearchExports(ArrayNode search_data) {
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
      // Put in all of the report header labels
      for (int i = 0; i < SEARCH_RESULTS_HEADER_LIST.size(); i++) {
         cell = row.createCell(i);
         cell.setCellStyle(header_style);
         cell.setCellValue(SEARCH_RESULTS_HEADER_LIST.get(i));
      }

      // Put out all of the data rows
      CellStyle cell_style = book.createCellStyle();
      cell_style.setAlignment(HorizontalAlignment.CENTER);

      for (int i = 0; i < search_data.size(); i++) {
         row = sheet1.createRow(i + 1);
         ObjectNode rec = getSearchResultsReportVersion((ObjectNode) search_data.get(i));

         // Code ID
         cell = row.createCell(0);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getLong(rec, "code_id", 0));

         // Software type
         cell = row.createCell(1);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "software_type", ""));

         // Project Type
         cell = row.createCell(2);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "project_type", ""));

         // Repository/Landing Page Link
         cell = row.createCell(3);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "repository_link_landing_page", ""));

         // Software Title
         cell = row.createCell(4);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "software_title", ""));

         // Description
         cell = row.createCell(5);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "description", ""));

         // License(s)
         cell = row.createCell(6);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "licenses", ""));

         // Programming Language(s)
         cell = row.createCell(7);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "programming_languages", ""));

         // Version Number
         cell = row.createCell(8);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "version_number", ""));

         // Documentation URL
         cell = row.createCell(9);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "documentation_url", ""));

         // Developer(s)
         cell = row.createCell(10);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "developers_list", ""));

         // Don't show the DOI unless there is a release date
         String doi = JsonUtils.getString(rec, "doi", "");
         String release_date = JsonUtils.getString(rec, "release_date", "");
         // DOI
         cell = row.createCell(11);
         cell.setCellStyle(cell_style);
         cell.setCellValue(SearchFunctions.showDOI(doi, release_date) ? doi : "");

         // Release Date
         cell = row.createCell(12);
         cell.setCellStyle(cell_style);
         cell.setCellValue(release_date);

         // Short Title
         cell = row.createCell(13);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "short_title", ""));

         // Country of Origin
         cell = row.createCell(14);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "country_of_origin", ""));

         // Keywords
         cell = row.createCell(15);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "keywords", ""));

         // Other Special Requirements
         cell = row.createCell(16);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "other_special_requirements", ""));

         // Site Accession Number
         cell = row.createCell(17);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "site_accession_number", ""));

         // Sponsoring orgs
         cell = row.createCell(18);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "sponsor_orgs", ""));

         // Research Orgs
         cell = row.createCell(19);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "research_orgs", ""));

         // Contributors
         cell = row.createCell(20);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "contributors", ""));

         // Contributing Orgs
         cell = row.createCell(21);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "contributing_orgs", ""));

         // Related Identifiers
         cell = row.createCell(22);
         cell.setCellStyle(cell_style);
         cell.setCellValue(JsonUtils.getString(rec, "related_identifiers", ""));

      }

      for (int i = 0; i < SEARCH_RESULTS_HEADER_LIST.size(); i++) {
         sheet1.autoSizeColumn(i);
      }
      return book;
   }

   public static String getJsonSearchExports(ArrayNode search_data) {
      ArrayNode return_data = new ArrayNode(JsonUtils.INSTANCE);
      for (JsonNode doc : search_data) {
         return_data.add(getSearchResultsReportVersion((ObjectNode) doc));
      }

      return return_data.toString();
   }

   private static ObjectNode getSearchResultsReportVersion(ObjectNode docs) {
      ObjectNode return_data = new ObjectNode(JsonUtils.INSTANCE);
      // code id
      return_data.put("code_id", JsonUtils.getLong(docs, "code_id", 0));

      // Software type
      String software_type = JsonUtils.getString(docs, "software_type", "");
      ArrayNode software_types = DOECODEServletContextListener.getJsonList(DOECODEJson.SOFTWARE_TYPE_KEY);
      return_data.put("software_type", DOECODEUtils.getDisplayVersionOfValue(software_types, software_type));

      // Project Type
      String project_type = JsonUtils.getString(docs, "accessibility", "");
      ArrayNode project_types = DOECODEServletContextListener.getJsonList(DOECODEJson.AVAILABILITY_KEY);
      return_data.put("project_type", DOECODEUtils.getDisplayVersionOfValue(project_types, project_type));

      // Repository/Landing Page Link
      String repos_landing_page_str = "";
      String landing_page = JsonUtils.getString(docs, "landing_page", "");
      String repository_link = JsonUtils.getString(docs, "repository_link", "");
      if (StringUtils.isNotBlank(landing_page)) {
         repos_landing_page_str += (landing_page + "; ");
      }
      if (StringUtils.isNotBlank(repository_link)) {
         repos_landing_page_str += repository_link;
      }
      return_data.put("repository_link_landing_page", repos_landing_page_str);

      // Software Title
      return_data.put("software_title", JsonUtils.getString(docs, "software_title", ""));

      // Description
      return_data.put("description", JsonUtils.getString(docs, "description", ""));

      // License(s)
      ArrayNode licenses = (ArrayNode) docs.get("licenses");
      return_data.put("licenses", DOECODEUtils.makeTokenSeparatedList(licenses, "; "));

      // Programming Language(s)
      ArrayNode programming_languages = (ArrayNode) docs.get("programming_languages");
      return_data.put("programming_languages", DOECODEUtils.makeTokenSeparatedList(programming_languages, "; "));

      // Version Number
      return_data.put("version_number", JsonUtils.getString(docs, "version_number", ""));

      // Documentation URL
      return_data.put("documentation_url", JsonUtils.getString(docs, "documentation_url", ""));

      // Developer(s)
      ArrayNode developers = (ArrayNode) docs.get("developers");
      ArrayNode developer_displays = new ArrayNode(JsonUtils.INSTANCE);
      for (JsonNode n : developers) {
         ObjectNode row = (ObjectNode) n;
         ArrayNode name_parts = new ArrayNode(JsonUtils.INSTANCE);
         String last_name = JsonUtils.getString(row, "last_name", "");
         if (StringUtils.isNotBlank(last_name)) {
            name_parts.add(last_name);
         }
         String first_name = JsonUtils.getString(row, "first_name", "");
         if (StringUtils.isNotBlank(first_name)) {
            name_parts.add(first_name);
         }
         String name = DOECODEUtils.makeTokenSeparatedList(name_parts, ", ");

         ArrayNode other_parts = new ArrayNode(JsonUtils.INSTANCE);
         String orc_id = JsonUtils.getString(row, "orcid", "");
         if (StringUtils.isNotBlank(orc_id)) {
            other_parts.add("ORCID: " + orc_id);
         }
         ArrayNode affiliations = (ArrayNode) row.get("affiliations");
         String affiliations_str = (null != affiliations && affiliations.size() > 0)
               ? DOECODEUtils.makeTokenSeparatedList(affiliations, "; ")
               : "";
         if (StringUtils.isNotBlank(affiliations_str)) {
            other_parts.add("Affiliations: " + affiliations_str);
         }
         String other_parts_str = DOECODEUtils.makeTokenSeparatedList(other_parts, ", ");

         String display = name;
         if (StringUtils.isNotBlank(other_parts_str)) {
            display += " (" + other_parts_str + ")";
         }

         developer_displays.add(display);
      }
      return_data.put("developers_list", DOECODEUtils.makeTokenSeparatedList(developer_displays, "; "));

      // Don't show the DOI unless there is a doi and a release date
      String doi = JsonUtils.getString(docs, "doi", "");
      String release_date = JsonUtils.getString(docs, "release_date", "");
      // DOI
      return_data.put("doi", SearchFunctions.showDOI(doi, release_date) ? doi : "");

      // Release Date
      return_data.put("release_date", release_date);

      // Short Title
      return_data.put("short_title", JsonUtils.getString(docs, "acronym", ""));

      // Country of Origin
      return_data.put("country_of_origin", JsonUtils.getString(docs, "country_of_origin", ""));

      // Keywords
      return_data.put("keywords", JsonUtils.getString(docs, "keywords", ""));

      // Other Special Requirements
      return_data.put("other_special_requirements", JsonUtils.getString(docs, "other_special_requirements", ""));

      // Site Accession Number
      return_data.put("site_accession_number", JsonUtils.getString(docs, "site_accession_number", ""));

      // Sponsoring orgs
      ArrayNode sponsor_orgs_list = new ArrayNode(JsonUtils.INSTANCE);
      for (JsonNode j : (ArrayNode) docs.get("sponsoring_organizations")) {
         ObjectNode row = (ObjectNode) j;

         // Gather all of the values we'll put in the array
         // Name
         String org_name = JsonUtils.getString(row, "organization_name", "");
         // is doe
         boolean is_doe = JsonUtils.getBoolean(row, "DOE", false);
         // Contrat num
         String primary_award = JsonUtils.getString(row, "primary_award", "");

         ArrayNode additional_rewards = new ArrayNode(JsonUtils.INSTANCE);
         ArrayNode br_codes = new ArrayNode(JsonUtils.INSTANCE);
         ArrayNode fwp_nums = new ArrayNode(JsonUtils.INSTANCE);
         for (JsonNode jn : (ArrayNode) row.get("funding_identifiers")) {
            ObjectNode f_identifiers = (ObjectNode) jn;
            String value = JsonUtils.getString(f_identifiers, "identifier_value", "");
            switch (JsonUtils.getString(f_identifiers, "identifier_type", "")) {
            case "AwardNumber":
               additional_rewards.add(value);
               break;
            case "FWPNumber":
               fwp_nums.add(value);
               break;
            case "BRCode":
               br_codes.add(value);
               break;
            }
         }

         // Assemble the string
         ArrayNode value_str = new ArrayNode(JsonUtils.INSTANCE);
         value_str.add("DOE Organization (" + (is_doe ? "Y" : "N"));
         value_str.add("Primary Award/Contract: " + primary_award);

         if (additional_rewards.size() > 0) {
            value_str
                  .add("Additional Awards/Contracts: " + DOECODEUtils.makeTokenSeparatedList(additional_rewards, "; "));
         }
         if (fwp_nums.size() > 0) {
            value_str.add("FWP Numbers: " + DOECODEUtils.makeTokenSeparatedList(fwp_nums, "; "));
         }
         if (br_codes.size() > 0) {
            value_str.add("B&R Codes: " + DOECODEUtils.makeTokenSeparatedList(br_codes, "; "));
         }

         sponsor_orgs_list.add(org_name + " (" + DOECODEUtils.makeTokenSeparatedList(value_str, ", ") + ")");
      }
      return_data.put("sponsor_orgs", DOECODEUtils.makeTokenSeparatedList(sponsor_orgs_list, "; "));

      // Researh Orgs
      ArrayNode research_orgs_list = new ArrayNode(JsonUtils.INSTANCE);
      for (JsonNode j : (ArrayNode) docs.get("research_organizations")) {
         ObjectNode row = (ObjectNode) j;
         String organization_name = JsonUtils.getString(row, "organization_name", "");
         boolean is_doe = JsonUtils.getBoolean(row, "DOE", false);
         if (StringUtils.isNotBlank(organization_name)) {
            organization_name += " (DOE Organization: " + (is_doe ? "Y" : "N") + ")";
         }
         research_orgs_list.add(organization_name);
      }
      return_data.put("research_orgs", DOECODEUtils.makeTokenSeparatedList(research_orgs_list, "; "));

      // Contributors
      ArrayNode contributors_list = new ArrayNode(JsonUtils.INSTANCE);
      ArrayNode contributors = (ArrayNode) docs.get("contributors");
      for (JsonNode j : contributors) {
         ObjectNode row = (ObjectNode) j;
         // Name
         ArrayNode name_parts = new ArrayNode(JsonUtils.INSTANCE);
         String last_name = JsonUtils.getString(row, "last_name", "");
         if (StringUtils.isNotBlank(last_name)) {
            name_parts.add(last_name);
         }
         String first_name = JsonUtils.getString(row, "first_name", "");
         if (StringUtils.isNotBlank(first_name)) {
            name_parts.add(first_name);
         }
         String name = DOECODEUtils.makeTokenSeparatedList(name_parts, ", ");
         // Other Info
         ArrayNode other_parts = new ArrayNode(JsonUtils.INSTANCE);
         String orc_id = JsonUtils.getString(row, "orcid", "");
         if (StringUtils.isNotBlank(orc_id)) {
            other_parts.add("ORCID: " + orc_id);
         }
         ArrayNode affiliations = (ArrayNode) row.get("affiliations");
         String affiliations_str = (null != affiliations && affiliations.size() > 0)
               ? DOECODEUtils.makeTokenSeparatedList(affiliations, "; ")
               : "";
         if (StringUtils.isNotBlank(affiliations_str)) {
            other_parts.add("Affiliations: " + affiliations_str);
         }
         String contributor_type = JsonUtils.getString(row, "contributor_type", "");
         if (StringUtils.isNotBlank(contributor_type)) {
            contributor_type = DOECODEUtils.getDisplayVersionOfValue(
                  DOECODEServletContextListener.getJsonList(DOECODEJson.CONTRIBUTOR_KEY), contributor_type);
            other_parts.add("Contributor Type: " + contributor_type);
         }
         String other_parts_str = DOECODEUtils.makeTokenSeparatedList(other_parts, ", ");

         String display = name;
         if (StringUtils.isNotBlank(other_parts_str)) {
            display += " (" + other_parts_str + ")";
         }
         contributors_list.add(display);
      }
      return_data.put("contributors", DOECODEUtils.makeTokenSeparatedList(contributors_list, "; "));

      // Contributing Orgs
      ArrayNode contributing_orgs_list = new ArrayNode(JsonUtils.INSTANCE);
      for (JsonNode j : (ArrayNode) docs.get("contributing_organizations")) {
         ObjectNode row = (ObjectNode) j;
         String name = JsonUtils.getString(row, "organization_name", "");
         String contributor_type = JsonUtils.getString(row, "contributor_type", "");
         boolean is_doe = JsonUtils.getBoolean(row, "DOE", false);
         contributing_orgs_list.add(
               name + " (DOE Organization: " + (is_doe ? "Y" : "N") + ", Contributor Type: " + contributor_type + ")");
      }
      return_data.put("contributing_orgs", DOECODEUtils.makeTokenSeparatedList(contributing_orgs_list, "; "));

      // Related Identifiers
      ArrayNode related_identifiers_list = new ArrayNode(JsonUtils.INSTANCE);
      for (JsonNode j : (ArrayNode) docs.get("related_identifiers")) {
         ObjectNode row = (ObjectNode) j;
         String value = JsonUtils.getString(row, "identifier_value", "");
         String type = JsonUtils.getString(row, "identifier_type", "");
         String relation_type = JsonUtils.getString(row, "relation_type", "");

         related_identifiers_list.add(value + " (Identifier Type: " + type + ", Relation Type: " + relation_type + ")");
      }
      return_data.put("related_identifiers", DOECODEUtils.makeTokenSeparatedList(related_identifiers_list, "; "));

      return return_data;
   }
}
