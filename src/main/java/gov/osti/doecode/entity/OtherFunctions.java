package gov.osti.doecode.entity;

import com.fasterxml.jackson.databind.node.ObjectNode;
import gov.osti.doecode.listeners.DOECODEServletContextListener;
import gov.osti.doecode.servlet.Init;
import gov.osti.doecode.utils.DOECODEUtils;
import gov.osti.doecode.utils.JsonUtils;
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
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        String captcha_response = request.getParameter("g-recaptcha-response");
        String recaptcha_secretkey = Init.recaptcha_secretkey;
        String ip_address = "";
        // Make sure there's a value for everything that's required. If any one of these
        // dont' have values, return an error
        if (StringUtils.isBlank(request.getParameter("first_name"))
                || StringUtils.isBlank(request.getParameter("last_name"))
                || StringUtils.isBlank(request.getParameter("address"))
                || StringUtils.isBlank(request.getParameter("city"))
                || StringUtils.isBlank(request.getParameter("postal_code"))
                || StringUtils.isBlank(request.getParameter("country"))
                || StringUtils.isBlank(request.getParameter("email_address"))
                || StringUtils.isBlank(request.getParameter("phone_number"))
                || StringUtils.isBlank(request.getParameter("job_title"))
                || StringUtils.isBlank(request.getParameter("employment_designation"))
                || StringUtils.isBlank(captcha_response) || StringUtils.isBlank(recaptcha_secretkey)
                || !isValidreCaptcha(captcha_response, recaptcha_secretkey, ip_address)
                || !allConditionalAreValid(request)) {
            return_data.put("had_error", true);
            return_data.put("message", "You must enter all required fields and validate the captcha.");
        } else {
            // Submit form
            ObjectNode requested_data = JsonUtils.MAPPER.createObjectNode();
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
            requested_data.put("contract_number", request.getParameter("contract_number"));
            requested_data.put("contracting_organization",
                    request.getParameter("contracting_organization"));
            requested_data.put("employment_designation_other_value",
                    request.getParameter("employment_designation_other_value"));
            return_data = sendGitlabSubmissionEmail(request.getServletContext(), requested_data);
        }

        return return_data;
    }

    private static boolean allConditionalAreValid(HttpServletRequest request) {
        boolean all_valid = true;
        // Check contract number stuff
        String designation = request.getParameter("employment_designation");

        // If the designation is one of the values that requires a contract number and
        // contracting organization, we'll have to check to make sure we got those
        // values
        if (StringUtils.equals(designation, "DOE Federal Employee")
                || StringUtils.equals(designation, "DOE Federal Employee")
                && (StringUtils.isBlank("contracting_organization")
                || StringUtils.isBlank("contract_number"))) {
            all_valid = false;
        }

        // Make sure the token is correct
        String request_token = request.getParameter("token"); // Get the token just sent
        String session_token = request.getSession(true).getAttribute("gitlab-token").toString();
        all_valid = StringUtils.isNotBlank(session_token) && StringUtils.equals(session_token, request_token);

        return all_valid;
    }

    private static boolean isValidreCaptcha(String key, String secret_key, String ip_address) {
        String recaptcha_url = "https://www.google.com/recaptcha/api/siteverify?secret=" + secret_key + "&response=" + key;
        if (StringUtils.isNotBlank(ip_address)) {
            recaptcha_url += ("&remoteip=" + ip_address);
        }

        ObjectNode response = JsonUtils.MAPPER.createObjectNode();
        try {
            response = DOECODEUtils.makePOSTRequest(recaptcha_url, JsonUtils.MAPPER.createObjectNode());
        } catch (Exception ex) {
            log.error("Exception in gitlab submission: " + ex.getMessage());
        }

        boolean is_valid = response.findPath("success").asBoolean(false);

        return is_valid;
    }

    public static ObjectNode sendGitlabSubmissionEmail(ServletContext context, ObjectNode request_data) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();

        // Check all of the values before submitting
        // Let's go ahead and put the message together
        StringBuilder email_message = new StringBuilder();

        /* Name */
        email_message.append("----- NAME ----- \n");
        // First Name
        email_message.append(request_data.findPath("first_name").asText(""));
        email_message.append(" ");

        // Middle Name
        String middle_name = request_data.findPath("middle_name").asText("");
        if (StringUtils.isNotBlank(middle_name)) {
            email_message.append(middle_name);
            email_message.append(" ");
        }

        // Last Name
        email_message.append(request_data.findPath("last_name").asText(""));
        email_message.append(" ");

        // Suffix
        email_message.append(request_data.findPath("suffix").asText(""));
        email_message.append("\n\n");

        /* Address */
        email_message.append("----- Mailing Address ----- \n");
        // Street Address
        email_message.append(request_data.findPath("address").asText(""));
        email_message.append("\n");
        // City
        email_message.append(request_data.findPath("city").asText(""));

        // State
        String state = request_data.findPath("state").asText("");
        if (StringUtils.isNotBlank(state)) {
            email_message.append(", ");
            email_message.append(state);
            email_message.append("\n");
        } else {
            email_message.append(" ");
        }
        // Postal Code
        email_message.append(request_data.findPath("postal_code").asText(""));
        email_message.append(" ");
        // Country
        email_message.append(request_data.findPath("country").asText(""));
        email_message.append("\n\n");

        /* Contact Info */
        email_message.append("----- Contact Information ----- \n");
        // Email Address
        email_message.append(request_data.findPath("email_address").asText(""));
        email_message.append("\n");
        // PHone Number
        email_message.append(request_data.findPath("phone_number").asText(""));
        email_message.append("\n\n");

        /* Job */
        email_message.append("----- Job Title/Designation ----- \n");
        // Job Title
        email_message.append(request_data.findPath("job_title").asText(""));
        email_message.append(", ");
        // Employment Designation
        String employment_designation = request_data.findPath("employment_designation").asText("");
        email_message.append(employment_designation);
        if (StringUtils.isNotBlank(employment_designation)
                && StringUtils.equals(employment_designation, "Other")) {
            email_message.append(" (").append(request_data.findPath("employment_designation_other_value").asText("")).append(")");
        }

        /* Contract Number/Organization */
        String contract_number = request_data.findPath("contract_number").asText("");
        if (StringUtils.isNotBlank(contract_number)) {
            email_message.append("\n\n");
            email_message.append("----- Contract Number Information -----\n");
            // Contract Number
            email_message.append(contract_number);
            email_message.append("     ");
            // Contracting Organization
            email_message.append(request_data.findPath("contracting_organization").asText(""));
        }

        HtmlEmail email = new HtmlEmail();
        email.setHostName(Init.smtp_host);
        try {
            email.setFrom(Init.gitlab_from_email);
            email.addTo(Init.gitlab_submit_email);
            email.setSubject("OSTI Gitlab Registration");
            email.setMsg(email_message.toString());
            email.send();
            return_data.put("had_error", false);
        } catch (EmailException e) {
            log.error("Email error: " + e.getMessage());
            return_data.put("message", "Unable to send email due to unknown error");
            return_data.put("had_error", true);
        }

        return return_data;
    }

    public static ObjectNode getOtherLists(ServletContext context) {
        ObjectNode return_data = JsonUtils.MAPPER.createObjectNode();
        try {
            return_data.set("countries_list",
                    DOECODEServletContextListener.getJsonList(DOECODEJson.COUNTRIES_KEY));
            return_data.set("state_list",
                    DOECODEServletContextListener.getJsonList(DOECODEJson.STATES_KEY));
        } catch (Exception e) {
            log.error("Error in loading input json lists: " + e.getMessage());
        }
        return return_data;
    }
}
