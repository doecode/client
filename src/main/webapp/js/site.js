const POC_LIST_LOADER_ERROR = {title: 'Error in POC Loading', show_loader: true,
    message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error in loading list of sites with POC's. The list couldn't successfully be loaded",
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
    var val = $(self).val();

    clearPOCListTable();
    if (val === '') {
        //Clear
        $("#site-code").val('');
        $("#poc-site-list-container").hide();
    } else if (val === ' ') {
        //New Site
        $("#site-code").val('');
        $("#poc-site-list-container").show();
    } else {
        //Existing Site
        $("#site-code").val('');
        $("#poc-site-list-container").show();
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
    var new_email = $(self).parent().prev('td').prev('td').find('input[type=text].new-poc-entry').val().trim();
    var active_state = $(self).parent().prev('td').find('input[type=checkbox]').is(':checked');

    if (new_email) {
        //Gather all of the emails
        var email_list = gatherAllPOCEmails();
        email_list.push(new_email);
        var duplicates = checkAndMarkPOCDuplicates(email_list);

        //If there were no duplicates, add the new row
        if (!duplicates) {
            //Add email to list
            $("#poc-admin-email-list>tbody").prepend('<tr><td><input id="new-poc-email-address" value="' + new_email + '" class="form-control pure-input-1" type="text"></td>'
                    + '<td><input type="checkbox" ' + ((active_state) ? 'checked' : '') + '/></td>'
                    + '<td><span class="fa fa-minus-circle poc-remove-email" title="Remove Email"></span></td></tr>');
            $(self).parent().prev('td').prev('td').find('input[type=text].new-poc-entry').val('');
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
    //Clear out last field
    $("#poc-admin-email-list > tbody > tr:last-child > td:first-child > input[type=text]").val('');
    //Make sure a site has been entered
    var site_code = $("#site-code").val().trim();

    if (site_code) {
        //Check for the emails
        var duplicates = checkAndMarkPOCDuplicates();
        if (duplicates) {
            showPOCMessage(true, 'Please resolve duplicate emails', 'has-error');
        } else {
            //Count number found
            var email_lists = gatherAllPOCEmails();
            if (email_lists.length < 1) {
                showPOCMessage(true, 'You must enter at least one email to save', 'has-error');
            } else {
                //Gather emails, active states, etc
                var emails = [];
                $("#poc-admin-email-list > tbody > tr:not(:last-child)").each(function(){
                    var self = this;
                    var email_address = $(self).find('td:first-child > input[type=text]').val();
                    var is_checked = $(self).find('td:nth-child(2) > input[type=checkbox]').is(':checked');
                    
                    emails.push({
                        email_address:email_address,
                        active:is_checked
                    });
                });
                
                var post_data=  {
                    site:site_code,
                    emails:emails
                };
                
                console.log(JSON.stringify(post_data));
            }
        }
    } else {
        showPOCMessage(true, 'You must have a site code entered', 'has-error');
    }
};

if (document.getElementById('poc-admin-page-identifier')) {
    checkHasRole('OSTI');
    checkIsAuthenticated();

    //Get the site list
    /*
     doAuthenticatedAjax('GET', API_BASE + 'site/poc-list', function (data) {
     var list = data;
     var option_string = "";
     list.forEach(function (item) {
     option_string += "<option value='" + item + "' title='" + item + "'>" + item + "</option>";
     });
     $("#poc-site-list").append(option_string);
     }, null, function () {
     setCommonModalMessage(POC_LIST_LOADER_ERROR);
     showCommonModalMessage();
     });*/

    //OnClick for when you select a site from the dropdown
    $("#poc-site-list option").on('click', POCListAction);

    //OnClick for adding a adding a new site
    $("#poc-admin-email-list > tbody tr td span.poc-add-new-email").on('click', addNewPOCToTable);

    //OnClick for removing a site from the list
    $("#poc-admin-email-list > tbody").on('click', "tr td span.poc-remove-email", removePOCFromTable);

    //Every time a value is changed in one of the boxes (with the exception of the last one), check for duplicates and blanks
    $("#poc-admin-email-list > tbody").on('input', " tr:not(:last-child) > td:first-child > input[type=text]", checkPOCEmails);

    //OnClick for the save button
    $("#save-changes-btn").on('click', submitPOCChanges);

    //Makes sure that the site code stays upper-case
    $("#site-code").on('blur', function () {
        var self = this;
        $(self).val($(self).val().toUpperCase());
    });

} else if (document.getElementById('site-admin-page-identifier')) {
    checkHasRole('OSTI');
    checkIsAuthenticated();
}