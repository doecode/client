/**
 * This class is designed to add some convenience functions (based on eclipsesource json) to the json objects used in the java in this application.
 */
package gov.osti.doecode.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.JsonNodeFactory;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.io.IOException;
import java.io.PrintWriter;
import java.io.Reader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.ArrayList;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;

/**
 *
 * @author smithwa
 */
public class JsonUtils {

    private static Logger log = LoggerFactory.getLogger(JsonUtils.class.getName());

    public static final JsonNodeFactory INSTANCE = JsonNodeFactory.instance;
    public static final ObjectMapper MAPPER = new ObjectMapper();

    public static ObjectNode createObjectNode() {
        return MAPPER.createObjectNode();
    }

    public static ArrayNode createArrayNode() {
        return MAPPER.createArrayNode();
    }

    /*
     Takes a json array, and you pass what key in that array you're comparing to, and what value
     So like, I could be looking for the value "ON" in the availabilities json list, and I want to compare it to the "value" key
     If we do that, it's like getJsonListItem(list,"value",val);
     */
    public static ObjectNode getJsonListItem(ArrayNode array, String key, String value) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        for (JsonNode v : array) {
            ObjectNode row = (ObjectNode) v;
            if (StringUtils.equals(row.findPath(key).asText(""), value)) {
                return_data = row;
                break;
            }
        }
        return return_data;
    }

    public static boolean arrayContains(ArrayNode arr, String s) {
        for (JsonNode j : arr) {
            if (StringUtils.equals(j.asText(""), s)) {
                return true;
            }
        }
        return false;
    }

    public static ArrayList<String> getKeys(ObjectNode on) {
        ArrayList<String> keys = new ArrayList<String>();
        on.fieldNames().forEachRemaining((s) -> {
            keys.add(s);
        });
        return keys;
    }

    public static boolean isValidObjectNode(String jsonString) {
        boolean isJson = true;
        try {
            MAPPER.readTree(jsonString);
        } catch (Exception e) {
            isJson = false;
        }
        return isJson;
    }

    public static ObjectNode parseObjectNode(String s) {
        ObjectNode on = new ObjectNode(INSTANCE);
        try {
            on = (ObjectNode) MAPPER.readTree(s);
        } catch (Exception e) {
            log.debug("Exception in parsing object" + e.getMessage());
        }
        return on;
    }

    public static ObjectNode parseObjectNode(Reader r) {
        ObjectNode on = new ObjectNode(INSTANCE);
        try {
            on = (ObjectNode) MAPPER.readTree(r);
        } catch (Exception e) {
            log.debug("Exception in parsing object " + e.getMessage());
        }
        return on;
    }

    public static ArrayNode parseArrayNode(String s) {
        ArrayNode an = new ArrayNode(INSTANCE);
        try {
            an = (ArrayNode) MAPPER.readTree(s);
        } catch (Exception e) {
            log.debug("Exception in parsing array: " + e.getMessage());
        }
        return an;
    }

    public static ArrayNode parseArrayNode(Reader r) {
        ArrayNode an = new ArrayNode(INSTANCE);
        try {
            an = (ArrayNode) MAPPER.readTree(r);
        } catch (Exception e) {
            log.debug("Exception in parsing array: " + e.getMessage());
        }
        return an;
    }

    public static void writeTo(ObjectNode obj, HttpServletResponse response) throws IOException {
        response.setContentType("application/json; charset=UTF-8");
        PrintWriter p = response.getWriter();
        p.print(obj.toString());
        p.flush();
        p.close();
    }
}
