const ABOUT_IMG_URLS = [
    '/' + APP_NAME + '/images/about/DOEcodeFeatures_main710px-min.png',
    '/' + APP_NAME + '/images/about/DOEcodeFeatures_doi710px-min.png',
    '/' + APP_NAME + '/images/about/DOEcodeFeatures_Repository710px-min.png',
    '/' + APP_NAME + '/images/about/DOEcodeFeatures_Catalog710px-min.png',
    '/' + APP_NAME + '/images/about/DOEcodeFeatures_Policy710px-min.png',
    '/' + APP_NAME + '/images/about/DOEcodeFeatures_GitHub710px-min.png',
    '/' + APP_NAME + '/images/about/DOEcodeFeatures_SocialCode710px-min.png',
    '/' + APP_NAME + '/images/about/DOEcodeFeatures_Easy710px-min.png'
];

const ABOUT_TOP_URLS = [
    '/' + APP_NAME + '/images/about/Discover-min.png', '/' + APP_NAME + '/images/about/Discover_hover-min.png',
    '/' + APP_NAME + '/images/about/Create-min.png', '/' + APP_NAME + '/images/about/Create_hover-min.png',
    '/' + APP_NAME + '/images/about/Submit-min.png', '/' + APP_NAME + '/images/about/Submit_hover-min.png'
];

/*Handles the 3 images on the top of the about page*/
var handleAboutTopMouseEnter = function () {
    var dataHover = $(this).data('hover');
    $(this).attr('src', ABOUT_TOP_URLS[parseInt(dataHover)]);
};

/*Turns about page image back to normal when you are no longer hovering over*/
var handleAboutTopMouseLeave = function () {
    var dataNoHover = $(this).data('nohover');
    $(this).attr('src', ABOUT_TOP_URLS[parseInt(dataNoHover)]);
};

/*Handles the silly image in the center of the about page*/
var handleAboutMouseEnter = function () {
    var dataHover = $(this).data('hover');
    $("#about-doecode-features").attr('src', ABOUT_IMG_URLS[parseInt(dataHover)]);
};

/*Turns about page image back to normal when you are no longer hovering over*/
var handleAboutMouseLeave = function () {
    $("#about-doecode-features").attr('src', ABOUT_IMG_URLS[0]);
};

/*Closes and Opens the more/less with the descriptions on the search results page*/
var toggleDescriptionMoreLess = function () {
    //If visible, hide
    if ($(this).prev('span.description-pt2-container').is(':visible')) {
        $(this).prev('span.description-pt2-container').hide();
        $(this).attr('title', 'More');
        $(this).html('More&gt;&gt;');

    } else { //else hidden, show
        $(this).prev('span.description-pt2-container').show();
        $(this).attr('title', 'Less');
        $(this).html('&lt;&lt;Less');
    }
};

/*Triggers the search by the name of the author clicked*/
var authorSearchDropdownName = function () {
    clearSearchFormFields();
    $("#search-developers_contributors").val("\"" + $(this).data('authorname') + "\"");
    $("#search-page-form").attr('action', '/' + APP_NAME + '/results?page=1');
    $("#search-page-form").submit();
};

/*Triggers the search by the name of the orcid clicked*/
var authorSearchDropdownORCID = function () {
    var orcid = $(this).data('orcid');

    clearSearchFormFields();
    $("#search-orcid").val(orcid);
    $("#search-page-form").attr('action', '/' + APP_NAME + '/results?page=1');
    $("#search-page-form").submit();

};

/*Opens and closes the affiliations collapse on the biblio page*/
var toggleAffiliationCollapse = function () {
    if ($(this).next('div.toggle-affiliations-collapse').hasClass('in')) { //If is open, close
        $(this).next('div.toggle-affiliations-collapse').removeClass('in');
        $(this).html('<span class="fa fa-plus-square-o"></span>&nbsp;Show Developer Affiliations');
        $(this).attr('title', 'Show Author Affiliations');
    } else { //If is closed, open
        $(this).next('div.toggle-affiliations-collapse').addClass('in');
        $(this).html('<span class="fa fa-minus-square-o"></span>&nbsp;Hide Developer Affiliations');
        $(this).attr('title', 'Hide Author Affiliations');
    }
};

