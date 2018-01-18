package gov.osti.doecode.utils;

import com.fasterxml.jackson.databind.node.ArrayNode;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import javax.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class DOECODEUtils {

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

     public static String getClientIp(HttpServletRequest request) {

          String remoteAddr = "";

          if (request != null) {
               remoteAddr = request.getHeader("X-FORWARDED-FOR");
               if (remoteAddr == null || "".equals(remoteAddr)) {
                    remoteAddr = request.getRemoteAddr();
               }
          }

          return remoteAddr;
     }

}
