const API_BASE = "@api.url@";
const AUTHORITY_API_BASE = "@authorityapi.url@";
const LOGIN_EXPIRATION_DATE_FORMAT = "YYYY-MM-DD HH:mm";
const SESSION_TIMEOUT = parseInt("@session_timeout@");

function doAjax(methodType, url, successCallback, data, errorCallback, dataType) {
    var errorCall = errorCallback;
    if (errorCall === undefined) {
        errorCall = function errorCall(jqXhr, exception) {
            // silent error
        };
    }

    if (dataType === undefined) {
        dataType = "json";
    }

    $.ajax({
        url: url,
        cache: false,
        method: methodType,
        dataType: dataType,
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
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
            request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
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
            request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
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
            request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
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
        localStorage.token_expiration = moment().add(SESSION_TIMEOUT, 'minutes').format(LOGIN_EXPIRATION_DATE_FORMAT);
    };

    $.ajax({
        url: API_BASE + 'user/authenticated',
        cache: false,
        method: 'GET',
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
        },
        success: successCallback,
        error: handleAuthenticatedError
    });
}

function checkHasRole(role) {

    $.ajax({
        url: API_BASE + 'user/hasrole/' + role,
        cache: false,
        method: 'GET',
        beforeSend: function beforeSend(request) {
            request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
        },
        success: function success() {
            localStorage.token_expiration = moment().add(SESSION_TIMEOUT, 'minutes').format(LOGIN_EXPIRATION_DATE_FORMAT);
        },
        error: function error(jqXhr, exception) {
            handleAuthenticatedError(jqXhr, exception);
        }
    });
}

function handleAuthenticatedSuccess(data, callback) {
    localStorage.token_expiration = moment().add(SESSION_TIMEOUT, 'minutes').format(LOGIN_EXPIRATION_DATE_FORMAT);
    callback(data);
}

function handleAuthenticatedError(jqXhr, exception, callback) {
    if (jqXhr.status == 401) {
        window.sessionStorage.lastLocation = window.location.href;
        clearLoginLocalstorage();
        window.location.href = '/doecode/login?redirect=true';
    } else if (jqXhr.status == 403) {
        window.location.href = '/doecode/forbidden';
    } else if (callback != undefined) {
        callback(jqXhr, exception);
    } else {
        window.location.href = '/doecode/error';
    }
}

function clearLoginLocalstorage() {
    localStorage.xsrfToken = "";
    localStorage.user_email = "";
    localStorage.first_name = "";
    localStorage.last_name = "";
    localStorage.token_expiration = "";
    localStorage.roles = "";
    localStorage.user_site = "";
    localStorage.pending_roles = "";
}

function setLoggedInAttributes(data) {
    localStorage.xsrfToken = data.xsrfToken;
    localStorage.user_email = data.email;
    localStorage.first_name = data.first_name;
    localStorage.last_name = data.last_name;
    localStorage.token_expiration = moment().add(SESSION_TIMEOUT, 'minutes').format(LOGIN_EXPIRATION_DATE_FORMAT);
    localStorage.roles = JSON.stringify(data.roles);
    localStorage.user_site = data.site;
    localStorage.pending_roles = JSON.stringify(data.pending_roles);
}

function resetLoggedInAttributesUserData(data) {
    localStorage.first_name = data.first_name;
    localStorage.last_name = data.last_name;
}

function appendQueryString(url) {
    var ampOrQuestion = "?";
    if (url.indexOf('?') > 0)
        ampOrQuestion = "&";

    var queryString = window.location.search.slice(1);
    if (queryString)
        return url + ampOrQuestion + window.location.search.slice(1);
    else
        return url;
}

function getQueryParam(paramName) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0].toLowerCase() === paramName.toLowerCase()) {
            return pair[1];
        }
    }

    return false;
}

function getChildData(type) {
    if (type === 'developers') {
        return new Developer();
    } else if (type === 'contributors') {
        return new Contributor();
    } else if (type === 'sponsoring_organizations') {
        return new SponsoringOrganization();
    } else if (type === 'contributing_organizations') {
        return new ContributingOrganization();
    } else if (type === 'research_organizations') {
        return new ResearchOrganization();
    } else if (type === 'related_identifiers') {
        return new RelatedIdentifier();
    }
}

