const DATEPICKER_OPTS = {
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-100:+0'
};

var toggleSearchDropdown = function () {
    var dropdownElement = $(this).next('div.adv-search-dropdown');

    if ($(dropdownElement).is(':visible')) {
        $(dropdownElement).hide();
    } else {
        $(dropdownElement).show();
    }
};


var triggerAdvancedSearch = function () {
    clearSearchFormFields();

    //All Fields
    $("#search-all_fields").val($("#advanced-search-all_fields").val());

    //Software title
    $("#search-software_title").val($("#advanced-search-software_title").val());

    //Developers/Contributors
    $("#search-developers_contributors").val($("#advanced-search-developers_contributors").val());

    //Identifier Numbers
    $("#search-identifiers").val($("#advanced-search-identifier_numbers").val());

    //Release Date Start 
    var date_earliest = $("#advanced-search-date_earliest").val();
    if (date_earliest) {
        $("#search-date_earliest").val(moment(date_earliest, FRONT_END_DATE_FORMAT).format(BACK_END_DATE_FORMAT) + "T05:00:01.000Z");
    }
    //Release Date End
    var date_latest = $("#advanced-search-date_latest").val();
    if (date_latest) {
        $("#search-date_latest").val(moment(date_latest, FRONT_END_DATE_FORMAT).format(BACK_END_DATE_FORMAT) + "T23:59:59.001Z");
    }

    //Code Accessibility
    var accessibility_vals = $("#advanced-search-accessibility").val();
    if (accessibility_vals.length > 0) {
        $("#search-accessibility").val(JSON.stringify(accessibility_vals));
    }

    //Licenses
    var licenses_vals = $("#advanced-search-licenses").val();
    if (licenses_vals.length > 0) {
        $("#search-licenses").val(JSON.stringify(licenses_vals));
    }

    //Research Organization
    var research_orgs = $("#advanced-search-research_organization").val();
    if (research_orgs.length > 0) {
        $("#search-research_organization").val(JSON.stringify(research_orgs));
    }

    //Sponsoring Organization
    var sponsoring_orgs = $("#advanced-search-sponsoring_organization").val();
    if (sponsoring_orgs.length > 0) {
        $("#search-sponsoring_organization").val(JSON.stringify(sponsoring_orgs));
    }

    //Sort
    $("#search-sort").val($("#advanced-search-sort").val());

    $("#search-page-form").attr('action', '/doecode/results?page=1');
    $("#search-page-form").submit();
};

var triggerDropdownAdvancedSearch = function () {
    var name_prefix = "#" + $(this).data('idprefix');
    clearSearchFormFields();
    //Software title
    $("#search-software_title").val($(name_prefix + "-software_title").val());

    //Developers/Contributors
    $("#search-developers_contributors").val($(name_prefix + "-developers_contributors").val());

    //Identifier Numbers
    $("#search-identifiers").val($(name_prefix + "-identifier_numbers").val());

    //Release Date Start 
    var date_earliest = $(name_prefix + "-date_earliest").val();
    if (date_earliest) {
        $("#search-date_earliest").val(moment(date_earliest, FRONT_END_DATE_FORMAT).format(BACK_END_DATE_FORMAT) + "T05:00:01.000Z");
    }
    //Release Date End
    var date_latest = $(name_prefix + "-date_latest").val();
    if (date_latest) {
        $("#search-date_latest").val(moment(date_latest, FRONT_END_DATE_FORMAT).format(BACK_END_DATE_FORMAT) + "T23:59:59.001Z");
    }

    $("#search-page-form").attr('action', '/doecode/results?page=1');
    $("#search-page-form").submit();
};

var triggerBasicSearch = function () {
    clearSearchFormFields();
    $("#search-all_fields").val($(this).parent().prev('div').find('input[type=text]').val());
    $("#search-page-form").attr('action', '/doecode/results?page=1');
    $("#search-page-form").submit();
};

var clearSearchFormFields = function () {
    $("#search-sort").val('score desc');
    $("#search-start").val(0);
    $("#search-rows").val(10);
    $(".search-form-input").each(function () {
        if ($(this).data('dtype')) {
            var datatype = $(this).data('dtype');
            switch (datatype) {
                case 'array':
                    $(this).val('[]');
                    break;
                default:
                    $(this).val('');
                    break;
            }
        }
    });
};

var logout = function () {
    $.get(API_BASE + 'user/logout', function (data) {
        clearLoginLocalstorage();
        window.location.href = '/doecode/logout';
    }, 'json');
};

$(document).ready(function () {
    //Toggles teh advanced search button dropdown
    $(".adv-search-button").on('click', toggleSearchDropdown);

    //Makes all of the advanced search and search buttons work
    $("#adv-search-page-search-btn").on('click', triggerAdvancedSearch);
    $(".adv-search-btn-dropdown").on('click', triggerDropdownAdvancedSearch);
    $(".search-btn").on('click', triggerBasicSearch);
    $(".search-box").on('keyup', function (event) {
        if (event.which === 13) {
            $(this).parent().next('div').find('button').trigger('click');
        }
    });

    //Sets up all of the datepickers
    $(".doecode-datepicker").datepicker(DATEPICKER_OPTS);

    /*Page-specific content*/
    if (document.getElementById('search-results-page-identifier')) {
        /*Store the latest search parameters on the search results page*/
        localStorage.latestSearchParams = JSON.stringify($("#search-page-form").serializeArray());

    } else {
        /*Clear out the latest search params*/
        localStorage.latestSearchParams = JSON.stringify({});
    }

    /*Makes the logout button work*/
    $(".logout-btn").on("click", logout);

    /*Clears out the common message modal*/
    $("#common-message-dialog").on('hidden.bs.modal', clearCommonModal);

    /*Puts all of the correct text into each tooltip*/
    $(".tooltip-item").each(function () {
        var related_html = $(this).find('span.tooltip-content').html();
        var hide_val = $(this).data('hidecount') ? parseInt($(this).data('hidecount')) : 1000;
        $(this).tooltip({placement: 'top',
            html: true,
            title: related_html,
            delay: {'hide': hide_val,
                'show': 100}
        });
    });

    /*Make the signin-btn-containers trigger the anchor tags within them*/
    $(".signin-btn-container").on('click', function () {
        window.location.href=$(this).find('a').attr('href');
    });
});