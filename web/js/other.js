var post_gitlab_form_data = function () {
    $("#gitlab-signup-error-message").html('');
    $("#submit-btn").prop('disabled', true);
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

    //Go through and get the value of each field. If there's a value, mark it as successful. If there's no value, yet the field is required, mark it as erroneous. Otherwise, blank it out
    $(".gitlab-signup-input").each(function () {
        var val = $(this).val().trim();
        $(this).val(val);
        var is_required = $(this).hasClass('gitlab-signup-required');
        var self = this;

        if (val) {
            mark_gitlab_form_field(self, SUCCESS_CONDITION);
        } else if (!val && is_required) {
            mark_gitlab_form_field(self, ERROR_CONDITION);
        } else {
            mark_gitlab_form_field(self, BLANK_CONDITION);
        }
    });

    //Put up an error if any of the required fields aren't filled out
    if (!submission_data.first_name || !submission_data.last_name || !submission_data.address
            || !submission_data.city || !submission_data.postal_code || !submission_data.country
            || !submission_data.email_address || !submission_data.phone_number
            || !submission_data.job_title || !submission_data.employment_designation) {
        $("#gitlab-signup-error-message").html('You must fill out all required fields');
        $("#submit-btn").prop('disabled', false);
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

var gitlab_signup_callback = function () {
    console.log("Success");
};

//Keep at bottom
if (document.getElementById('gitlab-signup-page-identifier')) {
    $("#submit-btn").on('click', post_gitlab_form_data);
    //Makes the on-blur's work
    $(".gitlab-signup-input").on('blur', gitlab_form_blur_callback);
    //Prevents form from submitting with enter
    $("#gitlab-signup-form").on('submit', function (event) {
        event.preventDefault();
        console.log("didn't submit");
    });
}