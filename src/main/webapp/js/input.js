var metadata = new Metadata();
var developer = new Developer();
var sponsor_org = new SponsoringOrganization();
var research_org = new ResearchOrganization();
var contributor = new Contributor();
var contributing_org = new ContributingOrganization();
var related_identifier = new RelatedIdentifier();

var developers_table = null;
var sponsoring_orgs_table = null;
var research_orgs_table = null;
var contributors_table = null;
var contributor_orgs_table = null;
var related_identifiers_table = null;

var form = mobx.observable({
    "allowSave": true,
    "workflowStatus": ""
});

var developers_data_tbl_opts = {
    order: [[0, 'asc']],
    columns: [
        {name: 'first_name', data: 'first_name', 'defaultContent': ''},
        {name: 'last_name', data: 'last_name', 'defaultContent': ''},
        {name: 'affiliations', data: 'affiliations', 'defaultContent': '', render: function (data, type, row) {
            var affiliations = data ? data.join(', ') : '';
            return affiliations;
        }}
    ]
};

var sponsoring_org_tbl_opts = {
    order: [[0, 'asc']],
    columns: [
        {name: 'organization_name', data: 'organization_name', 'defaultContent': ''},
        {name: 'primary_award', data: 'primary_award', 'defaultContent': ''}
    ]
};

var research_org_tbl_opts = {
    order: [[0, 'asc']],
    columns: [
        {name: 'organization_name', data: 'organization_name', 'defaultContent': ''}
    ]
};

var contributors_org_tbl_opts = {
    order: [[0, 'asc']],
    columns: [
        {name: 'first_name', data: 'first_name', 'defaultContent': ''},
        {name: 'last_name', data: 'last_name', 'defaultContent': ''},
        {name: 'contributor_type', data: 'contributor_type', 'defaultContent': ''}
    ]
};

var contributing_organizations_tbl_opts = {
    order: [[0, 'asc']],
    columns: [
        {name: 'organization_name', data: 'organization_name', 'defaultContent': ''},
        {name: 'contributor_type', data: 'contributor_type', 'defaultContent': ''}
    ]
};

var related_identifiers_tbl_opts = {
    order: [[0, 'asc']],
    columns: [
        {name: 'identifier_type', data: 'identifier_type', 'defaultContent': ''},
        {name: 'relation_type', data: 'relation_type', 'defaultContent': ''},
        {name: 'identifier_value', data: 'identifier_value', 'defaultContent': ''}
    ]
};


var toggleCollapsible = function () {
    $(this).prev().prev('a.input-accordion-title').trigger('click');
};

var accessibilityRepositoryLinkType = mobx.action("Change Project Type", function () {
    metadata.setValue("accessibility", $(this).val());
});

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
    }
    else if (is_completed) {
    	$("#" + label).removeClass("has-error");
    	$("#" + label).addClass("has-success");
    	$("#" + label).parent().parent().removeClass("has-error");
    	$("#" + label).parent().parent().addClass("has-success");
    	$("#" + label + "-error").text("");
    	$("#" + label).parent().parent().find(".errorCheck").hide();
    	$("#" + label).parent().parent().find(".successCheck").show();
    }
    else {
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
    }
    else if (use_parenthetical_text) {
    	new_class_list = use_parenthetical_text ? "req_of" : "";
    }

    $("#" + label).removeClass("req req_rf req_of").addClass(new_class_list);
};

var inputChange = mobx.action("Input Change", function (event) {
    var value = $(this).val();
    if (event.data.field == "release_date" && value)
        value = moment(value, FRONT_END_DATE_FORMAT).format(BACK_END_DATE_FORMAT);

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
    if (field == "release_date" && value)
        value = moment(value, BACK_END_DATE_FORMAT).format(FRONT_END_DATE_FORMAT);

    $("#" + input).val(value);
};

var updateDropzoneStyle = function (store, field, label, input, exclude_parenthetical_text) {
    updateLabelStyle(store, field, label, exclude_parenthetical_text);

    var value = store.getValue(field);

    $("#" + input).html(value);

    if (value)
        $("#uploaded-file-div").show();
    else {
        var existingFile = $(".dz-remove")[0];

        if (existingFile)
            existingFile.click();

        $("#uploaded-file-div").hide();
    }

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
    populateSelectWithCustomData(input, current_list);
    loadSelectData(input, current_list);
};


var autopopulateFromRepository = function () {
    setCommonModalMessage({
        title: 'Autopopulate',
        show_loader: true,
        message_type: MESSAGE_TYPE_REGULAR,
        content: "<br/> Loading Data from Repository: <br> " + $("#repository-link").val(),
        contentClasses: ['center-text'], showClose: false
    });
    showCommonModalMessage();

    doAjax('GET', API_BASE + "metadata/autopopulate?repo=" + metadata.getValue('repository_link'), parseAutopopulateResponse, undefined, parseErrorResponse);
    event.preventDefault();
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
    	contentClasses: ['center-text'], showClose: true
    });
    showCommonModalMessage();
};

