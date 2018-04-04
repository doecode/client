package gov.osti.doecode.utils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import org.apache.commons.codec.binary.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DOECODEUtils {

     //public static final DateTimeFormatter MONTH_DAY_YEAR_TIME_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-ddHH:mm:ss");
     public static final DateTimeFormatter MONTH_DAY_YEAR_TIME_FORMAT = DateTimeFormatter.ofPattern("MM/dd/yyyy HH:mm:ss");

     private final static Logger log = LoggerFactory.getLogger(DOECODEUtils.class.getName());

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

     public static String makeSpaceSeparatedList(ArrayNode list) {
          StringBuilder b = new StringBuilder();
          for (int i = 0; i < list.size(); i++) {
               if (i > 0) {
                    b.append(" ");
               }
               b.append(list.get(i));
          }
          return b.toString();
     }

     public static String getDisplayVersionOfValue(ArrayNode array, String value){
          String display_val = value;
          for(JsonNode n:array){
               ObjectNode objNode = (ObjectNode)n;
               String nVal = JsonObjectUtils.getString(objNode,"value","");
               if(StringUtils.equals(nVal,value)){
                    display_val = JsonObjectUtils.getString(objNode, "label", value);
                    break;
               }
          }
          return display_val;
     }
}
