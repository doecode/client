const DATEPICKER_OPTS = {
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-100:+0'
};

var toggleSearchDropdown = function () {
    var dropdownElement = $(this).next('div.adv-search-dropdown');

    if ($(dropdownElement).is(':visible')) {
        if ($("#adv-search-toggle-extra-container").is(':visible')) {
            $("#adv-search-toggle-btn").trigger('click');
        }
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

    //Programming Languages
    var programming_languages_vals = $("#advanced-search-programming_languages").val();
    if (programming_languages_vals.length > 0) {
        $("#search-programming_languages").val(JSON.stringify(programming_languages_vals));
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

    //Software Type
    var software_types = $("#advanced-search-software_type").val();
    if (software_types.length > 0) {
        $("#search-software_type").val(JSON.stringify(software_types));
    }

    //Sort
    $("#search-sort").val($("#advanced-search-sort").val());

    $("#search-page-form").attr('action', '/' + APP_NAME + '/results?page=1');
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

    //Code Accessibility
    var accessibility_vals = $("#navbar-searchbar-accessibility").val();
    if (accessibility_vals.length > 0) {
        $("#search-accessibility").val(JSON.stringify(accessibility_vals));
    }

    //Licenses
    var licenses_vals = $("#navbar-searchbar-licenses").val();
    if (licenses_vals.length > 0) {
        $("#search-licenses").val(JSON.stringify(licenses_vals));
    }

    //Programming Languages
    var programming_languages_vals = $("#navbar-searchbar-programming_languages").val();
    if (programming_languages_vals.length > 0) {
        $("#search-programming_languages").val(JSON.stringify(programming_languages_vals));
    }

    //Research Organization
    var research_orgs = $("#navbar-searchbar-research_organization").val();
    if (research_orgs.length > 0) {
        $("#search-research_organization").val(JSON.stringify(research_orgs));
    }

    //Sponsoring Organization
    var sponsoring_orgs = $("#navbar-searchbar-sponsoring_organization").val();
    if (sponsoring_orgs.length > 0) {
        $("#search-sponsoring_organization").val(JSON.stringify(sponsoring_orgs));
    }

    //Software Type
    var software_types = $("#navbar-searchbar-software_type").val();
    if (software_types.length > 0) {
        $("#search-software_type").val(JSON.stringify(software_types));
    }

    //Sort
    $("#search-sort").val($("#navbar-searchbar-sort").val());

    $("#search-page-form").attr('action', '/' + APP_NAME + '/results?page=1');
    $("#search-page-form").submit();
};

var triggerBasicSearch = function () {
    clearSearchFormFields();
    $("#search-all_fields").val($(this).parent().prev('div').find('input[type=text]').val());
    $("#search-page-form").attr('action', '/' + APP_NAME + '/results?page=1');
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
        window.location.href = '/' + APP_NAME + '/logout';
    }, 'json');
};

//Toggles the advanced search extended dropdown
var toggleAdvExtendedDropdown = function (action) {
    if ($("#adv-search-toggle-extra-container").is(':visible') || action === ADV_DROPDOWN_CLOSE) {//close
        if (document.getElementById('homepage-indicator')) {
            $("#outtermost-homepage-style").css('padding-bottom', '0px');
        }
        $("#adv-search-toggle-extra-container").hide();
        $("#adv-search-toggle-btn-icon").removeClass('fa-minus-square-o');
        $("#adv-search-toggle-btn-icon").addClass('fa-plus-square-o');
        $("#adv-search-toggle-btn-icon-text").html('More Options');
    } else {//open
        if (document.getElementById('homepage-indicator')) {
            $("#outtermost-homepage-style").css('padding-bottom', '200px');
        }
        $("#adv-search-toggle-extra-container").show();
        $("#adv-search-toggle-btn-icon").removeClass('fa-plus-square-o');
        $("#adv-search-toggle-btn-icon").addClass('fa-minus-square-o');
        $("#adv-search-toggle-btn-icon-text").html('Less Options');
    }
};

/*Initialize Everything*/
//Toggles the advanced search button dropdown
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
    window.location.href = $(this).find('a').attr('href');
});

/*Toggles the advanced search button*/
$("#adv-search-toggle-btn").on('click', toggleAdvExtendedDropdown);

/*If we have content in the advanced search, let's populate the advanced search dropdown with it*/
if (isValidJSON(localStorage.latestSearchParams) && Array.isArray(JSON.parse(localStorage.latestSearchParams))) {
    populateAdvancedSearchForm("navbar-searchbar-");
}

//Makes the chosen js inputs work with custom content
$(".chosen-search-input").on('keyup', modifyChosenSelectForCustomEntry);
$(".chosen-search-input").on('keydown', modifyChosenSelectForCustomEntryTabKey);

var clearOutMicrosoftCharacters = function (value) {
    // smart single quotes and apostrophe
    value = value.replace(/[\u2018\u2019\u201A]/g, "'");
    // smart double quotes
    value = value.replace(/[\u201C\u201D\u201E]/g, '"');
    // ellipsis
    value = value.replace(/\u2026/g, "...");
    // dashes
    value = value.replace(/[\u2013\u2014]/g, "-");

    return value;
};

$("input[type=text],textarea").on('blur', function () {
    $(this).val(clearOutMicrosoftCharacters($(this).val()));
});