package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonObjectUtils;
import java.io.IOException;
import java.util.logging.Logger;
import javax.servlet.ServletContext;

public class InputFunctions {

     private static Logger log = Logger.getLogger(InputFunctions.class.getName());

     public static ObjectNode getInputFormLists(ServletContext context) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          try {
               return_data.put("availabilities_list", getInputJsonList(context, DOECODEUtils.AVAILABILITIES_LIST_JSON, DOECODEUtils.AVAILABILITIES_LIST_JSON_KEY));
               return_data.put("licenses_list", getInputJsonList(context, DOECODEUtils.LICENSE_OPTIONS_LIST_JSON, DOECODEUtils.LICENSE_JLIST_SON_KEY));
               return_data.put("affiliations_list", getInputJsonList(context, DOECODEUtils.AFFILIATIONS_LIST_JSON, DOECODEUtils.AFFILIATIONS_LIST_JSON_KEY));
               return_data.put("countries_list", getInputJsonList(context, DOECODEUtils.COUNTRIES_LIST_JSON, DOECODEUtils.COUNTRIES_LIST_JSON_KEY));
               return_data.put("sponsoring_orgs_list", getInputJsonList(context, DOECODEUtils.SPONSOR_ORG_LIST_JSON, DOECODEUtils.SPONSOR_ORG_LIST_JSON_KEY));
               return_data.put("research_orgs_list", getInputJsonList(context, DOECODEUtils.RESEARCH_ORG_LIST_JSON, DOECODEUtils.RESEARCH_ORG_LIST_JSON_KEY));
               return_data.put("contributor_type_list", getInputJsonList(context, DOECODEUtils.CONTRIBUTOR_TYPES_LIST_JSON, DOECODEUtils.CONTRIBUTOR_TYPES_LIST_JSON_KEY));
          } catch (Exception e) {
               log.severe("Error in loading input json lists: " + e.getMessage());
          }
          return return_data;
     }

     public static ArrayNode getInputJsonList(ServletContext context, String list, String key) throws IOException {
          String jsonPath = context.getRealPath("./json");
          return DOECODEUtils.getJsonList(jsonPath + "/" + list, key);
     }
}
