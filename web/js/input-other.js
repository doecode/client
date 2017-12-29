/*Options for loading messages on the account page*/
const LOADING_PROJECTS_OPTS = {title: 'Loading My Projects List', show_loader: true,
    message_type: MESSAGE_TYPE_REGULAR, content: "<br/>Loading my projects",
    contentClasses: ['center-text'], showClose: false};

const LOADER_PROJECTS_ERROR_OPTS = {title: 'Error in Loading My Projects List', show_loader: true,
    message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error in loading my projects",
    contentClasses: ['center-text'], showClose: true};

/*Options for loading messages on the pending page*/
const LOADING_PENDING_PROJECTS_OPTS = {title: 'Loading Pending Projects List', show_loader: true,
    message_type: MESSAGE_TYPE_REGULAR, content: "<br/>Loading Pending Projects",
    contentClasses: ['center-text'], showClose: false};
const LOADING_PENDING_PROJECTS_ERROR_OPTS = {title: 'Error in Loading Pending Projects List', show_loader: true,
    message_type: MESSAGE_TYPE_ERROR, content: "<br/>Error in loading pending projects",
    contentClasses: ['center-text'], showClose: true};

var pending_data_table_opts = {
    order: [[0, 'asc']],
    autoWidth: false,
    responsive: true,
    columns: [
        {name: 'code_id', data: 'code_id', width: '10%', className: 'text-center'},
        {name: 'software_title', data: 'software_title', width: '69%'},
        {name: 'workflow_status', data: 'workflow_status', width: '8%', className: 'text-center', orderable: false},
        {render: function (data, type, row) {
                var software_type_url = getSoftwareTypeLabel(row.software_type);
                return '<a href="/doecode/approve?code_id=' + row.code_id + '&software_type=' + software_type_url
                        + '" class="pure-button pure-button-primary btn-sm white"><span class="fa fa-pencil"></span> View for Approval</a>';
            }, width: '13%', className: 'text-center', orderable: false}
    ]
};

var projects_data_table_opts = {
    order: [[0, 'asc']],
    autoWidth: false,
    responsive: true,
    columns: [
        {name: 'code_id', data: 'code_id', width: '10%', className: 'text-center'},
        {name: 'software_title', data: 'software_title', width: '56%'},
        {name: 'workflow_status', data: 'workflow_status', width: '8%', className: 'text-center'},
        {render: function (data, type, row) {
                var software_type_url = getSoftwareTypeLabel(row.software_type);
                return '<a href="/doecode/submit?code_id=' + row.code_id + '&software_type=' + software_type_url
                        + '" class="pure-button button-success btn-sm white "><span class="fa fa-pencil"></span> Update Metadata</a>';
            }, width: '13%', className: 'text-center', orderable: false},
        {render: function (data, type, row) {
                var software_type_url = getSoftwareTypeLabel(row.software_type);
                return '<a href="/doecode/announce?code_id=' + row.code_id + '&software_type=' + software_type_url
                        + '" class="pure-button pure-button-primary btn-sm white"><span class="fa fa-pencil"></span> Announce to E-Link</a>';
            }, width: '13%', className: 'text-center', orderable: false}
    ]
};

