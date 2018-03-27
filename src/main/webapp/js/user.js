/*Options for loading message on the account page in the event of a failed login when using a passcode*/
const FAILED_TO_LOGIN_WITH_PASSCODE = {title: 'Failed to Sign In', show_loader: true,
    message_type: MESSAGE_TYPE_ERROR, content: '<br/>Passcode login failed<br/>Page will redirect in 1 second',
    contentClasses: ['center-text'], showClose: true};

var login = function () {
    //Remove errors, if they're even showing up 
    $("#login-email-container").removeClass('has-error');
    $("#login-password-container").removeClass('has-error');
    $("#login-error-container").hide();
    $("#login-errors").html('');

    var post_data = {
        email: $("#email-address").val(),
        password: $("#password").val()
    };
    var try_login = true;
    var error_messages = "";

    //Do some basic error checking
    if (!post_data.email) {
        $("#login-email-container").addClass('has-error');
        error_messages += ("You need to enter an email<br/>");
        try_login = false;
    }
    if (!post_data.password) {
        $("#login-password-container").addClass('has-error');
        error_messages += "You need to enter a password<br/>";
        try_login = false;
    }

    if (try_login === true) {
        $.ajax(API_BASE + "user/login", {
            cache: false,
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify(post_data),
            success: function (data) {
                //Now that we're logged in, let's set some local storage attributes
                setLoggedInAttributes(data);
                //Send up our login data for java to do content with
                $.ajax('/' + APP_NAME + '/set-login-status-name', {
                    cache: false,
                    contentType: "application/json",
                    method: "POST",
                    data: JSON.stringify(data),
                    success: function (return_data) {
                        if (return_data.requested_url) {
                            window.location.href = return_data.requested_url;
                        } else if (window.sessionStorage.lastLocation && window.sessionStorage.lastLocation.length > 0) {
                            window.location.href = window.sessionStorage.lastLocation;
                        } else {
                            window.location.href = '/' + APP_NAME + '/projects';
                        }

                    }
                });
            },
            error: function (xhr) {
                $("#redirect-errors-container").hide();

                var error_msg = "";

                if (xhr.responseJSON) {
                    var response = xhr.responseJSON;
                    error_msg = (response.status === 401 && response.errors && response.errors.length > 0 && response.errors[0] == 'Password is expired.')
                            ? 'Your password has expired. Please go to the <a href="/' + APP_NAME + '/forgot-password">password reset page</a> to reset your password.'
                            : "Invalid Username/Password. If you believe this to be in error, please contact&nbsp;<a href='mailto:doecode@osti.gov'>doecode@osti.gov</a>&nbsp;for further information."
                } else {
                    error_msg = "An error has occurred, and the DOE CODE API couldn't be reached.";
                }

                $("#login-errors").html(error_msg);
                $("#login-errors-container").show();
            }
        });
    } else {
        $("#login-errors").html(error_messages);
        $("#login-errors-container").show();
    }
};

var triggerByEnter = function (event) {
    if (event.which === 13) {
        event.data.callback();
    }
};

var goToPage = function (event) {
    window.location.href = event.data.page;
};

var checkPassword = function (event) {
    var password_validation_data = doPasswordValidation(event.data, event.data.is_confirm);
    if (!event.data.is_confirm) {
        //Is Password wrong enough
        togglePasswordRuleIndicator('password-rule-min-length', password_validation_data.long_enough);

        //Does it contain a proper special character?
        togglePasswordRuleIndicator('password-rule-accepted-char', password_validation_data.special_char);

        //Does it contain a number
        togglePasswordRuleIndicator('password-rule-number-char', password_validation_data.contains_num);

        //Does it contain upper and lower case characters
        togglePasswordRuleIndicator('password-rule-upper-lower', password_validation_data.upper_case_lower_case);

        //Make sure it doesn't contain the email
        togglePasswordRuleIndicator('password-rule-no-username', password_validation_data.password_no_email);

        //Do the confirm and password match?
        togglePasswordRuleIndicator('password-rule-confirm-match', password_validation_data.password_match);
    }
};

