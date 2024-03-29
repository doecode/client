package gov.osti.doecode.entity;

import javax.servlet.ServletContext;

import com.fasterxml.jackson.databind.node.ObjectNode;

import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.utils.JsonUtils;

public class InputFunctions {

   public static ObjectNode getInputFormLists(ServletContext context) {
      ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
      return_data.set("project_type_list", DOECODEServletContextListener.getJsonList(DOECODEJson.PROJECT_TYPE_KEY));
      return_data.set("licenses_list", DOECODEServletContextListener.getJsonList(DOECODEJson.LICENSE_KEY));
      return_data.set("affiliations_list", DOECODEServletContextListener.getJsonList(DOECODEJson.AFFILIATIONS_KEY));
      return_data.set("countries_list", DOECODEServletContextListener.getJsonList(DOECODEJson.COUNTRIES_KEY));
      return_data.set("sponsoring_orgs_list", DOECODEServletContextListener.getJsonList(DOECODEJson.SPONSOR_ORG_KEY));
      return_data.set("research_orgs_list", DOECODEServletContextListener.getJsonList(DOECODEJson.RESEARCH_KEY));
      return_data.set("contributor_personal_type_list", DOECODEServletContextListener.getJsonList(DOECODEJson.CONTRIBUTOR_PERSONAL_KEY));
      return_data.set("contributor_org_type_list", DOECODEServletContextListener.getJsonList(DOECODEJson.CONTRIBUTOR_ORG_KEY));
      return return_data;
   }

}
