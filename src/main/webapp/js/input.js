/***********************************************************************/
/***********************************************************************/
/*********************VARIABLE DECLARATIONS*****************************/
/***********************************************************************/
/***********************************************************************/
var metadata = new Metadata();
var developer = new Developer();
var sponsor_org = new SponsoringOrganization();
var research_org = new ResearchOrganization();
var contributor = new Contributor();
var contributing_org = new ContributingOrganization();
var related_identifier = new RelatedIdentifier();
var award_doi = new AwardDOI();

var developers_table = null;
var sponsoring_orgs_table = null;
var research_orgs_table = null;
var contributors_table = null;
var contributor_orgs_table = null;
var related_identifiers_table = null;
var award_dois_table = null;
var change_log_table = null;

// modal redirect
var modal_redirect = null;

//The value that just shows what page we're on
var page_val = $("#page").val();

var form = mobx.observable({
    "allowSave": true,
    "workflowStatus": ""
});
form.last_filename = "";

form.open_licenses = [];
form.open_propurl = "";
form.closed_licenses = [];
form.closed_propurl = "";
form.closed_licensecontact = "";
form.closedsource_available = null;
form.closedsource_contactinfo = null;

form.previous_ouo = false;
form.is_limited = $("#is_limited").val() == "true";

var datatableCallback = function (settings) {
    var api = this.api();
    var data = api.rows({
        page: 'current'
    }).data();

    // if not approval, and first column is sorted ascending while not being searched, enable reordering
    if (page_val != 'approve' && data.search() == "" && data.order()[0][0] == 0 && data.order()[0][1] == 'asc') {
        data.rowReorder.enable();
        data.columns(0).every(function () {
            this.nodes().to$().each(function () {
                $(this).removeClass('reorder-disabled');
                $(this).addClass('reorder');
            });
        });
    } else {
        data.rowReorder.disable();
        data.columns(0).every(function () {
            this.nodes().to$().each(function () {
                $(this).removeClass('reorder');
                $(this).addClass('reorder-disabled');
            });
        });
    }
};

var developers_data_tbl_opts = {
    drawCallback: datatableCallback,
    rowReorder: {
        update: false
    },
    order: [
        [0, 'asc']
    ],
    columns: [{
            className: 'reorder',
            name: 'id',
            data: 'id',
            'defaultContent': ''
        },
        {
            name: 'first_name',
            data: 'first_name',
            'defaultContent': ''
        },
        {
            name: 'last_name',
            data: 'last_name',
            'defaultContent': ''
        },
        {
            name: 'affiliations',
            data: 'affiliations',
            'defaultContent': '',
            render: function (data, type, row) {
                var affiliations = data ? data.join(', ') : '';
                return affiliations;
            }
        }
    ],
    // Disable search bar for Developers datatable
    sDom: 'lrtip'
};

var sponsoring_org_tbl_opts = {
    order: [
        [0, 'asc']
    ],
    columns: [{
            name: 'organization_name',
            data: 'organization_name',
            'defaultContent': ''
        },
        {
            name: 'primary_award',
            data: 'primary_award',
            'defaultContent': ''
        }
    ]
};

var research_org_tbl_opts = {
    order: [
        [0, 'asc']
    ],
    columns: [{
        name: 'organization_name',
        data: 'organization_name',
        'defaultContent': ''
    }]
};

var contributors_org_tbl_opts = {
    drawCallback: datatableCallback,
    rowReorder: {
        update: false
    },
    order: [
        [0, 'asc']
    ],
    columns: [{
            className: 'reorder',
            name: 'id',
            data: 'id',
            'defaultContent': ''
        },
        {
            name: 'first_name',
            data: 'first_name',
            'defaultContent': ''
        },
        {
            name: 'last_name',
            data: 'last_name',
            'defaultContent': ''
        },
        {
            name: 'contributor_type',
            data: 'contributor_type',
            'defaultContent': ''
        }
    ]
};

var contributing_organizations_tbl_opts = {
    order: [
        [0, 'asc']
    ],
    columns: [{
            name: 'organization_name',
            data: 'organization_name',
            'defaultContent': ''
        },
        {
            name: 'contributor_type',
            data: 'contributor_type',
            'defaultContent': ''
        }
    ]
};

var related_identifiers_tbl_opts = {
    order: [
        [0, 'asc']
    ],
    autoWidth: false,
    columns: [{
            name: 'identifier_type',
            data: 'identifier_type',
            'defaultContent': '',
            width: '20%'
        },
        {
            name: 'relation_type',
            data: 'relation_type',
            'defaultContent': '',
            width: '25%'
        },
        {
            name: 'identifier_value',
            data: 'identifier_value',
            'defaultContent': '',
            className: 'word-break'
        }
    ]
};

var award_dois_tbl_opts = {
    order: [
        [0, 'asc']
    ],
    autoWidth: false,
    columns: [
        {
            name: 'award_doi',
            data: 'award_doi',
            'defaultContent': ''
        },
        {
            name: 'funder_name',
            data: 'funder_name',
            'defaultContent': '',
            className: 'word-break'
        }
    ]
};

var change_log_tbl_opts = {
    order: [
        [0, 'desc']
    ],
    autoWidth: false,
    pageLength : 7,
    lengthMenu: [[7, 25, 50, 100], [7, 25, 50, 100]],
    columns: [
        {
            name: 'change_date',
            data: 'change_date',
            'defaultContent': '',
            width: '15%'
        },
        {
            name: 'changed_by',
            data: 'changed_by',
            'defaultContent': '',
            width: '15%'
        },
        {
            name: 'changes_made',
            data: 'changes_made',
            'defaultContent': '',
            className: 'word-break'
        }
    ]
};

/***********************************************************************/
/***********************************************************************/
/*********************FUNCTION DECLARATIONS*****************************/
/***********************************************************************/
/***********************************************************************/
var toggleCollapsible = function () {
    $(this).prev().prev().prev('a.input-accordion-title').trigger('click');
};

// If you close a modal, any new items added are removed, based on an attribute in the option field
var clearChosenList = function (list_id) {
    $('#' + list_id + ' option[data-iscustom="true"]').remove();
    $('#' + list_id + ' option').each(function () {
        $(this).prop('selected', false);
    });
    $("#" + list_id).trigger('chosen:updated');
};

var trackOpenClosedInfo = mobx.action("Track OpenClosed Info", function (projectType) {
    if (!projectType)
        return;

    var openSource = projectType.charAt(0) == 'O';

    if (openSource) {
        form.open_licenses = metadata.getValue("licenses");
        form.open_propurl = metadata.getValue("proprietary_url");
    }
    else {
        form.closed_licenses = metadata.getValue("licenses");
        form.closed_propurl = metadata.getValue("proprietary_url");
        form.closed_licensecontact = metadata.getValue("license_contact_email");

        form.closedsource_available = metadata.getValue("license_closedsource_available");
        form.closedsource_contactinfo = metadata.getValue("license_closedsource_contactinfo");
    }
});

var updateFromOpenClosedInfo = mobx.action("Update From OpenClosed Info", function (openSource) {
    if (openSource) {
        metadata.setValue('license_closedsource_available', null);
        metadata.setValue('license_closedsource_contactinfo', null);

        metadata.setValue('licenses', form.open_licenses);
        metadata.setValue('proprietary_url', form.open_propurl);
    } else {
        metadata.setValue('license_closedsource_available', form.closedsource_available);
        metadata.setValue('license_closedsource_contactinfo', form.closedsource_contactinfo);

        metadata.setValue('licenses', form.closed_licenses);
        metadata.setValue('proprietary_url', form.closed_propurl);
        metadata.setValue('license_contact_email', form.closed_licensecontact);
    }
});

var projectTypeButtonClick = mobx.action("Project Type Click", function () {
    var project_type = metadata.getValue("project_type");
    var openSource = project_type == null ? null : project_type.charAt(0) == 'O';
    var accessLims = metadata.getValue("access_limitations");
    trackOpenClosedInfo(project_type);

    var id = $(this).attr("id");
    if (id == "input-opensource-btn") {
        // if not already OS, blank out some things
        if (!openSource || openSource == null) {
            metadata.setValue("project_type", null);
            metadata.setValue("project_type_public", null);
            metadata.setValue("project_type_landing", null);
            if (!form.is_limited && accessLims.length == 0)
                metadata.setValue("access_limitations", ["UNL"]);
        }

        metadata.setValue("project_type_opensource", true);

        metadata.setValue("license_closedsource_available", null);
        metadata.setValue("license_closedsource_contactinfo", null);
    }
    else if (id == "input-closedsource-btn") {
        // if not already CS, blank out some things
        if (openSource || openSource == null) {
            metadata.setValue("project_type", null);
            if (!form.is_limited && accessLims.length == 0)
                metadata.setValue("access_limitations", ["UNL"]);
        }

        metadata.setValue("project_type_opensource", false);

        metadata.setValue("project_type_public", false);
        metadata.setValue("project_type_landing", null);
    }
    else if (id == "input-pubyes-btn") {
        metadata.setValue("project_type_public", true);
    }
    else if (id == "input-pubno-btn") {
        metadata.setValue("project_type_public", false);
    }
    else if (id == "input-landyes-btn") {
        metadata.setValue("project_type_landing", true);
        metadata.setValue("landing_contact", "");
    }
    else if (id == "input-landno-btn") {
        metadata.setValue("project_type_landing", false);
        metadata.setValue("landing_page", "");
        
        var sge = JSON.parse(localStorage.user_data).software_group_email;    
        if (sge != null && sge != undefined)
            metadata.setValue("landing_contact", sge);
    }
});

var projectTypeButtonUpdate = function () {
    var is_opensource = metadata.getValue("project_type_opensource");
    var is_public = metadata.getValue("project_type_public");
    var is_landing = metadata.getValue("project_type_landing");
    if (is_opensource == null) {
        $("#is-public-div").hide();
        $("#is-landing-div").hide();
        
        $("#input-opensource-btn").addClass("faded");
        $("#input-closedsource-btn").addClass("faded");
    }
    else {
        if (is_opensource) {
            $("#is-public-div").show();
            $("#is-landing-div").hide();
            $("#input-opensource-btn").removeClass("faded");
            $("#input-closedsource-btn").addClass("faded");
        }
        else {
            $("#is-public-div").hide();
            $("#is-landing-div").show();
            $("#input-opensource-btn").addClass("faded");
            $("#input-closedsource-btn").removeClass("faded");
        }

        if (is_public == null) {
            $("#input-pubyes-btn").addClass("faded");
            $("#input-pubno-btn").addClass("faded");
        }
        else {
            if (is_public) {
                $("#input-pubyes-btn").removeClass("faded");
                $("#input-pubno-btn").addClass("faded");
            }
            else {
                $("#input-pubyes-btn").addClass("faded");
                $("#input-pubno-btn").removeClass("faded");
            }
        }

        if (is_landing == null) {
            $("#input-landyes-btn").addClass("faded");
            $("#input-landno-btn").addClass("faded");
        }
        else {
            if (is_landing) {
                $("#input-landyes-btn").removeClass("faded");
                $("#input-landno-btn").addClass("faded");
            }
            else {
                $("#input-landyes-btn").addClass("faded");
                $("#input-landno-btn").removeClass("faded");
            }
        }
    }
};

var setProjectType = mobx.action("Set Project Type", function () {
    var is_opensource = metadata.getValue("project_type_opensource");
    var is_public = metadata.getValue("project_type_public");
    var is_landing = metadata.getValue("project_type_landing");

    if (is_opensource == null || (is_opensource === true && is_public == null) || (is_opensource === false && is_landing == null))
        return;

    val = null;

    if (is_opensource && is_public)
        val = "OS";
    else if (is_opensource && !is_public)
        val = "ON";
    else if (!is_opensource && is_landing != null)
        val = "CS";

    updateFromOpenClosedInfo(val.charAt(0) == 'O');
    trackOpenClosedInfo(val);

    metadata.setValue("project_type", val);
});

var licensesButtonClick = mobx.action("License Options Click", function () {
    var id = $(this).attr("id");
    if (id == "input-licenseyes-btn") {
        metadata.setValue("license_closedsource_available", true);
    }
    else if (id == "input-licenseno-btn") {
        metadata.setValue("license_closedsource_available", false);
    }
    else if (id == "input-contactyes-btn") {
        metadata.setValue("license_closedsource_contactinfo", true);
    }
    else if (id == "input-contactno-btn") {
        metadata.setValue("license_closedsource_contactinfo", false);
    }
});

