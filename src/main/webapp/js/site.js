checkIsAuthenticated();
if (document.getElementById('site-admin-page-identifier')) {
    const POC_LIST_LOADER_ERROR = {title: 'Error in Site Loading', show_loader: true,
        message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error in loading list of sites. The list couldn't successfully be loaded",
        contentClasses: ['center-text'], showClose: true};

    const POC_POST_LOADER_ERROR = {title: 'Error in Updating Site', show_loader: true,
        message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error in updating site information. Site couldn't be updated successfully.",
        contentClasses: ['center-text'], showClose: true};

    const POC_PUT_LOADER_ERROR = {title: 'Error in Saving New Site', show_loader: true,
        message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error in creating new site. Site couldn't be created successfully.",
        contentClasses: ['center-text'], showClose: true};

    /**
     * Shows/hides message built from the text and class you give it
     */
    let showPOCMessage = function (show, message, messageClass) {
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
    let showSiteAdminMessage = function (show, message, messageClass) {
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
    let clearPOCListTable = function () {
        showPOCMessage(false, '');
        $("#poc-admin-email-list > tbody > tr:not(:last-child)").remove();
    };

    /**
     * Goes through the POC table, marks all duplicates, removes marks from previous entries that are no longer duplicates. Return whether or not duplicates were found
     */
    let checkAndMarkPOCDuplicates = function (email_list) {
        var had_duplicates = false;
        if (email_list === undefined) {
            email_list = gatherAllPOCEmails();
        }
        //Remove all error indications
        $("#poc-admin-email-list > tbody tr > td:first-child > input[type=text]").parent().removeClass('has-error');
        showPOCMessage(false, '');

        //Check for duplicates, and mark accordingly
        var duplicates = checkForDuplicates(email_list, true);
        if (duplicates.length > 0) {
            duplicates.forEach(function (item) {
                $("#poc-admin-email-list > tbody tr:nth-child(" + (parseInt(item) + 1) + ") > td:first-child > input[type=text]").parent().addClass('has-error');
            });
            had_duplicates = true;
            showPOCMessage(true, 'Please resolve duplicate emails', 'has-error');
            $("#save-changes-btn").prop('disabled', true);
        } else {
            $("#save-changes-btn").prop('disabled', false);
        }
        return had_duplicates;
    };

    /**
     * Gathers all emails from the list, with the exception of the last entry. The user is expected to click the green plus to add their email to the list
     */
    let gatherAllPOCEmails = function () {
        let email_addresses = [];
        //For every text input, inside of the first td of every table row in the table body, add the value to a list, and return it
        $("#poc-admin-email-list > tbody tr:not(:last-child) > td:first-child > input[type=text]").each(function () {
            let self = this;
            email_addresses.push($(self).val().trim().toLowerCase());
        });
        return email_addresses;
    };

    //On-change event for the sites dropdown to change/show the form based on what was chosen
    $("#site-list").on('change', function () {
        var self = this;
        var site_code = $(self).val();
        var lab_name = $(self).find('option:selected').data('sitelabname');

        clearPOCListTable();
        //Hide new site fields
        $("#new-site-info").hide();
        //Clear out new site fields 
        document.querySelectorAll('#new-site-info input[type="text"]').forEach(function (new_site_input) {
            new_site_input.value = '';
        });
        //Hide the existing site info
        $("#existing-site-info").hide();
        //Hide the save buttons
        $("#save-new-btn,#save-changes-btn").hide();

        if (site_code == 'NEWSITE') {
            //Clear
            $("#site-code").html('');
            $("#new-site-info").show();
            $("#site-list-container").show();
            $("#save-new-btn").show();
        } else {
            //Existing Site
            $("#existing-site-info").show();
            $("#site-code").html(site_code);
            $("#lab-name").html(lab_name);

            $("#save-changes-btn").show();
            //Get data from api
            doAuthenticatedAjax('GET', API_BASE + 'site/info/' + site_code, function (data) {
                $("#standard-usage").html(data.standard_usage == true ? 'Yes' : 'No');
                $("#hq-usage").html(data.hq_usage == true ? 'Yes' : 'No');
                $("#software-group-email").val(data.software_group_email);
                //Get all of the email domains
                $("#email-domains").html(data.email_domains.join(' '));

                //Load all of the emails
                if (data.poc_emails.length > 0) {
                    data.poc_emails.forEach(function (item) {
                        $("#poc-admin-email-list > tbody > tr:last-child").before('<tr><td><input id="new-poc-email-address" value="' + item + '" class="form-control pure-input-1" type="text"></td>'
                                + '<td><span class="fas fa-minus-circle poc-remove-email" title="Remove Email"></span></td></tr>');
                    });
                } else {
                    $("#poc-admin-email-list > tbody > tr:last-child").before('<tr><td><input id="new-poc-email-address" class="form-control pure-input-1" type="text"></td>'
                            + '<td><span class="fas fa-minus-circle poc-remove-email" title="Remove Email"></span></td></tr>');
                }

                $("#site-list-container").show();
            }, null, function () {
                setCommonModalMessage(POC_LIST_LOADER_ERROR);
                showCommonModalMessage();
            });

        }

    });

    //OnClick for adding a new site email address
    $("#poc-admin-email-list > tbody tr td span.poc-add-new-email").on('click', function () {
        $("#poc-admin-email-list > tbody > tr:last").before('<tr><td><input id="new-poc-email-address" class="form-control pure-input-1" type="text"/></td>'
                + '<td><span class="fas fa-minus-circle poc-remove-email" title="Remove Email"></span></td></tr>');
        $("#poc-admin-email-list > tbody > tr:nth-last-child(2) > td:first-child > input[type=text]").focus();
    });

    //OnClick for removing a site from the list
    $("#poc-admin-email-list > tbody").on('click', "tr td span.poc-remove-email", function () {
        var self = this;
        $(self).parent().parent().remove();
        checkAndMarkPOCDuplicates();
    });

    //Every time a value is changed in one of the boxes (with the exception of the last one), check for duplicates and blanks
    $("#poc-admin-email-list > tbody").on('input', " tr:not(:last-child) > td:first-child > input[type=text]", function () {
        checkAndMarkPOCDuplicates();
    });

    //On entery, trigger the add functionality
    $("#poc-admin-email-list > tbody").on('keyup', 'tr:nth-last-child(2) > td:first-child > input[type=text]', function (event) {
        if (event.which === 13) {
            $("#poc-admin-email-list > tbody > tr:last-child > td:nth-child(2) > span.poc-add-new-email").trigger('click');
        }
    });

    //On-click for the save button 
    $("#save-changes-btn").on('click', function () {
        //Clear out the empty fields, if there are any
        let empty_list = [];
        $("#poc-admin-email-list > tbody > tr > td:first-child > input[type=text]").each(function () {
            var self = this;
            var val = $(self).val();
            if (!val) {
                empty_list.push($(self).parent().parent());
            }
        });
        //Remove the empty rows
        empty_list.forEach(function (item) {
            $(item).remove();
        });



        //Check and see whether there are any errors in the contact emails
        let duplicates = checkAndMarkPOCDuplicates();
        if (duplicates) {
            showPOCMessage(true, 'Please resolve duplicate emails', 'has-error');
            return;
        }

        //Get the site code, lab name, domains, and usage data
        let current_site_code = $("#site-list").val();
        let lab_name = $("#lab-name").html();
        let email_domains = $("#email-domains").html().split(' ');
        let is_standard_usage = ($("#standard-usage").text() == 'Yes');
        let is_hq_usage = ($("#hq-usage").text() == 'Yes');

        //Get the POC emails
        let email_list = gatherAllPOCEmails();

        //Get the software email
        let software_group_email = document.getElementById('software-group-email').value.trim();

        let post_data = [{
                site_code: current_site_code,
                lab_name: lab_name,
                email_domains: email_domains,
                poc_emails: email_list,
                software_group_email: software_group_email,
                standard_usage: is_standard_usage,
                hq_usage: is_hq_usage
            }];

        //Post the changes to the server
        doAuthenticatedAjax('POST', API_BASE + 'site/edit', function (data) {
            clearPOCListTable();
            $("#site-list").val('');
            $("#site-list option[value='']").trigger('click');
            $("#site-list").attr('disabled', 'disabled');
            $("#site-list-container").hide();

            showSiteAdminMessage(true, 'Changes saved. This page will reload shortly', 'has-success');
            setTimeout(function () {
                window.location.href = '/' + APP_NAME + '/site-admin';
            }, 1000);
        }, post_data, function (jqxhr, settings) {
            var error = JSON.parse(JSON.stringify(POC_POST_LOADER_ERROR));
            var errlist = ((jqxhr || {}).responseJSON || {}).errors;
            if (errlist != null)
                error.content = error.content + "<br/><br/>" + errlist;
            setCommonModalMessage(error);
            showCommonModalMessage();
        });

    });

    //Add an event to teh save new button to save brand new sites
    document.getElementById('save-new-btn').addEventListener('click', function () {
        /* Check if the contact emails are valid. If they aren't, show an error message */
        let duplicates = checkAndMarkPOCDuplicates();
        if (duplicates) {
            showPOCMessage(true, 'Please resolve duplicate emails', 'has-error');
            return;
        }

        /* Gather the needed data */
        let post_data = {};
        //Site Code
        post_data.site_code = document.getElementById('new-site-code').value.trim();

        //Lab Name
        post_data.lab_name = document.getElementById('new-lab-name').value.trim();

        //Email domain(s)
        let email_domain = document.getElementById('new-lab-domains').value.trim();
        if (email_domain) {
            let refined_list = [];
            email_domain.split(';').forEach(function (item) {
                if (item.trim() != '') {
                    refined_list.push(item.trim());
                }
            });
            if (refined_list.length > 0) {
                post_data.email_domains = refined_list;
            }
        }

        //Standard usage
        post_data.standard_usage = document.getElementById('new-standard-usage').checked;

        //hq usage
        post_data.hq_usage = document.getElementById('new-hq-usage').checked;

        //Software Group Email
        post_data.software_group_email = document.getElementById('software-group-email').value.trim();

        //POC Emails
        post_data.poc_emails = gatherAllPOCEmails();

        /* Validate the data. if it's valid, we post it to the server */
        let errors = [];
        //Validate site code
        if (!post_data.site_code) {
            errors.push('You must enter a Site Code');
        }
        //Validate lab name
        if (!post_data.lab_name) {
            errors.push('You must enter a Lab Name');
        }

        //Post if we had no errors
        if (errors.length > 0) {
            showPOCMessage(true, errors.join('<br/>'), 'has-error');
            return;
        } else {
            //Put the post data into an array so the server will accept it
            post_data = [post_data];

            //Do the PUT
            doAuthenticatedAjax('PUT', API_BASE + 'site/new', function (data) {
                clearPOCListTable();
                $("#site-list").val('');
                $("#site-list option[value='']").trigger('click');
                $("#site-list").attr('disabled', 'disabled');
                $("#site-list-container").hide();

                showSiteAdminMessage(true, 'New Site Saved. This page will reload shortly', 'has-success');
                setTimeout(function () {
                    window.location.href = '/' + APP_NAME + '/site-admin';
                }, 1000);
            }, post_data, function (jqxhr, settings) {
                var error = JSON.parse(JSON.stringify(POC_PUT_LOADER_ERROR));
                var errlist = ((jqxhr || {}).responseJSON || {}).errors;
                if (errlist != null)
                    error.content = error.content + "<br/><br/>" + errlist;
                setCommonModalMessage(error);
                showCommonModalMessage();
            });
        }
    });

}