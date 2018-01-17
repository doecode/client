package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.JsonObjectUtils;
import javax.servlet.ServletContext;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.mail.EmailException;
import org.apache.commons.mail.HtmlEmail;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class OtherFunctions {

     private static Logger log = LoggerFactory.getLogger(OtherFunctions.class.getName());

     public static ObjectNode handleGitlabSubmissionForm(HttpServletRequest request) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);

          //Make sure there's a value for everything that's required. If any one of these dont' have values, return an error
          if (StringUtils.isBlank(request.getParameter("first_name")) || StringUtils.isBlank(request.getParameter("last_name")) || StringUtils.isBlank(request.getParameter("address")) || StringUtils.isBlank(request.getParameter("city")
          ) || StringUtils.isBlank(request.getParameter("postal_code")) || StringUtils.isBlank(request.getParameter("country")) || StringUtils.isBlank(request.getParameter("email_address")) || StringUtils.isBlank(request.getParameter("phone_number")
          ) || StringUtils.isBlank(request.getParameter("job_title")) || StringUtils.isBlank(request.getParameter("employment_designation")) || isValidreCaptcha(request.getParameter("g-recaptcha-response"))) {
               return_data.put("had_error", true);
               return_data.put("message", "You must enter all required fields and validate the captcha");
          } else {
               //Submit form
               ObjectNode requested_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
               requested_data.put("first_name", request.getParameter("first_name"));
               requested_data.put("middle_name", request.getParameter("middle_name"));
               requested_data.put("last_name", request.getParameter("last_name"));
               requested_data.put("suffix", request.getParameter("suffix"));
               requested_data.put("address", request.getParameter("address"));
               requested_data.put("city", request.getParameter("city"));
               requested_data.put("state", request.getParameter("state"));
               requested_data.put("postal_code", request.getParameter("postal_code"));
               requested_data.put("country", request.getParameter("country"));
               requested_data.put("email_address", request.getParameter("email_address"));
               requested_data.put("phone_number", request.getParameter("phone_number"));
               requested_data.put("job_title", request.getParameter("job_title"));
               requested_data.put("employment_designation", request.getParameter("employment_designation"));
               return_data = sendGitlabSubmissionEmail(request.getServletContext(), requested_data);
          }

          return return_data;
     }

     private static boolean isValidreCaptcha(String key) {
          log.info(key);
          boolean is_valid = false;

          return is_valid;
     }

     public static ObjectNode sendGitlabSubmissionEmail(ServletContext context, ObjectNode request_data) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);

          //Check all of the values before submitting
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
               return_data.put("had_error", false);
               return_data.put("message", "Successful signup");
          } catch (EmailException e) {
               log.error("Email error: " + e.getMessage());
               return_data.put("message", "Unable to send email due to unknown error");
               return_data.put("had_error", true);
          }

          return return_data;
     }

     public static ObjectNode getOtherLists(ServletContext context) {
          ObjectNode return_data = new ObjectNode(JsonObjectUtils.FACTORY_INSTANCE);
          try {
               return_data.put("countries_list", Init.countries_list);
               return_data.put("state_list", Init.states_list);
          } catch (Exception e) {
               log.error("Error in loading input json lists: " + e.getMessage());
          }
          return return_data;
     }
}