var licenseButtonUpdate = function () {
    var is_opensource = metadata.getValue("project_type_opensource");
    var has_license = metadata.getValue("license_closedsource_available");
    var has_contact = metadata.getValue("license_closedsource_contactinfo");

    if (is_opensource || is_opensource == null) {
        $("#licence-select-zone").show();
        $("#has-license-div").hide();

        $("#license-contact-div").hide();
        $("#license-contact-zone").hide();
    }
    else {
        $("#licence-select-zone").hide();
        $("#has-license-div").show();
    }

    if (has_license == null) {
        $("#license-contact-div").hide();
        $("#license-contact-zone").hide();
        
        $("#input-licenseyes-btn").addClass("faded");
        $("#input-licenseno-btn").addClass("faded");
    }
    else {
        $("#license-contact-div").show();

        if (has_license) {
            $("#input-licenseyes-btn").removeClass("faded");
            $("#input-licenseno-btn").addClass("faded");
            $("#proprietary-url-zone").show();
        }
        else {
            $("#license-contact-div").hide();

            $("#input-licenseyes-btn").addClass("faded");
            $("#input-licenseno-btn").removeClass("faded");
            $("#proprietary-url-zone").hide();
        }

        if (has_contact == null) {
            $("#input-contactyes-btn").addClass("faded");
            $("#input-contactno-btn").addClass("faded");
            $("#license-contact-zone").hide();
        }
        else {
            if (has_contact) {
                $("#input-contactyes-btn").removeClass("faded");
                $("#input-contactno-btn").addClass("faded");
                $("#license-contact-zone").hide();
            }
            else {
                $("#input-contactyes-btn").addClass("faded");
                $("#input-contactno-btn").removeClass("faded");
                $("#license-contact-zone").show();
            }
        }
    }
};

var setSuccess = function (label, is_completed, error_msg) {
    var is_error = error_msg ? true : false;
    if (is_error) {
        $("#" + label).addClass("has-error");
        $("#" + label).removeClass("has-success");
        $("#" + label).parent().parent().addClass("has-error");
        $("#" + label).parent().parent().removeClass("has-success");
        $("#" + label + "-error").html(error_msg);
        $("#" + label).parent().parent().find(".errorCheck").show();
        $("#" + label).parent().parent().find(".successCheck").hide();
    } else if (is_completed) {
        $("#" + label).removeClass("has-error");
        $("#" + label).addClass("has-success");
        $("#" + label).parent().parent().removeClass("has-error");
        $("#" + label).parent().parent().addClass("has-success");
        $("#" + label + "-error").text("");
        $("#" + label).parent().parent().find(".errorCheck").hide();
        $("#" + label).parent().parent().find(".successCheck").show();
    } else {
        $("#" + label).removeClass("has-error");
        $("#" + label).removeClass("has-success");
        $("#" + label).parent().parent().removeClass("has-error");
        $("#" + label).parent().parent().removeClass("has-success");
        $("#" + label + "-error").text("");
        $("#" + label).parent().parent().find(".errorCheck").hide();
        $("#" + label).parent().parent().find(".successCheck").hide();
    }
};

var setRequired = function (label, is_required, exclude_parenthetical_text) {
    use_parenthetical_text = !(exclude_parenthetical_text === true);

    var new_class_list = "";

    if (is_required) {
        new_class_list = use_parenthetical_text ? "req req_rf" : "req";
    } else if (use_parenthetical_text) {
        new_class_list = use_parenthetical_text ? "req_of" : "";
    }

    $("#" + label).removeClass("req req_rf req_of").addClass(new_class_list);
};

var inputChange = mobx.action("Input Change", function (event) {
    var value = $(this).val();
    if ((event.data.field == "release_date" || event.data.field == "contract_start_date" || event.data.field == "sb_release_date" || event.data.field == "ouo_release_date") && value) {
        value = moment(value, FRONT_END_DATE_FORMAT).format(BACK_END_DATE_FORMAT);
    } else if ((['programming_languages', 'licenses', 'access_limitations',
        'affiliations', 'country_of_origin', 'project_keywords', 'organization_name',
        'award_numbers', 'br_codes', 'fwp_numbers', 'contributor_type', 'identifier_type', 'relation_type'].indexOf(event.data.field) > -1) && value && Array.isArray(value)) {
        //Due to a strange bug with chosen js, duplicates can happen in certain scenarios. This is to prevent said duplicates
        let refined = [];
        value.forEach(function (item) {
            if (refined.indexOf(item) < 0) {
                refined.push(item);
            }
        });
        value = refined;
    }
    event.data.store.setValue(event.data.field, value);
});

var checkboxChange = mobx.action("Checkbox Change", function (event) {
    event.data.store.setValue(event.data.field, $(this).is(":checked"));
});

var updateLabelStyle = function (store, field, label, exclude_parenthetical_text) {
    $("#" + label).text(store.getLabel(field, $("#" + label).text()));

    setRequired(label, store.isRequired(field), exclude_parenthetical_text);
    setSuccess(label, store.isCompleted(field), store.getError(field));
};

var updateInputStyle = function (store, field, label, input, exclude_parenthetical_text) {
    updateLabelStyle(store, field, label, exclude_parenthetical_text);

    var value = store.getValue(field);
    if ((field == "release_date" || field == "contract_start_date" || field == "sb_release_date" || field == "ouo_release_date") && value)
        value = moment(value, BACK_END_DATE_FORMAT).format(FRONT_END_DATE_FORMAT);

    $("#" + input).val(value);
};

var updateDropzoneStyle = function (store, field, label, input, exclude_parenthetical_text) {
    updateLabelStyle(store, field, label, exclude_parenthetical_text);

    var value = store.getValue(field);

    $("#" + input).html(value);

    if (value)
        $("#" + input).closest(".upload-remove-div").show();
    else
        $("#" + input).closest(".upload-remove-div").hide();

};

var updateTextStyle = function (store, field, label, input, exclude_parenthetical_text, placeholder) {
    updateLabelStyle(store, field, label, exclude_parenthetical_text);

    var value = store.getValue(field);
    value = value ? value : placeholder;

    $("#" + input).text(value);
};

var updateSelectStyle = function (store, field, label, input, exclude_parenthetical_text) {
    updateLabelStyle(store, field, label, exclude_parenthetical_text);
    var current_list = mobx.toJS(store.getValue(field));
    clearChosenList(input);
    populateSelectWithCustomData(input, current_list);
    loadSelectData(input, current_list);
};

var updateActiveDataPage = function (table, data) {
    if (table) {
        var previousPageIdx = table.page.info().page;
        var previousTotal = table.page.info().recordsTotal;

        table.clear();
        table.rows.add(data).draw();

        // if not first draw and adding records, or page is no longer valid, then go to last page
        var lastPageIdx = table.page.info().pages - 1;
        if ((previousTotal > 0 && table.page.info().recordsTotal > previousTotal) || previousPageIdx > lastPageIdx)
            table.page(lastPageIdx).draw(false);
        else
            table.page(previousPageIdx).draw(false);
    }
};


var autopopulateFromRepository = function () {
    setCommonModalMessage({
        title: 'Autopopulate',
        show_loader: true,
        message_type: MESSAGE_TYPE_REGULAR,
        content: "<br/> Loading Data from Repository: <br> " + $("#repository-link").val(),
        contentClasses: ['center-text'],
        showClose: false
    });
    showCommonModalMessage();

    doAjax('GET', API_BASE + "metadata/autopopulate?repo=" + metadata.getValue('repository_link'), parseAutopopulateResponse, undefined, parseErrorResponse);
    event.preventDefault();
};

var parseEditErrorResponse = function (jqXhr, exception) {
    modal_redirect = '/' + APP_NAME;

    if (page_val == 'approve')
        modal_redirect += '/pending';
    else
        modal_redirect += '/projects';

    parseErrorResponse(jqXhr, exception);
};

var parseErrorResponse = function parseErrorResponse(jqXhr, exception) {
    let x = 0;
    let msg = "";

    if (jqXhr.responseJSON && jqXhr.responseJSON.errors) {
        for (x = 0; x < jqXhr.responseJSON.errors.length; x++) {
            msg += (msg == "" ? "" : "; ") + jqXhr.responseJSON.errors[x];
        }
    }

    if (msg == "")
        msg = "Internal Server Error: " + jqXhr.status;

    setCommonModalMessage({
        title: 'ERROR',
        show_loader: true,
        message_type: MESSAGE_TYPE_ERROR,
        content: "<br/>" + msg,
        contentClasses: ['center-text'],
        showClose: true
    });
    showCommonModalMessage();
};


var parseSearchResponse = mobx.action("Parse Search Response", function parseSearchResponse(data) {
    //Set the owner email, though we won't actually show it if the user doesn't have specific permissions
    $("#owner-email-address").html(data.metadata.owner);
    if ($("#page").val() == 'submit' || $("#page").val() == 'announce') {
        //First, check if the user is the owner of this record
        if (data.metadata.owner != JSON.parse(localStorage.user_data).user_email) {
            /*Make a quick site ownership code check, to ensure that this user should be working on this record*/
            var site_code_check = data.metadata.site_ownership_code;
            checkHasRole(site_code_check, function () {
                /*If they have permissions for this site, then we need not make any further checks*/
                $("#owner-email-address").parent().show();
            }, function () {
                /*This means they didn't have a permission for this site, but they might be a record admin. We will make that check too.*/
                checkHasRole('RecordAdmin', function () {
                    /*If they are a record admin, then we need not make any further checks*/
                    $("#owner-email-address").parent().show();
                }, function () {
                    /*This means the user isn't a record admin, and don't have permissions for this site. They need to be redirected.*/
                    window.location.href = '/' + APP_NAME + '/forbidden?message=You do not have permission to edit ' + data.code_id + ';';
                });
            });
        }
    }

    // lock access limitations from being edited, if not RecordAdmin
    checkHasRole("RecordAdmin", function () {
        $("#access-limitations").prop("disabled", false).trigger("chosen:updated");
        $("#change-log-zone").show();
    }, function () {
        $("#access-limitations").prop("disabled", true).trigger("chosen:updated");
        $("#change-log-zone").hide();
    });

    metadata.loadRecordFromServer(data.metadata, page_val);

    // if old record that's not updated, set to default
    var software_type_id = metadata.getValue("software_type");
    if (!software_type_id) {
        metadata.setValue("software_type", $("#software_type").val());
    }
    
    form.is_limited = !metadata.getValue("access_limitations").includes("UNL");
    restrictLimitations();

    form.last_filename = "";
    var project_type = metadata.getValue("project_type");
    if (project_type != 'OS') {
        var orig_file = metadata.getValue("file_name");
        form.last_filename = orig_file ? orig_file : form.last_filename;
    }

    if (project_type != null) {
        switch (project_type) {
            case "OS":
                metadata.setValue("project_type_opensource", true);
                metadata.setValue("project_type_public", true);
                break;
            case "ON":
                metadata.setValue("project_type_opensource", true);
                metadata.setValue("project_type_public", false);
                break;
            case "CS":
                metadata.setValue("project_type_opensource", false);
                metadata.setValue("project_type_public", null);

                var closed_landingpage = metadata.getValue('landing_page');
                var closed_landingcontact = metadata.getValue('landing_contact');

                if (closed_landingcontact != null && closed_landingcontact != "") {
                    metadata.setValue('project_type_landing', false);
                }
                else if (closed_landingpage != null && closed_landingpage != "") {
                    metadata.setValue('project_type_landing', true);
                }
                break;
            default:
                break;
        }
        
        projectTypeButtonUpdate();
        
        var openSource = project_type.charAt(0) == 'O';
        if (!openSource) {
            var closed_propurl = metadata.getValue('proprietary_url');
            var closed_licensecontact = metadata.getValue('license_contact_email');
            var override = false;

            if (closed_propurl != null && closed_propurl != "")
                metadata.setValue('license_closedsource_available', true);
            else {
                metadata.setValue('license_closedsource_available', false);
                override = true;
            }

            if (override || closed_licensecontact != null && closed_licensecontact != "")
                metadata.setValue('license_closedsource_contactinfo', false);
            else {
                metadata.setValue('license_closedsource_contactinfo', true);
            }
        }

        trackOpenClosedInfo(project_type);
    }

    form.workflowStatus = data.metadata.workflow_status;
    form.allowSave = (data.metadata.workflow_status == "" || data.metadata.workflow_status == "Saved");



    // this should really be based on info from data store, not calculated like this.  We should revisit doi_status...
    const doi = metadata.getValue("doi");
    const prefix = doi.substr(0, doi.indexOf('/'));
    const id = doi.substr(doi.lastIndexOf('/') + 1, doi.length - 1);
    const infix = doi.substr(doi.indexOf('/') + 1, doi.lastIndexOf('/') - doi.indexOf('/') - 1);

    if (prefix == "10.5072" || prefix == "10.11578") {
        metadata.setValue("doi_status", (form.allowSave ? "RES" : "REG"));
    }

    // Allow Is Migrated Flag
    checkHasRole('RecordAdmin', function () {
        // do nothing
    }, function () {
        checkHasRole('ApprovalAdmin', function () {
            if ($("#page").val() != 'approve') {
                // not approver on approval page, so wipe out migration flag
                metadata.setValue('is_migration', false);
            }
        }, function () {
            // not admin, so wipe out migration flag
            metadata.setValue('is_migration', false);
        });
    });

    form.previous_ouo = metadata.getValue("access_limitations").includes("OUO");

    if (infix) {
        metadata.setValue("doi_infix", infix);
    }
    hideCommonModalMessage();
});

