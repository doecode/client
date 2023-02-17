/*Options for loading messages on the account page*/
const LOADING_PROJECTS_OPTS = {title: 'Loading My Projects List', show_loader: true,
    message_type: MESSAGE_TYPE_REGULAR, content: "<br/>Loading your projects, this may take a few minutes to load.",
    contentClasses: ['center-text'], showClose: false};

const LOADER_PROJECTS_ERROR_OPTS = {title: 'Error in Loading My Projects List', show_loader: true,
    message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error loading your projects",
    contentClasses: ['center-text'], showClose: true};

/*Options for loading messages on the pending page*/
const LOADING_PENDING_PROJECTS_OPTS = {title: 'Loading Pending Projects List', show_loader: true,
    message_type: MESSAGE_TYPE_REGULAR, content: "<br/>Loading Pending Projects",
    contentClasses: ['center-text'], showClose: false};
const LOADING_PENDING_PROJECTS_ERROR_OPTS = {title: 'Error in Loading Pending Projects List', show_loader: true,
    message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error in loading pending projects",
    contentClasses: ['center-text'], showClose: true};

var pending_data_table_opts = {
    order: [[2, 'asc']],
    autoWidth: false,
    responsive: true,
    columns: [
        {name: 'code_id', data: 'code_id', width: '88px', className: 'text-center'},
        {name: 'software_title', data: 'software_title'},
        {name: 'date_record_updated', data: null, render: {
            "_": "date_record_updated",
            "filter": "date_record_updated_display",
            "display": "date_record_updated_display"
            }, width: '88px', orderData: [2,0], className: 'text-center'},
        {name: 'workflow_status', data: 'workflow_status', width: '88px', className: 'text-center'},
        {render: function (data, type, row) {
                return '<a href="/' + APP_NAME + '/approve?code_id=' + row.code_id
                        + '" class="pure-button pure-button-primary btn-sm white"><span class="fas fa-pencil-alt"></span> View for Approval</a>';
            }, width: '13%', className: 'text-center', orderable: false}
    ]
};

var projects_data_table_opts = {
    order: [[0, 'asc']],
    autoWidth: false,
    responsive: true,
    columns: [
        {name: 'code_id', data: 'code_id', width: '88px', className: 'text-center'},
        {name: 'software_title', data: 'software_title'},
        {render: function (data, type, row) {
                return '<a href="/' + APP_NAME + '/' + row.edit_endpoint + '?code_id=' + row.code_id
                        + '" class="pure-button button-success btn-sm white " title="Update Metadata for ' + row.code_id + '">Update Metadata</a>';

            }, width: '105px', className: 'text-center datatable-vertical-center', orderable: false},
        {name: 'workflow_status', data: 'workflow_status', width: '115px', className: 'text-center datatable-vertical-center'},
        {name: 'system_status', data: 'system_status', width: '115px', className: 'text-center datatable-vertical-center', orderable: false},
        {render: function (data, type, row) {
                var btn_markup = '';
                if (row.workflow_status && row.workflow_status_value != 'Saved' && row.doi) {
                    btn_markup = '<a href="/' + APP_NAME + '/' + row.new_endpoint + '?load_id=' + row.code_id + '&software_type=' + row.software_type + '&version_type=New'
                            + '" class="pure-button button-new-version btn-sm white " title="New Version of ' + row.code_id + '">New</a>&nbsp;&nbsp;'
                            + '<a href="/' + APP_NAME + '/' + row.new_endpoint + '?load_id=' + row.code_id + '&software_type=' + row.software_type + '&version_type=Prev'
                            + '" class="pure-button button-new-version btn-sm white " title="Previous Version of ' + row.code_id + '">Prev</a>';
                }
                return btn_markup;

            }, width: '125px', className: 'text-center datatable-vertical-center', orderable: false}
    ]
};

var htmlEncode = function(input) {
    const textArea = document.createElement('textarea');
    textArea.innerText = input;
    return textArea.innerHTML;
}

var htmlEncodeList = function(list) {
    return list.map(x => htmlEncode(x));
}

