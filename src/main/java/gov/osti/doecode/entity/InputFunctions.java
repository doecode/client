package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonObjectUtils;
import javax.servlet.ServletContext;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class InputFunctions {

     private static Logger log = LoggerFactory.getLogger(InputFunctions.class.getName());

     public static ObjectNode getInputFormLists(ServletContext context) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          return_data.put("availabilities_list", DOECODEServletContextListener.getJsonList(DOECODEJson.AVAILABILITY_KEY));
          return_data.put("licenses_list", DOECODEServletContextListener.getJsonList(DOECODEJson.LICENSE_KEY));
          return_data.put("affiliations_list", DOECODEServletContextListener.getJsonList(DOECODEJson.AFFILIATIONS_KEY));
          return_data.put("countries_list", DOECODEServletContextListener.getJsonList(DOECODEJson.COUNTRIES_KEY));
          return_data.put("sponsoring_orgs_list", DOECODEServletContextListener.getJsonList(DOECODEJson.SPONSOR_ORG_KEY));
          return_data.put("research_orgs_list", DOECODEServletContextListener.getJsonList(DOECODEJson.RESEARCH_KEY));
          return_data.put("contributor_type_list", DOECODEServletContextListener.getJsonList(DOECODEJson.CONTRIBUTOR_KEY));
          return return_data;
     }

}