//This function eventually calls parseAutopopulateResponse - but it first needs to remove some values 
var parseLoadIdResponse = function (data) {
    if ($("#page").val() == 'submit' || $("#page").val() == 'announce') {
        //First, check if this is the owner or not
        if (data.metadata.owner != JSON.parse(localStorage.user_data).user_email) {
            var site_code_check = data.metadata.site_ownership_code;
            checkHasRole(site_code_check, function () {
                /*If they have permissions for this site, then we need not make any further checks*/
            }, function () {
                /*This means they didn't have a permission for this site, but they might be a record admin. We will make that check too.*/
                checkHasRole('RecordAdmin', function () {
                    /*If they are a record admin, then we need not make any further checks*/
                }, function () {
                    /*This means the user isn't a record admin, and don't have permissions for this site. They need to be redirected.*/
                    window.location.href = '/' + APP_NAME + '/forbidden?message=You do not have permission to create that record.';
                });
            });
        }
    }
    data.metadata.code_id = '';
    data.metadata.workflow_status = '';
    data.metadata.date_record_added = '';
    data.metadata.date_record_updated = '';
    data.metadata.file_name = '';
    data.metadata.files = [];
    data.metadata.container_name = '';
    data.metadata.containers = [];
    data.metadata.repository_link = '';
    data.metadata.landing_page = '';
    data.metadata.landing_contact = '';

    //Get the "version_type", and from that, add a related identifier entry
    var related_identifiers_list = [];
    if ($("#version_type").val() == 'Prev') { //If this is considered to be the previous version of the load id
        related_identifiers_list.push({
            identifier_type: 'DOI',
            identifier_value: data.metadata.doi,
            relation_type: 'IsPreviousVersionOf'
        });
    } else { //If this is considered to be the next or newer version of the load id
        related_identifiers_list.push({
            identifier_type: 'DOI',
            identifier_value: data.metadata.doi,
            relation_type: 'IsNewVersionOf'
        });
    }
    //Set the list with the new entry as the list from the metadata
    data.metadata.related_identifiers = related_identifiers_list;
    data.metadata.doi = '';

    parseSearchResponse(data);
};

var parseAutopopulateResponse = mobx.action("Parse Autopopulate Response", function parseAutopopulateResponse(responseData) {
    if (responseData !== undefined) {
        metadata.updateMetadata(responseData.metadata);
    }
    hideCommonModalMessage();
});


var doMultipartSubmission = function doMultipartSubmission(url, successCallback) {
    const files = metadata.getValue("files");
    const containers = metadata.getValue("containers");
    let formData = new FormData();
    if (Array.isArray(files.slice()) && files.length > 0)
        formData.append('file', files[0]);
    if (Array.isArray(containers.slice()) && containers.length > 0)
        formData.append('container', containers[0]);
    formData.append('metadata', JSON.stringify(metadata.serializeData()));
    doAuthenticatedMultipartRequest(url, formData, successCallback, parseErrorResponse);
};


var save = function save() {
    var code_id = $("#code_id").val();
    var msg = code_id ? "Project " + code_id : "New Project";

    setCommonModalMessage({
        title: 'Saving',
        show_loader: true,
        message_type: MESSAGE_TYPE_REGULAR,
        content: "<br/>Saving data for " + msg + ".",
        contentClasses: ['center-text'],
        showClose: false
    });
    showCommonModalMessage();

    if ((Array.isArray(metadata.getValue("files").slice()) && metadata.getValue("files").length > 0) ||
        (Array.isArray(metadata.getValue("containers").slice()) && metadata.getValue("containers").length > 0))
        doMultipartSubmission(API_BASE + 'metadata/save', parseSaveResponse);
    else
        doAuthenticatedAjax('POST', API_BASE + 'metadata/save', parseSaveResponse, metadata.serializeData(), parseErrorResponse);
};



var submit = function submit() {
    var code_id = $("#code_id").val();
    var msg = code_id ? "Project " + code_id : "New Project";

    msg = "<br/>Submitting data for " + msg + ".";
    if (metadata.getValue("project_type").charAt(0) == 'C')
        msg += "<br/><br/>Please wait while your record and the associated files are being sent to DOE CODE. This may take a few minutes to complete.";

    setCommonModalMessage({
        title: 'Submitting',
        show_loader: true,
        message_type: MESSAGE_TYPE_REGULAR,
        content: msg,
        contentClasses: ['center-text'],
        showClose: false
    });
    showCommonModalMessage();

    if ((Array.isArray(metadata.getValue("files").slice()) && metadata.getValue("files").length > 0) ||
        (Array.isArray(metadata.getValue("containers").slice()) && metadata.getValue("containers").length > 0))
        doMultipartSubmission(API_BASE + 'metadata/submit', parseSubmitResponse);
    else
        doAuthenticatedAjax('POST', API_BASE + 'metadata/submit', parseSubmitResponse, metadata.serializeData(), parseErrorResponse);
};



var announce = function announce() {
    var code_id = $("#code_id").val();
    var msg = code_id ? "Project " + code_id : "New Project";

    setCommonModalMessage({
        title: 'Announcing',
        show_loader: true,
        message_type: MESSAGE_TYPE_REGULAR,
        content: "<br/>Announcing data for " + msg + ".",
        contentClasses: ['center-text'],
        showClose: false
    });
    showCommonModalMessage();

    if ((Array.isArray(metadata.getValue("files").slice()) && metadata.getValue("files").length > 0) ||
        (Array.isArray(metadata.getValue("containers").slice()) && metadata.getValue("containers").length > 0))
        doMultipartSubmission(API_BASE + 'metadata/announce', parseAnnounceResponse);
    else
        doAuthenticatedAjax('POST', API_BASE + 'metadata/announce', parseAnnounceResponse, metadata.serializeData(), parseErrorResponse);
};



var approve = function approve() {
    var code_id = $("#code_id").val();
    var msg = code_id ? "Project " + code_id : "New Project";

    setCommonModalMessage({
        title: 'Approving',
        show_loader: true,
        message_type: MESSAGE_TYPE_REGULAR,
        content: "<br/>Approving data for " + msg + ". Please wait, this may take a few minutes.",
        contentClasses: ['center-text'],
        showClose: false
    });
    showCommonModalMessage();

    doAuthenticatedAjax('GET', API_BASE + 'metadata/approve/' + code_id, parseApproveResponse, null, parseErrorResponse);
};



var editComment = function editComment() {
    var code_id = $("#code_id").val();
    var msg = code_id ? "Project " + code_id : "New Project";

    var commentData = {};
    var setComment = metadata.getValue("comment");
    commentData["comment"] = setComment ? setComment : null;

    setCommonModalMessage({
        title: 'Editing Comment',
        show_loader: true,
        message_type: MESSAGE_TYPE_REGULAR,
        content: "<br/>Editing comment for " + msg + ". Please wait, this may take a moment.",
        contentClasses: ['center-text'],
        showClose: false
    });
    showCommonModalMessage();

    doAuthenticatedAjax('POST', API_BASE + 'metadata/comment/' + code_id, parseCommentResponse, commentData, parseErrorResponse);
};



var parseSaveResponse = mobx.action("Parse Receive Response", function parseSaveResponse(data) {
    metadata.setValue("code_id", data.metadata.code_id);
    hideCommonModalMessage();

    var target = "submit";
    if (form.is_limited)
        target = "announce";

    if (!($("#code_id").val())) {
        window.location.href = "/" + APP_NAME + "/" + target + "?code_id=" + data.metadata.code_id;
    }
});

var fillContactDataFromAccount = mobx.action("Fill Contact Data", function () {
    doAjax('GET', '/' + APP_NAME + '/user-data/get-current-user-data', function (data) {
        //Contact Name
        metadata.setValue("recipient_name", data.first_name + ' ' + data.last_name);
        //Contact Email
        metadata.setValue("recipient_email", data.email);
        //Contact Organization
        if (data.site != 'CONTR') {
            metadata.setValue("recipient_org", data.site);
        }
    }, null, function (xhr) {});
});


var parseSubmitResponse = function parseSubmitResponse(data) {
    hideCommonModalMessage();
    window.location.href = '/' + APP_NAME + '/confirm?workflow=submitted&code_id=' + data.metadata.code_id;
};


var parseAnnounceResponse = function parseAnnounceResponse(data) {
    hideCommonModalMessage();
    window.location.href = '/' + APP_NAME + '/confirm?workflow=announced&code_id=' + data.metadata.code_id;
};


var parseApproveResponse = function parseApproveResponse(data) {
    hideCommonModalMessage();
    window.location.href = '/' + APP_NAME + '/pending';
};


var parseCommentResponse = function parseApproveResponse(data) {
    hideCommonModalMessage();

    window.location.reload(true);
};


var setModalActions = function setModalActions(modal) {
    //Clears out the lists upon closing the modals
    $("#" + modal + "-edit-modal").on('hidden.bs.modal', {
        modal_name: modal
    }, clearModal);
    //Show the add modal
    $("#add-" + modal + "-modal-btn").on('click', {
        modal_name: modal
    }, showModal);
    //Hide the modal
    $("#" + modal + "-close-btn").on('click', {
        modal_name: modal
    }, hideModal);
    //Delete the item
    $("#" + modal + "-delete-btn").on('click', {
        modal_name: modal
    }, deleteModalData);
    //Save the item
    $("#" + modal + "-save-btn").on('click', {
        modal_name: modal
    }, saveModalData);
    //Load the item data
    $("#" + modal + "-data-table tbody").on('click', 'tr', {
        modal_name: modal
    }, loadDataIntoModalForm);
};

var setModalStatus = function setModalStatus(modal, store) {
    const disabled = !store.validateSchema();
    const errors = store.checkForSchemaErrors();
    var errorMessage = "";

    if (errors.length > 0)
        errorMessage = "The following fields contain errors: " + errors.join(", ");

    $("#" + modal + "-modal-error").text(errorMessage);

    if (errorMessage)
        $("#" + modal + "-modal-error-zone").show();
    else
        $("#" + modal + "-modal-error-zone").hide();

    $("#" + modal + "-save-btn").prop('disabled', disabled);
}

var setPanelStatus = function setPanelStatus(panel, anchor, panelStatus) {
    $("#" + anchor).removeClass("req_fr req_arfc required-field-span");
    $("#" + anchor).next("span").hide();
    $("#" + anchor).next("span").next("span").hide();

    if (panelStatus.remainingRequired > 0)
        $("#" + anchor).addClass("req_fr required-field-span");
    else if (panelStatus.hasRequired) {
        $("#" + anchor).addClass("req_arfc");
        $("#" + anchor).next("span").show();
    }
    
    if (panelStatus.errors)
        $("#" + anchor).next("span").next("span").show();

    if (panel == "Contact Information") {
        const successNotice = panelStatus.hasRequired ? panelStatus.remainingRequired == 0 : panelStatus.completedOptional > 0;

        setRequired("contact-lbl", panelStatus.hasRequired, true);
        setSuccess("contact-lbl", (successNotice && !panelStatus.errors));
    }
};


/***********************************************************************/
/***********************************************************************/
/************************MOB X DECLARATIONS*****************************/
/***********************************************************************/
/***********************************************************************/
/*********************
 FORM (action)
 *********************/
mobx.autorun("Allow Save", function () {
    if (form.allowSave) {
        $("#input-save-btn").show();
    } else {
        $("#input-save-btn").hide();
    }
    $("#doi").prop("disabled", !form.allowSave && metadata.getValue("doi"));

    //mobx.whyRun();
});

mobx.autorun("Toggle Software Type", function () {
    if (metadata.getValue("software_type") == "B") {
        $("#organizations-step").show();
        $('#organizations-step').insertBefore('#doi-step');
    }

    //mobx.whyRun();
});

mobx.autorun("Overwrite", function () {
    // if submitting and announced project, pre-approval, show a warning.
    if (form.workflowStatus == "Announced" && page_val == 'submit') {
        $('#input-overwrite-msg-top').show();
        $('#input-overwrite-msg-bottom').show();
    } else {
        $('#input-overwrite-msg-top').hide();
        $('#input-overwrite-msg-bottom').hide();
    }

    //mobx.whyRun();
});