var parseConfirmPageData = function (data) {
    data = data.metadata;
    var availabilities_list = JSON.parse($("#availabilities-list-json").val());
    //Now, go through, grab the values
    var metadata_list = [];

    //Title
    if (data.software_title) {
        metadata_list.push({
            title: 'Software Title',
            content: htmlEncode(data.software_title)
        });
    }

    //Developers
    if (data.developers && data.developers.length > 0) {
        var developer_list_refined = [];
        data.developers.forEach(function (item) {
            developer_list_refined.push(htmlEncode(item.first_name) + ' ' + htmlEncode(item.last_name) + ' ' + makeDelimitedList(htmlEncodeList(item.affiliations), ', '));
        });
        var developer_list_string = makeDelimitedList(developer_list_refined, '<br/>');
        metadata_list.push({
            title: 'Developers',
            content: developer_list_string
        });
    }
    //Release Date
    if (data.release_date) {
        metadata_list.push({
            title: 'Release Date',
            content: moment(data.release_date, BACK_END_DATE_FORMAT).format(FRONT_END_DATE_FORMAT)
        });
    }
    //Project Type
    if (data.project_type) {
        var display_val = "";
        availabilities_list.forEach(function (item) {
            if (data.project_type === item.value) {
                display_val = item.label;
                return true;
            }
        });
        metadata_list.push({
            title: 'Project Type',
            content: display_val
        });
    }

    //Licenses
    if (data.licenses && data.licenses.length > 0) {
        var licenses_list = makeDelimitedList(data.licenses, ', ');
        metadata_list.push({
            title: 'Licenses',
            content: licenses_list
        });
    }

    //Access Limitations
    if (data.access_limitations && data.access_limitations.length > 0) {
        var access_limitations_list = makeDelimitedList(data.access_limitations, ', ');
        metadata_list.push({
            title: 'Access Limitations',
            content: access_limitations_list
        });
    }

    //Protections
    if (data.protections && data.protections.length > 0) {
        var protections_list = makeDelimitedList(data.protections, ', ');
        metadata_list.push({
            title: 'Protections',
            content: protections_list
        });
    }

    //Site accession number
    if (data.site_accession_number) {
        metadata_list.push({
            title: 'Site Accession Number',
            content: htmlEncode(data.site_accession_number)
        });
    }
    //Research Orgs
    if (data.research_organizations && data.research_organizations.length > 0) {
        var research_org_list = [];
        data.research_organizations.forEach(function (item) {
            research_org_list.push(item.organization_name);
        });
        metadata_list.push({
            title: 'Research Organizations',
            content: makeDelimitedList(htmlEncodeList(research_org_list), ', ')
        });
    }

    //Contributors
    if (data.contributors && data.contributors.length > 0) {
        var contributor_list_refined = [];
        data.contributors.forEach(function (item) {
            contributor_list_refined.push(htmlEncode(item.first_name) + ' ' + htmlEncode(item.last_name) + ' ' + makeDelimitedList(htmlEncodeList(item.affiliations), ', '));
        });
        var contributor_list_string = makeDelimitedList(contributor_list_refined, '<br/>');
        metadata_list.push({
            title: 'Contributors',
            content: contributor_list_string
        });
    }
    //Contributing Organizations
    if (data.contributing_organizations && data.contributing_organizations.length > 0) {
        var contributing_org_list = [];
        data.contributing_organizations.forEach(function (item) {
            contributing_org_list.push(item.organization_name);
        });
        metadata_list.push({
            title: 'Contributing Organizations',
            content: makeDelimitedList(htmlEncodeList(contributing_org_list), ', ')
        });
    }

    //Sponsoring Organization
    if (data.sponsoring_organizations && data.sponsoring_organizations.length > 0) {
        var sponsoring_org_items_list = [];
        data.sponsoring_organizations.forEach(function (item) {
            //Get all of the primary award and other related content
            var sponsor_extra_info = makeSponsorOrgExtraInfoRow(data.sponsoring_organizations);
            sponsoring_org_items_list.push('<div class="row">'
                    + '<div class="col-md-6 col-xs-12">'
                    + htmlEncode(item.organization_name)
                    + '</div>'
                    + '<div class="col-md-6 col-xs-12">'
                    + sponsor_extra_info
                    + '</div>'
                    + '</div>');
        });
        metadata_list.push({
            title: 'Sponsoring Organizations',
            content: makeDelimitedList(sponsoring_org_items_list, '')
        });
    }
    //Country of Origin
    if (data.country_of_origin) {
        metadata_list.push({
            title: 'Country of Origin',
            content: data.country_of_origin
        });
    }
    //Other Special Requirements
    if (data.other_special_requirements) {
        metadata_list.push({
            title: 'Other Special Requirements',
            content: htmlEncode(data.other_special_requirements)
        });
    }
    //Keywords
    if (data.keywords) {
        metadata_list.push({
            title: 'Keywords',
            content: htmlEncode(data.keywords)
        });
    }
    //Landing Page
    if (data.landing_page) {
        metadata_list.push({
            title: 'Landing Page',
            content: '<a target="_blank" href="' + data.landing_page + '">' + data.landing_page + '</a>'
        });
    }
    //Repository URL
    if (data.repository_link) {
        metadata_list.push({
            title: 'Repository URL',
            content: '<a target="_blank" href="' + data.repository_link + '">' + data.repository_link + '</a>'
        });
    }

    //Go through, put all of the things into an html string
    var content_string = "";
    metadata_list.forEach(function (item) {
        content_string += ('<tr><td>' + item.title + '</td><td>' + item.content + '</td></tr>');
    });
    $("#confirmation-metadata-container > tbody").html(content_string);

    $("#confirmation-metadata-container").show();
};

