/*Values acquired from replacer plugin in the pom*/
const API_BASE = $("#api-url").val();//The url to the DOE CODE API
const AUTHORITY_API_BASE = $("#authority-api-base").val(); //The url to the OSTI Elink Authority API
const SESSION_TIMEOUT = parseInt($("#session-timeout").val()); //Amount of time until session expires (in minutes)
const APP_NAME = $("#app-name").val(); //Name of application. doecode by default, but can be changed if paralell deployments on the same tomcat are needed
const GOOGLE_ANALYTICS_4_ID = $("#google-analytics-4-id").val();//ID used for google analytics 4 tracking

/*Normal static values*/
const LOGIN_EXPIRATION_DATE_FORMAT = "YYYY-MM-DD HH:mm";//Date format used to for the moment object that determines if you've been inactive for 45 minutes or not
const ERROR_CONDITION = 'error'; //Used to indicate that a field needs to be marked as erroneous 
const SUCCESS_CONDITION = 'success';//Used to indicate that a field needs to be marked as successful
const BLANK_CONDITION = 'blank';//Used to indicate that a field needs to be marked as blank, because it's neither successful or erroneous
var NON_CHARACTER_KEYCODES = [
    13, /*enter*/
    38, /*up arrow*/
    40, /*down arrow*/
    39, /*right arrow*/
    37, /*left arrow*/
    27, /*escape*/
    17, /*ctrl*/
    18, /*alt*/
    16, /*shift*/
    9 /*tab*/];

// Backend Date Format - YYYY-MM-DD
function parseBackendDate(dateString) {
    const timeStrings = dateString.split('-');
    const timeValues = timeStrings.map(Number);
    
    return new Date(Date.UTC(timeValues[0], timeValues[1]-1, timeValues[2]+1))
}
    
// Frontend Date Format 
// <input type='date'> returns values as YYYY-MM-DD
// and Displays as MM/DD/YYYY
function parseFrontendDate(dateString) {
    const timeStrings = dateString.split('-');
    const timeValues = timeStrings.map(Number); 

    return new Date(Date.UTC(timeValues[0], timeValues[1]-1, timeValues[2]+1))
}

// const LOGIN_EXPIRATION_DATE_FORMAT = "YYYY-MM-DD HH:mm" Date format used to for the moment object that determines if you've been inactive for 45 minutes or not
function formatExpirationDate(date) {
    let p = new Intl.DateTimeFormat('en',{
        year:'numeric',
        month:'2-digit',
        day:'2-digit',
        hour:'2-digit',
        minute:'2-digit',
        hour12: true
    }).formatToParts(date).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
    }, {});
    
    return `${p.month}-${p.day}-${p.year} ${p.hour}:${p.minute}`; 
}

// Backend Date Format - YYYY-MM-DD
function formatBackendDate(date) {
    let p = new Intl.DateTimeFormat('en',{
        year:'numeric',
        month:'2-digit',
        day:'2-digit',
    }).formatToParts(date).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
    }, {});
    
    return `${p.year}-${p.month}-${p.day}`; 
}

// Frontend Date Format - MM/DD/YYYY
function formatFrontendDate(date) {
    let p = new Intl.DateTimeFormat('en',{
        year:'numeric',
        month:'2-digit',
        day:'2-digit',
    }).formatToParts(date).reduce((acc, part) => {
        acc[part.type] = part.value;
        return acc;
    }, {});
    
    return `${p.month}/${p.day}/${p.year}`; 
}

function doAjax(methodType, url, successCallback, data, errorCallback, dataType, contentType) {
    var errorCall = errorCallback;
    if (errorCall === undefined) {
        errorCall = function errorCall(jqXhr, exception) {
            // silent error
        };
    }

    if (dataType === undefined) {
        dataType = "json";
    }

    if (contentType === undefined) {
        contentType = "application/json";

    }

    $.ajax({
        url: url,
        cache: false,
        method: methodType,
        dataType: dataType,
        data: JSON.stringify(data),
        contentType: "application/json; charset=UTF-8",
        success: successCallback,
        error: errorCall
    });
}