var parseSearchResponse = mobx.action("Parse Search Response", function parseSearchResponse(data) {
    if(document.getElementById('owner-email-address')){
        $("#owner-email-address").html(data.metadata.owner);
    }
    metadata.loadRecordFromServer(data.metadata, $("#page").val());

    // if old record that's not updated, set to default
    var software_type_id = metadata.getValue("software_type");
    if (!software_type_id)
        metadata.setValue("software_type", $("#software_type").val());

    // if CO project, we need to store original repo link, in case they change type
    form.co_repo = "";
    if (metadata.getValue("accessibility") == "CO") {
        var orig_repo = metadata.getValue("repository_link");
        form.co_repo = orig_repo ? orig_repo : form.co_repo;
    }

    form.workflowStatus = data.metadata.workflow_status;
    form.allowSave = (data.metadata.workflow_status == "" || data.metadata.workflow_status == "Saved");



    // this should really be based on info from data store, not calculated like this.  We should revisit doi_status...
    const doi = metadata.getValue("doi");
    const prefix = doi.substr(0, doi.indexOf('/'));
    const id = doi.substr(doi.lastIndexOf('/') + 1, doi.length - 1);
    const infix = doi.substr(doi.indexOf('/') + 1, doi.lastIndexOf('/') - doi.indexOf('/') - 1);

    if (prefix == "10.5072" || prefix == "10.11578")
    	metadata.setValue("doi_status", (form.allowSave ? "RES" : "REG"));

    if (infix)
    	metadata.setValue("doi_infix", infix);



    hideCommonModalMessage();
});

var parseAutopopulateResponse = mobx.action("Parse Autopopulate Response", function parseAutopopulateResponse(responseData) {
    if (responseData !== undefined) {
        metadata.updateMetadata(responseData.metadata);
    }
    hideCommonModalMessage();
});


var doMultipartSubmission = function doMultipartSubmission(url, successCallback) {
    const files = metadata.getValue("files");
    let formData = new FormData();
    formData.append('file', files[0]);
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
    	contentClasses: ['center-text'], showClose: false
    });
    showCommonModalMessage();

    if (metadata.getValue("accessibility") == 'OS' || (Array.isArray(metadata.getValue("files").slice()) && metadata.getValue("files").length == 0))
        doAuthenticatedAjax('POST', API_BASE + 'metadata/save', parseSaveResponse, metadata.serializeData(), parseErrorResponse);
    else
        doMultipartSubmission(API_BASE + 'metadata/save', parseSaveResponse);
};



var submit = function submit() {
    var code_id = $("#code_id").val();
    var msg = code_id ? "Project " + code_id : "New Project";
    
    setCommonModalMessage({
        title: 'Submitting',
        show_loader: true,
    	message_type: MESSAGE_TYPE_REGULAR,
    	content: "<br/>Submitting data for " + msg + ".",
    	contentClasses: ['center-text'], showClose: false
    });
    showCommonModalMessage();

    if (metadata.getValue("accessibility") == 'OS' || (Array.isArray(metadata.getValue("files").slice()) && metadata.getValue("files").length == 0))
        doAuthenticatedAjax('POST', API_BASE + 'metadata/submit', parseSubmitResponse, metadata.serializeData(), parseErrorResponse);
    else
        doMultipartSubmission(API_BASE + 'metadata/submit', parseSubmitResponse);
};



