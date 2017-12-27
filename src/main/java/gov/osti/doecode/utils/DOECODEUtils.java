package gov.osti.doecode.utils;

import com.eclipsesource.json.Json;
import com.eclipsesource.json.JsonArray;
import com.eclipsesource.json.JsonObject;
import com.eclipsesource.json.JsonValue;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.logging.Logger;

public class DOECODEUtils {

     private final static Logger log = Logger.getLogger(DOECODEUtils.class.getName());

     public static final String AVAILABILITIES_LIST_JSON_KEY = "availabilities";
     public static final String AVAILABILITIES_LIST_JSON = "availabilityList.json";

     public static final String LICENSE_JLIST_SON_KEY = "licenseOptions";
     public static final String LICENSE_OPTIONS_LIST_JSON = "licenseOptionsList.json";

     public static final String RESEARCH_ORG_LIST_JSON_KEY = "researchOrgs";
     public static final String RESEARCH_ORG_LIST_JSON = "researchOrgList.json";

     public static final String SEARCH_SORT_LIST_JSON_KEY = "searchSortOptions";
     public static final String SEARCH_SORT_OPTIONS_LIST_JSON = "searchSortOptionsList.json";

     public static final String SPONSOR_ORG_LIST_JSON_KEY = "sponsorOrgs";
     public static final String SPONSOR_ORG_LIST_JSON = "sponsorOrgsList.json";

     public static final String AFFILIATIONS_LIST_JSON_KEY = "affiliations";
     public static final String AFFILIATIONS_LIST_JSON = "affiliationsList.json";

     public static final String COUNTRIES_LIST_JSON_KEY = "countries";
     public static final String COUNTRIES_LIST_JSON = "countriesList.json";

     public static final String CONTRIBUTOR_TYPES_LIST_JSON_KEY = "contributorTypes";
     public static final String CONTRIBUTOR_TYPES_LIST_JSON = "contributorTypes.json";
     
     public static final String SOFTWARE_TYPES_LIST_JSON_KEY = "softwareTypes";
     public static final String SOFTWARE_TYPES_LIST_JSON = "softwareTypeList.json";

     public static JsonArray getJsonList(String path, String key) throws IOException {
          File f = new File(path);
          byte[] bytes = Files.readAllBytes(f.toPath());
          String s = new String(bytes, "UTF-8");
          return Json.parse(s).asObject().get(key).asArray();
     }

     /*
          Takes a json array, and you pass what key in that array you're comparing to, and what value
          So like, I could be looking for the value "ON" in the availabilities json list, and I want to compare it to the "value" key
          If we do that, it's like getJsonListItem(list,"value",val);
      */
     public static JsonObject getJsonListItem(JsonArray array, String key, String value) {
          JsonObject return_data = new JsonObject();
          for (JsonValue v : array) {
               JsonObject row = v.asObject();
               if (row.getString(key, "").equals(value)) {
                    return_data = row;
                    break;
               }
          }
          return return_data;
     }

     public static boolean isValidDateOfPattern(DateTimeFormatter format, String date) {
          boolean is_valid = true;
          try {
               LocalDate.parse(date, format);
          } catch (Exception e) {
               is_valid = false;
          }
          return is_valid;
     }

     public static boolean isValidLong(String num) {
          boolean isNum = true;

          try {
               Long.parseLong(num);
          } catch (Exception e) {
               isNum = false;
          }

          return isNum;
     }

     public static boolean isValidJsonObject(String jsonString) {
          boolean isJson = true;

          try {
               Json.parse(jsonString).asObject();
          } catch (Exception e) {
               isJson = false;
          }

          return isJson;
     }

     public static String makeSpaceSeparatedList(JsonArray list) {
          StringBuilder b = new StringBuilder();
          for (int i = 0; i < list.size(); i++) {
               if (i > 0) {
                    b.append(" ");
               }
               b.append(list.get(i));
          }
          return b.toString();
     }

     

}