var togglePasswordRuleIndicator = function (element_id, is_valid) {
    if (is_valid) {
        $("#" + element_id).addClass('green');
        $("#" + element_id).next('span.password-rule-description').addClass('green');
        $("#" + element_id).removeClass('fa-minus');
        $("#" + element_id).addClass('fa-check');
    } else {
        $("#" + element_id).removeClass('green');
        $("#" + element_id).next('span.password-rule-description').removeClass('green');
        $("#" + element_id).removeClass('fa-check');
        $("#" + element_id).addClass('fa-minus');
    }
};

var doPasswordValidation = function (password_check_ids, is_confirm) {
    var password = $("#" + password_check_ids.password_id).val();
    var email = $("#" + password_check_ids.email_id).val();
    var confirm = $("#" + password_check_ids.confirm_password_id).val();

    var password_to_use = (is_confirm) ? confirm : password;
    var minLength = 8;
    var specialCharacterRegex = /[!@#\$%\^&\*\(\)]/g;
    var lowerRegex = /[a-z]/g;
    var upperRegex = /[A-Z]/g;
    var numberRegex = /[\d]/g;

    var return_data = {};
    //Is the password long enough?
    return_data.long_enough = (password_to_use.length >= minLength);
    //Does it contain at least one special character?
    return_data.special_char = specialCharacterRegex.test(password_to_use);
    //Does it contain at least one number?
    return_data.contains_num = numberRegex.test(password_to_use);
    //Does it have at least one upper case and lower case letter?
    return_data.upper_case_lower_case = (upperRegex.test(password_to_use) && lowerRegex.test(password_to_use));
    //Does it contain the email?
    return_data.password_no_email = (password_to_use.toLowerCase().indexOf(email.toLowerCase()) < 0 || email.toLowerCase().trim() == '');
    //Do the password and confirm password match?
    return_data.password_match = (password !== '' && password === confirm);
    //Returns whether this particular password is a match
    return_data.is_valid_password = return_data.long_enough && return_data.special_char && return_data.contains_num && return_data.upper_case_lower_case && return_data.password_no_email;
    if (return_data.is_valid_password === true && is_confirm === true) {
        return_data.is_valid_password = return_data.password_match;
    }

    return return_data;
};

var markRegistrationFieldWithStatus = function (condition, element, message) {
    switch (condition) {
        case ERROR_CONDITION:
            //mark related field as has-success
            $(element).parent().parent().prev('div').addClass('has-error');
            //mark parent container as has-success
            $(element).parent().addClass('has-error');
            if (!$(element).next('span').hasClass('errorCheck')) {
                //Add check mark
                $(element).after('<span class="fa fa-times form-control-feedback errorCheck"></span>');
            }
            break;
        case SUCCESS_CONDITION:
            //mark related field as has-success
            $(element).parent().parent().prev('div').addClass('has-success');
            //mark parent container as has-success
            $(element).parent().addClass('has-success');
            if (!$(element).next('span').hasClass('successCheck')) {
                //Add check mark
                $(element).after('<span class="fa fa-check form-control-feedback successCheck"></span>');
            }
            break;
        case BLANK_CONDITION:
            //remove has-success from related field
            $(element).parent().parent().prev('div').removeClass('has-success');
            $(element).parent().parent().prev('div').removeClass('has-error');
            //remove has-success from parent container
            $(element).parent().removeClass('has-success');
            $(element).parent().removeClass('has-error');
            //remove check mark
            $(element).next('span.successCheck').remove();
            $(element).next('span.errorCheck').remove();
            break;
    }

    //Set the message, if there is one
    $(element).next('label.registration-msg').html(message ? message : '');
    $(element).next().next('label.registration-msg').html(message ? message : '');
};

var markUserFieldWithStatus = function (condition, element, message) {
    switch (condition) {
        case ERROR_CONDITION:
            $(element).parent().addClass('has-error');
            if (!$(element).next().is('span.errorCheck')) {
                $(element).after('<span class="fa fa-times form-control-feedback errorCheck errorCheck-account"></span>');
            }
            break;
        case SUCCESS_CONDITION:
            //Mark container as has-success
            $(element).parent().addClass('has-success');
            if (!$(element).next().is('span.successCheck')) {
                $(element).after('<span class="fa fa-check form-control-feedback successCheck successCheck-account"></span>');
            }
            break;
        case BLANK_CONDITION:
            $(element).parent().removeClass('has-success');
            $(element).parent().removeClass('has-error');
            $(element).next('span.successCheck').remove();
            $(element).next('span.errorCheck').remove();
            break;
    }

    $(element).next('label.user-msg').html(message ? message : '');
    $(element).next().next('label.user-msg').html(message ? message : '');
};

var markRegisterAsValidOrEmpty = function (event) {
    var element = (event.data && event.data.passed_in != undefined) ? event.data.passed_in : this;
    var keep_checking = (event.data && event.data.status != undefined) ? event.data.status : true;

    if ($(element).val() && keep_checking) {
        markRegistrationFieldWithStatus(SUCCESS_CONDITION, element);
    } else {
        markRegistrationFieldWithStatus(BLANK_CONDITION, element);
    }
};

var handleRegistrationContractNumberValidation = function () {
    markRegistrationFieldWithStatus(BLANK_CONDITION, this);
    var contract_val = $(this).val().trim();

    if (contract_val) {
        var self = this;
        //Look up the contract number, and ensure that it's valid
        $.get(AUTHORITY_API_BASE + "contract/validate/" + contract_val, function (data) {
            if (data.isValid === true) {
                markRegistrationFieldWithStatus(SUCCESS_CONDITION, self);
            } else {
                markRegistrationFieldWithStatus(ERROR_CONDITION, self, 'Invalid DOE Contract Number');
            }
        }, 'json');
    }
};

var handleUserAdminContractNumberValidation = function () {
    markUserFieldWithStatus(BLANK_CONDITION, this);
    var contract_val = $(this).val().trim();

    if (contract_val) {
        var self = this;
        $.get(AUTHORITY_API_BASE + "contract/validate/" + contract_val, function (data) {
            if (data.isValid === true) {
                markUserFieldWithStatus(SUCCESS_CONDITION, self);
            } else {
                markUserFieldWithStatus(ERROR_CONDITION, self, 'Invalid DOE Contract Number');
            }
        }, 'json');
    }
};

var markUserFieldAsValidOrEmpty = function (event) {
    var element = (event.data && event.data.passed_in != undefined) ? event.data.passed_in : this;
    var keep_checking = (event.data && event.data.status != undefined) ? event.data.status : true;

    if ($(element).val() && keep_checking) {
        markUserFieldWithStatus(SUCCESS_CONDITION, element);
    } else {
        markUserFieldWithStatus(BLANK_CONDITION, element);
    }
};

var doContractNumberValidationCheck = function () {
    var email_val = $(this).val();
    if ($(this).val()) {
        $.get(API_BASE + 'user/getsitecode/' + email_val, function (data) {
            if (data.site_code && data.site_code === 'CONTR') {
                $("#contract-number-container").show();
            } else {
                $("#contract-number-container").hide();
            }
        }, 'json');
    } else {
        $("#contract-number-container").hide();
    }
};

var createAccount = function () {
    var user_data = {
        first_name: $("#first-name").val(),
        last_name: $("#last-name").val(),
        email: $("#email").val(),
        password: $("#password").val(),
        confirm_password: $("#confirm-password").val(),
        contract_number: $("#contract-number").val()
    };
    $("#forgot-password-reminder-text").hide();

    $.ajax(API_BASE + "user/register", {
        cache: false,
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify(user_data),
        success: function (data) {
            $("#create-account-container").hide();
            $("#successful-signup-container").show();
        },
        error: function (xhr) {
            var error_text = "";
            var responseText = JSON.parse(xhr.responseText);
            var errorMessages = [];

            if (xhr.status == 400) {
                errorMessages = responseText.errors;
                //If this message shows up, we do something special
                if (errorMessages.indexOf('An account with this email address already exists.') > -1) {
                    $("#forgot-password-reminder-text").show();
                }
                //check for contract error
            } else {
                errorMessages.push("A server error has occurred that is preventing registration from functioning properly.");
            }

            //Put all of the errors into a string, and show them
            errorMessages.forEach(function (item) {
                error_text += (item + "<br/>");
            });
            $("#signup-errors").html(error_text);
        }
    });
};

var sendForgotPasswordRequest = function () {
    $("#approval-error-msg").html('');
    var post_data = {
        email: $("#email-address").val()
    };

    if (post_data.email) {
        $.ajax({
            url: API_BASE + 'user/forgotpassword',
            cache: false,
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify(post_data),
            success: function (data) {
                $("#forgot-password-container").hide();
                $("#forgot-password-confirmation-container").show();
            },
            error: function (xhr) {
                if (xhr.status === 400) {
                    $("#forgot-password-container").hide();
                    $("#forgot-password-confirmation-container").show();
                } else {
                    $("#forgot-password-error").html('An error has occurred, preventing your request from being processed.');
                }
            }
        });
    } else {
        $("#forgot-password-error").html('Please enter an email adddress');
    }
};

var saveUserAccountChanges = function () {
    $("#account-error-message").html('');
    var save_name_changes = false;
    var save_password_changes = false;

    //Name content first
    var original_first_name = $("#original-user-first-name").val();
    var original_last_name = $("#original-user-last-name").val();

    var name_post_data = {
        first_name: $("#first_name").val(),
        last_name: $("#last_name").val()
    };

    if (original_first_name != name_post_data.first_name || original_last_name != name_post_data.last_name) {//This means we'll try to do some changes
        save_name_changes = true;
    }

    //Password content
    var password_post_data = {
        password: $("#password").val(),
        confirm_password: $("#confirm-password").val()
    };

    if (password_post_data.password || password_post_data.confirm_password) {
        save_password_changes = true;
    }

    //Save changes
    if (save_name_changes) {
        $.ajax({
            url: API_BASE + 'user/update',
            cache: false,
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify(name_post_data),
            beforeSend: function beforeSend(request) {
                request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
            },
            success: function (data) {
                if (save_password_changes) {
                    savePasswordChanges(password_post_data, true, data);
                } else {
                    updateLoginNameStatus(data);
                }
            },
            error: function (xhr) {
                $("#account-error-message").html('An error has occurred, preventing your first/last name changes from saving.');
            }
        });
    } else if (save_password_changes) {
        savePasswordChanges(password_post_data, false);
    } else {
        $("#account-error-message").html('No changes were made');
    }
};

var savePasswordChanges = function (post_data, update_login_status_name, login_name_status_data) {
    $.ajax({
        url: API_BASE + 'user/changepassword',
        cache: false,
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify(post_data),
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
        },
        success: function (data) {
            if (update_login_status_name) {
                updateLoginNameStatus(login_name_status_data);
            } else {
                $("#user-account-success-message").html('Changes saved successfully. Your page will reload in 3 seconds');
                setTimeout(function () {
                    window.location.href = '/' + APP_NAME + '/account';
                }, 3000);
            }
        },
        error: function (xhr) {
            $("#account-error-message").html('Error in updating password: Password is not acceptable.');
        }
    });
};

