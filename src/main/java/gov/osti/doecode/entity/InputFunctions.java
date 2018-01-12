package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.utils.JsonObjectUtils;
import javax.servlet.ServletContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InputFunctions {

     private static Logger log = LoggerFactory.getLogger(InputFunctions.class.getName());

     public static ObjectNode getInputFormLists(ServletContext context) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          try {
               String jsonPath = context.getRealPath("./json");
               return_data.put("availabilities_list", JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.AVAILABILITIES_LIST_JSON, JsonObjectUtils.AVAILABILITIES_LIST_JSON_KEY));
               return_data.put("licenses_list", JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.LICENSE_OPTIONS_LIST_JSON, JsonObjectUtils.LICENSE_JLIST_SON_KEY));
               return_data.put("affiliations_list", JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.AFFILIATIONS_LIST_JSON, JsonObjectUtils.AFFILIATIONS_LIST_JSON_KEY));
               return_data.put("countries_list", JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.COUNTRIES_LIST_JSON, JsonObjectUtils.COUNTRIES_LIST_JSON_KEY));
               return_data.put("sponsoring_orgs_list", JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.SPONSOR_ORG_LIST_JSON, JsonObjectUtils.SPONSOR_ORG_LIST_JSON_KEY));
               return_data.put("research_orgs_list", JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.RESEARCH_ORG_LIST_JSON, JsonObjectUtils.RESEARCH_ORG_LIST_JSON_KEY));
               return_data.put("contributor_type_list", JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.CONTRIBUTOR_TYPES_LIST_JSON, JsonObjectUtils.CONTRIBUTOR_TYPES_LIST_JSON_KEY));
          } catch (Exception e) {
               log.error("Error in loading input json lists: " + e.getMessage());
          }
          return return_data;
     }

}
