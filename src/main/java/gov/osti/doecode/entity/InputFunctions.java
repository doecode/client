package gov.osti.doecode.entity;

import javax.servlet.ServletContext;

import com.fasterxml.jackson.databind.node.ObjectNode;

import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.utils.JsonUtils;

public class InputFunctions {

   public static ObjectNode getInputFormLists(ServletContext context) {
      ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
      return_data.set("availabilities_list", DOECODEServletContextListener.getJsonList(DOECODEJson.AVAILABILITY_KEY));
      return_data.set("licenses_list", DOECODEServletContextListener.getJsonList(DOECODEJson.LICENSE_KEY));
      return_data.set("affiliations_list", DOECODEServletContextListener.getJsonList(DOECODEJson.AFFILIATIONS_KEY));
      return_data.set("countries_list", DOECODEServletContextListener.getJsonList(DOECODEJson.COUNTRIES_KEY));
      return_data.set("sponsoring_orgs_list", DOECODEServletContextListener.getJsonList(DOECODEJson.SPONSOR_ORG_KEY));
      return_data.set("research_orgs_list", DOECODEServletContextListener.getJsonList(DOECODEJson.RESEARCH_KEY));
      return_data.set("contributor_type_list", DOECODEServletContextListener.getJsonList(DOECODEJson.CONTRIBUTOR_KEY));
      return return_data;
   }

}