/*Sees whether or not the arrays contain the same content, regardless of order*/
function doArraysContainSame(array1, array2) {
    var containsSame = true;
    if (array1.length == array2.length) {
        array1.forEach(function (item) {
            if (array2.indexOf(item) < 0) {
                containsSame = false;
                return false;
            }
        });
    } else {
        containsSame = false;
    }
    return containsSame;
}

function getIsLoggedIn() {
    return localStorage.token_expiration != "" && moment(localStorage.token_expiration, LOGIN_EXPIRATION_DATE_FORMAT).isAfter(moment());
}

function combineName(first, middle, last) {
    var fullName = last ? last : "";
    fullName += (fullName && first ? ", " : "") + (first ? first : "");
    fullName += (fullName && middle ? " " : "") + (middle ? middle.substr(0, 1) + "." : "");

    return fullName;
}

function itemListToNameArray(itemList) {
    var listArr = [];
    itemList.forEach(function (item) {
        var fullName = combineName(item.first_name, item.middle_name, item.last_name);

        if (fullName)
            listArr.push(fullName);
    });

    return listArr;
}

function combineAuthorLists(list1, list2) {
    var list1Arr = itemListToNameArray(list1);
    var list2Arr = itemListToNameArray(list2);

    return list1Arr.concat(list2Arr);
}

function joinWithDelimiters(list, delimiter, lastDelimiter) {
    var result = "";
    var listEnd = "";

    if (lastDelimiter && list.length > 1)
        listEnd = list.pop();

    result = list.join(delimiter);

    if (listEnd)
        result += lastDelimiter + listEnd;

    return result;
}


/*
 * This modifies a chosen select that has a data-allowcustom value of "true"
 * It will allow you to enter your own options into the chosen select
 */
var modifyChosenSelectForCustomEntryTabKey = function (event) {
	// Had to add Tab check apart from Enter, because Enter was causing issues during "keydown"
    if (event.which === 9) {
		var e = jQuery.Event("keyup");
		e.which = 13; // # Enter key code
		$(this).trigger(e);
    }
};

var modifyChosenSelectForCustomEntry = function (event) {
	// Tab does not trigger during "keyup" but "keydown" was causing issues, so now Tab triggers from another function to keep it separated from Enter.
    if (event.which === 13) {
        //The value the user has entered
        var val_typed_in = $(this).val();

        //The select box that this chosen select is associated with
        var related_select = $(this).parent().parent().parent().prev('select.doecode-chosen-select');

        //If the value we selected isn't already in the select box, let's add it in, and select it
        var related_select_id = $(related_select).attr('id');

        //If this is a select that allows multiple customs, and there was a value entered that isn't one already in the list, add it to the list
        if (val_typed_in) {
            //Go to the associated select, add the value to it
            setSelectData(related_select_id, [val_typed_in]);
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
        //If not in Select
        if ($("#" + select + " option[value=" + item + "]").val() === undefined) {
            $("#" + select).append('<option value="' + item + '" data-iscustom="true">' + item + '</option>');
        }
    });
};

var loadSelectData = function (select, data, is_single) {
    if (typeof data == "string")
        data = [data];

    if (!is_single)
        is_single = isSelectOption(select, "issingle");

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
    if (option == "issingle" && !$("#" + select).hasClass("doecode-chosen-select"))
        return true;
    else
        return $("#" + select).data(option) ? $("#" + select).data(option) == true : false;
};

/*Goes through each select, and assigns it a chosen attribute based on whether it allows custom entries or not*/
$(".doecode-chosen-select").each(function () {
    var allows_custom_text = ($(this).data('allowcustom') == false) ? 'No match found for:' : 'Add:';
    $(this).chosen({
        width: '100%',
        no_results_text: allows_custom_text,
        search_contains: true
    });
});

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

    //If they want to show teh close button, we will
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

var getSoftwareTypeLabel = function(software_char){
  var return_val = "Scientific";
  
  switch(software_char){
      case "B":
          return_val = "Business";
          break;
  }
  
  return return_val;
};