var announce = function announce() {
    var code_id = $("#code_id").val();
    var msg = code_id ? "Project " + code_id : "New Project";
    
    setCommonModalMessage({
        title: 'Announcing',
        show_loader: true,
    	message_type: MESSAGE_TYPE_REGULAR,
    	content: "<br/>Announcing data for " + msg + ".",
    	contentClasses: ['center-text'], showClose: false
    });
    showCommonModalMessage();

    if (metadata.getValue("accessibility") == 'OS' || (Array.isArray(metadata.getValue("files").slice()) && metadata.getValue("files").length == 0))
        doAuthenticatedAjax('POST', API_BASE + 'metadata/announce', parseAnnounceResponse, metadata.serializeData(), parseErrorResponse);
    else
        doMultipartSubmission(API_BASE + 'metadata/announce', parseAnnounceResponse);
};



var approve = function approve() {
    var code_id = $("#code_id").val();
    var msg = code_id ? "Project " + code_id : "New Project";
    
    setCommonModalMessage({
        title: 'Approving',
        show_loader: true,
    	message_type: MESSAGE_TYPE_REGULAR,
    	content: "<br/>Approving data for " + msg + ".",
    	contentClasses: ['center-text'], showClose: false
    });
    showCommonModalMessage();

    doAuthenticatedAjax('GET', API_BASE + 'metadata/approve/'+code_id, parseApproveResponse, null, parseErrorResponse);
};