/*Makes the search page pagination buttons work*/
var searchPagePaginate = function () {
    var direction = $(this).data('direction');
    if (direction === 'prev') {
        var new_start = parseInt($("#search-start").val()) - parseInt($("#search-rows").val());
        var new_page = parseInt($("#search-pageNum").val()) - 1;
        submitSearchFormDirection(new_start, new_page);

    } else if (direction === 'next') {
        var new_start = (parseInt($("#search-start").val()) + parseInt($("#search-rows").val()));
        var new_page = parseInt($("#search-pageNum").val()) + 1;
        submitSearchFormDirection(new_start, new_page);
    }
};

/*Sends your search to the page currently selected on your paginator*/
var triggerPaginationGoSearch = function () {
    var page_going_to = parseInt($(this).parent().parent().find('td:first-child > input[type=range]').val());
    var rows = parseInt($("#search-rows").val());
    var new_start = (rows * page_going_to) - rows;

    submitSearchFormDirection(new_start, page_going_to);
};

/*Manipulates the search form, and sends it forwards or backwards*/
var submitSearchFormDirection = function (new_start, new_page) {
    $("#search-start").val(new_start);
    $("#search-page-form").attr('action', '/' + APP_NAME + '/results?page=' + new_page);
    $("#search-page-form").submit();
};

/*SHows and hides the pagination dropdown*/
var togglePaginationDropdown = function () {
    if ($(this).next().next('div.pagination-dropdown').is(':visible')) {
        $(this).next().next('div.pagination-dropdown').hide();
    } else {
        $(this).next().next('div.pagination-dropdown').show();
    }
};

/*Updates the current page value on the pagination slider*/
var updatePaginationSliderValues = function () {
    $(this).parent().parent().parent().parent().parent().parent().find('div.pagination-go > label > span.pagination-min-pages').html($(this).val());
};

var updateSearchSort = function () {
    $("#search-sort").val($(this).data('sortval'));
    restartSearchToFirstpage();
};

var addSearchCheckboxToSearch = function () {
    var name = $(this).attr('name');
    var value = $(this).val();
    var isChecked = $(this).is(':checked');

    var current_value = isValidJSON($("#search-" + name).val()) ? JSON.parse($("#search-" + name).val()) : [];
    var new_value = [];
    if (isChecked) { //Meaning, we want to add it
        current_value.push(value);
        new_value = current_value;
    } else { //Meaning we want to remove it
        current_value.forEach(function (item) {
            if (item !== value) {
                new_value.push(item);
            }
        });
    }

    $("#search-" + name).val(JSON.stringify(new_value));
    restartSearchToFirstpage();
};

var restartSearchToFirstpage = function () {
    $("#search-start").val(0);
    $("#search-page-form").attr('action', '/' + APP_NAME + '/results?page=1');
    $("#search-page-form").submit();
};

var goBackToSearch = function () {
    //If the previous was the search page, we'll go there. Otherwise, we'll just take them to a blank search
    var previous_page = document.referrer;
    var current_page = window.location.href.toString();
    var environment = current_page.substring(0, current_page.indexOf('/biblio'));

    if (previous_page.indexOf(environment + "/results") == 0) { //If the previous page was a search page, go there
        window.history.back();
    } else { //If the previous page wasn't a search page, just go back to the search
        window.location.href = '/' + APP_NAME + '/results?page=1';
    }
};

var removeSearchResultDescriptionItem = function () {
    var is_array = $(this).data('isarray') == true;
    var field = $(this).data('field');

    if (is_array) {
        var current_val = JSON.parse($("#search-" + field).val());
        var valueToRemove = $(this).data('origvalue');
        var new_arr = [];
        current_val.forEach(function (item) {
            if (item != valueToRemove) {
                new_arr.push(item);
            }
        });

        $("#search-" + field).val(JSON.stringify(new_arr));
    } else {
        $("#search-" + field).val('');
    }

    restartSearchToFirstpage();
};

var modify_search = function () {
    var width = $(document).width();
    if (width < 768) {
        localStorage.isRefinedSearch = "true";
        window.location.href = '/' + APP_NAME + '/search';
    } else {
        if (!$("#advanced-search-dropdown").is(':visible')) {
            $("#advanced-search-dropdown-btn").trigger('click');
        }
        toggleAdvExtendedDropdown(ADV_DROPDOWN_OPEN);
    }
};