function doAuthenticatedMultipartRequest(url, formData, successCallback, errorCallback) {

    if (successCallback === undefined) {
        successCallback = function successCallback() {
            // silent success
        };
    }

    $.ajax({
        url: url,
        cache: false,
        processData: false,
        contentType: false,
        method: 'POST',
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", JSON.parse(localStorage.user_data).xsrfToken);
        },
        dataType: 'json',
        data: formData,
        success: function success(data) {
            handleAuthenticatedSuccess(data, successCallback);
        },
        error: function error(jqXhr, exception) {
            handleAuthenticatedError(jqXhr, exception, errorCallback);
        }
    });
}

function doAuthenticatedAjax(methodType, url, successCallback, data, errorCallback) {

    if (successCallback === undefined) {
        successCallback = function successCallback() {};
    }

    $.ajax({
        url: url,
        cache: false,
        method: methodType,
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", JSON.parse(localStorage.user_data).xsrfToken);
        },
        dataType: 'json',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: function success(data) {
            handleAuthenticatedSuccess(data, successCallback);
        },
        error: function error(jqXhr, exception) {
            handleAuthenticatedError(jqXhr, exception, errorCallback);
        }
    });
}

function doAuthenicatedFileDownloadAjax(url, successCallback, errorCallback) {
    $.ajax({
        url: url,
        cache: false,
        method: 'GET',
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", JSON.parse(localStorage.user_data).xsrfToken);
        },
        success: function success(data) {
            handleAuthenticatedSuccess(data, successCallback);
        },
        error: function error(xhr, exception) {
            handleAuthenticatedError(xhr, exception, errorCallback);
        }
    });
}

function checkIsAuthenticated() {
    var successCallback = function successCallback() {
        var user_data = JSON.parse(localStorage.user_data);
        const d = new Date();
        user_data.token_expiration = formatExpirationDate(d.setMinutes(d.getMinutes() + SESSION_TIMEOUT));
        localStorage.user_data = JSON.stringify(user_data);
    };

    $.ajax({
        url: API_BASE + 'user/authenticated',
        cache: false,
        method: 'GET',
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", JSON.parse(localStorage.user_data).xsrfToken);
        },
        success: successCallback,
        error: handleAuthenticatedError
    });
}

function handleAuthenticatedSuccess(data, callback) {
    var user_data = JSON.parse(localStorage.user_data);
    const d = new Date();
    user_data.token_expiration = formatExpirationDate(d.setMinutes(d.getMinutes() + SESSION_TIMEOUT));
    localStorage.user_data = JSON.stringify(user_data);
    callback(data);
}

function handleAuthenticatedError(jqXhr, exception, callback) {
    if (jqXhr.status == 401) {
        window.sessionStorage.lastLocation = window.location.href;
        clearLoginLocalstorage();
        window.location.href = '/' + APP_NAME + '/login?redirect=true';
    } else if (jqXhr.status == 403) {
        window.location.href = '/' + APP_NAME + '/forbidden';
    } else if (callback !== undefined && (typeof callback == 'function')) {
        callback(jqXhr, exception);
    } else {
        window.location.href = '/' + APP_NAME + '/error';
    }
}

function clearLoginLocalstorage() {
    localStorage.user_data = "";
}

function setLoggedInAttributes(data) {
    var user_data = {};
    const d = new Date();

    user_data.xsrfToken = data.xsrfToken;
    user_data.user_email = data.email;
    user_data.first_name = data.first_name;
    user_data.last_name = data.last_name;
    user_data.display_name = data.display_name;
    user_data.display_name_lastname_first = data.display_name_lastname_first;
    user_data.token_expiration = formatExpirationDate(d.setMinutes(d.getMinutes() + SESSION_TIMEOUT));
    user_data.roles = data.roles;
    user_data.user_site = data.site;
    user_data.software_group_email = data.software_group_email;
    user_data.pending_roles = data.pending_roles;

    localStorage.user_data = JSON.stringify(user_data);
}