var updateLoginNameStatus = function (post_data) {
    $.ajax({
        url: '/' + APP_NAME + '/update-login-status-name',
        cache: false,
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify(post_data),
        success: function (data) {
            $("#user-account-success-message").html('Changes saved successfully. Your page will reload in 3 seconds');
            setTimeout(function () {
                window.location.href = '/' + APP_NAME + '/account';
            }, 3000);
        },
        error: function (xhr) {
            $("#account-error-message").html('An error has occurred in updating your first/last name');
        }
    });
};

var generateNewAPIKey = function () {
    $.ajax({
        url: API_BASE + 'user/newapikey',
        cache: false,
        contentType: "application/json",
        method: "GET",
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
        },
        success: function (data) {
            $("#new-api-key").html("New API Key<br/>" + data.apiKey);
        },
        error: function () {
            $("#new-api-key-error-message").html('An error has occurred, preventing your new api key from being generated');
        }
    });
};

var requestAdminRole = function () {
    $.ajax({
        url: API_BASE + 'user/requestadmin',
        cache: false,
        contentType: "application/json",
        method: "GET",
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
        },
        success: function (data) {
            var post_data = {pending_roles: [localStorage.user_site]};
            //We have to update the back-end
            $.ajax({
                url: '/' + APP_NAME + '/update-login-status-name',
                cache: false,
                contentType: "application/json",
                method: "POST",
                data: JSON.stringify(post_data),
                success: function (data) {
                    $("#request-admin-role-message").html('Administrative role successfully requested');
                },
                error: function (xhr) {
                    $("#request-admin-role-errors").html('An error has occurred in updating your profile. You may need to log out for all changes to take effect');
                }
            });
        },
        error: function () {
            $("#request-admin-role-errors").html('Error in updating ');
        }
    });
};
var clearAdminForm = function () {
    $("#email").val('');
    $("#first_name").val('');
    $("#last_name").val('');
    $("#award_number").val('');
    $("#roles-box").val('');
    $("#active-state").prop('checked', false);
    $("#user-admin-warning-message").html('');
    $("#useradmin-warning-message-container").hide();
};
var loadUserDataForAdminForm = function () {
    //Clear the form
    clearAdminForm();
    var chosen_option = $(this).find('option:selected');
    var value = $(chosen_option).val();
    if (value !== '') {
        var email = value;
        var first_name = chosen_option.data('firstname');
        var last_name = chosen_option.data('lastname');
        var award_number = chosen_option.data('awardnum');
        var role = chosen_option.data('role');
        var is_active = chosen_option.data('isactive');
        var is_verified = chosen_option.data('isverified');
        var is_password_expired = chosen_option.data('ispassexpired');
        var pending_roles = chosen_option.data('pendingroles').split(',');

        $("#email").val(email);
        $("#first_name").val(first_name);
        $("#last_name").val(last_name);
        if (award_number && award_number != 'undefined' && award_number != undefined) {
            $("#award_number").val(award_number);
        }
        $("#roles-box").val(role);
        $("#active-state").prop('checked', is_active);
        $("#user-admin-input-form-container").show();

        if (is_verified == false) {
            $("#user-admin-warning-message").html('User has not been verified');
            $("#useradmin-warning-message-container").show();
        } else if (is_password_expired == true) {
            $("#user-admin-warning-message").html("User's password has expired.");
            $("#useradmin-warning-message-container").show();
        }

        var current_user_obj = {
            email: email,
            first_name: first_name,
            last_name: last_name,
            award_number: award_number,
            roles: [role],
            active: is_active,
            is_verified: is_verified,
            pending_roles: pending_roles
        };

        $("#current-user-values-obj").val(JSON.stringify(current_user_obj));
    } else {
        $("#user-admin-input-form-container").hide();
        $("#current-user-values-obj").val('');
    }
};

