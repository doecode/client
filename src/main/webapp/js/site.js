const POC_LIST_LOADER_ERROR = {title: 'Error in POC Loading', show_loader: true,
    message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error in loading list of sites with POC's. The list couldn't successfully be loaded",
    contentClasses: ['center-text'], showClose: true};

var clearPOCListTable = function () {
    $("#poc-admin-email-list > tbody > tr:not(:last-child)").remove();
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
        $("#new-site-code").val('');
        $("#new-site-code").hide();
        $("#new-site-code").prev('label').html('');
        $("#new-site-code").prev('label').hide();
        $("#poc-site-list-container").hide();
    } else if (val === ' ') {
        //New Site
        $("#new-site-code").val('');
        $("#new-site-code").show();
        $("#new-site-code").prev('label').html('');
        $("#new-site-code").prev('label').show();
        $("#poc-site-list-container").show();
    } else {
        //Existing Site
        $("#new-site-code").val('');
        $("#new-site-code").hide();
        $("#new-site-code").prev('label').html($(self).val());
        $("#new-site-code").prev('label').show();
        $("#poc-site-list-container").show();
    }

};

/**
 * Triggers when you click on the green plus next to the empty text box at the bottom of the POC list
 */
var addNewPOCToTable = function () {
    
};

/**
 * Triggers when you click on the red X next to an existing email in the POC admin
 */
var removePOCFromTable = function () {

};

/**
 * Saves POC admin changes
 */
var submitPOCChanges = function () {

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

} else if (document.getElementById('site-admin-page-identifier')) {
    checkHasRole('OSTI');
    checkIsAuthenticated();
}