/****************************/
/****CHOSEN JS OVERRIDES*****/
/****************************/
var modifyChosenSelectForCustomEntryTabKey = function (event) {
    if (event.which === 9) {
        //The default behavior is to just close the box and do nothing, so we'll need to override it
        event.preventDefault();
        //Grab highlighted item
        var highlighted = $(this).parent().parent().next('.chosen-drop').find('ul.chosen-results').find('li.active-result.highlighted');

        if (highlighted.length > 0) {
            //Get the related select
            var related_select_id = $(this).parent().parent().parent().prev('select.doecode-chosen-select').attr('id');
            //Get the item from the dropdown that's highlighted
            var highlighted_option_index = $(highlighted).data('option-array-index') + 1;
            //Set the item to selected
            var item_to_add = $("#" + related_select_id + " option:nth-child(" + highlighted_option_index + ")");
            $(item_to_add).prop('selected', true);
            if ($(item_to_add).data('allowcustom') == true) {
                $(item_to_add).html($(item_to_add).val());
            }
            //Update
            $("#" + related_select_id).trigger('chosen:updated');
            $("#" + related_select_id).trigger('change');
            $("#" + related_select_id).trigger('chosen:close');
        }
    }
};

var modifyChosenSelectForCustomEntry = function (event) {
    var keypressed = event.which;

    if (NON_CHARACTER_KEYCODES.indexOf(keypressed) < 0) {
        var self = this;
        var val = $(self).val();
        var related_select = $(self).parent().parent().parent().prev('select.doecode-chosen-select');
        if ($(related_select).data('allowcustom') == true) {
            //Get the related select information
            var related_select_id = $(related_select).attr('id');

            //Caret Position
            var caret_position = event.target.selectionStart;
            sessionStorage.last_chosen_input_position = caret_position;

            //If we don't have an index for this in the underlying select, make it so
            if (val != null && val.trim() != "") {
                if (!document.getElementById(related_select_id + "-custom-option")) {
                    $(related_select).prepend("<option id=" + related_select_id + "-custom-option" + " value='" + val + "'>Add: " + val + "</option>");
                } else {
                    $("#" + related_select_id + "-custom-option").val(val);
                    $("#" + related_select_id + "-custom-option").html("Add: " + val);
                }
            }
            // remove unneeded Add option
            else if (document.getElementById(related_select_id + "-custom-option")) {
                $("#" + related_select_id + "-custom-option").remove();
            }

            $(related_select).trigger("chosen:updated");
            $(self).val(val);
            $(self).width('100%');

            var triggersearch = jQuery.Event('keyup');
            triggersearch.which = 39;
            $(self).trigger(triggersearch);
        }
    } else if ((keypressed == 39 || keypressed == 37) && sessionStorage.last_chosen_input_position) {//If the key pressed is the left or right arrow
        this.setSelectionRange(sessionStorage.last_chosen_input_position, sessionStorage.last_chosen_input_position);
        sessionStorage.last_chosen_input_position = "";
    } else {
        sessionStorage.last_chosen_input_position = "";
    }
};


var modifyChosenSelectForCustomEntrySingle = function (event) {
    var keypressed = event.which;

    if (NON_CHARACTER_KEYCODES.indexOf(keypressed) < 0) {
        var self = this;
        var val = $(self).val();
        var related_select = $(self).parent().parent().parent().prev('select.doecode-chosen-select');
        if ($(related_select).data('allowcustom') == true) {
            var related_select_id = $(related_select).attr('id');
            //See if there's a custom entry field
            //If we don't have an index for this in the underlying select, make it so
            if (val != null && val.trim() != "") {
                if (!document.getElementById(related_select_id + "-custom-option")) {
                    $(related_select).prepend("<option id=" + related_select_id + "-custom-option" + " data-iscustom='true' value='" + val + "'>Add: " + val + "</option>");
                } else {
                    $("#" + related_select_id + "-custom-option").val(val);
                    $("#" + related_select_id + "-custom-option").html("Add: " + val);
                }
            }
            // remove unneeded Add option
            else if (document.getElementById(related_select_id + "-custom-option")) {
                $("#" + related_select_id + "-custom-option").remove();
            }
            $(related_select).trigger('chosen:updated');
            $(self).val(val);

            var triggersearch = jQuery.Event('keyup');
            triggersearch.which = 39;
            $(self).trigger(triggersearch);
        }
    }
};

