package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonObjectUtils;
import javax.servlet.ServletContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InputFunctions {

     private static Logger log = LoggerFactory.getLogger(InputFunctions.class.getName());

     public static ObjectNode getInputFormLists(ServletContext context) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          return_data.put("availabilities_list", Init.availabilities_list);
          return_data.put("licenses_list", Init.licenses_list);
          return_data.put("affiliations_list", Init.affiliations_list);
          return_data.put("countries_list", Init.countries_list);
          return_data.put("sponsoring_orgs_list", Init.sponsor_org_list);
          return_data.put("research_orgs_list", Init.research_org_list);
          return_data.put("contributor_type_list", Init.contributor_type_list);
          return return_data;
     }

}