var setUpDateSlider = function () {
    google.charts.load('current', {
        packages: ['table', 'controls']
    });
    google.charts.setOnLoadCallback(drawVisualization);

    function drawVisualization() {
        var style = 'stroke-color: #337ab7; stroke-opacity: 0.6; stroke-width: 1; fill-color: #337ab7; fill-opacity: 0.2';
        var years_array = [
            ['Year', 'Results', {
                    role: 'style'
                }]
        ];
        var year_facets = JSON.parse($("#facets-year-data").val());
        year_facets.forEach(function (item) {
            years_array.push([new Date(item.year, 0, 1), item.count, style]);
        });
        var data = google.visualization.arrayToDataTable(years_array);
        var formatter = new google.visualization.DateFormat({
            pattern: 'yyyy'
        });
        formatter.format(data, 0);

        // daterangefilter slider control on 'Year' column
        var slider = new google.visualization.ControlWrapper({
            'controlType': 'DateRangeFilter',
            'containerId': 'control',
            'options': {
                'filterColumnLabel': 'Year',
                'ui': {
                    'format': {
                        'pattern': 'yyyy'
                    },
                    'label': ''
                }
            }
        });

        //When you drag the slider, this is triggered
        $('.daterange_div').on('mouseup', '.google-visualization-controls-slider-thumb', function (event) {
            if (event.which == 1) {
                //Values pulled from the slider
                var yr_until = formatter.formatValue(slider.getState().highValue);
                var yr_from = formatter.formatValue(slider.getState().lowValue);

                //The dates from the search form
                var current_start_date = $("#search-date_earliest").val();
                var current_end_date = $("#search-date_latest").val();
                //The years from what we found in the search form
                var date_pattern = new RegExp(/^\d{4}/);
                var date_start_found = date_pattern.exec(current_start_date);
                var date_end_found = date_pattern.exec(current_end_date);

                //If there's no value for the start date, or no value for the end date, or if the date we have isn't equal to what was triggered by the slider, we continue with re-submitting the search
                if (!current_start_date || !current_end_date || (date_start_found && date_start_found[0] != yr_from) || (date_end_found && date_end_found[0] != yr_until)) {
                    $('#search-date_earliest').val(yr_from + "-01-01T05:00:01.000Z");
                    $('#search-date_latest').val(yr_until + "-12-31T23:59:59.001Z");
                    restartSearchToFirstpage();
                }
            }
        });

        var columnChart = new google.visualization.ChartWrapper({
            'chartType': 'ColumnChart',
            'containerId': 'chart',
            'options': {
                'axisTitlesPosition': 'none',
                'backgroundColor': '#f9f9f9',
                'width': 200,
                'height': 100,
                'bar': {
                    groupWidth: 2
                },
                vAxis: {
                    minValue: 0,
                    baselineColor: '#ddd',
                    gridlines: {
                        color: 'transparent'
                    }
                },
                hAxis: {
                    gridlines: {
                        color: 'transparent'
                    }
                },
                'chartArea': {
                    width: '100%',
                    height: '100%'
                }
            }
        });

        //When you click on one of the bars in the date things, this is triggered
        google.visualization.events.addListener(columnChart, 'ready', function () {
            // need to wait until chart is ready to add select events (apparently)
            google.visualization.events.addListener(columnChart.getChart(), 'select', function () {
                chartObject = columnChart.getChart();
                var yr = formatter.formatValue(data.getValue(chartObject.getSelection()[0].row, 0));
                $('#search-date_earliest').val(yr + "-01-01T05:00:01.000Z");
                $('#search-date_latest').val(yr + "-12-31T23:59:59.001Z");
                restartSearchToFirstpage();
            });
        });

        // need a dashboard to contain the controls
        var dashboard = new google.visualization.Dashboard(document.getElementsByClassName('daterange_div'));
        // ... and bind the controls in the dashboard, One Ring style
        dashboard.bind(slider, columnChart);
        dashboard.draw(data);
    }
};

var pushDownloadMetric = function () {
    //code id we care about
    var code_id = $(this).data('codeid');
    var href = $(this).attr('href');
    var ga_link = '/' + APP_NAME + "/downloads/" + code_id + "/" + href;
    _gaq.push(['_trackPageview', ga_link]);
};