var populateSelectWithCustomData = function (select, data) {
    if (!data || !isSelectOption(select, "allowcustom"))
        return;

    if (typeof data == "string") {
        data = [data];
    }
    data.forEach(function (item) {
        var length = $("#" + select + " option[value='" + item + "']").length;
        if (length == 0) {
            var newOption = $('<option>', {
                value: item,
                text: item,
                'data-iscustom': "true"
            });
            $("#" + select).append(newOption);
        }
    });
};

var loadSelectData = function (select, data, is_single) {
    if (typeof data == "string") {
        data = [data];
    }
    if (!is_single) {
        is_single = isSelectOption(select, "issingle");
    }
    if (!is_single) {
        //Get the currently selected values, push in the new values
        var selected_vals = $("#" + select).val();

        if (data && selected_vals)
            data = selected_vals.concat(data);
    }

    $("#" + select).val(data);

    //Update the select so our new value(s) are selected
    $("#" + select).trigger('chosen:updated');

    if (is_single) {
        $("#" + select).trigger('chosen:close');
    }

};

var setSelectData = function (select, data) {
    var is_single = isSelectOption(select, "issingle");
    populateSelectWithCustomData(select, data);
    loadSelectData(select, data, is_single);
    $("#" + select).trigger('change');
};

var isSelectOption = function (select, option) {
    if (option == "issingle" && !$("#" + select).hasClass("doecode-chosen-select")) {
        return true;
    } else {
        return $("#" + select).data(option) ? $("#" + select).data(option) == true : false;
    }
};

/*Goes through each select, and assigns it a chosen attribute based on whether it allows custom entries or not*/
$("select.doecode-chosen-select:not([data-issingle=true])").each(function () {
    var self = this;
    var self_id = $(this).attr('id');
    var allows_custom_text = ($(self).data('allowcustom') == false) ? 'No match found for:' : '';
    //Initialize all chosen selects
    $(self).chosen({
        width: '100%',
        no_results_text: allows_custom_text,
        search_contains: true
    });

    //On change, if the option that was selected is the value in the custom option at the top, remove it from the custom option at the top, 
    if ($(self).data('allowcustom') == true) {
        $(self).on('change', function () {
            var custom_field = $("#" + $(self).attr('id') + "-custom-option");
            var custom_field_val = $(custom_field).val();

            var this_selects_values = $(self).val();
            //If the value in the custom option field is in the array of options associated with this select, add a new option to the bottom of the list.
            if (this_selects_values.indexOf(custom_field_val) > -1) {
                $(self).append("<option value='" + custom_field_val + "' title='" + custom_field_val + "' data-iscustom='true' selected>" + custom_field_val + "</option>");
            }

            //If there is an option in this select that is custom, and is no longer in this select's array of values, remove that item entirely
            var items_to_remove = $(self).find("option[data-iscustom='true']");
            $(items_to_remove).each(function () {
                var item = this;
                var item_val = $(item).val();
                if (this_selects_values.indexOf(item_val) < 0) {
                    $("#" + self_id + " option[data-iscustom='true'][value='" + item_val + "']").remove();
                }
            });

            //Clear out the custom field and update
            $(custom_field).val('');
            $(custom_field).html('');
            $(custom_field).prop('selected', false);
            $(self).trigger('chosen:updated');
        });
    }
});