var makeSponsorOrgExtraInfoRow = function (data) {
    var html = "<div>";

    //Primary Award
    if (data.primary_award && data.primary_award.tostring().toUpperCase() !== 'UNKNOWN') {
        html += "<div class='row'>";
        html + "<div class='col-md-1'></div>";
        html += "<div class='col-md-5 col-xs-12'>Primary Award/Contract Number:</div>";
        html += "<div class='col-md-6 col-xs-12'>" + htmlEncode(data.primary_award) + "</div>";
        html += "</div>";
    }

    //Award Numbers
    if (data.award_numbers && data.award_numbers.length > 0) {
        html += "<div class='row'>";
        html += "<div class='col-md-1'></div>";
        html += "<div class='col-md-5 col-xs-12'>Other Award/Contract Number:</div>";
        html += "<div class='col-md-6 col-xs-12'>";
        html += makeDelimitedList(htmlEncodeList(data.award_numbers), '<br/>');
        html += "</div>";
        html += "</div>";
    }

    //FWP Numbers
    if (data.fwp_numbers && data.fwp_numbers.length > 0) {
        html += "<div class='row'>";
        html += "<div class='col-md-1'></div>";
        html += "<div class='col-md-3 col-xs-12'>FWP Number:</div>";
        html += "<div class='col-md-8 col-xs-12'>";
        html += makeDelimitedList(htmlEncodeList(data.fwp_numbers), '<br/>');
        html += "</div>";
        html += "</div>";
    }

    //BR Codes
    if (data.br_codes && data.br_codes.length > 0) {
        html += "<div class='row'>";
        html += "<div class='col-md-1'></div>";
        html += "<div class='col-md-3 col-xs-12'>B&amp;R Codes:</div>";
        html += "<div class='col-md-8 col-xs-12'>";
        html += makeDelimitedList(data.br_codes, '<br/>');
        html += "</div>";
        html += "</div>";
    }

    html += "</div>";
    return html;
};

var parseConfirmPageError = function () {
    $("#confirm-error-message").html('An error has occurred in loading your data');
};
var parseYMLDownloadSuccess = function (data) {
    $("#yml-anchor").attr('href', 'data:text/yaml;charset=utf-8,' + encodeURIComponent(data));
    $("#yml-anchor").attr('download', 'metadata-' + $("#code-id").val() + '.yml');
    $("#download-yml-container").show();
};
var praseYMLDownloadError = function (xhr) {
    $("#yml-anchor").attr('href', 'data:text/yaml;charset=utf-8,' + encodeURIComponent(xhr.responseText));
    $("#yml-anchor").attr('download', 'metadata-' + $("#code-id").val() + '.yml');
    $("#download-yml-container").show();
};
var goToPage = function (event) {
    window.location.href = event.data.page;
};

