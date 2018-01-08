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

          //Let's go ahead and put the message together
          StringBuilder email_message = new StringBuilder();
          /**Name**/
          email_message.append("NAME: \n");
          //First Name
          email_message.append(JsonObjectUtils.getString(return_data, "first_name", ""));
          email_message.append(" ");
          //Middle Name
          email_message.append(JsonObjectUtils.getString(return_data, "middle_name", ""));
          email_message.append(" ");
          //Last Name
          email_message.append(JsonObjectUtils.getString(return_data, "last_name", ""));
          email_message.append(" ");
          //Suffix
          email_message.append(JsonObjectUtils.getString(return_data, "suffix", ""));
          email_message.append("\n\n");

          /**Address**/
          email_message.append("Mailing Address: \n");
          //Street Address
          email_message.append(JsonObjectUtils.getString(return_data, "address", ""));
          email_message.append("\n");
          //City
          email_message.append(JsonObjectUtils.getString(return_data, "city", ""));
          email_message.append(" ");
          //State/Province
          email_message.append(JsonObjectUtils.getString(return_data, "state", ""));
          email_message.append("\n");
          //Postal Code
          email_message.append(JsonObjectUtils.getString(return_data, "postal_code", ""));
          email_message.append(" ");
          //Country
          email_message.append(JsonObjectUtils.getString(return_data, "country", ""));
          email_message.append("\n\n");

          /**Contact Info**/
          email_message.append("Contact Information: \n");
          //Email Address
          email_message.append(JsonObjectUtils.getString(return_data, "email_address", ""));
          email_message.append(" ");
          //PHone Number
          email_message.append(JsonObjectUtils.getString(return_data, "phone_number", ""));
          email_message.append("\n\n");

          /**Job**/
          email_message.append("Job Title/Designation: \n");
          //Job Title
          email_message.append(JsonObjectUtils.getString(return_data, "job_title", ""));
          email_message.append(" ");
          //Employment Designation
          email_message.append(JsonObjectUtils.getString(return_data, "employment_designation", ""));

          HtmlEmail email = new HtmlEmail();
          email.setHostName(context.getInitParameter("smtpHost"));
          try {
               email.setFrom(context.getInitParameter("gitlab_from_email"));
               email.addTo(context.getInitParameter("gitlab_submit_email"));
               email.setSubject("Reset Authority Password");
               email.setMsg(email_message.toString());
               email.send();
          } catch (EmailException e) {
               log.error("Email error: " + e.getMessage());
               return_data.put("error", "Unable to send email due to unknown error");
          }

          return return_data;
     }
}
