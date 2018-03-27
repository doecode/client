var post_gitlab_form_data = function () {
    $("#gitlab-signup-error-message").html('');
    var submission_data = {};
    submission_data.first_name = $("#first-name").val();
    submission_data.middle_name = $("#middle-name").val();
    submission_data.last_name = $("#last-name").val();
    submission_data.suffix = $("#suffix").val();
    submission_data.address = $("#address").val();
    submission_data.city = $("#city").val();
    submission_data.state = $("#state option:selected").text();
    submission_data.postal_code = $("#postal-code").val();
    submission_data.country = $("#country option:selected").text();
    submission_data.email_address = $("#email").val();
    submission_data.phone_number = $("#phone-number").val();
    submission_data.job_title = $("#job-title").val();
    submission_data.employment_designation = $("#employment-designation").val();

    var conditional_required_fields_okay = true;
    //Go through and get the value of each field. If there's a value, mark it as successful. If there's no value, yet the field is required, mark it as erroneous. Otherwise, blank it out
    $(".gitlab-signup-input").each(function () {
        var self = this;
        var val = $(self).val().trim();
        $(self).val(val);

        var is_required = $(this).hasClass('gitlab-signup-required');
        var is_conditional_required = $(this).hasClass('conditional-required');

        //If it's a required field, but only if a value for another field is selected
        if (is_required && is_conditional_required === true) {
            //Get the field that this field is associated with
            var associated_field = $(self).data('associatedfield');
            //Get the values that this element's associated field could have to actually show this field
            var associated_values = $(self).data('associatedvalues').split(',');

            //Get the value of the associated field
            var associated_field_value = $("#" + associated_field).val();
            //See whether or not the associated field has a value that is acceptable for this field
            var associated_field_has_value = associated_values.indexOf(associated_field_value);

            if (associated_field_has_value && val) {
                mark_gitlab_form_field(self, SUCCESS_CONDITION);
            } else if (associated_field_has_value && !val) {
                mark_gitlab_form_field(self, ERROR_CONDITION);
                conditional_required_fields_okay = false;
            } else {
                mark_gitlab_form_field(self, BLANK_CONDITION);
            }

        } else if (is_required && !is_conditional_required) {
            if (val) {
                mark_gitlab_form_field(self, SUCCESS_CONDITION);
            } else if (!val && is_required) {
                mark_gitlab_form_field(self, ERROR_CONDITION);
            } else {
                mark_gitlab_form_field(self, BLANK_CONDITION);
            }
        }
    });

    //Put up an error if any of the required fields aren't filled out
    if (!submission_data.first_name || !submission_data.last_name
            || !submission_data.address || !submission_data.city 
            || !submission_data.postal_code || !submission_data.country
            || !submission_data.email_address || !submission_data.phone_number
            || !submission_data.job_title || !submission_data.employment_designation
            || !conditional_required_fields_okay) {
        $("#gitlab-signup-error-message").html('You must fill out all required fields');
    } else {
        $("#gitlab-signup-form").submit();
    }
};

var gitlab_form_blur_callback = function () {
    var self = this;
    var val = $(this).val().trim();
    if (val) {
        mark_gitlab_form_field(self, SUCCESS_CONDITION);
    } else {
        mark_gitlab_form_field(self, BLANK_CONDITION);
    }
};

var mark_gitlab_form_field = function (element, condition) {
    $(element).parent().removeClass('has-error');
    $(element).parent().removeClass('has-success');
    $(element).next('span.errorCheck').hide();
    $(element).next().next('span.successCheck').hide();

    switch (condition) {
        case ERROR_CONDITION:
            $(element).parent().addClass('has-error');
            $(element).next('span.errorCheck').show();
            break;
        case SUCCESS_CONDITION:
            $(element).parent().addClass('has-success');
            $(element).next().next('span.successCheck').show();
            break;
    }
};

var showRequiredEmploymentDesignationFields = function () {
    var val = $(this).val();

    switch (val) {
        case "DOE Prime Contractor":
        case "DOE Sub-Contractor":
            $("#contract-number").parent().show();
            $("#contracting-organization").parent().show();
            break;
        default:
            $("#contract-number").parent().hide();
            $("#contracting-organization").parent().hide();
            break;
    }
};

var gitlab_recaptcha_success_callback = function () {
    $("#gitlab-signup-error-message").html('');
    $("#submit-btn").prop('disabled', false);
};

var gitlab_recaptcha_expiration_callback = function () {
    $("#gitlab-signup-error-message").html('Your recaptcha session has expired. Please try the recaptcha again before submitting.');
    $("#submit-btn").prop('disabled', true);
};

var gitlab_recaptcha_error_callback = function () {
    $("#gitlab-signup-error-message").html('An error has occurred with captcha. Your request could not be processed at this time');
    $("#submit-btn").prop('disabled', true);
};


//Keep at bottom
if (document.getElementById('gitlab-signup-page-identifier')) {
    $("#submit-btn").on('click', post_gitlab_form_data);
    //Makes the on-blur's work
    $(".gitlab-signup-input").on('blur', gitlab_form_blur_callback);
    //Show extra, required fields (conditionally)
    $("#employment-designation").on('click', showRequiredEmploymentDesignationFields);
}