var saveUserAdminForm = function () {
    var password_check_ids = {email_id: "email",
        password_id: "password",
        confirm_password_id: "confirm-password"};

    //See if anything was even changed
    $("#user-admin-error-messages").html("");
    var try_save = true;
    var do_password_save = true;
    var error_message = "";
    var current_user_data = JSON.parse($("#current-user-values-obj").val());
    var new_user_data = {
        email: $("#email").val(),
        first_name: $("#first_name").val(),
        last_name: $("#last_name").val(),
        award_number: $("#award_number").val(),
        roles: [$("#roles-box").val()],
        active: $("#active-state").is(':checked')
    };

    //Validate the passwords, if any passwords were entered. If no passwords were entered, then we won't add them to the post object
    var password = $("#password").val();
    var confirm_password = $("#confirm-password").val();

    if (password.length > 0 || confirm_password.length > 0) {
        var password_valid = doPasswordValidation(password_check_ids, false);
        var confirm_password_valid = doPasswordValidation(password_check_ids, true);
        if (password_valid.is_valid_password === true && confirm_password_valid.is_valid_password === true) {
            new_user_data.new_password = password;
            new_user_data.confirm_password = confirm_password;
            do_password_save = true;
        } else {
            error_message = "You must enter and confirm a valid password to save password changes.";
            try_save = false;
        }
    }

    //If changes were made, we'll put the field into this object, and post it
    var post_data = {};
    for (var key in new_user_data) {
        if ((Array.isArray(new_user_data[key]) && (new_user_data[key].toString()) != current_user_data[key].toString()) || (new_user_data[key] != current_user_data[key])) {
            post_data[key] = new_user_data[key];
        }
    }

    //TODO If business rules allow more than one permission per user, this will need to made smarter. 
    //Currently, since there is only one permission per user (even though the data structures allow for multiples), it's assumed that if you have a permission, that you won't need
    //to request any more
    if (post_data.roles && current_user_data.pending_roles && current_user_data.pending_roles.length > 0) {
        post_data.pending_roles = [];
    }

    //Now, if we had anything put into the post data object, we'll post the data
    if (Object.keys(post_data).length > 0 && try_save === true) {
        $.ajax({
            url: API_BASE + 'user/update/' + new_user_data.email,
            cache: false,
            contentType: "application/json",
            method: "POST",
            beforeSend: function beforeSend(request) {
                request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
            },
            data: JSON.stringify(post_data),
            success: function (data) {
                clearAdminForm();
                $("#user-admin-input-form-container").hide();
                //If this user is the one currently logged in, we have to update their content
                //We have to update the back-end
                if (new_user_data.email == localStorage.user_email) {
                    $.ajax({
                        url: '/' + APP_NAME + '/update-login-status-name',
                        cache: false,
                        contentType: "application/json",
                        method: "POST",
                        data: JSON.stringify(post_data),
                        success: function (data) {
                            window.scrollTo(0, 0);
                            $("#user-admin-success-message").html('Your changes have saved successfully. Your page will refresh in 3 seconds');
                            setTimeout(function () {
                                window.location.href = '/' + APP_NAME + '/user-admin';
                            }, 3000);
                        }
                    });
                } else {
                    window.scrollTo(0, 0);
                    $("#user-admin-success-message").html('Your changes have saved successfully. Your page will refresh in 3 seconds');
                    setTimeout(function () {
                        window.location.href = '/' + APP_NAME + '/user-admin';
                    }, 3000);
                }

            },
            error: function (xhr) {
                window.scrollTo(0, 0);
                $("#user-admin-error-messages").html("An error has occurred in trying to save your changes");
            }
        });
    } else {
        window.scrollTo(0, 0);
        $("#user-admin-error-messages").html(error_message ? error_message : "No changes were made");
    }
};