/*********************
 REPO PANEL (action)
 *********************/
mobx.autorun("Repository Info Panel", function () {
    setPanelStatus("Repository Information", "repository-panel-anchor", metadata.panelStatus.repository);

    //mobx.whyRun();
});

mobx.autorun("Project Type", function () {
    var project_type = metadata.getValue("project_type");
    var project_landing = metadata.getValue("project_type_landing");
    switch (project_type) {
        case "OS":
            $("#repository-link-div").show();
            $("#landing-page-div").hide();
            $("#landing-contact-div").hide();
            $("#autopop-div").show();
            $("#repository-link-display-div").show();
            $("#file-upload-zone").hide();
            break;
        case "ON":
            $("#repository-link-div").hide();
            $("#landing-page-div").show();
            $("#landing-contact-div").hide();
            $("#autopop-div").hide();
            $("#repository-link-display-div").hide();
            $("#file-upload-zone").show();
            break;
        default:
            $("#repository-link-div").hide();
            $("#landing-page-div").hide();
            $("#landing-contact-div").hide();
            if (project_landing === true) {
                $("#landing-page-div").show();
                $("#landing-contact-div").hide();
            }
            else if (project_landing === false) {
                $("#landing-page-div").hide();
                $("#landing-contact-div").show();
            }
            $("#autopop-div").hide();
            $("#repository-link-display-div").hide();
            $("#file-upload-zone").show();
            break;
    }

    if ($("#input-form-optional-toggle").is(":visible")) {
        $("#supplemental-step").hide();
    }

    if (project_type != 'OS') {
        metadata.setValue("file_name", form.last_filename);
    }

    //mobx.whyRun();
});

mobx.autorun("Project Group Success", function () {
    var is_opensource = metadata.getValue("project_type_opensource");
    var is_public = metadata.getValue("project_type_public");
    var is_landing = metadata.getValue("project_type_landing");

    var grp_success = (is_opensource === true && is_public != null) ||
        (is_opensource === false && is_landing != null);

    setSuccess("project-type-lbl", grp_success);

    //mobx.whyRun();
});

mobx.autorun("Project Button Update", function () {
    projectTypeButtonUpdate();
    setProjectType();

    //mobx.whyRun();
});

mobx.autorun("Project Type Open Source", function () {
    updateLabelStyle(metadata, "project_type_opensource", "is-opensource-lbl");

    //mobx.whyRun();
});

mobx.autorun("Project Type Public", function () {
    updateLabelStyle(metadata, "project_type_public", "is-public-lbl");

    //mobx.whyRun();
});

mobx.autorun("Project Type Landing", function () {
    updateLabelStyle(metadata, "project_type_landing", "is-landing-lbl");

    //mobx.whyRun();
});

mobx.autorun("Repository URL", function () {
    updateInputStyle(metadata, "repository_link", "repository-link-lbl", "repository-link");
    $("#autopopulate-from-repository").prop('disabled', !metadata.isCompleted("repository_link"));

    //mobx.whyRun();
});

mobx.autorun("Landing Page", function () {
    updateInputStyle(metadata, "landing_page", "landing-page-lbl", "landing-page");

    //mobx.whyRun();
});

mobx.autorun("Landing Contact", function () {
    updateInputStyle(metadata, "landing_contact", "landing-contact-lbl", "landing-contact");

    //mobx.whyRun();
});


/*********************
 PRODUCT PANEL (action)
 *********************/
mobx.autorun("Product Description Panel", function () {
    setPanelStatus("Product Description", "product-description-panel-anchor", metadata.panelStatus.product);

    //mobx.whyRun();
});

mobx.autorun("Repository URL Display", function () {
    updateTextStyle(metadata, "repository_link", "repository-link-display-lbl", "repository-link-display");

    //mobx.whyRun();
});

mobx.autorun("Software Title", function () {
    updateInputStyle(metadata, "software_title", "software-title-lbl", "software-title");

    //mobx.whyRun();
});

mobx.autorun("Description", function () {
    updateInputStyle(metadata, "description", "description-lbl", "description");

    //mobx.whyRun();
});

mobx.autorun("Programming Language(s)", function () {
    updateSelectStyle(metadata, "programming_languages", "programming-languages-lbl", "programming-languages");

    //mobx.whyRun();
});
mobx.autorun("Version Number", function () {
    updateInputStyle(metadata, "version_number", "version-number-lbl", "version-number");

    //mobx.whyRun();
});
mobx.autorun("Documentation URL", function () {
    updateInputStyle(metadata, "documentation_url", "documentation-url-lbl", "documentation-url");

    //mobx.whyRun();
});

mobx.autorun("License Button Update", function () {
    licenseButtonUpdate();

    //mobx.whyRun();
});

mobx.autorun("License CS Available", function () {
    updateLabelStyle(metadata, "license_closedsource_available", "has-license-lbl");

    //mobx.whyRun();
});

mobx.autorun("License CS Contact Info", function () {
    updateLabelStyle(metadata, "license_closedsource_contactinfo", "has-contactinfo-lbl");

    //mobx.whyRun();
});

mobx.autorun("Licenses", function () {
    updateSelectStyle(metadata, "licenses", "licenses-lbl", "licenses");

    if (metadata.getValue("licenses").indexOf('Other') > -1) {
        $("#proprietary-url-zone").show();
    } else {
        $("#proprietary-url-zone").hide();
    }

    //mobx.whyRun();
});

mobx.autorun("Access Limitation(s)", function () {
    updateSelectStyle(metadata, "access_limitations", "access-limitations-lbl", "access-limitations");

    var accessLims = metadata.getValue("access_limitations");
    if (accessLims.includes("SBIR") || accessLims.includes("STTR")) {
        $("#small-business-zone").show();
    }
    else {
        $("#small-business-zone").hide();
    }
    if (accessLims.includes("OUO")) {
        $("#official-use-only-zone").show();
    }
    else {
        $("#official-use-only-zone").hide();
    }
    if (accessLims.includes("PROT")) {
        $("#official-use-only-prot-zone").show();
    }
    else {
        $("#official-use-only-prot-zone").hide();
    }
    if (accessLims.includes("PDOUO")) {
        $("#official-use-only-pdouo-zone").show();
    }
    else {
        $("#official-use-only-pdouo-zone").hide();
    }
    var hasDoi = metadata.isCompleted("doi");
    if (!hasDoi && !form.is_limited) {
        $("#unl-notice").show();
    }
    else {
        $("#unl-notice").hide();
    }

    //mobx.whyRun();
});

mobx.autorun("Phase", function () {
    updateSelectStyle(metadata, "phase", "phase-lbl", "phase");

    //mobx.whyRun();
});

mobx.autorun("Previous Contract Number", function () {
    updateInputStyle(metadata, "previous_contract_number", "previous-contract-number-lbl", "previous-contract-number");

    //mobx.whyRun();
});

mobx.autorun("Contract Start Date", function () {
    updateInputStyle(metadata, "contract_start_date", "contract-start-date-lbl", "contract-start-date");

    //mobx.whyRun();
});

mobx.autorun("Small Business Release Date", function () {
    updateInputStyle(metadata, "sb_release_date", "sb-release-date-lbl", "sb-release-date");

    //mobx.whyRun();
});

mobx.autorun("Business Official Name", function () {
    updateInputStyle(metadata, "bo_name", "bo-name-lbl", "bo-name");

    //mobx.whyRun();
});

mobx.autorun("Business Official Email", function () {
    updateInputStyle(metadata, "bo_email", "bo-email-lbl", "bo-email");

    //mobx.whyRun();
});

mobx.autorun("Business Official Phone", function () {
    updateInputStyle(metadata, "bo_phone", "bo-phone-lbl", "bo-phone");

    //mobx.whyRun();
});

mobx.autorun("Business Official Organization", function () {
    updateInputStyle(metadata, "bo_org", "bo-org-lbl", "bo-org");

    //mobx.whyRun();
});

mobx.autorun("Principal Investigator Name", function () {
    updateInputStyle(metadata, "pi_name", "pi-name-lbl", "pi-name");

    //mobx.whyRun();
});

mobx.autorun("Principal Investigator Email", function () {
    updateInputStyle(metadata, "pi_email", "pi-email-lbl", "pi-email");

    //mobx.whyRun();
});

mobx.autorun("Principal Investigator Phone", function () {
    updateInputStyle(metadata, "pi_phone", "pi-phone-lbl", "pi-phone");

    //mobx.whyRun();
});

mobx.autorun("Principal Investigator Organization", function () {
    updateInputStyle(metadata, "pi_org", "pi-org-lbl", "pi-org");

    //mobx.whyRun();
});

mobx.autorun("Exemption Number", function () {
    updateInputStyle(metadata, "exemption_number", "exemption-number-lbl", "exemption-number");

    //mobx.whyRun();
});

mobx.autorun("OUO Release Date", function () {
    updateInputStyle(metadata, "ouo_release_date", "ouo-release-date-lbl", "ouo-release-date");

    //mobx.whyRun();
});

mobx.autorun("Protection", function () {
    updateSelectStyle(metadata, "protection", "protection-lbl", "protection");

    //mobx.whyRun();
});

mobx.autorun("Protection Other", function () {
    updateInputStyle(metadata, "protection_other", "protection-other-lbl", "protection-other");

    var protection = metadata.getValue("protection");
    if (protection != null && protection.includes("Other")) {
        $("#official-use-only-prot-other-zone").show();
    }
    else {
        $("#official-use-only-prot-other-zone").hide();
    }

    //mobx.whyRun();
});

mobx.autorun("DOE Headquarters Program Office", function () {
    updateInputStyle(metadata, "program_office", "program-office-lbl", "program-office");

    //mobx.whyRun();
});

mobx.autorun("Protection Reason", function () {
    updateInputStyle(metadata, "protection_reason", "protection-reason-lbl", "protection-reason");

    //mobx.whyRun();
});

mobx.autorun("Proprietary URL", function () {
    updateInputStyle(metadata, "proprietary_url", "proprietary-url-lbl", "proprietary-url");

    //mobx.whyRun();
});

mobx.autorun("License Contact Email", function () {
    updateInputStyle(metadata, "license_contact_email", "license-contact-email-lbl", "license-contact-email");

    //mobx.whyRun();
});


/*********************
 DEVELOPERS PANEL (action)
 *********************/
mobx.autorun("Developers Panel", function () {
    setPanelStatus("Developers", "developers-panel-anchor", metadata.panelStatus.developers);

    //mobx.whyRun();
});

mobx.autorun("Developers", function () {
    updateActiveDataPage(developers_table, metadata.getValue("developers").toJS());
    updateLabelStyle(metadata, "developers", "developers-lbl", true);
    setSuccess("developers-lbl", metadata.isCompleted("developers"), metadata.getError("developers"));

    //mobx.whyRun();
});


/*********************
 DEVELOPERS MODAL (action)
 *********************/
mobx.autorun("Developer First Name", function () {
    updateInputStyle(developer, "first_name", "developer-edit-first-name-lbl", "developer-edit-first-name");

    //mobx.whyRun();
});

mobx.autorun("Developer Middle Name", function () {
    updateInputStyle(developer, "middle_name", "developer-edit-middle-name-lbl", "developer-edit-middle-name");

    //mobx.whyRun();
});

mobx.autorun("Developer Last Name", function () {
    updateInputStyle(developer, "last_name", "developer-edit-last-name-lbl", "developer-edit-last-name");

    //mobx.whyRun();
});

mobx.autorun("Developer Email", function () {
    updateInputStyle(developer, "email", "developer-edit-email-lbl", "developer-edit-email");

    //mobx.whyRun();
});

mobx.autorun("Developer ORCID", function () {
    updateInputStyle(developer, "orcid", "developer-edit-orcid-lbl", "developer-edit-orcid");

    //mobx.whyRun();
});

mobx.autorun("Developer Affiliations", function () {
    updateSelectStyle(developer, "affiliations", "developer-edit-affiliations-lbl", "developer-edit-affiliations");

    //mobx.whyRun();
});

mobx.autorun("Developer Modal", function () {
    setModalStatus("developers", developer);

    //mobx.whyRun();
});


/*********************
 DOI PANEL (action)
 *********************/
mobx.autorun("DOI/Release Date Panel", function () {
    setPanelStatus("DOI and Release Date", "doi-release-date-panel-anchor", metadata.panelStatus.doi);

    //mobx.whyRun();
});

mobx.autorun("DOI", function () {
    updateInputStyle(metadata, "doi", "doi-lbl", "doi");

    //mobx.whyRun();
});

mobx.autorun("DOI Infix", function () {
    updateInputStyle(metadata, "doi_infix", "doi-infix-lbl", "doi-infix");

    //mobx.whyRun();
});

