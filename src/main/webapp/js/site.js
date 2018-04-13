const POC_LIST_LOADER_ERROR = {title: 'Error in Site Loading', show_loader: true,
    message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error in loading list of sites. The list couldn't successfully be loaded",
    contentClasses: ['center-text'], showClose: true};

const POC_POST_LOADER_ERROR = {title: 'Error in Updating Site', show_loader: true,
    message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error in updating site information. Site couldn't be updated successfully.",
    contentClasses: ['center-text'], showClose: true};

/**
 * Shows/hides message built from the text and class you give it
 */
var showPOCMessage = function (show, message, messageClass) {
    //Set messsage
    $("#poc-message").html(message);

    if (messageClass) {
        //Set class of parent
        $("#poc-message").parent().addClass(messageClass);
    }

    //Show or hide message
    if (show) {
        $("#poc-message").show();
    } else {
        $("#poc-message").hide();
    }
};

/**
 * Shows/hides message built from the text and class you give it
 */
var showSiteAdminMessage = function (show, message, messageClass) {
    //Set messsage
    $("#site-admin-message").html(message);

    if (messageClass) {
        //Set class of parent
        $("#site-admin-message").parent().addClass(messageClass);
    }

    //Show or hide message
    if (show) {
        $("#site-admin-message").show();
    } else {
        $("#site-admin-message").hide();
    }
};
/**
 * Empties the POC table of all email entries, with the exception of the last entry, since it's always used for adding new emails
 */
var clearPOCListTable = function () {
    showPOCMessage(false, '');
    $("#poc-admin-email-list > tbody > tr:not(:last-child)").remove();
};

/**
 * Goes through the POC table, marks all duplicates, removes marks from previous entries that are no longer duplicates. Return whether or not duplicates were found
 */
var checkAndMarkPOCDuplicates = function (email_list) {
    var had_duplicates = false;
    if (email_list === undefined) {
        email_list = gatherAllPOCEmails();
    }
    //Remove all error indications
    $("#poc-admin-email-list > tbody tr > td:first-child > input[type=text]").parent().removeClass('has-error');
    showPOCMessage(false, '');

    //Check for duplicates, and mark accordingly
    var duplicates = checkForDuplicates(email_list);
    if (duplicates.length > 0) {

        duplicates.forEach(function (item) {
            $("#poc-admin-email-list > tbody tr:nth-child(" + (parseInt(item) + 1) + ") > td:first-child > input[type=text]").parent().addClass('has-error');
        });
        had_duplicates = true;
        showPOCMessage(true, 'Please resolve duplicate emails', 'has-error');
    }
    return had_duplicates;
};

/**
 * Triggers when you click on a site in the list at the top of the POC admin page
 */
var POCListAction = function () {
    var self = this;
    var site_code = $(self).val();
    var lab_name = $(self).data('sitelabname');

    clearPOCListTable();

    if (site_code === '') {
        //Clear
        $("#site-code").html('');
        $("#site-list-container").hide();
    } else {
        //Existing Site
        $("#site-code").html(site_code);
        $("#lab-name").html(lab_name);
        //Get data from api
        doAuthenticatedAjax('GET', API_BASE + 'site/info/' + site_code, function (data) {
            //Get all of the email domains
            var email_domains_list = "";
            data[0].email_domains.forEach(function (item) {
                email_domains_list += (item + '<br/>');
            });
            $("#email-domains").html(email_domains_list);

            //Load all of the emails
            data[0].poc_emails.forEach(function (item) {
                $("#poc-admin-email-list > tbody > tr:last-child").before('<tr><td><input id="new-poc-email-address" value="' + item + '" class="form-control pure-input-1" type="text"></td>'
                        + '<td><span class="fa fa-minus-circle poc-remove-email" title="Remove Email"></span></td></tr>');
            });
            $("#site-list-container").show();
        }, null, function () {
            setCommonModalMessage(POC_LIST_LOADER_ERROR);
            showCommonModalMessage();
        });

    }

};

/**
 * Gathers all emails from the list, with the exception of the last entry. The user is expected to click the green plus to add their email to the list
 */
var gatherAllPOCEmails = function () {
    var email_addresses = [];
    //For every text input, inside of the first td of every table row in the table body, add the value to a list, and return it
    $("#poc-admin-email-list > tbody tr:not(:last-child) > td:first-child > input[type=text]").each(function () {
        var self = this;
        email_addresses.push($(self).val().trim().toLowerCase());
    });
    return email_addresses;
};

/**
 * Triggers when you click on the green plus next to the empty text box at the bottom of the POC list
 */