var validateRegistrationPasswordField = function (event) {
    markRegistrationFieldWithStatus(BLANK_CONDITION, this);
    var password_validation = doPasswordValidation(event.data.password_ids, event.data.is_confirm);
    var validation_status = '';
    if ($(this).val() == '') {
        validation_status = BLANK_CONDITION;
    } else if (password_validation.is_valid_password === false) {
        validation_status = ERROR_CONDITION;
    } else {
        validation_status = SUCCESS_CONDITION;
    }
    markRegistrationFieldWithStatus(validation_status, this);
};

var validateUserPagePasswordField = function (event) {
    markUserFieldWithStatus(BLANK_CONDITION, this);
    var password_validation = doPasswordValidation(event.data.password_ids, event.data.is_confirm);
    var validation_status = '';
    if ($(this).val() == '') {
        validation_status = BLANK_CONDITION;
    } else if (password_validation.is_valid_password === false) {
        validation_status = ERROR_CONDITION;
    } else {
        validation_status = SUCCESS_CONDITION;
    }
    markUserFieldWithStatus(validation_status, this);
};

var setUpUserAccountPage = function () {

    var password_check_ids = {email_id: "email",
        password_id: "password",
        confirm_password_id: "confirm-password"};
    //Makes the account save button work
    $("#save-user-btn").on('click', saveUserAccountChanges);

    //Validation for the various fields
    $("#first_name").on('blur', markUserFieldAsValidOrEmpty);
    $("#last_name").on('blur', markUserFieldAsValidOrEmpty);
    $("#password").on('blur', {password_ids: password_check_ids, is_confirm: false}, validateUserPagePasswordField);
    $("#confirm-password").on('blur', {password_ids: password_check_ids, is_confirm: true}, validateUserPagePasswordField);

    //Set content for the check password utility
    $("#password").on('keyup', password_check_ids, checkPassword);
    $("#confirm-password").on('keyup', password_check_ids, checkPassword);

    //Makes the generate new api key button work
    $("#generate-new-api-key-btn").on('click', generateNewAPIKey);
    //Makes the request admin role button work
    $("#request-admin-role").on('click', requestAdminRole);
};