//Chosen selects for single inputs
$("select.doecode-chosen-select[data-issingle=true]").each(function () {
    var self = this;
    var self_id = $(this).attr('id');
    var allows_custom_text = ($(self).data('allowcustom') == false) ? 'No match found for:' : '';
    var allow_single_deselect = $(self).data('allowsingledeselect') == true;
    //Initialize all chosen selects
    $(self).chosen({
        width: '100%',
        no_results_text: allows_custom_text,
        search_contains: true,
        allow_single_deselect: allow_single_deselect
    });

    // Chosen Select singles are not triggering OnChange on inital entry without a blank entry, for some reason
    $(self).prepend("<option value='' title=''></option>");

    //On change, if the option that was selected is the value in the custom option at the top, remove it from the custom option at the top, 
    if ($(self).data('allowcustom') == true) {
        $(self).on('change', function () {
            var custom_field = $("#" + $(self).attr('id') + "-custom-option");
            var custom_field_val = $(custom_field).val();

            var chosen_val = $(self).val();
            //If the value in the custom option field is in the array of options associated with this select, add a new option to the bottom of the list.
            if (chosen_val == custom_field_val) {
                $(self).append("<option value='" + custom_field_val + "' title='" + custom_field_val + "' data-iscustom='true' selected>" + custom_field_val + "</option>");
            }

            //If there is an option in this select that is custom, and is no longer in this select's array of values, remove that item entirely
            var items_to_remove = $(self).find("option[data-iscustom='true']");
            $(items_to_remove).each(function () {
                var item = this;
                var item_val = $(item).val();
                if (chosen_val != item_val) {
                    $("#" + self_id + " option[data-iscustom='true'][value='" + item_val + "']").remove();
                }
            });

            //Clear out the custom field and update
            $(custom_field).val('');
            $(custom_field).html('');
            $(custom_field).prop('selected', false);
            $(self).trigger('chosen:updated');
        });
    }
});

/****************************/
/****CHOSEN JS OVERRIDES*****/
/****************************/

/*Generically handles the toggling of a given collapsible in bootstrap. This is here so you can toggle without the need for ID's*/
var toggleCollapse = function (event) {
    if ($(this).next().hasClass('in')) {
        $(this).next().removeClass('in');
        if (event.data.open_name != undefined) {
            $(this).html(event.data.open_name);
        }
    } else {
        $(this).next().addClass('in');
        if (event.data.close_name != undefined) {
            $(this).html(event.data.close_name);
        }
    }
};

/*COMMON MODAL CONTENT*/
const MESSAGE_TYPE_REGULAR = "";
const MESSAGE_TYPE_ERROR = "has-error";
const MESSAGE_TYPE_SUCCESS = "has-success";
var setCommonModalMessage = function (options) {
    //Set the title
    $("#common-message-dialog-title").html(options.title);
    //If we need the loader, we set it here
    if (options.show_loader) {
        switch (options.message_type) {
            case MESSAGE_TYPE_REGULAR:
            case MESSAGE_TYPE_SUCCESS:
                $("#common-message-dialog-loader").show();
                $("#common-message-dialog-loader-error").hide();
                break;
            case MESSAGE_TYPE_ERROR:
                $("#common-message-dialog-loader").hide();
                $("#common-message-dialog-loader-error").show();
                break;
        }
    }
    //Now for the actual content
    var html_content = "";
    if (Array.isArray(options.content)) {
        options.content.forEach(function (item) {
            html_content += ("<div><label class='control-label'>" + item + "</label></div>");
        });
    } else {
        html_content = options.content;
    }
    $("#common-message-dialog-content").html(html_content);
    //Set the color of the content
    $("#common-message-dialog-content").addClass(options.message_type);
    if (options.contentClasses) {
        options.contentClasses.forEach(function (item) {
            $("#common-message-dialog-content").addClass(item);
        });
    }

    //If they want to show the close button, we will
    if (options.showClose && options.showClose === true) {
        $("#common-message-dialog-close-btn").show();
    }

    $("#common-message-dialog").modal('show');
};

var hideCommonModalMessage = function () {
    $("#common-message-dialog").modal('hide');
};