var parseSaveResponse = mobx.action("Parse Receive Response", function parseSaveResponse(data) {
    metadata.setValue("code_id", data.metadata.code_id);
    hideCommonModalMessage();

    if (!($("#code_id").val())) {
        window.location.href = "/" + APP_NAME + "/submit?code_id=" + data.metadata.code_id;
    }
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


var setModalActions = function setModalActions(modal) {
    //Clears out the lists upon closing the modals
    $("#" + modal + "-edit-modal").on('hidden.bs.modal', {modal_name: modal}, clearModal);
    //Show the add modal
    $("#add-" + modal + "-modal-btn").on('click', {modal_name: modal}, showModal);
    //Hide the modal
    $("#" + modal + "-close-btn").on('click', {modal_name: modal}, hideModal);
    //Delete the item
    $("#" + modal + "-delete-btn").on('click', {modal_name: modal}, deleteModalData);
    //Save the item
    $("#" + modal + "-save-btn").on('click', {modal_name: modal}, saveModalData);
    //Load the item data
    $("#" + modal + "-data-table tbody").on('click', 'tr', {modal_name: modal}, loadDataIntoModalForm);
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

    if (panelStatus.remainingRequired > 0)
        $("#" + anchor).addClass("req_fr required-field-span");
    else if (panelStatus.hasRequired) {
        $("#" + anchor).addClass("req_arfc");
        $("#" + anchor).next("span").show();		
    }

    if (panel == "Contact Information") {
        const successNotice = panelStatus.hasRequired ? panelStatus.remainingRequired == 0 : panelStatus.completedOptional > 0;

        setRequired("contact-lbl", panelStatus.hasRequired, true);    	
        setSuccess("contact-lbl", (successNotice && !panelStatus.errors));
    }
}


/*********************
 FORM (action)
 *********************/ 
mobx.autorun("Allow Save", function () {
    if (form.allowSave)
        $("#input-save-btn").show();
    else
        $("#input-save-btn").hide();

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
    if (form.workflowStatus == "Announced" && $("#page").val() == 'submit') {
        $('#input-overwrite-msg-top').show();
        $('#input-overwrite-msg-bottom').show();
    }
    else {
        $('#input-overwrite-msg-top').hide();
        $('#input-overwrite-msg-bottom').hide();
    }

    // mobx.whyRun();
});


/*********************
 REPO PANEL (action)
 *********************/
mobx.autorun("Repository Info Panel", function () {
    setPanelStatus("Repository Information", "repository-panel-anchor", metadata.panelStatus.repository);

    //mobx.whyRun();
});

mobx.autorun("Project Type", function () {
    var project_type = metadata.getValue("accessibility");
    switch (project_type) {
        case "OS":
            $("#git-repo-only-div").show();
            $("#repository-link-div").show();
            $("#landing-page-div").hide();
            $("#autopop-div").show();
            $("#repository-link-display-div").show();
            $("#repository-link-co-div").hide();
            $("#file-upload-zone").hide();
            break;
        case "ON":
        case "CS":
            $("#git-repo-only-div").hide();
            $("#repository-link-div").hide();
            $("#landing-page-div").show();
            $("#autopop-div").hide();
            $("#repository-link-display-div").hide();
            $("#repository-link-co-div").hide();
            $("#file-upload-zone").show();
            break;
        case "CO":
            $("#git-repo-only-div").hide();
            $("#repository-link-div").hide();
            $("#landing-page-div").show();
            $("#autopop-div").hide();
            $("#repository-link-display-div").show();
            $("#repository-link-co-div").show();
            $("#file-upload-zone").show();
            break;
        default:
            $("#git-repo-only-div").hide();
            $("#repository-link-div").hide();
            $("#landing-page-div").hide();
            $("#autopop-div").hide();
            $("#repository-link-display-div").hide();
            $("#repository-link-co-div").hide();
            $("#file-upload-zone").show();
            break;
    }
    $("input[name=repository-info-group][value=" + project_type + "]").prop('checked', true);

    if (project_type == "CO") {
        metadata.setValue("repository_link", form.co_repo);
        $("#supplemental-step").show();
    }
    else if ($("#input-form-optional-toggle").is(":visible")) {
        $("#supplemental-step").hide();
    }

    setSuccess("project-type-lbl", project_type != null);

    //mobx.whyRun();
});

mobx.autorun("Repository Link", function () {
    updateInputStyle(metadata, "repository_link", "repository-link-lbl", "repository-link");
    $("#autopopulate-from-repository").prop('disabled', !metadata.isCompleted("repository_link"));

    //mobx.whyRun();
});

mobx.autorun("Repository Link CO", function () {
    updateTextStyle(metadata, "repository_link", "repository-link-co-lbl", "repository-link-co", metadata.getValue("accessibility") == "CO", form.co_repo ? form.co_repo : "TBD");

    //mobx.whyRun();
});

mobx.autorun("Landing Page", function () {
    updateInputStyle(metadata, "landing_page", "landing-page-lbl", "landing-page");

    //mobx.whyRun();
});


/*********************
 PRODUCT PANEL (action)
 *********************/
mobx.autorun("Product Description Panel", function () {
    setPanelStatus("Product Description", "product-description-panel-anchor", metadata.panelStatus.product);

    //mobx.whyRun();
});

mobx.autorun("Repository Link Display", function () {
    updateTextStyle(metadata, "repository_link", "repository-link-display-lbl", "repository-link-display", metadata.getValue("accessibility") == "CO", form.co_repo ? form.co_repo : "TBD");

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

mobx.autorun("Programming Language(s)", function(){
    updateSelectStyle(metadata, "programming_languages", "programming-languages-lbl", "programming-languages");
    
    //mobx.whyRun();
});
mobx.autorun("Version Number", function(){
    updateInputStyle(metadata, "version_number", "version-number-lbl", "version-number");
    
    //mobx.whyRun();
});
mobx.autorun("Documentation URL", function(){
    updateInputStyle(metadata, "documentation_url", "documentation-url-lbl", "documentation-url");
    
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

mobx.autorun("Proprietary URL", function () {
    updateInputStyle(metadata, "proprietary_url", "proprietary-url-lbl", "proprietary-url");

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
    if (developers_table) {
        developers_table.clear();

        var data = metadata.getValue("developers").toJS();
        developers_table.rows.add(data).draw();		
    }

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
    }
    else {
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

mobx.autorun("Other Special Requirements", function () {
    updateInputStyle(metadata, "other_special_requirements", "other-special-requirements-lbl", "other-special-requirements");

    //mobx.whyRun();
});

mobx.autorun("Accession Number", function () {
    updateInputStyle(metadata, "site_accession_number", "site-accession-number-lbl", "site-accession-number");

    //mobx.whyRun();
});

mobx.autorun("File Upload", function () {
    updateDropzoneStyle(metadata, "file_name", "uploaded-file-name-lbl", "uploaded-file-name");

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
    if (sponsoring_orgs_table) {
        sponsoring_orgs_table.clear();

        var data = metadata.getValue("sponsoring_organizations").toJS();
        sponsoring_orgs_table.rows.add(data).draw();		
    }

    updateLabelStyle(metadata, "sponsoring_organizations", "sponsoring-orgs-lbl", true);

    //mobx.whyRun();
});

mobx.autorun("Research Orgs", function () {
    if (research_orgs_table) {
        research_orgs_table.clear();

        var data = metadata.getValue("research_organizations").toJS();
        research_orgs_table.rows.add(data).draw();		
    }

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
    if (contributors_table) {
        contributors_table.clear();

        var data = metadata.getValue("contributors").toJS();
        contributors_table.rows.add(data).draw();		
    }

    updateLabelStyle(metadata, "contributors", "contributors-lbl", true);

    //mobx.whyRun();
});

mobx.autorun("Contributor Orgs", function () {
    if (contributor_orgs_table) {
        contributor_orgs_table.clear();

        var data = metadata.getValue("contributing_organizations").toJS();
        contributor_orgs_table.rows.add(data).draw();		
    }

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




/*********************
 MODALS
 *********************/
//Makes it to where if you close a modal, any new items added are removed, based on an attribute in the option field
var clearChosenList = function (list_id) {
    $('#' + list_id + ' option[data-iscustom="true"]').remove();
    $('#' + list_id + ' option').each(function () {
        $(this).prop('selected', false);
    });
    $("#" + list_id).trigger('chosen:updated');
};

var showModal = function (event) {
    var is_new = $("#current_datatable_id").val() == -1;
    var modal = event.data.modal_name;
    var modal_id = event.data.modal_name + "-edit-modal";

    var manage_text = "";
    if (modal == "developers")
        manage_text = " Developer";
    else if (modal == "sponsoring-orgs")
        manage_text = " Sponsoring Organization";
    else if (modal == "research-orgs")
        manage_text = " Research Organization";
    else if (modal == "contributors")
        manage_text = " Contributor";
    else if (modal == "contributor-orgs")
        manage_text = " Contributing Organization";
    else if (modal == "related-identifiers")
        manage_text = " Related Identifier";

    if (is_new) {
        $("#" + modal + "-manage-lbl").text("Enter" + manage_text);	
        $("#" + modal_id + " span[name='delete-btn']").hide();
    }
    else {
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
	}
    else if (modal == "sponsoring-orgs") {
    	target_table = sponsoring_orgs_table;
	    modal_data = {
	        DOE: $("#sponsoring-orgs-edit-DOE").is(':checked'),
	        organization_name: $("#sponsoring-orgs-edit-organization_name").val(),
	        primary_award: $("#sponsoring-orgs-edit-primary_award").val(),
	        award_numbers: $("#sponsoring-orgs-edit-award_numbers").val(),
	        br_codes: $("#sponsoring-orgs-edit-br_codes").val(),
	        fwp_numbers: $("#sponsoring-orgs-edit-fwp_numbers").val()
	    };
	}
    else if (modal == "research-orgs") {
    	target_table = research_orgs_table;
	    modal_data = {
	        DOE: $("#research-orgs-edit-DOE").is(':checked'),
	        organization_name: $("#research-orgs-edit-organization_name").val()
	    };
	}
    else if (modal == "contributors") {
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
	}
    else if (modal == "contributor-orgs") {
    	target_table = contributor_orgs_table;
	    modal_data = {
	        DOE: $("#contributing-organization-edit-DOE").is(':checked'),
	        organization_name: $("#contributing-organization-edit-organization_name").val(),
	        contributor_type: $("#contributing-organization-edit-contribtype").val()
	    };
	}
    else if (modal == "related-identifiers") {
    	target_table = related_identifiers_table;
	    modal_data = {
	        identifier_type: $("#related-identifier-identifier-type").val(),
	        relation_type: $("#related-identifier-relation-type").val(),
	        identifier_value: $("#related-identifier-identifier-value").val()
	    };
	}
    else
        throw 'Unknown modal table value!';
    
    var edit_idx = $("#current_datatable_id").val();
    // add
    if (edit_idx == -1)
        target_table.rows.add([modal_data]).draw();
    // edit
    else
        target_table.row(edit_idx).data(modal_data).draw();

    //Now, hide the modal
    hideModal({data:{modal_name: modal}});
    
    updateModalSourceData(modal, target_table);
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
    }
    else if (modal == "sponsoring-orgs") {
    	target_table = sponsoring_orgs_table;
    	row_data = target_table.row(this).data();
    	if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
    	}
    		
        sponsor_org.loadValues(row_data);
    }
    else if (modal == "research-orgs") {
    	target_table = research_orgs_table;
    	row_data = target_table.row(this).data();
    	if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
    	}
    		
    	research_org.loadValues(row_data);
    }
    else if (modal == "contributors") {
    	target_table = contributors_table;
    	row_data = target_table.row(this).data();
    	if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
    	}
    	
    	contributor.loadValues(row_data);
    }
    else if (modal == "contributor-orgs") {
    	target_table = contributor_orgs_table;
    	row_data = target_table.row(this).data();
    	if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
    	}
    	
    	contributing_org.loadValues(row_data);   
    }
    else if (modal == "related-identifiers") {
    	target_table = related_identifiers_table;
    	row_data = target_table.row(this).data();
    	if (!row_data) {
            $("#add-" + modal + "-modal-btn").trigger("click");
            return;
    	}
    	
    	related_identifier.loadValues(row_data);
    }	
    else
        throw 'Unknown modal table value!';

    $("#current_datatable_id").val(target_table.row( this ).index());
    showModal({data:{modal_name: modal}});
});

var deleteModalData = mobx.action("Delete Modal Data", function (event) {
    var modal = event.data.modal_name;
    var edit_idx = $("#current_datatable_id").val();
    
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
    else
        throw 'Unknown modal table value!';
    
    target_table.row(edit_idx).remove().draw();
    hideModal({data:{modal_name: modal}});
    updateModalSourceData(modal, target_table);
});

var updateModalSourceData = mobx.action("Update Modal Source", function (modal, target_table) {
    if (!target_table)
        return;

    var updated_data = [];
    $.each(target_table.rows().data(), function (i, row) {
        updated_data.push(row);
    });
	
    metadata.setValue(modalToMetadataProperty(modal), updated_data);
});

var clearModal = mobx.action("Clear Modal", function (event) {
    var modal = event.data.modal_name;
	
    if (modal == "developers") {
        developer.clear();
        clearChosenList("developer-edit-affiliations");
    }
    else if (modal == "sponsoring-orgs") {
        sponsor_org.clear();
        clearChosenList("sponsoring-orgs-edit-award_numbers");
        clearChosenList("sponsoring-orgs-edit-br_codes");
        clearChosenList("sponsoring-orgs-edit-fwp_numbers");
    }
    else if (modal == "research-orgs") {
        research_org.clear();
        clearChosenList("research-orgs-edit-organization_name");
    }	
    else if (modal == "contributors") {
        contributor.clear();
        clearChosenList("contributor-edit-affiliations");
    }
    else if (modal == "contributor-orgs") {
        contributing_org.clear();
    }
    else if (modal == "related-identifiers") {
        related_identifier.clear();
    }
    else
        throw 'Unknown modal table value!';
});

var modalToMetadataProperty = function (modal) {
    var matadata_property = modal;    

    if (modal == "sponsoring-orgs")
    	matadata_property = "sponsoring_organizations";
    else if (modal == "research-orgs")
    	matadata_property = "research_organizations";	
    else if (modal == "contributor-orgs")
    	matadata_property = "contributing_organizations";
    else if (modal == "related-identifiers")
    	matadata_property = "related_identifiers";
    
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
    	contentClasses: ['center-text'], showClose: false
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


//Keeps the dropzone thing from auto-searching for anything with the dropzone class
Dropzone.autoDiscover = false;
//Regex to see if the file is allowed
const FILE_EXTENSION_REGEX = new RegExp(/\.(zip|tar|tar[.]gz|tar[.]bz2)$/);
var hideFileUploadInfo = mobx.action("Remove File Drop", function () {
    $("#delete-uploaded-file-btn").unbind();
    metadata.setValue("file_name", "");
    metadata.setValue("files", []);
});
//Configuration for the file upload dropzone
var FILE_UPLOAD_CONFIG = {url: 'someurl',
    autoProcessQueue: false,
    acceptedFiles: '.zip,.tar,.tar.gz,.tar.bz2',
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
                //Unbinding the event on the remove anchor
                $(".dz-remove").unbind();

                //Button to make the file uploader work
                metadata.setValue("file_name", file.name);
                metadata.setValue("files", [file]);
				
                //Make the delete file button work
                $("#delete-uploaded-file-btn").on('click', function () {
                    self.removeFile(file);
                    hideFileUploadInfo();
                });

                //Make the remove button included hide the right content
                $(".dz-remove").on('click', function () {
                    hideFileUploadInfo();
                });

                //Hide the progress bar because we don't want to see it
                $(".dz-progress").hide();
            }
        }));

    }
};