mobx.autorun("DOI Registration Check", function () {
    //flag indicating whether DOI has already been registered for this record (not currently being set, but should we?)
    const registered = metadata.getValue("doi_status") === "REG";

    //flag indicating if doi is already reserved in this session
    const reserving = metadata.getValue("doi_status") === "RES" || registered;

    if (reserving) {
        $("#doi-notice").show();
        $("#reserve-text").text("Clear Reserved DOI");
        $("#reserve-icon").removeClass("fa-pencil");
        $("#reserve-icon").addClass("fa-eraser");
        $("#doi-infix-zone").show();
    } else {
        $("#doi-notice").hide();
        $("#reserve-text").text("Reserve DOI");
        $("#reserve-icon").addClass("fa-pencil");
        $("#reserve-icon").removeClass("fa-eraser");
        $("#doi-infix-zone").hide();
    }

    $("#doi").prop("disabled", reserving);

    if (registered) {
        $("#doi-notice").hide();
        $("#doi-reservation-zone").hide();
        $("#doi-infix-zone").hide();
    }

    //mobx.whyRun();
});

mobx.autorun("Release Date", function () {
    updateInputStyle(metadata, "release_date", "release-date-lbl", "release-date");

    //mobx.whyRun();
});


/*********************
 SUPPLEMENTAL PANEL (action)
 *********************/
mobx.autorun("Supplemental Product Information Panel", function () {
    setPanelStatus("Supplemental Product Information", "supplemental-product-info-panel-anchor", metadata.panelStatus.supplemental);

    //mobx.whyRun();
});

mobx.autorun("Short Title or Acronym", function () {
    updateInputStyle(metadata, "acronym", "short-title-lbl", "short-title");

    //mobx.whyRun();
});

mobx.autorun("Country of Origin", function () {
    updateSelectStyle(metadata, "country_of_origin", "country-of-origin-lbl", "country-of-origin");

    //mobx.whyRun();
});

mobx.autorun("Keywords", function () {
    updateInputStyle(metadata, "keywords", "keywords-lbl", "keywords");

    //mobx.whyRun();
});

mobx.autorun("Project Keywords", function () {
    updateSelectStyle(metadata, "project_keywords", "project-keywords-lbl", "project-keywords");

    //mobx.whyRun();
});

mobx.autorun("Other Special Requirements", function () {
    updateInputStyle(metadata, "other_special_requirements", "other-special-requirements-lbl", "other-special-requirements");

    //mobx.whyRun();
});

mobx.autorun("Accession Number", function () {
    updateInputStyle(metadata, "site_accession_number", "site-accession-number-lbl", "site-accession-number");

    //mobx.whyRun();
});

mobx.autorun("Is Migration", function () {
    $("#project-is-migration").prop('checked', metadata.getValue("is_migration"));

    //mobx.whyRun();
});

mobx.autorun("File Upload", function () {
    updateDropzoneStyle(metadata, "file_name", "uploaded-file-name-lbl", "uploaded-file-name");

    if (metadata.getValue("file_name"))
        $("#cert-zone").show();
    else
        $("#cert-zone").hide();
    
    //mobx.whyRun();
});

mobx.autorun("Is Certified", function () {
    $("#file-is-certified").prop('checked', metadata.getValue("is_file_certified"));

    //mobx.whyRun();
});

mobx.autorun("Container Upload", function () {
    updateDropzoneStyle(metadata, "container_name", "uploaded-container-name-lbl", "uploaded-container-name");

    //mobx.whyRun();
});


/*********************
 ORGANIZATIONS PANEL (action)
 *********************/
mobx.autorun("Organizations Panel", function () {
    setPanelStatus("Organizations", "organizations-panel-anchor", metadata.panelStatus.organizations);

    //mobx.whyRun();
});

mobx.autorun("Sponsoring Orgs", function () {
    updateActiveDataPage(sponsoring_orgs_table, metadata.getValue("sponsoring_organizations").toJS());
    updateLabelStyle(metadata, "sponsoring_organizations", "sponsoring-orgs-lbl", true);

    //mobx.whyRun();
});

mobx.autorun("Research Orgs", function () {
    updateActiveDataPage(research_orgs_table, metadata.getValue("research_organizations").toJS());
    updateLabelStyle(metadata, "research_organizations", "research-orgs-lbl", true);

    //mobx.whyRun();
});


/*********************
 SPONSOR ORGS MODAL (action)
 *********************/
mobx.autorun("SponsoringOrg DOE", function () {
    $("#sponsoring-orgs-edit-DOE").prop('checked', sponsor_org.getValue("DOE"));

    //mobx.whyRun();
});

mobx.autorun("SponsoringOrg Name", function () {
    updateSelectStyle(sponsor_org, "organization_name", "sponsoring-orgs-edit-organization_name-lbl", "sponsoring-orgs-edit-organization_name");

    //mobx.whyRun();
});

mobx.autorun("SponsoringOrg Primary Award", function () {
    updateInputStyle(sponsor_org, "primary_award", "sponsoring-orgs-edit-primary_award-lbl", "sponsoring-orgs-edit-primary_award");

    //mobx.whyRun();
});

mobx.autorun("SponsoringOrg Additional Awards", function () {
    updateSelectStyle(sponsor_org, "award_numbers", "sponsoring-orgs-edit-award_numbers-lbl", "sponsoring-orgs-edit-award_numbers");

    //mobx.whyRun();
});

mobx.autorun("SponsoringOrg B&R", function () {
    updateSelectStyle(sponsor_org, "br_codes", "sponsoring-orgs-edit-br_codes-lbl", "sponsoring-orgs-edit-br_codes");

    //mobx.whyRun();
});

mobx.autorun("SponsoringOrg FWP", function () {
    updateSelectStyle(sponsor_org, "fwp_numbers", "sponsoring-orgs-edit-fwp_numbers-lbl", "sponsoring-orgs-edit-fwp_numbers");

    //mobx.whyRun();
});

mobx.autorun("SponsoringOrg Modal", function () {
    setModalStatus("sponsoring-orgs", sponsor_org);

    //mobx.whyRun();
});


/*********************
 RESEARCH ORGS MODAL (action)
 *********************/
mobx.autorun("ResearchOrg DOE", function () {
    $("#research-orgs-edit-DOE").prop('checked', research_org.getValue("DOE"));

    //mobx.whyRun();
});

mobx.autorun("ResearchOrg Name", function () {
    updateSelectStyle(research_org, "organization_name", "research-orgs-edit-organization_name-lbl", "research-orgs-edit-organization_name");

    //mobx.whyRun();
});

mobx.autorun("ResearchOrg Modal", function () {
    setModalStatus("research-orgs", research_org);

    //mobx.whyRun();
});


/*********************
 CONTRIBUTORS PANEL (action)
 *********************/
mobx.autorun("Contributors and Contributing Organizations Panel", function () {
    setPanelStatus("Contributors and Contributing Organizations", "contributors-contributing-orgs-panel-anchor", metadata.panelStatus.contribs);

    //mobx.whyRun();
});

mobx.autorun("Contributors", function () {
    updateActiveDataPage(contributors_table, metadata.getValue("contributors").toJS());
    updateLabelStyle(metadata, "contributors", "contributors-lbl", true);

    //mobx.whyRun();
});

mobx.autorun("Contributor Orgs", function () {
    updateActiveDataPage(contributor_orgs_table, metadata.getValue("contributing_organizations").toJS());
    updateLabelStyle(metadata, "contributing_organizations", "contributor-orgs-lbl", true);

    //mobx.whyRun();
});


/*********************
 CONTRIBUTOR MODAL (action)
 *********************/
mobx.autorun("Contributor First Name", function () {
    updateInputStyle(contributor, "first_name", "contributor-edit-first_name-lbl", "contributor-edit-first_name");

    //mobx.whyRun();
});

mobx.autorun("Contributor Middle Name", function () {
    updateInputStyle(contributor, "middle_name", "contributor-edit-middle_name-lbl", "contributor-edit-middle_name");

    //mobx.whyRun();
});

mobx.autorun("Contributor Last Name", function () {
    updateInputStyle(contributor, "last_name", "contributor-edit-last_name-lbl", "contributor-edit-last_name");

    //mobx.whyRun();
});

mobx.autorun("Contributor Email", function () {
    updateInputStyle(contributor, "email", "contributor-edit-email-lbl", "contributor-edit-email");

    //mobx.whyRun();
});

mobx.autorun("Contributor ORCID", function () {
    updateInputStyle(contributor, "orcid", "contributor-edit-orcid-lbl", "contributor-edit-orcid");

    //mobx.whyRun();
});

mobx.autorun("Contributor Affiliations", function () {
    updateSelectStyle(contributor, "affiliations", "contributor-edit-affiliations-lbl", "contributor-edit-affiliations");

    //mobx.whyRun();
});

mobx.autorun("Contributor ContribType", function () {
    updateSelectStyle(contributor, "contributor_type", "contributor-edit-contribtype-lbl", "contributor-edit-contribtype");

    //mobx.whyRun();
});

mobx.autorun("Contributor Modal", function () {
    setModalStatus("contributors", contributor);

    //mobx.whyRun();
});


/*********************
 CONTRIBUTOR ORGS MODAL (action)
 *********************/
mobx.autorun("ContributingOrg DOE", function () {
    $("#contributing-organization-edit-DOE").prop('checked', contributing_org.getValue("DOE"));

    //mobx.whyRun();
});

mobx.autorun("ContributingOrg Name", function () {
    updateInputStyle(contributing_org, "organization_name", "contributing-organization-edit-organization_name-lbl", "contributing-organization-edit-organization_name");

    //mobx.whyRun();
});

mobx.autorun("ContributingOrg ContribType", function () {
    updateSelectStyle(contributing_org, "contributor_type", "contributing-organization-edit-contribtype-lbl", "contributing-organization-edit-contribtype");

    //mobx.whyRun();
});

mobx.autorun("ContributingOrg Modal", function () {
    setModalStatus("contributor-orgs", contributing_org);

    //mobx.whyRun();
});


/*********************
 IDENTIFIERS PANEL (action)
 *********************/
mobx.autorun("Identifiers Panel", function () {
    setPanelStatus("Identifiers", "identifiers-panel-anchor", metadata.panelStatus.identifiers);

    //mobx.whyRun();
});

mobx.autorun("Related Identifiers", function () {
    if (related_identifiers_table) {
        related_identifiers_table.clear();

        var data = metadata.getValue("related_identifiers").toJS();
        related_identifiers_table.rows.add(data).draw();
    }

    updateLabelStyle(metadata, "related_identifiers", "related-identifiers-lbl", true);

    //mobx.whyRun();
});


/*********************
 IDENTIFIERS MODAL (action)
 *********************/
mobx.autorun("Related Identifier Type", function () {
    updateSelectStyle(related_identifier, "identifier_type", "related-identifier-identifier-type-lbl", "related-identifier-identifier-type");

    //mobx.whyRun();
});

mobx.autorun("Related Identifier Relation", function () {
    updateSelectStyle(related_identifier, "relation_type", "related-identifier-relation-type-lbl", "related-identifier-relation-type");

    //mobx.whyRun();
});

mobx.autorun("Related Identifier", function () {
    updateInputStyle(related_identifier, "identifier_value", "related-identifier-identifier-value-lbl", "related-identifier-identifier-value");

    //mobx.whyRun();
});

mobx.autorun("Related Identifier Modal", function () {
    setModalStatus("related-identifiers", related_identifier);

    //mobx.whyRun();
});


/*********************
 AWARD DOIS PANEL (action)
 *********************/
mobx.autorun("Award DOIs Panel", function () {
    setPanelStatus("Award DOIs", "awards-panel-anchor", metadata.panelStatus.awards);

    //mobx.whyRun();
});

mobx.autorun("Award DOIs", function () {
    if (award_dois_table) {
        award_dois_table.clear();

        var data = metadata.getValue("award_dois").toJS();
        award_dois_table.rows.add(data).draw();
    }

    updateLabelStyle(metadata, "award_dois", "award-dois-lbl", true);

    //mobx.whyRun();
});

mobx.autorun("Change Log", function () {
    if (change_log_table) {
        change_log_table.clear();

        var data = metadata.getValue("change_log").toJS();
        change_log_table.rows.add(data).draw();
    }

    updateLabelStyle(metadata, "change_log", "change-log-lbl", true);

    //mobx.whyRun();
});


/*********************
 AWARD DOIS MODAL (action)
 *********************/
mobx.autorun("Award DOI", function () {
    updateInputStyle(award_doi, "award_doi", "award-doi-value-lbl", "award-doi-value");

    //mobx.whyRun();
});

mobx.autorun("Award DOI Funder Name", function () {
    updateInputStyle(award_doi, "funder_name", "award-doi-funder-name-lbl", "award-doi-funder-name");

    //mobx.whyRun();
});

