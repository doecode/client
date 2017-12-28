/**
 * This class is designed to add some convenience functions (based on eclipsesource json) to the json objects used in the java in this application.
 */
package gov.osti.doecode.utils;

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

/**
 *
 * @author smithwa
 */
public class JsonObjectUtils {
     
     private static Logger log = LoggerFactory.getLogger(JsonObjectUtils.class.getName());
     
     public static final JsonNodeFactory FACTORY_INSTANCE = JsonNodeFactory.instance;
     public static final ObjectMapper MAPPER = new ObjectMapper();
     
     public static String getString(ObjectNode obj, String key, String defaultValue) {
          return (obj.has(key) && obj.get(key) != null) ? obj.get(key).asText(defaultValue) : defaultValue;
     }
     
     public static int getInt(ObjectNode obj, String key, int defaultValue) {
          return (obj.has(key) && obj.get(key) != null) ? obj.get(key).asInt(defaultValue) : defaultValue;
     }
     
     public static long getLong(ObjectNode obj, String key, long defaultValue) {
          return (obj.has(key) && obj.get(key) != null) ? obj.get(key).asLong(defaultValue) : defaultValue;
     }
     
     public static boolean getBoolean(ObjectNode obj, String key, boolean defaultValue) {
          return (obj.has(key) && obj.get(key) != null) ? obj.get(key).asBoolean(defaultValue) : defaultValue;
     }
     
     public static boolean containsKey(ObjectNode on, String key) {
          return getKeys(on).contains(key);
     }
     
     public static ArrayList<String> getKeys(ObjectNode on) {
          ArrayList<String> keys = new ArrayList();
          on.fieldNames().forEachRemaining((s) -> {
               System.out.println(s);
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
          ObjectNode on = new ObjectNode(FACTORY_INSTANCE);
          try {
               on = (ObjectNode) MAPPER.readTree(s);
          } catch (Exception e) {
               log.error("Exception in parsing object" + e.getMessage());
          }
          return on;
     }
     
     public static ObjectNode parseObjectNode(Reader r) {
          ObjectNode on = new ObjectNode(FACTORY_INSTANCE);
          try {
               on = (ObjectNode) MAPPER.readTree(r);
          } catch (Exception e) {
               log.error("Exception in parsing object " + e.getMessage());
          }
          return on;
     }
     
     public static ArrayNode parseArrayNode(String s) {
          ArrayNode an = new ArrayNode(FACTORY_INSTANCE);
          try {
               an = (ArrayNode) MAPPER.readTree(s);
          } catch (Exception e) {
               log.error("Exception in parsing array: " + e.getMessage());
          }
          return an;
     }
     
     public static ArrayNode parseArrayNode(Reader r) {
          ArrayNode an = new ArrayNode(FACTORY_INSTANCE);
          try {
               an = (ArrayNode) MAPPER.readTree(r);
          } catch (Exception e) {
               log.error("Exception in parsing array: " + e.getMessage());
          }
          return an;
     }
     
     public static void writeTo(ObjectNode obj, HttpServletResponse response) throws IOException {
          PrintWriter p = response.getWriter();
          p.print(obj.toString());
          p.flush();
          p.close();
     }
}