$(document).ready(mobx.action("Document Ready", function () {
    //Above all else, make sure we're allowed to be here
    checkIsAuthenticated();
    
    // Set table input message
    $('.table-msg').html($("#table_msg").val());
    
    // Override Chosen to allow Success/Error marking
    $(".chosen-container").addClass("selectControl");

    // Clear radio group in case of back button usage.
    $('input:radio[name="repository-info-group"]:checked').prop('checked', false);

    //Datatables declarations
    developers_table = $("#developers-data-table").DataTable(developers_data_tbl_opts);
    sponsoring_orgs_table = $("#sponsoring-orgs-data-table").DataTable(sponsoring_org_tbl_opts);
    research_orgs_table = $("#research-orgs-data-table").DataTable(research_org_tbl_opts);
    contributors_table = $("#contributors-data-table").DataTable(contributors_org_tbl_opts);
    contributor_orgs_table = $("#contributor-orgs-data-table").DataTable(contributing_organizations_tbl_opts);
    related_identifiers_table = $("#related-identifiers-data-table").DataTable(related_identifiers_tbl_opts);

    if ($("#page").val() == 'submit') {
        metadata.requireOnlySubmitFields();
    }

    clearChosenList("licenses");
    clearChosenList("programming-languages");

    // If editing, load the data from server.
    var code_id = $("#code_id").val();
    if (code_id) {
        setCommonModalMessage({
            title: 'Loading Projects',
            show_loader: true,
            message_type: MESSAGE_TYPE_REGULAR,
            content: "<br/>Loading Project " + code_id,
            contentClasses: ['center-text'], showClose: false
        });
        showCommonModalMessage();
        doAuthenticatedAjax('GET', API_BASE + "metadata/" + code_id, parseSearchResponse, undefined, parseErrorResponse);
    } else {
        // set software type
        metadata.setValue("software_type", $("#software_type").val());
	    
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
    //Makes the accessibility radio buttons work
    $('input[name="repository-info-group"]').on('change', accessibilityRepositoryLinkType);

    // Panel Updates
    $('#repository-link').on('change', {store: metadata, field: "repository_link"}, inputChange);
    $('#landing-page').on('change', {store: metadata, field: "landing_page"}, inputChange);
    
    $('#software-title').on('input', {store: metadata, field: "software_title"}, inputChange);
    $('#description').on('input', {store: metadata, field: "description"}, inputChange);
    $('#programming-languages').on('change', {store: metadata, field: "programming_languages"}, inputChange);
    $('#version-number').on('input', {store: metadata, field: "version_number"}, inputChange);
    $('#documentation-url').on('change', {store: metadata, field: "documentation_url"}, inputChange);
    $('#licenses').on('change', {store: metadata, field: "licenses"}, inputChange);
    
    $('#proprietary-url').on('change', {store: metadata, field: "proprietary_url"}, inputChange);
    $('#doi').on('change', {store: metadata, field: "doi"}, inputChange);
    $('#doi-infix').on('input', {field: "doi_infix"}, handleInfix);
    $('#release-date').on('change', {store: metadata, field: "release_date"}, inputChange);
    $('#short-title').on('input', {store: metadata, field: "acronym"}, inputChange);
    $('#country-of-origin').on('change', {store: metadata, field: "country_of_origin"}, inputChange);
    $('#keywords').on('input', {store: metadata, field: "keywords"}, inputChange);
    $('#other-special-requirements').on('input', {store: metadata, field: "other_special_requirements"}, inputChange);
    $('#site-accession-number').on('input', {store: metadata, field: "site_accession_number"}, inputChange);
    
    $('#contact-info-name').on('input', {store: metadata, field: "recipient_name"}, inputChange);
    $('#contact-info-email').on('change', {store: metadata, field: "recipient_email"}, inputChange);
    $('#contact-info-phone').on('change', {store: metadata, field: "recipient_phone"}, inputChange);
    $('#contact-info-organization').on('input', {store: metadata, field: "recipient_org"}, inputChange);

    // Dev Modal Updates
    $('#developer-edit-first-name').on('input', {store: developer, field: "first_name"}, inputChange);
    $('#developer-edit-middle-name').on('input', {store: developer, field: "middle_name"}, inputChange);
    $('#developer-edit-last-name').on('input', {store: developer, field: "last_name"}, inputChange);
    $('#developer-edit-email').on('change', {store: developer, field: "email"}, inputChange);
    $('#developer-edit-orcid').on('change', {store: developer, field: "orcid"}, inputChange);
    $('#developer-edit-affiliations').on('change', {store: developer, field: "affiliations"}, inputChange);

    // SponsorOrg Modal Updates
    $('#sponsoring-orgs-edit-DOE').on('change', {store: sponsor_org, field: "DOE"}, checkboxChange);
    $('#sponsoring-orgs-edit-organization_name').on('change', {store: sponsor_org, field: "organization_name"}, inputChange);
    $('#sponsoring-orgs-edit-primary_award').on('change', {store: sponsor_org, field: "primary_award"}, inputChange);
    $('#sponsoring-orgs-edit-award_numbers').on('change', {store: sponsor_org, field: "award_numbers"}, inputChange);
    $('#sponsoring-orgs-edit-br_codes').on('change', {store: sponsor_org, field: "br_codes"}, inputChange);
    $('#sponsoring-orgs-edit-fwp_numbers').on('change', {store: sponsor_org, field: "fwp_numbers"}, inputChange);

    // ResearchOrg Modal Updates
    $('#research-orgs-edit-DOE').on('change', {store: research_org, field: "DOE"}, checkboxChange);
    $('#research-orgs-edit-organization_name').on('change', {store: research_org, field: "organization_name"}, inputChange);

    // Contributor Modal Updates
    $('#contributor-edit-first_name').on('input', {store: contributor, field: "first_name"}, inputChange);
    $('#contributor-edit-middle_name').on('input', {store: contributor, field: "middle_name"}, inputChange);
    $('#contributor-edit-last_name').on('input', {store: contributor, field: "last_name"}, inputChange);
    $('#contributor-edit-email').on('change', {store: contributor, field: "email"}, inputChange);
    $('#contributor-edit-orcid').on('change', {store: contributor, field: "orcid"}, inputChange);
    $('#contributor-edit-affiliations').on('change', {store: contributor, field: "affiliations"}, inputChange);
    $('#contributor-edit-contribtype').on('change', {store: contributor, field: "contributor_type"}, inputChange);

    // ContributingOrg Modal Updates
    $('#contributing-organization-edit-DOE').on('change', {store: contributing_org, field: "DOE"}, checkboxChange);
    $('#contributing-organization-edit-organization_name').on('input', {store: contributing_org, field: "organization_name"}, inputChange);
    $('#contributing-organization-edit-contribtype').on('change', {store: contributing_org, field: "contributor_type"}, inputChange);

    // Related Identifier Modal Updates
    $('#related-identifier-identifier-type').on('change', {store: related_identifier, field: "identifier_type"}, inputChange);
    $('#related-identifier-relation-type').on('change', {store: related_identifier, field: "relation_type"}, inputChange);
    $('#related-identifier-identifier-value').on('input', {store: related_identifier, field: "identifier_value"}, inputChange);

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

    /*File uploads*/
    var dropzone = $("#file-upload-dropzone").dropzone(FILE_UPLOAD_CONFIG);

    // form buttons
    $('#input-save-btn').on('click', save);
    $('#input-announce-btn').on('click', announce);
    $('#input-submit-btn').on('click', submit);
    $('#input-approve-btn').on('click', approve);

    if ($("#page").val() == 'announce')
        $('#input-announce-btn').show();

    if ($("#page").val() == 'submit')
        $('#input-submit-btn').show();

    if ($("#page").val() == 'approve') {
        $('#input-help-anchor').hide();
        $('#input-approve-msg-top').show();
        $('#input-approve-msg-bottom').show();
        $('#input-approve-btn').show();
    }

    // if this is the announce or approve page, we're going to open all of the panels
    if ($('#page').val() == 'announce' || $('#page').val() == 'approve') {
        //$('.panel-collapse:not(".in")').collapse('show');
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