mobx.autorun("Award DOI Modal", function () {
    setModalStatus("award-dois", award_doi);

    //mobx.whyRun();
});


/*********************
 CONTACT PANEL (action)
 *********************/
mobx.autorun("Contact Panel", function () {
    setPanelStatus("Contact Information", "contact-info-panel-anchor", metadata.panelStatus.contact);

    //mobx.whyRun();
});

mobx.autorun("Contact Name", function () {
    updateInputStyle(metadata, "recipient_name", "contact-info-name-lbl", "contact-info-name");

    //mobx.whyRun();
});

mobx.autorun("Contact Email", function () {
    updateInputStyle(metadata, "recipient_email", "contact-info-email-lbl", "contact-info-email");

    //mobx.whyRun();
});

mobx.autorun("Contact Phone", function () {
    updateInputStyle(metadata, "recipient_phone", "contact-info-phone-lbl", "contact-info-phone");

    //mobx.whyRun();
});

mobx.autorun("Contact Organization", function () {
    updateInputStyle(metadata, "recipient_org", "contact-info-organization-lbl", "contact-info-organization");

    //mobx.whyRun();
});


/*********************
 FORM (action)
 *********************/
mobx.autorun("Submit Button", function () {
    $('#input-submit-btn').prop('disabled', !metadata.validateSchema());

    //mobx.whyRun();
});

mobx.autorun("Announce Button", function () {
    $('#input-announce-btn').prop('disabled', !metadata.validateSchema());

    //mobx.whyRun();
});

mobx.autorun("Edit Comment", function () {
    updateInputStyle(metadata, "comment", "record-comment-lbl", "record-comment", true);

    //mobx.whyRun();
});




/***********************************************************************/
/***********************************************************************/
/************************MODAL DECLARATIONS*****************************/
/***********************************************************************/
/***********************************************************************/

var showModal = function (event) {
    var is_new = $("#current_datatable_id").val() == -1;
    var modal = event.data.modal_name;
    var modal_id = event.data.modal_name + "-edit-modal";

    var manage_text = " ";
    if (modal == "developers")
        manage_text += "Developer";
    else if (modal == "sponsoring-orgs")
        manage_text += "Sponsoring Organization";
    else if (modal == "research-orgs")
        manage_text += "Research Organization";
    else if (modal == "contributors")
        manage_text += "Contributor";
    else if (modal == "contributor-orgs")
        manage_text += "Contributing Organization";
    else if (modal == "related-identifiers")
        manage_text += "Related Identifier";
    else if (modal == "award-dois")
        manage_text += "Award DOIs";

    if (is_new) {
        $("#" + modal + "-manage-lbl").text("Enter" + manage_text);
        $("#" + modal_id + " span[name='delete-btn']").hide();
    } else {
        $("#" + modal + "-manage-lbl").text("Edit" + manage_text);
        $("#" + modal_id + " span[name='delete-btn']").show();
    }

    $("#" + modal_id).modal('show');
};

var hideModal = function (event) {
    var modal_id = event.data.modal_name + "-edit-modal";
    $("#" + modal_id).modal('hide');
    $("#current_datatable_id").val(-1);
};


var saveModalData = function (event) {
    var modal = event.data.modal_name;
    var modal_data = null;

    var target_table = null;
    if (modal == "developers") {
        target_table = developers_table;
        modal_data = {
            first_name: $("#developer-edit-first-name").val().trim(),
            last_name: $("#developer-edit-last-name").val().trim(),
            middle_name: $("#developer-edit-middle-name").val().trim(),
            email: $("#developer-edit-email").val().trim(),
            orcid: $("#developer-edit-orcid").val().trim(),
            affiliations: $("#developer-edit-affiliations").val()
        };
    } else if (modal == "sponsoring-orgs") {
        target_table = sponsoring_orgs_table;
        modal_data = {
            DOE: $("#sponsoring-orgs-edit-DOE").is(':checked'),
            organization_name: $("#sponsoring-orgs-edit-organization_name").val(),
            primary_award: $("#sponsoring-orgs-edit-primary_award").val(),
            award_numbers: $("#sponsoring-orgs-edit-award_numbers").val(),
            br_codes: $("#sponsoring-orgs-edit-br_codes").val(),
            fwp_numbers: $("#sponsoring-orgs-edit-fwp_numbers").val()
        };
    } else if (modal == "research-orgs") {
        target_table = research_orgs_table;
        modal_data = {
            DOE: $("#research-orgs-edit-DOE").is(':checked'),
            organization_name: $("#research-orgs-edit-organization_name").val()
        };
    } else if (modal == "contributors") {
        target_table = contributors_table;
        modal_data = {
            first_name: $("#contributor-edit-first_name").val(),
            middle_name: $("#contributor-edit-middle_name").val(),
            last_name: $("#contributor-edit-last_name").val(),
            email: $("#contributor-edit-email").val(),
            orcid: $("#contributor-edit-orcid").val(),
            affiliations: $("#contributor-edit-affiliations").val(),
            contributor_type: $("#contributor-edit-contribtype").val()
        };
    } else if (modal == "contributor-orgs") {
        target_table = contributor_orgs_table;
        modal_data = {
            DOE: $("#contributing-organization-edit-DOE").is(':checked'),
            organization_name: $("#contributing-organization-edit-organization_name").val(),
            contributor_type: $("#contributing-organization-edit-contribtype").val()
        };
    } else if (modal == "related-identifiers") {
        target_table = related_identifiers_table;
        modal_data = {
            identifier_type: $("#related-identifier-identifier-type").val(),
            relation_type: $("#related-identifier-relation-type").val(),
            identifier_value: $("#related-identifier-identifier-value").val()
        };
    } else if (modal == "award-dois") {
        target_table = award_dois_table;
        modal_data = {
            award_doi: $("#award-doi-value").val(),
            funder_name: $("#award-doi-funder-name").val()
        };
    } else
        throw 'Unknown modal table value!';

    var edit_idx = $("#current_datatable_id").val() - 1;

    // insert original ID back into modal, if editing
    if (edit_idx > -1)
        modal_data.id = edit_idx + 1;

    //Now, hide the modal
    hideModal({
        data: {
            modal_name: modal
        }
    });

    updateModalSourceData(modal, modal_data);
};

var loadDataIntoModalForm = mobx.action("Load Modal Data", function (event) {
    var modal = event.data.modal_name;

    var row_data = null;
    var target_table = null;
    if (modal == "developers") {
        target_table = developers_table;
        row_data = target_table.row(this).data();
        if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
        }

        developer.loadValues(row_data);
    } else if (modal == "sponsoring-orgs") {
        target_table = sponsoring_orgs_table;
        row_data = target_table.row(this).data();
        if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
        }

        sponsor_org.loadValues(row_data);
    } else if (modal == "research-orgs") {
        target_table = research_orgs_table;
        row_data = target_table.row(this).data();
        if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
        }

        research_org.loadValues(row_data);
    } else if (modal == "contributors") {
        target_table = contributors_table;
        row_data = target_table.row(this).data();
        if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
        }

        contributor.loadValues(row_data);
    } else if (modal == "contributor-orgs") {
        target_table = contributor_orgs_table;
        row_data = target_table.row(this).data();
        if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
        }

        contributing_org.loadValues(row_data);
    } else if (modal == "related-identifiers") {
        target_table = related_identifiers_table;
        row_data = target_table.row(this).data();
        if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
        }

        related_identifier.loadValues(row_data);
    } else if (modal == "award-dois") {
        target_table = award_dois_table;
        row_data = target_table.row(this).data();
        if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
        }

        award_doi.loadValues(row_data);
    } else
        throw 'Unknown modal table value!';

    $("#current_datatable_id").val(row_data.id);
    showModal({
        data: {
            modal_name: modal
        }
    });
});

var deleteModalData = mobx.action("Delete Modal Data", function (event) {
    var modal = event.data.modal_name;
    var edit_idx = $("#current_datatable_id").val() - 1;

    if (edit_idx == -1)
        return;

    var target_table = null;
    if (modal == "developers")
        target_table = developers_table;
    else if (modal == "sponsoring-orgs")
        target_table = sponsoring_orgs_table;
    else if (modal == "research-orgs")
        target_table = research_orgs_table;
    else if (modal == "contributors")
        target_table = contributors_table;
    else if (modal == "contributor-orgs")
        target_table = contributor_orgs_table;
    else if (modal == "related-identifiers")
        target_table = related_identifiers_table;
    else if (modal == "award-dois")
        target_table = award_dois_table;
    else
        throw 'Unknown modal table value!';

    hideModal({
        data: {
            modal_name: modal
        }
    });
    removeModalSourceData(modal, edit_idx);
});

var updateModalSourceData = mobx.action("Update Modal Source", function (modal, row_data) {
    if (!modal)
        return;

    metadata.saveToArray(modalToMetadataProperty(modal), row_data);
});

var removeModalSourceData = mobx.action("Remove Modal Source", function (modal, row_data) {
    if (!modal)
        return;

    metadata.removeFromArray(modalToMetadataProperty(modal), row_data);
});

var clearModal = mobx.action("Clear Modal", function (event) {
    var modal = event.data.modal_name;

    if (modal == "developers") {
        developer.clear();
        clearChosenList("developer-edit-affiliations");
    } else if (modal == "sponsoring-orgs") {
        sponsor_org.clear();
        clearChosenList("sponsoring-orgs-edit-award_numbers");
        clearChosenList("sponsoring-orgs-edit-br_codes");
        clearChosenList("sponsoring-orgs-edit-fwp_numbers");
    } else if (modal == "research-orgs") {
        research_org.clear();
        clearChosenList("research-orgs-edit-organization_name");
    } else if (modal == "contributors") {
        contributor.clear();
        clearChosenList("contributor-edit-affiliations");
    } else if (modal == "contributor-orgs") {
        contributing_org.clear();
    } else if (modal == "related-identifiers") {
        related_identifier.clear();
    } else if (modal == "award-dois") {
        award_doi.clear();
    } else
        throw 'Unknown modal table value!';
});

var modalToMetadataProperty = function (modal) {
    var matadata_property = modal;

    if (modal == "sponsoring-orgs") {
        matadata_property = "sponsoring_organizations";
    } else if (modal == "research-orgs") {
        matadata_property = "research_organizations";
    } else if (modal == "contributor-orgs") {
        matadata_property = "contributing_organizations";
    } else if (modal == "related-identifiers") {
        matadata_property = "related_identifiers";
    } else if (modal == "award-dois") {
        matadata_property = "award_dois";
    }

    return matadata_property;
};





/**DOI and Release Date**/
var parseReservationResponse = mobx.action("Reservation Response", function (data) {
    metadata.setValue("doi", data.doi);
    metadata.setValue("doi_status", "RES");

    hideCommonModalMessage();
});

var reserveDOI = mobx.action("Reserve DOI", function () {
    var code_id = $("#code_id").val();
    var msg = code_id ? "Project " + code_id : "New Project";

    setCommonModalMessage({
        title: 'Reserve DOI',
        show_loader: true,
        message_type: MESSAGE_TYPE_REGULAR,
        content: "<br/>Reserving DOI for " + msg + ".",
        contentClasses: ['center-text'],
        showClose: false
    });
    showCommonModalMessage();
    doAuthenticatedAjax('GET', API_BASE + 'metadata/reservedoi', parseReservationResponse, null, parseErrorResponse);
});

var handleReserve = mobx.action("Handle DOI Reservation", function () {
    //get if currently reserved then toggle
    const reserved = metadata.getValue("doi_status") === "RES";

    if (reserved) {
        //they are unreserving the DOI, so set doi, infix, and status to empty and add the validations back
        metadata.setValue("doi", "");
        metadata.setValue("doi_infix", "");
        metadata.setValue("doi_status", "");
    } else {
        //reserve a new DOI in correct format, disabling validations first to let our own DOI pass through
        reserveDOI();
    }
});

var handleInfix = mobx.action("Handle DOI Infix", function (event) {
    //get if currently reserved then toggle
    let infix = event.target.value;

    metadata.setValue("doi_infix", infix);

    const doi = metadata.getValue("doi");
    const prefix = doi.substr(0, doi.indexOf('/') + 1);
    const id = doi.substr(doi.lastIndexOf('/') + 1, doi.length - 1);

    if (infix)
        infix += "/";

    metadata.setValue("doi", prefix + infix + id);
});

var handleReorderingDevs = function (e, diff, edit) {
    handleReordering(e, diff, edit, developers_table, "developers");
};

var handleReorderingContribs = function (e, diff, edit) {
    handleReordering(e, diff, edit, contributors_table, "contributors");
};