var addNewPOCToTable = function () {
    var self = this;
    var new_email = $(self).parent().prev('td').find('input[type=text].new-poc-entry').val().trim();

    if (new_email) {
        //Gather all of the emails
        var email_list = gatherAllPOCEmails();
        email_list.push(new_email);
        var duplicates = checkAndMarkPOCDuplicates(email_list);

        //If there were no duplicates, add the new row
        if (!duplicates) {
            //Add email to list
            $("#poc-admin-email-list>tbody").prepend('<tr><td><input id="new-poc-email-address" value="' + new_email + '" class="form-control pure-input-1" type="text"></td>'
                    + '<td><span class="fa fa-minus-circle poc-remove-email" title="Remove Email"></span></td></tr>');
            $(self).parent().prev('td').find('input[type=text].new-poc-entry').val('');
            showPOCMessage(false, '');
        }
    } else {
        showPOCMessage(true, 'You must enter an email address to add one to the list', 'has-error');
    }
};

/**
 * Triggers when you click on the red X next to an existing email in the POC admin
 */
var removePOCFromTable = function () {
    var self = this;
    $(self).parent().parent().remove();
    checkAndMarkPOCDuplicates();
};

/**
 * When the user makes a change to any of the text inputs, check and make sure that there are no duplicates, and no empty ones(that aren't the last one)
 */
var checkPOCEmails = function () {
    checkAndMarkPOCDuplicates();
};

/**
 * Saves POC admin changes
 */
var submitPOCChanges = function () {
    console.log("Submitting");

    //Clear out last field
    $("#poc-admin-email-list > tbody > tr:last-child > td:first-child > input[type=text]").val('');

    //Get the current site code
    var current_site_code = $("#site-list").val();

    var duplicates = checkAndMarkPOCDuplicates();
    if (duplicates) {
        showPOCMessage(true, 'Please resolve duplicate emails', 'has-error');
        return;
    }

    //Get the number found
    var email_list = gatherAllPOCEmails();

    var post_data = [{
            site_code: current_site_code,
            poc_emails: email_list
        }];

    doAuthenticatedAjax('POST', API_BASE + 'site/update', function (data) {
        clearPOCListTable();
        $("#site-list").val('');
        $("#site-list option[value='']").trigger('click');
        $("#site-list").attr('disabled', 'disabled');

        showSiteAdminMessage(true, 'Changes successfully changed. This page will reload in 3 seconds', 'has-success');
        setTimeout(function () {
            window.location.href = '/' + APP_NAME + '/site-admin';
        }, 3000);
    }, post_data, function () {
        setCommonModalMessage(POC_POST_LOADER_ERROR);
        showCommonModalMessage();
    });
};

checkHasRole('OSTI');
checkIsAuthenticated();
if (document.getElementById('site-admin-page-identifier')) {
    //Get the site list
    $("#sites-list-label").html('Site list loading...');
    doAuthenticatedAjax('GET', API_BASE + 'site/info', function (data) {
        var option_string = "";
        data.forEach(function (item) {
            var site_code = item.site_code;
            var lab = item.lab;
            //Comes up like <option value='ORNL' data-sitelabname='Oak Ridge National Laboratory' title='Oak Ridge National Laboratory'>Oak Ridge National Laboratory (ORNL)</option>
            option_string += "<option value='" + site_code + "' data-sitelabname='" + lab + "' title='" + lab + "'>" + lab + " (" + site_code + ")</option>";
        });
        $("#site-list").append(option_string);
        $("#sites-list-label").html('Sites');
        $("#site-list").removeAttr('disabled');
    }, null, function () {
        setCommonModalMessage(POC_LIST_LOADER_ERROR);
        showCommonModalMessage();
    });

    //Get the list of sites

    //OnClick for when you select a site from the dropdown
    $("#site-list").on('click', 'option', POCListAction);

    //OnClick for adding a adding a new site
    $("#poc-admin-email-list > tbody tr td span.poc-add-new-email").on('click', addNewPOCToTable);

    //OnClick for removing a site from the list
    $("#poc-admin-email-list > tbody").on('click', "tr td span.poc-remove-email", removePOCFromTable);

    //Every time a value is changed in one of the boxes (with the exception of the last one), check for duplicates and blanks
    $("#poc-admin-email-list > tbody").on('input', " tr:not(:last-child) > td:first-child > input[type=text]", checkPOCEmails);

    //On entery, trigger the add functionality
    $("#poc-admin-email-list > tbody > tr:last-child > td:first-child > input[type=text]").on('keyup', function (event) {
        var self = this;
        if (event.which === 13) {
            $(self).parent().next('td').find('span.poc-add-new-email').trigger('click');
        }
    });

    //OnClick for the save button
    $("#save-changes-btn").on('click', submitPOCChanges);

    //Makes sure that the site code stays upper-case
    /*
     $("#site-code").on('blur', function () {
     var self = this;
     $(self).val($(self).val().toUpperCase());
     });
     */
}