//If we're on the about page....
if (document.getElementById('about-page-identifier')) {
    /*Make the top 3 image hovers work*/
    $(".about-top-img").hover(handleAboutTopMouseEnter, handleAboutTopMouseLeave);
    $(".about-urls-area").hover(handleAboutMouseEnter, handleAboutMouseLeave);
    /*Had to add false href's to these to pass 508 compliance. This is here to prevent the clicking from doing anything*/
    $(".about-urls-area").on('click', function (event) {
        event.preventDefault();
    });

} else if (document.getElementById('search-results-page-identifier')) {
    /*Toggles the more or less on the search results page*/
    $(".description-pt2-toggle").on('click', toggleDescriptionMoreLess);

    /*Toggles sidebar filter on small screens*/
    $(".toggle-sidebar").on('click', {
        open_name: '<span class="fa fa-caret-right fa-page-caret clickable"></span>&nbsp;&nbsp;Filter Search',
        close_name: '<span class="fa fa-caret-down fa-page-caret clickable"></span>&nbsp;&nbsp;Filter Search'
    }, toggleCollapse);

    /*Makes the previous and next buttons work*/
    $(".pagination-prev-btn,.pagination-next-btn").on('click', searchPagePaginate);

    /*Hides and shows the dropdown*/
    $(".pagination-choose-btn").on('click', togglePaginationDropdown);

    /*Updates the value of where the slider bar is at*/
    $(".pagination-choose-slider").on('input', updatePaginationSliderValues);

    /*Moves search to page you got to with the slider*/
    $(".pagination-go-slider").on('click', triggerPaginationGoSearch);

    /*Need to apply unique id's to the sort dropdowndowns so they work correctly*/
    var id_prefix = "sort-dropdown-";
    var sort_dropdown_value = 0;
    $(".sort-dropdown-btn").each(function () {
        var new_id = id_prefix + sort_dropdown_value.toString();
        $(this).attr('id', new_id);
        $(this).next('ul.dropdown-menu').attr('aria-labelledby', new_id);
        sort_dropdown_value++;
    });

    /*Triggers a re-search for the sake of sorting*/
    $(".sort-dropdown-option").on('click', updateSearchSort);

    //Makes it where clicking on a checkbox on the search results page adds or removes that value from the search
    $(".search-checkbox:not(input[type=checkbox].single-val-search-checkbox)").on('click', addSearchCheckboxToSearch);
    
    //Makes it where clicking on one of the single-val-search-checkbox checkbox triggers a search, single value

    //Allows you to search by author name
    $(".author-search-name").on('click', authorSearchDropdownName);

    //Makes the x next to the items in the search results description work
    $(".search-for-filter-x").on('click', removeSearchResultDescriptionItem);

    $(".search-for-modify-search").on('click', modify_search);

    //Makes the date range slider work
    if (isValidJSON($("#facets-year-data").val())
            && JSON.parse($("#facets-year-data").val()).length > 0
            && isValidInt($("#search-results-count").val())
            && parseInt($("#search-results-count").val()) > 0
            && $("#is-pagespeed-insights").val() != 'true') {
        setUpDateSlider();
    } else {
        $(".release-date-sidebar-container").hide();
    }

    //Makes the download links work
    $(".download-link").on('click', pushDownloadMetric);

    //Makes the Search Results Exporter links work
    $(".results-export-link").on('click', function () {
        var format = $(this).data('format');
        var search_form_data = $("#search-page-form").serialize();

        window.open('/' + APP_NAME + '/dissemination/export-search-results?format=' + format + "&" + search_form_data, '_blank');
    });

} else if (document.getElementById('biblio-page-identifier') && !document.getElementById('biblio-code-id-not-found')) {

    //For authors
    $(".author-search-name").on('click', authorSearchDropdownName);

    /*Searches DOECODE for a given orcid*/
    $(".author-dropdown-search-orcid").on("click", authorSearchDropdownORCID);

    //For author affiliations
    $(".toggle-affiliations").on('click', toggleAffiliationCollapse);

    //Tacks this page's url onto each of the social media links
    $(".biblio-sharing-link").each(function () {
        var current_href = $(this).attr('href');
        $(this).attr('href', current_href + window.location.href);
    });

    //Makes the "Search Results" part of the breadcrumb trail work
    $(".biblio-breadcrumb-trail").on('click', goBackToSearch);

    //Makes the "previous/next" work on the description
    $(".description-pt2-toggle").on('click', toggleDescriptionMoreLess);

    var clipboard = new Clipboard(".clip-cite-bib");
    //Unhighlights the text copied to the clipboard
    clipboard.on('success', function (e) {
        $(e.trigger).html("<span class='fa fa-check'></span> Copied to clipboard");
        var self = this;
        if (document.selection) {
            document.selection.empty();
        } else if (window.getSelection) {
            window.getSelection().removeAllRanges();
        }
    });

    //Makes it such that when you click on a tab, the "Copy to clipboard" text is set correctly
    $("a.citation-tab[data-toggle='tab']").on('shown.bs.tab', function (e) {
        var self = this;
        //get id of tab we're working on
        var tab = $(self).attr('href').toString().replace(/#/g, '');
        if (document.getElementById(tab)) {
            $("#" + tab).find('div.copy-btn-container > button.clip-cite-bib').html('<span class="fa fa-files-o"></span> Copy to clipboard');
        }
    });

    //Makes the download links work
    $(".download-link").on('click', pushDownloadMetric);

} else if (document.getElementById('advanced-search-page-identifier')) {
    //If we had a latest search, we'll populate the advanced search page with the parameters we had
    if (isValidJSON(localStorage.latestSearchParams) && Array.isArray(JSON.parse(localStorage.latestSearchParams)) && localStorage.isRefinedSearch === "true") {
        populateAdvancedSearchForm("advanced-search-");
    }
    localStorage.isRefinedSearch = "false";

} else if (document.getElementById('news-page-indicator')) {
    var redirectToNews = function (action, param_name, param_value) {
        var page = window.location.href.toString();
        if (action == 'add') {//tack on teh new parameter and value
            if (page.indexOf('?') == -1) {
                page += '?' + param_name + '=' + param_value;
            } else {
                page += ('&' + param_name + '=' + param_value);
            }
        } else if (action == 'remove') {//Parse teh various URL parms, and remove teh one we're wanting to take out
            var query_params = page.substr(page.indexOf('?') + 1);
            page = page.substr(0, page.indexOf('?'));
            var params = query_params.split("&");
            var new_params_list = [];
            params.forEach(function (item) {
                if (item.indexOf(param_name) == -1) {
                    new_params_list.push(item);
                }
            });
            //Add the parameters to teh URL, if we had any
            if (new_params_list.length > 0) {
                page += '?' + new_params_list.join('&');
            }
        }

        window.location.href = page;
    };

    $(".search-article-type").on('change', function () {
        var self = this;
        if ($(self).is(':checked')) {
            redirectToNews('add', 'articletype', $(self).val());
        } else {
            redirectToNews('remove', 'articletype');
        }
    });

    $(".search-publication-year").on('change', function () {
        var self = this;
        if ($(self).is(':checked')) {
            redirectToNews('add', 'year', $(self).val());
        } else {
            redirectToNews('remove', 'year');
        }
    });

    $('.clear-filter-x').on('click', function () {
        var self = this;
        var val = $(self).data('value');
        $('input[type=checkbox][value="' + val + '"]').trigger('click');
    });

    $(".filter-type-icon").on('click', function () {
        var self = this;
        var filter = $(self).data('filter');


        var current_page = window.location.href.toString();
        if (current_page.indexOf('?') > -1) {
            current_page = current_page.substr(0, current_page.indexOf('?'));
        }
        window.location.href = current_page + '?articletype=' + filter;
    });

} else if (document.getElementById('index-indicator')) {
    $("#homepage-adv-dropdown-btn").on('click', function () {
        var self = this;
        var adv_search_element = $(self).next('button').next('div.homepage-adv-search-dropdown');
        if ($(adv_search_element).is(':visible')) {
            if ($("#adv-search-toggle-extra-container").is(':visible')) {
                $("#adv-search-toggle-btn").trigger('click');
            }
            $(adv_search_element).hide();
        } else {
            $(adv_search_element).show();
        }
    });
}