var handleReordering = mobx.action("Reorder Rows", function (e, diff, edit, table, metadata_name) {
    var data = metadata.getValue(metadata_name);

    var reorderSourceId = edit.triggerRow.data().id;

    var changeArray = [];
    var offset = table.page.info().length * table.page.info().page;

    // row was moved
    if (diff.length > 0) {
        for (var i = 0; i < diff.length; i++) {
            var rowData = table.row(diff[i].node).data();

            var movingIdx = rowData.id - 1;
            var newIndex = diff[i].newPosition + offset;

            changeArray[newIndex] = mobx.toJS(data[movingIdx]);
            changeArray[newIndex].id = newIndex + 1;
        }
    }
    // do we need to move across pages
    else {
        var totalRecs = table.page.info().recordsTotal;
        var firstOnPage = table.page.info().start + 1; // start is 0 based
        var lastOnPage = table.page.info().end; // start is 1 based?
        // if not first/last item (unless last and only item on page 2+), but is first/last on page, then move across pages
        if ((reorderSourceId != 1 && (reorderSourceId != totalRecs || (reorderSourceId == totalRecs && reorderSourceId == firstOnPage && totalRecs > 1))) && (reorderSourceId == firstOnPage || reorderSourceId == lastOnPage)) {
            var movingIdx = reorderSourceId - 1;
            var newIndex = movingIdx;

            // if first, move back
            if (reorderSourceId == firstOnPage)
                newIndex -= 1;
            else
                newIndex += 1;

            changeArray[newIndex] = mobx.toJS(data[movingIdx]);
            changeArray[newIndex].id = newIndex + 1;

            changeArray[movingIdx] = mobx.toJS(data[newIndex]);
            changeArray[movingIdx].id = movingIdx + 1;
        }

    }

    // apply changes to data
    for (var key in changeArray) {
        data[key] = changeArray[key];
    }
});


// restrict Limitations based on expected input
var restrictLimitations = mobx.action("Restrict Limitations", function () {
    $('#input-opensource-btn').prop('disabled', form.is_limited);
    
    if (form.is_limited) {
        $('#access-limitations option[value="UNL"]').remove();

        metadata.setValue("project_type_opensource", false);
    }
    else {
        $("#access-limitations").find('option').each(function(index) {
            element = $(this);

            var label = element.text();
            var value = element.val();
            var codeMatch = label.match(/^.*?([A-Z]+)(;)?/);
            if (!codeMatch)
                return;

            var code = codeMatch[1];

            if (code == 'OUO')
                element.remove();
        });
    }
    $("#access-limitations").trigger('chosen:updated');
});


//Keeps the dropzone thing from auto-searching for anything with the dropzone class
Dropzone.autoDiscover = false;

//Regex to see if the file is allowed
const FILE_EXTENSION_REGEX = new RegExp(/[.](?:zip|tgz|tar(?:[.](?:gz|bz2))?)$/);
var removeFileUploadInfo = mobx.action("Remove File Drop", function () {
    metadata.setValue("is_file_certified", null);
    metadata.setValue("file_name", "");
    metadata.setValue("files", []);
    form.last_filename = "";

    // if dropzone has a file associated, remove it via click event
    var existingFile = $("#file-upload-dropzone .dz-remove")[0];

    if (existingFile)
        existingFile.click();
});
//Configuration for the file upload dropzone
var FILE_UPLOAD_CONFIG = {
    url: 'someurl',
    autoProcessQueue: false,
    acceptedFiles: '.zip,.tar,.tgz,.tar.gz,.tar.bz2',
    addRemoveLinks: true,
    maxFiles: 1,
    init: function () {
        var self = this;

        /*Runs when you try to add more files than allowed*/
        self.on("maxfilesexceeded", function (file) {
            this.removeAllFiles();
            this.addFile(file);
        });

        /*Runs when you add a file that isn't allowed*/
        this.on("error", function (file, message, xhr) {
            if (xhr == null) {
                this.removeFile(file);
            }
        });

        /*Runs when you add any kind of file*/
        self.on("addedfile", mobx.action("Add File Drop", function (file) {
            //Make sure that this file is allowed
            var file_extension = FILE_EXTENSION_REGEX.exec(file.name);
            if (file_extension) {
                metadata.setValue("is_file_certified", false);

                //Unbinding the event on the remove anchor
                $("#file-upload-dropzone .dz-remove").unbind();

                //Button to make the file uploader work
                metadata.setValue("file_name", file.name);
                metadata.setValue("files", [file]);
                form.last_filename = file.name;

                //Make the remove button included hide the right content
                $("#file-upload-dropzone .dz-remove").on('click', function () {
                    removeFileUploadInfo();
                });

                //Hide the progress bar because we don't want to see it
                $("#file-upload-dropzone .dz-progress").hide();
            }
        }));

    }
};

//Regex to see if the container is allowed
const CONTAINER_EXTENSION_REGEX = new RegExp(/[.](?:simg|tgz|tar(?:[.]gz)?)$/);
var removeContainerUploadInfo = mobx.action("Remove Container Drop", function () {
    metadata.setValue("container_name", "");
    metadata.setValue("containers", []);

    // if dropzone has a file associated, remove it via click event
    var existingFile = $("#container-upload-dropzone .dz-remove")[0];

    if (existingFile)
        existingFile.click();
});
//Configuration for the container upload dropzone
var CONTAINER_UPLOAD_CONFIG = {
    url: 'someurl',
    autoProcessQueue: false,
    acceptedFiles: '.tar,.tgz,.tar.gz,.simg',
    addRemoveLinks: true,
    maxFiles: 1,
    init: function () {
        var self = this;

        /*Runs when you try to add more files than allowed*/
        self.on("maxfilesexceeded", function (file) {
            this.removeAllFiles();
            this.addFile(file);
        });

        /*Runs when you add a file that isn't allowed*/
        this.on("error", function (file, message, xhr) {
            if (xhr == null) {
                this.removeFile(file);
            }
        });

        /*Runs when you add any kind of file*/
        self.on("addedfile", mobx.action("Add Container Drop", function (file) {
            //Make sure that this file is allowed
            var file_extension = CONTAINER_EXTENSION_REGEX.exec(file.name);
            if (file_extension) {
                //Unbinding the event on the remove anchor
                $("#container-upload-dropzone .dz-remove").unbind();

                //Button to make the container uploader work
                metadata.setValue("container_name", file.name);
                metadata.setValue("containers", [file]);

                //Make the remove button included hide the right content
                $("#container-upload-dropzone .dz-remove").on('click', function () {
                    removeContainerUploadInfo();
                });

                //Hide the progress bar because we don't want to see it
                $("#container-upload-dropzone .dz-progress").hide();
            }
        }));

    }
};

