package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class SitesFunctions {
    private static Logger log = LoggerFactory.getLogger(SitesFunctions.class);

    public static ObjectNode getSitesList(String xsrfToken, String accessToken) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        ArrayNode sites_list = DOECODEUtils.makeAuthenticatedGetArrRequest(Init.backend_api_url + "site/info", xsrfToken, accessToken);
        return_data.set("sites_list", sites_list);
        return return_data;
    }
}
