const DATEPICKER_OPTS = {
    changeMonth: true,
    changeYear: true,
    yearRange: 'c-100:+0'
};

var toggleSearchDropdown = function () {
    var dropdownElement = $(this).next('div.adv-search-dropdown');
    $('#homepage-adv-dropdown-btn').click(function () {
        $(dropdownElement).toggle();
    })

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

    //DOI
    $("#search-doi").val($("#advanced-search-doi").val());

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

    //Project Type
    var project_type_vals = $("#advanced-search-project_type").val();
    if (project_type_vals.length > 0) {
        $("#search-project_type").val(JSON.stringify(project_type_vals));
    }

    //Licenses
    var licenses_vals = $("#advanced-search-licenses").val();
    if (licenses_vals.length > 0) {
        $("#search-licenses").val(JSON.stringify(licenses_vals));
    }

    //Programming Languages
    var programming_languages_vals = $("#advanced-search-programming_languages").val();
    if (programming_languages_vals.length) {
        $("#search-programming_languages").val(programming_languages_vals);
    }

    //Research Organization
    var research_orgs = $("#advanced-search-research_organization").val();
    if (research_orgs.length) {
        $("#search-research_organization").val(JSON.stringify(research_orgs));
    }

    //Sponsoring Organization
    var sponsoring_orgs = $("#advanced-search-sponsoring_organization").val();
    if (sponsoring_orgs.length) {
        $("#search-sponsoring_organization").val(sponsoring_orgs);
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
    var self = this;
    var name_prefix = "#" + $(this).data('idprefix');

    clearSearchFormFields();

    //All fields (if applicable)
    var searchbar_val = ($(self).hasClass('homepage-search-btn')) ? $(self).prev('button').prev('input').val().trim() : $(self).parent().prev('div').find('input[type=text]').val();
    if (searchbar_val) {
        $("#search-all_fields").val(searchbar_val);
    }

    //Software title
    $("#search-software_title").val($(name_prefix + "-software_title").val());

    //Developers/Contributors
    $("#search-developers_contributors").val($(name_prefix + "-developers_contributors").val());

    //DOI
    $("#search-doi").val($(name_prefix + "-doi").val());

    //Identifier Numbers
    $("#search-identifier_numbers").val($(name_prefix + "-identifier_numbers").val());

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

    //Project Type
    var project_type_vals = $("#navbar-searchbar-project_type").val();
    if (project_type_vals.length > 0) {
        $("#search-project_type").val(JSON.stringify(project_type_vals));
    }

    //Licenses
    var licenses_vals = $("#navbar-searchbar-licenses").val();
    if (licenses_vals.length > 0) {
        $("#search-licenses").val(JSON.stringify(licenses_vals));
    }

    //Programming Languages
    var programming_languages_vals = $("#navbar-searchbar-programming_languages").val();
    if (programming_languages_vals) {
        $("#search-programming_languages").val(programming_languages_vals);
    }

    //Research Organization
    var research_orgs = $("#navbar-searchbar-research_organization").val();
    if (research_orgs) {
        $("#search-research_organization").val(research_orgs.trim());
    }

    //Sponsoring Organization
    var sponsoring_orgs = $("#navbar-searchbar-sponsoring_organization").val();
    if (sponsoring_orgs) {
        $("#search-sponsoring_organization").val(sponsoring_orgs.trim());
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
    if ($("#adv-search-toggle-extra-container").is(':visible') || action === ADV_DROPDOWN_CLOSE) { //close
        if (document.getElementById('index-indicator')) {
            $("#outermost-container").css('padding-bottom', '0px');
            $("#outermost-container>.wrapper").css('min-height', 'calc(100vh - 855px)');
            if ($(window).width() < 768 && $(window).width() > 319) {
                $("#outermost-container>.wrapper").css('min-height', 'calc(100vh + 605px)');
            } else if ($(window).width() < 992 && $(window).width() > 767) {
                $("#outermost-container>.wrapper").css('min-height', 'calc(100vh + 205px)');
            } else {
                $("#outermost-container>.wrapper").css('min-height', 'calc(100vh + 5px)');
            }
        }
        $("#adv-search-toggle-extra-container").hide();
        $("#adv-search-toggle-btn-icon").removeClass('fa-minus-square-o');
        $("#adv-search-toggle-btn-icon").addClass('fa-plus-square-o');
        $("#adv-search-toggle-btn-icon-text").html('More Options');
    } else { //open
        if (document.getElementById('index-indicator')) {
            $("#outermost-container>.wrapper").css('min-height', 'calc(100vh - 855px)');
            if ($(window).width() < 768 && $(window).width() > 319) {
                $("#outermost-container>.wrapper").css('min-height', 'calc(100vh + 1040px)');
            } else if ($(window).width() < 992 && $(window).width() > 767) {
                $("#outermost-container>.wrapper").css('min-height', 'calc(100vh + 640px)');
            } else {
                $("#outermost-container>.wrapper").css('min-height', 'calc(100vh + 440px)');
            }
        }
        $("#adv-search-toggle-extra-container").show();
        $("#adv-search-toggle-btn-icon").removeClass('fa-plus-square-o');
        $("#adv-search-toggle-btn-icon").addClass('fa-minus-square-o');
        $("#adv-search-toggle-btn-icon-text").html('Less Options');
    }
};

/*Initialize Everything*/
//Toggles the advanced search button dropdown
$(".adv-search-button").click(toggleSearchDropdown);

//Makes all of the advanced search and search buttons work
$("#adv-search-page-search-btn").on('click', triggerAdvancedSearch);
$(".adv-search-btn-dropdown").on('click', function () {
    $('button.search-btn:visible').trigger('click');
});
$(".search-btn").on('click', triggerDropdownAdvancedSearch);
$(".search-box").on('keyup', function (event) {
    if (event.which === 13) {
        var is_homepage_input = $(this).hasClass('homepage-searchbar');
        if (is_homepage_input) {
            $(this).next('button').next('button').trigger('click');
        } else {
            $(this).parent().next('div').find('button').trigger('click');
        }

    }
});

//Sets up all of the datepickers
$(".doecode-datepicker").datepicker(DATEPICKER_OPTS);

/*Page-specific content*/
if (document.getElementById('search-results-page-identifier')) {
    /*Store the latest search parameters on the search results page*/
    localStorage.latestSearchParams = JSON.stringify($("#search-page-form").serializeArray());
}

/*Makes the logout button work*/
$(".logout-btn").on("click", logout);

/*Clears out the common message modal*/
$("#common-message-dialog").on('hidden.bs.modal', clearCommonModal);

/*Puts all of the correct text into each tooltip*/
$(".tooltip-item").each(function () {
    var related_html = $(this).find('span.tooltip-content').html();
    var hide_val = $(this).data('hidecount') ? parseInt($(this).data('hidecount')) : 1000;
    $(this).tooltip({
        placement: 'top',
        html: true,
        title: related_html,
        delay: {
            'hide': hide_val,
            'show': 100
        }
    });
});

/*Make the signin-btn-containers trigger the anchor tags within them*/
$(".signin-btn-container").on('click', function () {
    window.location.href = $(this).find('a').attr('href');
});

/*Toggles the advanced search button*/
$("#adv-search-toggle-btn").on('click', toggleAdvExtendedDropdown);

//Makes the chosen js inputs work with custom content
$("li.search-field > .chosen-search-input").on('keyup', modifyChosenSelectForCustomEntry);
$("li.search-field > .chosen-search-input").on('keydown', modifyChosenSelectForCustomEntryTabKey);

//Makes the chosen js inputs that only allow one entry with custom content
$("div.chosen-search").on('keyup', 'input.chosen-search-input', modifyChosenSelectForCustomEntrySingle);

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

/*Causes the advanced search to close in the event that you click outside of the advanced search modal*/
var modal_id = (document.getElementById('index-indicator')) ? 'homepage-adv-dropdown-container' : 'advanced-search-dropdown';
$(document).mouseup(function (e) {
    var container = $("#" + modal_id);
    var datepicker_container = $("#ui-datepicker-div");
    var dropdown_button = $(".adv-search-button");
    // Check to see if the item clicked on was in the advanced search, datepicker in the advanced search modal, 
    // or dropdown button (otherwise this code will toggle the dropdown and the button will toggle it again)
    if (!container.is(e.target) && container.has(e.target).length === 0 && !datepicker_container.is(e.target) 
        && $(datepicker_container).has(e.target).length === 0 && !dropdown_button.is(e.target) && dropdown_button.has(e.target).length === 0 ) {
        container.hide();
    }
});