/***********************************************************************/
/***********************************************************************/
/****************************DOCUMENT READY*****************************/
/***********************************************************************/
/***********************************************************************/
$(document).ready(mobx.action("Document Ready", function () {
    //Above all else, make sure we're allowed to be here
    checkIsAuthenticated();

    // Set input messages
    $('.table-msg').html($("#table_msg").val());
    $('.upload-msg').html($("#upload_msg").val());

    // Override Chosen to allow Success/Error marking
    $(".chosen-container").addClass("selectControl");


    $('#access-limitations')
    .chosen()
    .on('change', function(e) {
        var accessLims = metadata.getValue("access_limitations");

        if (!form.is_limited) {
            $('#access-limitations option[value="UNL"]').prop('selected', true);
        }

        var isOUO = $('#access-limitations option[value="OUO"]').is(':selected');

        // if not OUO
        if (!isOUO) {
            // remove subtypes
            if (form.previous_ouo) {
                $('#access-limitations option:selected').each(function () {
                    cnt++;
                    var value = $(this).val();

                    if (value != 'UNL' && value != 'SBIR' && value != 'STTR') {
                        $('#access-limitations option[value="'+ value +'"]').prop('selected', false);
                    }
                });
            }
            // add if has OUO subtypes
            else {
                var cnt = 0;
                var unl = 0;
                $('#access-limitations option:selected').each(function () {
                    cnt++;
                    var value = $(this).val();

                    if (value == 'UNL' || value == 'SBIR' || value == 'STTR') {
                        unl++;
                    }
                });
                if (cnt > unl) {
                    $('#access-limitations option[value="OUO"]').prop('selected', true);
                    isOUO = true;
                }
            }
        }

        form.previous_ouo = isOUO;
    });

    $('#access-limitations')
    .chosen()
    .on('chosen:showing_dropdown', function(e) {
        var chosenElement = $(e.currentTarget.nextSibling);

        var isUNL = $('#access-limitations option[value="UNL"]').is(':selected');
        var isSBIR = $('#access-limitations option[value="SBIR"]').is(':selected');
        var isSTTR = $('#access-limitations option[value="STTR"]').is(':selected');
        var isOUO = $('#access-limitations option[value="OUO"]').is(':selected');

        chosenElement.find('li.active-result').each(function(index) {
            element = $(this);

            var label = element.text();
            var codeMatch = label.match(/^.*?([A-Z]+)(;)?/);
            
            if (!codeMatch)
                return;

            var code = codeMatch[1];
            var multiCode = codeMatch[2] == ';';
            var isAllowed = true;

            // if UNL selected, only SBIR/STTR allowed
            if ((isUNL && code == 'OUO')
            // if OUO selected, only UNL not allowed
            || (isOUO && code == 'UNL')
            // if SBIR selected, STTR not allowed
            || (isSBIR && code == 'STTR')
            // if STTR selected, SBIR not allowed
            || (isSTTR && code == 'SBIR')) {
                isAllowed = false;
            }

            // not allowed, disable
            if (!isAllowed) {
                element.removeClass('highlighted');
                element.removeClass('active-result');
                element.addClass('result-selected');
            }
        });
    });

    //Datatables declarations
    developers_table = $("#developers-data-table").DataTable(developers_data_tbl_opts);
    sponsoring_orgs_table = $("#sponsoring-orgs-data-table").DataTable(sponsoring_org_tbl_opts);
    research_orgs_table = $("#research-orgs-data-table").DataTable(research_org_tbl_opts);
    contributors_table = $("#contributors-data-table").DataTable(contributors_org_tbl_opts);
    contributor_orgs_table = $("#contributor-orgs-data-table").DataTable(contributing_organizations_tbl_opts);
    related_identifiers_table = $("#related-identifiers-data-table").DataTable(related_identifiers_tbl_opts);
    award_dois_table = $("#award-dois-data-table").DataTable(award_dois_tbl_opts);
    change_log_table = $("#change-log-data-table").DataTable(change_log_tbl_opts);


    // datatable functionality
    developers_table.on('row-reorder', handleReorderingDevs);
    contributors_table.on('row-reorder', handleReorderingContribs);

    // modal redirect function
    $("#common-message-dialog").on("hidden.bs.modal", function () {
        if (modal_redirect)
            window.location.href  = modal_redirect;
    });


    if (page_val == 'submit') {
        metadata.requireOnlySubmitFields();
    }

    clearChosenList("licenses");
    clearChosenList("access-limitations");
    clearChosenList("programming-languages");
    clearChosenList("product-keywords");

    // If editing, load the data from server.
    var code_id = $("#code_id").val();
    var load_id = $("#load_id").val();
    if (code_id) {
        setCommonModalMessage({
            title: 'Loading Projects',
            show_loader: true,
            message_type: MESSAGE_TYPE_REGULAR,
            content: "<br/>Loading Project " + code_id,
            contentClasses: ['center-text'],
            showClose: false
        });
        showCommonModalMessage();
        doAuthenticatedAjax('GET', API_BASE + "metadata/" + code_id, parseSearchResponse, undefined, parseEditErrorResponse);
    } else if (load_id) {
        setCommonModalMessage({
            title: 'Loading Projects',
            show_loader: true,
            message_type: MESSAGE_TYPE_REGULAR,
            content: "<br/>Loading data from project #" + load_id,
            contentClasses: ['center-text'],
            showClose: false
        });
        showCommonModalMessage();
        doAuthenticatedAjax('GET', API_BASE + "metadata/" + load_id, parseLoadIdResponse, undefined, parseEditErrorResponse);
        metadata.setValue("software_type", $("#software_type").val());
        $("#input-save-btn").show();
    } else {
        // set software type
        metadata.setValue("software_type", $("#software_type").val());
        
        restrictLimitations();

        $("#input-save-btn").show();
    }



    //For when the input form collapse items are shown
    $(".input-panel-collapse").on('shown.bs.collapse', function () {
        var toggle_arrow = $(this).prev('div.panel-heading').find('div.panel-title > span.accordion-toggle-arrow');
        $(toggle_arrow).removeClass('fa-chevron-right');
        $(toggle_arrow).addClass('fa-chevron-down');
        $(toggle_arrow).attr('title', 'Close');
    });
    //For when the input form collapse items are hidden
    $(".input-panel-collapse").on('hide.bs.collapse', function () {
        var toggle_arrow = $(this).prev('div.panel-heading').find('div.panel-title > span.accordion-toggle-arrow');
        $(toggle_arrow).removeClass('fa-chevron-down');
        $(toggle_arrow).addClass('fa-chevron-right');
        $(toggle_arrow).attr('title', 'Open');
    });

    //Makes the toggle arrows toggle the collapsibles
    $('.accordion-toggle-arrow').on('click', toggleCollapsible);

    //Makes the button to show additional fields work
    if (document.getElementById('input-form-optional-toggle')) {
        $("#input-form-optional-toggle").on('click', function () {
            $("#input-page-accordion > div.panel").each(function () {
                $(this).show();
            });
            $(this).hide();
        });
    }

    // open first panel
    $("#repository-panel-anchor").trigger('click');

    // Project Type
    $('#input-opensource-btn').on('click', projectTypeButtonClick);
    $('#input-closedsource-btn').on('click', projectTypeButtonClick);
    $('#input-pubyes-btn').on('click', projectTypeButtonClick);
    $('#input-pubno-btn').on('click', projectTypeButtonClick);
    $('#input-landyes-btn').on('click', projectTypeButtonClick);
    $('#input-landno-btn').on('click', projectTypeButtonClick);
    
    // License Closed Source
    $('#input-licenseyes-btn').on('click', licensesButtonClick);
    $('#input-licenseno-btn').on('click', licensesButtonClick);
    $('#input-contactyes-btn').on('click', licensesButtonClick);
    $('#input-contactno-btn').on('click', licensesButtonClick);

    // Panel Updates
    $('#repository-link').on('change', {
        store: metadata,
        field: "repository_link"
    }, inputChange);
    $('#landing-page').on('change', {
        store: metadata,
        field: "landing_page"
    }, inputChange);
    $('#landing-contact').on('change', {
        store: metadata,
        field: "landing_contact"
    }, inputChange);

    $('#software-title').on('input', {
        store: metadata,
        field: "software_title"
    }, inputChange);
    $('#description').on('input', {
        store: metadata,
        field: "description"
    }, inputChange);
    $('#programming-languages').on('change', {
        store: metadata,
        field: "programming_languages"
    }, inputChange);
    $('#version-number').on('input', {
        store: metadata,
        field: "version_number"
    }, inputChange);
    $('#documentation-url').on('change', {
        store: metadata,
        field: "documentation_url"
    }, inputChange);
    $('#licenses').on('change', {
        store: metadata,
        field: "licenses"
    }, inputChange);
    $('#access-limitations').on('change', {
        store: metadata,
        field: "access_limitations"
    }, inputChange);
    $('#phase').on('change', {
        store: metadata,
        field: "phase"
    }, inputChange);
    $('#previous-contract-number').on('change', {
        store: metadata,
        field: "previous_contract_number"
    }, inputChange);
    $('#contract-start-date').on('change', {
        store: metadata,
        field: "contract_start_date"
    }, inputChange);
    $('#sb-release-date').on('change', {
        store: metadata,
        field: "sb_release_date"
    }, inputChange);
    $('#bo-name').on('change', {
        store: metadata,
        field: "bo_name"
    }, inputChange);
    $('#bo-email').on('change', {
        store: metadata,
        field: "bo_email"
    }, inputChange);
    $('#bo-phone').on('change', {
        store: metadata,
        field: "bo_phone"
    }, inputChange);
    $('#bo-org').on('change', {
        store: metadata,
        field: "bo_org"
    }, inputChange);
    $('#pi-name').on('change', {
        store: metadata,
        field: "pi_name"
    }, inputChange);
    $('#pi-email').on('change', {
        store: metadata,
        field: "pi_email"
    }, inputChange);
    $('#pi-phone').on('change', {
        store: metadata,
        field: "pi_phone"
    }, inputChange);
    $('#pi-org').on('change', {
        store: metadata,
        field: "pi_org"
    }, inputChange);
    $('#exemption-number').on('change', {
        store: metadata,
        field: "exemption_number"
    }, inputChange);
    $('#ouo-release-date').on('change', {
        store: metadata,
        field: "ouo_release_date"
    }, inputChange);
    $('#protection').on('change', {
        store: metadata,
        field: "protection"
    }, inputChange);
    $('#protection-other').on('change', {
        store: metadata,
        field: "protection_other"
    }, inputChange);
    $('#program-office').on('change', {
        store: metadata,
        field: "program_office"
    }, inputChange);
    $('#protection-reason').on('change', {
        store: metadata,
        field: "protection_reason"
    }, inputChange);
    $('#proprietary-url').on('change', {
        store: metadata,
        field: "proprietary_url"
    }, inputChange);
    $('#license-contact-email').on('change', {
        store: metadata,
        field: "license_contact_email"
    }, inputChange);
    $('#doi').on('change', {
        store: metadata,
        field: "doi"
    }, inputChange);
    $('#doi-infix').on('input', {
        field: "doi_infix"
    }, handleInfix);
    $('#release-date').on('change', {
        store: metadata,
        field: "release_date"
    }, inputChange);
    $('#short-title').on('input', {
        store: metadata,
        field: "acronym"
    }, inputChange);
    $('#country-of-origin').on('change', {
        store: metadata,
        field: "country_of_origin"
    }, inputChange);
    $('#keywords').on('input', {
        store: metadata,
        field: "keywords"
    }, inputChange);
    $("#project-keywords").on('change', {
        store: metadata,
        field: 'project_keywords'
    }, inputChange);
    $('#other-special-requirements').on('input', {
        store: metadata,
        field: "other_special_requirements"
    }, inputChange);
    $('#site-accession-number').on('input', {
        store: metadata,
        field: "site_accession_number"
    }, inputChange);

    $('#contact-info-name').on('input', {
        store: metadata,
        field: "recipient_name"
    }, inputChange);
    $('#contact-info-email').on('change', {
        store: metadata,
        field: "recipient_email"
    }, inputChange);
    $('#contact-info-phone').on('change', {
        store: metadata,
        field: "recipient_phone"
    }, inputChange);
    $('#contact-info-organization').on('input', {
        store: metadata,
        field: "recipient_org"
    }, inputChange);

    // Dev Modal Updates
    $('#developer-edit-first-name').on('input', {
        store: developer,
        field: "first_name"
    }, inputChange);
    $('#developer-edit-middle-name').on('input', {
        store: developer,
        field: "middle_name"
    }, inputChange);
    $('#developer-edit-last-name').on('input', {
        store: developer,
        field: "last_name"
    }, inputChange);
    $('#developer-edit-email').on('change', {
        store: developer,
        field: "email"
    }, inputChange);
    $('#developer-edit-orcid').on('change', {
        store: developer,
        field: "orcid"
    }, inputChange);
    $('#developer-edit-affiliations').on('change', {
        store: developer,
        field: "affiliations"
    }, inputChange);

    // SponsorOrg Modal Updates 
    $('#sponsoring-orgs-edit-DOE').on('change', {
        store: sponsor_org,
        field: "DOE"
    }, checkboxChange);
    $('#sponsoring-orgs-edit-organization_name').on('change', {
        store: sponsor_org,
        field: "organization_name"
    }, inputChange);
    $('#sponsoring-orgs-edit-primary_award').on('change', {
        store: sponsor_org,
        field: "primary_award"
    }, inputChange);
    $('#sponsoring-orgs-edit-award_numbers').on('change', {
        store: sponsor_org,
        field: "award_numbers"
    }, inputChange);
    $('#sponsoring-orgs-edit-br_codes').on('change', {
        store: sponsor_org,
        field: "br_codes"
    }, inputChange);
    $('#sponsoring-orgs-edit-fwp_numbers').on('change', {
        store: sponsor_org,
        field: "fwp_numbers"
    }, inputChange);

    // ResearchOrg Modal Updates
    $('#research-orgs-edit-DOE').on('change', {
        store: research_org,
        field: "DOE"
    }, checkboxChange);
    $('#research-orgs-edit-organization_name').on('change', {
        store: research_org,
        field: "organization_name"
    }, inputChange);

    // Contributor Modal Updates
    $('#contributor-edit-first_name').on('input', {
        store: contributor,
        field: "first_name"
    }, inputChange);
    $('#contributor-edit-middle_name').on('input', {
        store: contributor,
        field: "middle_name"
    }, inputChange);
    $('#contributor-edit-last_name').on('input', {
        store: contributor,
        field: "last_name"
    }, inputChange);
    $('#contributor-edit-email').on('change', {
        store: contributor,
        field: "email"
    }, inputChange);
    $('#contributor-edit-orcid').on('change', {
        store: contributor,
        field: "orcid"
    }, inputChange);
    $('#contributor-edit-affiliations').on('change', {
        store: contributor,
        field: "affiliations"
    }, inputChange);
    $('#contributor-edit-contribtype').on('change', {
        store: contributor,
        field: "contributor_type"
    }, inputChange);

    // ContributingOrg Modal Updates
    $('#contributing-organization-edit-DOE').on('change', {
        store: contributing_org,
        field: "DOE"
    }, checkboxChange);
    $('#contributing-organization-edit-organization_name').on('input', {
        store: contributing_org,
        field: "organization_name"
    }, inputChange);
    $('#contributing-organization-edit-contribtype').on('change', {
        store: contributing_org,
        field: "contributor_type"
    }, inputChange);

    // Related Identifier Modal Updates
    $('#related-identifier-identifier-type').on('change', {
        store: related_identifier,
        field: "identifier_type"
    }, inputChange);
    $('#related-identifier-relation-type').on('change', {
        store: related_identifier,
        field: "relation_type"
    }, inputChange);
    $('#related-identifier-identifier-value').on('input', {
        store: related_identifier,
        field: "identifier_value"
    }, inputChange);

    // Award DOI Modal Updates
    $('#award-doi-value').on('change', {
        store: award_doi,
        field: "award_doi"
    }, inputChange);
    $('#award-doi-funder-name').on('change', {
        store: award_doi,
        field: "funder_name"
    }, inputChange);

    // Comment Updates
    $('#record-comment').on('change', {
        store: metadata,
        field: "comment"
    }, inputChange);

    //Makes the autopopualte from repository work
    $("#autopopulate-from-repository").on('click', autopopulateFromRepository);

    /*Developers*/
    setModalActions("developers");

    /*DOI and Release Date*/
    $("#reserve-doi-btn").on('click', handleReserve);

    /*Organizations*/
    setModalActions("sponsoring-orgs");
    setModalActions("research-orgs");

    /*Contributors and Contributing Organization*/
    setModalActions("contributors");
    setModalActions("contributor-orgs");

    /*Related identifiers*/
    setModalActions("related-identifiers");

    /*Award DOIs*/
    setModalActions("award-dois");

    /*File uploads*/
    $('#project-is-migration').on('change', {
        store: metadata,
        field: "is_migration"
    }, checkboxChange);
    $('#file-is-certified').on('change', {
        store: metadata,
        field: "is_file_certified"
    }, checkboxChange);

    var dropzone = $("#file-upload-dropzone").dropzone(FILE_UPLOAD_CONFIG);
    // bind removal event
    $("#delete-uploaded-file-btn").on('click', function () {
        removeFileUploadInfo();
    });

    /*Container uploads*/
    var dropzone2 = $("#container-upload-dropzone").dropzone(CONTAINER_UPLOAD_CONFIG);
    // bind removal event
    $("#delete-uploaded-container-btn").on('click', function () {
        removeContainerUploadInfo();
    });

    // form buttons
    $('#input-save-btn').on('click', save);
    $('#input-announce-btn').on('click', announce);
    $('#input-submit-btn').on('click', submit);
    $('#input-approve-btn').on('click', approve);
    $('#input-comment-btn').on('click', editComment);

    if (page_val == 'announce') {
        $('#input-announce-btn').show();
    }

    if (page_val == 'submit') {
        $('#input-submit-btn').show();
    }

    if (page_val == 'approve') {
        $('#input-help-anchor').hide();
        $('#input-approve-msg-top').show();
        $('#input-approve-msg-bottom').show();
        $('#input-approve-btn').show();
        $("#owner-email-address").parent().show();
    }

    //Assign functionality to the Auto Fill Contact Button
    if (page_val == 'submit' || page_val == 'announce') {
        $("#autofill-contact-info").on('click', fillContactDataFromAccount);
    } else {
        $("#autofill-contact-info").hide();
    }

}));

/*
 mobx.spy(function (spyReport) {
 // dig in here.  Have fun picking through all the different types.
 if (spyReport.type) {
 console.log(spyReport.type + ': rawSpyData: ', spyReport);
 }
 });
 */