var parseConfirmPageData = function (data) {
    data = data.metadata;
    var availabilities_list = JSON.parse($("#availabilities-list-json").val());
    //Now, go through, grab the values
    var metadata_list = [];

    //Developers
    if (data.developers && data.developers.length > 0) {
        var developer_list_refined = [];
        data.developers.forEach(function (item) {
            developer_list_refined.push(item.first_name + ' ' + item.last_name + ' ' + makeDelimitedList(item.affiliations, ', '));
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
    //Accessibility
    if (data.accessibility) {
        var display_val = "";
        availabilities_list.forEach(function (item) {
            if (data.accessibility === item.value) {
                display_val = item.label;
                return true;
            }
        });
        metadata_list.push({
            title: 'Code Availability',
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
    //Site accession number
    if (data.site_accession_number) {
        metadata_list.push({
            title: 'Site Accession Number',
            content: data.site_accession_number
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
            content: makeDelimitedList(research_org_list, ', ')
        });
    }

    //Contributors
    if (data.contributors && data.contributors.length > 0) {
        var contributor_list_refined = [];
        data.contributors.forEach(function (item) {
            contributor_list_refined.push(item.first_name + ' ' + item.last_name + ' ' + makeDelimitedList(item.affiliations, ', '));
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
            content: makeDelimitedList(contributing_org_list, ', ')
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
                    + item.organization_name
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
            content: data.other_special_requirements
        });
    }
    //Keywords
    if (data.keywords) {
        metadata_list.push({
            title: 'Keywords',
            content: data.keywords
        });
    }

    //Go through, put all of teh things into an html string
    var content_string = "";
    metadata_list.forEach(function (item) {
        content_string += ('<dt class="col-xs-4">' + item.title + '</dt><dd class="col-xs-8">' + item.content + '</dd>');
    });
    $("#confirmation-metadata-container").html(content_string);

    $("#confirmation-metadata-container").show();
};

var makeSponsorOrgExtraInfoRow = function (data) {
    var html = "<div>";

    //Primary Award
    if (data.primary_award && data.primary_award.tostring().toUpperCase() !== 'UNKNOWN') {
        html += "<div class='row'>";
        html + "<div class='col-md-1'></div>";
        html += "<div class='col-md-5 col-xs-12'>Primary Award/Contract Number:</div>";
        html += "<div class='col-md-6 col-xs-12'>" + data.primary_award + "</div>";
        html += "</div>";
    }

    //Award Numbers
    if (data.award_numbers && data.award_numbers.length > 0) {
        html += "<div class='row'>";
        html += "<div class='col-md-1'></div>";
        html += "<div class='col-md-5 col-xs-12'>Other Award/Contract Number:</div>";
        html += "<div class='col-md-6 col-xs-12'>";
        html += makeDelimitedList(data.award_numbers, '<br/>');
        html += "</div>";
        html += "</div>";
    }

    //FWP Numbers
    if (data.fwp_numbers && data.fwp_numbers.length > 0) {
        html += "<div class='row'>";
        html += "<div class='col-md-1'></div>";
        html += "<div class='col-md-3 col-xs-12'>FWP Number:</div>";
        html += "<div class='col-md-8 col-xs-12'>";
        html += makeDelimitedList(data.fwp_numbers, '<br/>');
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

$(document).ready(function () {
    checkIsAuthenticated();
    
    if (document.getElementById('confirmation-page-identifier')) {
        var code_id = $("#code-id").val();
        doAuthenticatedAjax('GET', API_BASE + 'metadata/' + code_id, parseConfirmPageData, null, parseConfirmPageError);
        doAuthenicatedFileDownloadAjax((API_BASE + 'metadata/' + code_id + '?format=yaml'), parseYMLDownloadSuccess, praseYMLDownloadError);

    } else if (document.getElementById('projects-page-identifier')) {
        //Show the modal message for loading projects
        setCommonModalMessage(LOADING_PROJECTS_OPTS);
        showCommonModalMessage();
        $.ajax({
            url: API_BASE + 'metadata/projects',
            cache: false,
            contentType: "application/json; charset=UTF-8",
            method: "GET",
            beforeSend: function beforeSend(request) {
                request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
            },
            success: function (data) {
                var new_data = [];

                data.records.forEach(function (item) {
                    new_data.push({
                        code_id: item.code_id ? item.code_id : '',
                        software_title: item.software_title ? item.software_title : '',
                        workflow_status: item.workflow_status ? item.workflow_status : ''
                    });
                });
                var projects_table = $("#projects-datatable").DataTable(projects_data_table_opts);
                projects_table.rows.add(new_data).draw();
                hideCommonModalMessage();
            },
            error: function () {
                setCommonModalMessage(LOADER_PROJECTS_ERROR_OPTS);
            }
        });
    } else if (document.getElementById('approval-page-identifier')) {
        //LOADING_PENDING_PROJECTS_OPTS
        setCommonModalMessage(LOADING_PENDING_PROJECTS_OPTS);
        showCommonModalMessage();
        $.ajax({
            url: API_BASE + 'metadata/projects/pending',
            cache: false,
            contentType: "application/json",
            method: "GET",
            beforeSend: function beforeSend(request) {
                request.setRequestHeader("X-XSRF-TOKEN", localStorage.xsrfToken);
            },
            success: function (data) {
                var new_data = [];

                data.records.forEach(function (item) {
                    new_data.push({
                        code_id: item.code_id ? item.code_id : '',
                        software_title: item.software_title ? item.software_title : '',
                        workflow_status: item.workflow_status ? item.workflow_status : ''
                    });
                });
                var approval_table = $("#pending-datatable").DataTable(pending_data_table_opts);
                approval_table.rows.add(new_data).draw();
                hideCommonModalMessage();
            },
            error: function () {
                setCommonModalMessage(LOADING_PENDING_PROJECTS_ERROR_OPTS);
            }
        });

    }
});