var parseProjectsPageData = function (data) {
    var new_data = [];

    data.records.forEach(function (item) {
        // format Status value
        var current_status = item.workflow_status ? item.workflow_status : '';
        var workflow_status = current_status;
        var is_limited = !item.access_limitations.includes("UNL");

        if (current_status == 'Approved' && item.approved_as)
            workflow_status = item.approved_as;
        else if (current_status != 'Approved')
            workflow_status = workflow_status;

        if (workflow_status == 'Submitted')
            workflow_status = 'Submission';
        else if (workflow_status == 'Announced')
            workflow_status = 'Announcement';

        if (current_status == 'Saved')
            workflow_status = '<span class="datatable-blue-status">' + workflow_status.toUpperCase() + '</span>';
        else if (current_status == 'Approved' && item.approved_as)
            workflow_status = '<span class="datatable-green-status">APPROVED</span><br><span class="">' + workflow_status + '</span>';
        else if (current_status != 'Approved')
            workflow_status = '<span class="datatable-red-status">PENDING APPROVAL</span><br><span class="">' + workflow_status + '</span>';
        else
            workflow_status = '<span class="datatable-green-status">' + workflow_status.toUpperCase() + '</span>';


        // format Availability value
        var system_status = '';
        if (item.system_status) {
            system_status = '<span class="datatable-altered-text">' + item.system_status + ' to:</span>';
            if (!is_limited)
                system_status += '<br>DOE CODE';
            if (item.system_status == 'Announced')
                system_status += '<br>' + (is_limited ? 'SRC' : 'OSTI.GOV');
        }

        // Software Type
        var software_type = item.software_type;
        switch (software_type) {
            case 'B':
                software_type = 'Business';
                break;
            case 'S':
                software_type = 'Scientific';
                break;
        }

        new_data.push({
            code_id: item.code_id ? item.code_id : '',
            software_title: item.software_title ? item.software_title.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '',
            workflow_status: workflow_status,
            workflow_status_value: item.workflow_status,
            system_status: system_status,
            software_type: software_type,
            edit_endpoint: (item.system_status == 'Announced' || item.workflow_status == 'Announced' || is_limited) ? 'announce' : 'submit',
            new_endpoint: is_limited ? 'announce' : 'submit',
            doi: item.doi
        });
    });
    var projects_table = $("#projects-datatable").DataTable(projects_data_table_opts);
    projects_table.rows.add(new_data).draw();
    hideCommonModalMessage();
};

var parseProjectsPageError = function () {
    setCommonModalMessage(LOADER_PROJECTS_ERROR_OPTS);
};

var parseApprovalPageData = function (data) {
    var new_data = [];

    data.records.forEach(function (item) {
        var workflow_status = item.workflow_status ? item.workflow_status : '';
        if (workflow_status == 'Announced') {
            workflow_status = '<span class="datatable-blue-status">' + workflow_status + '</span>';
        }
        new_data.push({
            code_id: item.code_id ? item.code_id : '',
            software_title: item.software_title ? item.software_title.replace(/</g, "&lt;").replace(/>/g, "&gt;") : '',
            date_record_updated: item.date_record_updated ? item.date_record_updated : '',
            date_record_updated_display: item.date_record_updated ? moment(item.date_record_updated, BACK_END_DATE_FORMAT).format(FRONT_END_DATE_FORMAT) : '',            
            workflow_status: workflow_status
        });
    });
    var approval_table = $("#pending-datatable").DataTable(pending_data_table_opts);
    approval_table.rows.add(new_data).draw();
    hideCommonModalMessage();
};

var parseApprovalPageError = function () {
    setCommonModalMessage(LOADING_PENDING_PROJECTS_ERROR_OPTS);
};

//Content to be ran at the beginning of the page
checkIsAuthenticated();
if (document.getElementById('confirmation-page-identifier')) {
    var code_id = $("#code-id").val();
    doAuthenticatedAjax('GET', API_BASE + 'metadata/' + code_id, parseConfirmPageData, null, parseConfirmPageError);
    doAuthenicatedFileDownloadAjax((API_BASE + 'metadata/' + code_id + '?format=yaml'), parseYMLDownloadSuccess, praseYMLDownloadError);

} else if (document.getElementById('projects-page-identifier')) {
    //Show the modal message for loading projects
    setCommonModalMessage(LOADING_PROJECTS_OPTS);
    showCommonModalMessage();
    doAuthenticatedAjax('GET', API_BASE + 'metadata/projects', parseProjectsPageData, null, parseProjectsPageError);

} else if (document.getElementById('approval-page-identifier')) {
    checkIsAuthenticated();
    //LOADING_PENDING_PROJECTS_OPTS
    setCommonModalMessage(LOADING_PENDING_PROJECTS_OPTS);
    showCommonModalMessage();
    doAuthenticatedAjax('GET', API_BASE + 'metadata/projects/pending', parseApprovalPageData, null, parseApprovalPageError);

}
