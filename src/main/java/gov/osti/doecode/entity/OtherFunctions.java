package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.utils.JsonObjectUtils;
import javax.servlet.ServletContext;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OtherFunctions {

     private static Logger log = LoggerFactory.getLogger(OtherFunctions.class.getName());

     public static ObjectNode sendGitlabSubmissionEmail(ServletContext context, ObjectNode request_data) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          boolean success = true;

          //Let's go ahead and put the message together
          StringBuilder email_message = new StringBuilder();
          /**
           * Name*
           */
          email_message.append("NAME: \n");
          //First Name
          email_message.append(JsonObjectUtils.getString(request_data, "first_name", ""));
          email_message.append(" ");
          //Middle Name
          email_message.append(JsonObjectUtils.getString(request_data, "middle_name", ""));
          email_message.append(" ");
          //Last Name
          email_message.append(JsonObjectUtils.getString(request_data, "last_name", ""));
          email_message.append(" ");
          //Suffix
          email_message.append(JsonObjectUtils.getString(request_data, "suffix", ""));
          email_message.append("\n\n");

          /**
           * Address*
           */
          email_message.append("Mailing Address: \n");
          //Street Address
          email_message.append(JsonObjectUtils.getString(request_data, "address", ""));
          email_message.append("\n");
          //City
          email_message.append(JsonObjectUtils.getString(request_data, "city", ""));
          email_message.append(" ");
          //State/Province
          email_message.append(JsonObjectUtils.getString(request_data, "state", ""));
          email_message.append("\n");
          //Postal Code
          email_message.append(JsonObjectUtils.getString(request_data, "postal_code", ""));
          email_message.append(" ");
          //Country
          email_message.append(JsonObjectUtils.getString(request_data, "country", ""));
          email_message.append("\n\n");

          /**
           * Contact Info*
           */
          email_message.append("Contact Information: \n");
          //Email Address
          email_message.append(JsonObjectUtils.getString(request_data, "email_address", ""));
          email_message.append(" ");
          //PHone Number
          email_message.append(JsonObjectUtils.getString(request_data, "phone_number", ""));
          email_message.append("\n\n");

          /**
           * Job*
           */
          email_message.append("Job Title/Designation: \n");
          //Job Title
          email_message.append(JsonObjectUtils.getString(request_data, "job_title", ""));
          email_message.append(" ");
          //Employment Designation
          email_message.append(JsonObjectUtils.getString(request_data, "employment_designation", ""));

          HtmlEmail email = new HtmlEmail();
          email.setHostName(context.getInitParameter("smtpHost"));
          try {
               email.setFrom(context.getInitParameter("gitlab_from_email"));
               email.addTo(context.getInitParameter("gitlab_submit_email"));
               email.setSubject("OSTI Gitlab Registration");
               email.setMsg(email_message.toString());
               email.send();
          } catch (EmailException e) {
               log.error("Email error: " + e.getMessage());
               return_data.put("error", "Unable to send email due to unknown error");
               success = false;
          }

          return_data.put("success", success);
          return return_data;
     }

     public static ObjectNode getOtherLists(ServletContext context) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          try {
               String jsonPath = context.getRealPath("./json");
               return_data.put("countries_list", JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.COUNTRIES_LIST_JSON, JsonObjectUtils.COUNTRIES_LIST_JSON_KEY));
               return_data.put("state_list", JsonObjectUtils.getJsonList(jsonPath + "/" + JsonObjectUtils.STATE_LIST_JSON, JsonObjectUtils.STATE_LIST_JSON_KEY));
          } catch (Exception e) {
               log.error("Error in loading input json lists: " + e.getMessage());
          }
          return return_data;
     }
}