var showCommonModalMessage = function () {
    $("#common-message-dialog").modal('show');
};

var clearCommonModal = function () {
    $("#common-message-dialog-title").html('');
    $("#common-message-dialog-loader").hide();
    $("#common-message-dialog-loader-error").hide();
    $("#common-message-dialog-content").html('');
    $("#common-message-dialog-close-btn").hide();
};

var isValidJSON = function (str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
};

var isValidInt = function (value) {
    try {
        parseInt(value);
    } catch (e) {
        return false;
    }

    return true;
};

/*Date formats, in regards to release date*/
const FRONT_END_DATE_FORMAT = 'MM/DD/YYYY';
const BACK_END_DATE_FORMAT = 'YYYY-MM-DD';

/*Make delimited list*/
var makeDelimitedList = function (list, delimiter) {
    var html = "";
    for (var i = 0; i < list.length; i++) {
        if (i > 0) {
            html += delimiter;
        }
        html += list[i];
    }
    return html;
};

/*Populates the advanced search form needed*/
var populateAdvancedSearchForm = function (id_prefix) {
    var latestSearchParams = JSON.parse(localStorage.latestSearchParams);
    latestSearchParams.forEach(function (item) {
        var item_val = item.value;
        var item_name = item.name;
        //If the item passed in is json, then we need to treat it differently
        if (isValidJSON(item_val) && Array.isArray(JSON.parse(item_val))) {
            var item_values = JSON.parse(item_val);
            item_values.forEach(function (values_item) {
                //Go through each item. If we don't have the value, then add it to the select box
                if ($("#" + id_prefix + item_name + ' option[value=\'' + values_item + '\']').val() === undefined) {
                    $("#" + id_prefix + item_name).append('<option value="' + values_item + '" selected>' + values_item + "</option>");

                } else {//IF we have the value already, go to that item and set it to selected
                    $("#" + id_prefix + item_name).find('option[value=\'' + values_item + '\']').prop('selected', true);
                }

                $("#" + id_prefix + item_name).trigger('chosen:updated');
            });
        } else if (item_val && (item_name == 'date_latest' || item_name == 'date_earliest')) {//If it's a date
            var no_t_date = item_val.substr(0, item_val.indexOf('T'));
            $("#" + id_prefix + item_name).val(formatFrontendDate(parseBackendDate(no_t_date)));

        } else {//If it's anything else
            $("#" + id_prefix + item.name).val(item_val);
        }
    });
};

/**
 * Takes a, and returns an array with all of the indexes that are duplicates. If the list is empty, assume there are no duplicates
 * 
 */
var checkForDuplicates = function (list, ignoreBlanks) {
    var duplicate_indexes = [];
    for (var i = 0; i < list.length; i++) {
        //If this index hasn't already been been flagged as a duplicate, continue
        if (duplicate_indexes.indexOf(i) < 0) {
            var current_val = list[i];
            //For every other item in the list, go through and gather the indexes of each duplicate
            for (var x = i + 1; x < list.length; x++) {
                var check_val = list[x];
                //Make sure again that indexes that have already been gathered aren't gathered again
                if ((ignoreBlanks && duplicate_indexes.indexOf(x) < 0 && current_val.trim() == check_val.trim() && current_val.trim() != '')
                        || (!ignoreBlanks && duplicate_indexes.indexOf(x) < 0 && current_val == check_val)) {
                    if (duplicate_indexes.indexOf(i) < 0) {
                        duplicate_indexes.push(i);
                    }
                    duplicate_indexes.push(x);
                }
            }
        }
    }
    return duplicate_indexes;
};

function checkHasRole(role, successCallback, errorCallback) {
    $.ajax({
        url: API_BASE + 'user/hasrole/' + role,
        cache: false,
        method: 'GET',
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", JSON.parse(localStorage.user_data).xsrfToken);
        },
        success: successCallback,
        error: errorCallback
    });
}

const ADV_DROPDOWN_CLOSE = 'CLOSE';
const ADV_DROPDOWN_OPEN = 'OPEN';