if (document.getElementById('login-page-identifier')) {
    //Log In
    $("#signin-btn").on('click', login);

    //Make enter work on email and password
    $("#password").on('keyup', {callback: login}, triggerByEnter);

} else if (document.getElementById('user-registration-page-identifier')) {
    var password_check_ids = {email_id: "email",
        password_id: "password",
        confirm_password_id: "confirm-password"};

    //Bindings to make the password validators work correctly
    $("#email").on('blur', password_check_ids, checkPassword);
    //Put check mark or x or nothing next to thing
    $("#password").on('blur', {password_ids: password_check_ids, is_confirm: false}, validateRegistrationPasswordField);
    //Put check mark or x or nothing next to thing
    $("#confirm-password").on('blur', {password_ids: password_check_ids, is_confirm: true}, validateRegistrationPasswordField);

    $("#email").on('keyup', password_check_ids, checkPassword);
    $("#password").on('keyup', password_check_ids, checkPassword);
    $("#confirm-password").on('keyup', password_check_ids, checkPassword);

    //Bindings to make the field appear as green and check-marked if it's considered valid
    $("#first-name").on('blur', markRegisterAsValidOrEmpty);
    $("#last-name").on('blur', markRegisterAsValidOrEmpty);
    $("#email").on('blur', function () {
        var self = this;
        markRegistrationFieldWithStatus(BLANK_CONDITION, self);
        var email_val = $(this).val().trim();
        if (email_val) {
            $.get(API_BASE + "validation/email?value=" + email_val, function (data) {
                markRegistrationFieldWithStatus(SUCCESS_CONDITION, self);
            }, 'json').fail(function () {
                markRegistrationFieldWithStatus(ERROR_CONDITION, self);
            });
        }
    });
    $("#first-name").on('keyup', markRegisterAsValidOrEmpty);
    $("#last-name").on('keyup', markRegisterAsValidOrEmpty);

    //the contract number is a bit special
    $("#contract-number").on('blur', handleRegistrationContractNumberValidation);

    //Checker to ensure whether or not we need to be showing the contract number field
    $("#email").on('blur', doContractNumberValidationCheck);

    //Makes the create account button work
    $("#create-account-btn").on('click', createAccount);

    //trigger the create account function when you press enter on teh confirm password field
    $("#confirm-password").on('keyup', {callback: createAccount}, triggerByEnter);

} else if (document.getElementById('forgot-password-page-identifier')) {
    $("#forgot-password-btn").on('click', sendForgotPasswordRequest);
    $("#email-address").on('keyup', {callback: sendForgotPasswordRequest}, triggerByEnter);

} else if (document.getElementById('user-account-page-identifier')) {
    var passcode = $("#user-passcode").val();
    if ($("#user-passcode").val()) {
        $.ajax(API_BASE + "user/login", {
            cache: false,
            contentType: "application/json",
            method: "POST",
            data: JSON.stringify({confirmation_code: passcode}),
            success: function (data) {
                //Now that we're logged in, let's set some local storage attributes
                setLoggedInAttributes(data);
                //Send up our login data for java to do content with
                $.ajax('/' + APP_NAME + '/set-login-status-name', {
                    cache: false,
                    contentType: "application/json",
                    method: "POST",
                    data: JSON.stringify(data),
                    success: function (return_data) {
                        $("#signin-status-big-screens,#signin-status-small-screens").html(return_data.signin_html);
                        $("#email").val(return_data.email);
                        $("#first_name").val(return_data.first_name);
                        $("#last_name").val(return_data.last_name);
                        setUpUserAccountPage();
                    }
                });
            },
            error: function (xhr) {
                setCommonModalMessage(FAILED_TO_LOGIN_WITH_PASSCODE);
                setTimeout(function () {
                    window.location.href = '/' + APP_NAME + '/login';
                }, 1000);
            }
        });
    } else {
        checkIsAuthenticated();
        setUpUserAccountPage();
    }
} else if (document.getElementById('user-admin-page-identifier')) {
    checkHasRole('OSTI');
    checkIsAuthenticated();

    //Now, we get the user list
    $.ajax({
        url: API_BASE + 'user/users',
        cache: false,
        contentType: "application/json",
        method: "GET",
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
        },
        success: function (data) {
            //Go through the users list, and populate the select with the values
            var pending_roles_list = [];
            data.forEach(function (item) {
                var role = (item.roles.length > 0) ? item.roles[0] : '';//Since we only have a one-role system at the moment, we're just going to grab the first role from the list, because that's all there will be
                //Because data attributes
                //Comes out like <option value="email@email.com" data-firstname="john" data-lastname="doe" data-awardnum="3135" data-role="BAPL" data-isactive="true" data-isverified="false" data-pendingroles='SITE1,SITE2,SITE3'>John DOE (email@email.com)</option>
                var user_option = '<option value="' + item.email + '" data-firstname="' + item.first_name + '" data-lastname="'
                        + item.last_name + '" data-awardnum="' + item.contract_number + '" data-role="' + role + '" data-isactive="'
                        + item.active + '" data-isverified="' + item.verified + '" data-ispassexpired="'
                        + item.password_expired + '" data-pendingroles="' + item.pending_roles.join(',') + '">' + item.first_name + ' ' + item.last_name + ' (' + item.email + ')' + '</option>';
                $("#user-admin-box").append(user_option);
                if (item.pending_roles.length > 0) {
                    pending_roles_list.push(
                            {name: item.first_name + ' ' + item.last_name, roles: item.pending_roles.join(',')});
                }
            });
            //If we have pending roles, we'll add them to the container
            if (pending_roles_list.length > 0) {
                var pending_roles_html = "";
                pending_roles_list.forEach(function (item) {
                    pending_roles_html += ("<div>" + item.name + " - " + item.roles + "</div>");
                });
                //Set the html to show the things
                $("#requesting-roles-collapse-container").html(pending_roles_html);
                //Show the container
                $("#requesting-roles-container").show();
            }
        },
        error: function () {
            $("#approval-error-msg").html('An error has occurred, preventing the users from loading.');
        }
    });

    //Makes teh "Users Requesting Roles" work
    $("#requesting-roles-collapse-btn").on('click',
            {open_name: '<strong><span class="fa fa-caret-right fa-page-caret clickable"></span> Users Requesting Roles</strong>',
                close_name: '<strong><span class="fa fa-caret-down fa-page-caret clickable"></span> Users Requesting Roles</strong>'}
    , toggleCollapse);

    //Makes the dropdown list work
    $("#user-admin-box").on('change', loadUserDataForAdminForm);

    var password_check_ids = {email_id: "email",
        password_id: "password",
        confirm_password_id: "confirm-password"};
    //Makes the input form validation content work
    $("#first_name").on('blur', markUserFieldAsValidOrEmpty);
    $("#last_name").on('blur', markUserFieldAsValidOrEmpty);
    $("#password").on('blur', {password_ids: password_check_ids, is_confirm: false}, validateUserPagePasswordField);
    $("#confirm-password").on('blur', {password_ids: password_check_ids, is_confirm: true}, validateUserPagePasswordField);

    //content for the password validation
    $("#password").on('keyup', password_check_ids, checkPassword);
    $("#confirm-password").on('keyup', password_check_ids, checkPassword);

    $("#save-user-admin-btn").on('click', saveUserAdminForm);

    //the contract number is a bit special
    $("#award_number").on('blur', handleUserAdminContractNumberValidation);


} else if (document.getElementById('help-page-identifier')) {
    checkIsAuthenticated();

}