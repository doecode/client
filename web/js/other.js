var post_gitlab_form_data = function () {
    $("#gitlab-signup-error-message").html('');
    $("#submit-btn").prop('disabled', true);
    var post_data = {};
    post_data.first_name = $("#first-name").val();
    post_data.middle_name = $("#middle-name").val();
    post_data.last_name = $("#last-name").val();
    post_data.suffix = $("#suffix").val();
    post_data.address = $("#address").val();
    post_data.city = $("#city").val();
    post_data.state = $("#state option:selected").text();
    post_data.postal_code = $("#postal-code").val();
    post_data.country = $("#country option:selected").text();
    post_data.email_address = $("#email").val();
    post_data.phone_number = $("#phone-number").val();
    post_data.job_title = $("#job-title").val();
    post_data.employment_designation = $("#employment-designation").val();

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

    //If something was entered in every field
    if (post_data.first_name && post_data.last_name && post_data.address
            && post_data.city && post_data.postal_code && post_data.country
            && post_data.email_address && post_data.phone_number
            && post_data.job_title && post_data.employment_designation) {
        $.ajax("/" + APP_NAME + "/gitlab-submission-form", {
            cache: false,
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify(post_data),
            success: function (data) {
                $("#submit-btn").prop('disabled', false);
            },
            error: function (xhr) {
                $("#submit-btn").prop('disabled', false);
            }
        });
    } else {
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

//Keep at bottom
if (document.getElementById('gitlab-signup-page-identifier')) {
    $("#submit-btn").on('click', post_gitlab_form_data);

    $(".gitlab-signup-input").on('blur', gitlab_form_blur_callback);
}