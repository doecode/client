import React from 'react';
import ReactDOM from 'react-dom';
import PolyFill from 'babel-polyfill';
import SearchItem from './SearchItem';
import {doAjax, getQueryParam, getSearchSortDisplay} from '../utils/utils';
import SearchData from '../stores/SearchData';
import SearchField from '../field/SearchField';
import Sidebar from './Sidebar';
import BreadcrumbTrail from '../fragments/BreadcrumbTrail';
import SimpleDropdown from '../fragments/SimpleDropdown';
import SortDropdown from './SortDropdown';
import PaginationButtons from './PaginationButtons';

const searchData = new SearchData();

export default class ResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.parseSearchResponse = this.parseSearchResponse.bind(this);
    this.parseErrorResponse = this.parseErrorResponse.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.refreshSearch = this.refreshSearch.bind(this);
    this.storeAndConductSearch = this.storeAndConductSearch.bind(this);
    this.constructYearsList = this.constructYearsList.bind(this);
    this.state = {
      results: undefined,
      facets: undefined,
      numFound: 0,
      serverError: false,
      initialLoading:true
    };
  }

  componentDidMount() {
    this.storeAndConductSearch();
  }

  parseSearchResponse(data) {
    window.scrollTo(0, 0);
    this.setState({"results": data.docs, numFound: data.num_found, facets: data.facets, initialLoading:false});
  }

  parseErrorResponse() {
    window.scrollTo(0, 0);
    this.setState({serverError: true, initialLoading:false});
  }

  refreshSearch() {
    searchData.setValue("start", Math.floor(searchData.getValue("start") / searchData.getValue("rows")) * searchData.getValue("rows"));
    this.storeAndConductSearch();
  }

  handlePageClick(data) {
    searchData.setValue("start", searchData.getValue("rows") * data.selected);
    this.storeAndConductSearch();
  }

  storeAndConductSearch() {
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    doAjax('POST', '/doecode/api/search/', this.parseSearchResponse, searchData.getData(), this.parseErrorResponse);
  }

  constructYearsList() {
    var facet_data = {};

    //Styles and structure for the years bar chart
    var years_bargraph_style = 'stroke-color: #337ab7; stroke-opacity: 0.6; stroke-width: 1; fill-color: #337ab7; fill-opacity: 0.2';
    var years_list = [
      [
        'Year',
        'Results', {
          role: 'style'
        }
      ]
    ];

    var earliest_year = 0;
    var latest_year = 0;

    //If we had facet data, go through, and pull out the year data
    if (this.state.facets) {
      //In the facets for years and their associated counts, the key is the year, and the value is the count for that year
      var just_years = [];
      for (var x in this.state.facets) {
        //In a facet key, the year is in the first 4 characters
        var facet_year = x.toString().substr(0, 4);
        //Add it to the years list
        just_years.push(x);
        //Also add it into the list of years we'll give to the bar chart
        years_list.push([
          new Date(facet_year, 0, 1),
          this.state.facets[x], //The actual number of records that were released that year
          years_bargraph_style
        ]);
      }

      //Go through the years array, and determine the earliest and latest years, so we know what range we need for the bar chart
      if (just_years.length > 0) {
        earliest_year = parseInt(just_years[0]);
        latest_year = parseInt(just_years[0]);
        just_years.forEach(function(row) {
          var row_num = parseInt(row);
          if (row_num < earliest_year) {
            earliest_year = row_num;
          }
          if (row_num > latest_year) {
            latest_year = row_num;
          }
        });
      }

    }

    facet_data.min_year = earliest_year;
    facet_data.max_year = latest_year;
    facet_data.years_list = years_list;
    return facet_data;
  }

  render() {

    /*Got to make the pagination status*/
    let pagStartVal = searchData.getValue("start") + 1;
    let pagEndVal = (searchData.getValue("rows") + searchData.getValue("start") > this.state.numFound)
      ? this.state.numFound
      : searchData.getValue("rows") + searchData.getValue("start");
    let pageNum = Math.ceil(searchData.getValue("start") / searchData.getValue("rows")) + 1;

    var searchFor = searchData.getValue("all_fields")
      ? searchData.getValue("all_fields")
      : "All Projects";
    searchFor = "Search for " + searchFor;

    let needsFilterSuffix = (searchData.getValue("software_title") || searchData.getValue("developers_contributors") || searchData.getValue("biblio_data") || searchData.getValue("identifiers") || searchData.getValue("date_earliest") || searchData.getValue("date_latest") || (searchData.getValue("accessibility") && searchData.getValue("accessibility").length > 0) || (searchData.getValue("licenses") && searchData.getValue("licenses").length > 0) || (searchData.getValue("research_organization") && searchData.getValue("research_organization").length > 0) || (searchData.getValue("sponsoring_organization") && searchData.getValue("sponsoring_organization").length > 0) || searchData.getValue("orcid"));

    let filterSuffix = needsFilterSuffix && <span className="search-for-filter-crumb">
      (filtered)</span>;

    var searchCrumb = <span>{searchFor}{filterSuffix}</span>;

    var breadcrumbList = [
      {
        key: 'brdcrmb1',
        value: <span>
            <a title='DOE CODE Homepage' href='/doecode'>DOE CODE</a>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
          </span>
      }, {
        key: 'brdcrmb2',
        value: searchCrumb
      }
    ];

    //We only want to show a page number if there were any results found
    var pageCount = Math.ceil(this.state.numFound / searchData.getValue("rows"));
    if (this.state.numFound > 1) {
      breadcrumbList.push({
        key: 'brdcrmb3', value: <span>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;Page&nbsp;{pageNum}&nbsp;of&nbsp;{pageCount}</span>
      });
    }

    var searchNumCounter = pagStartVal;
    const break_lbl = <a href="#">&hellip;</a>;

    var forcePage = (searchData.getValue("start") / searchData.getValue("rows"));

    var facetData = {
      release_dates: this.constructYearsList()
    };
    return (
      <div className="row not-so-wide-row">
        <div className='col-xs-12'>
          <div className='row'>
            <div className='col-lg-2'></div>
            <div className='col-lg-8 col-xs-12'>
              <BreadcrumbTrail list={breadcrumbList}/>
              <br/>
            </div>
            <div className='col-lg-2'></div>
          </div>
          {this.state.numFound > 0 && <div className='row'>
            <div className='col-lg-2'></div>
            <div className='col-lg-4 col-md-6 col-xs-12'>
              <h1 className='search-results-count'>{this.state.numFound}&nbsp; Search Results</h1>
            </div>
            <div className='col-lg-4 col-md-6 col-xs-12 right-text-md right-text-lg hide-xs'>
              <SortDropdown searchCallback={this.storeAndConductSearch}/>
            </div>
            <div className='col-lg-2'></div>
          </div>}
          <div className='row'>
            <div className='col-lg-2'></div>
            <Sidebar sidebarClass="col-lg-2 col-md-4 col-xs-12 sidebar" refreshSearch={this.refreshSearch} facetData={facetData}/>
            <div className="col-lg-6 col-md-8 col-xs-12 all-search-results-row">

              {this.state.numFound > 0 && <span>
                <div className='row right-text '>
                  <div className='col-xs-12'>
                    <PaginationButtons max={pageCount} currentVal={forcePage + 1} refreshSearchCallback={this.handlePageClick}/>
                  </div>
                </div>
                <br/>
                <div className="row">
                  <div className="col-xs-12 no-col-padding-left">
                    {this.state.results && this.state.results.length > 0 && <div>
                      {this.state.results.map((row, index) => <div className='search-result-row' key={index}>
                        <SearchItem listNumber={searchNumCounter++} data={row}/>
                      </div>)}
                    </div>}
                  </div>
                </div>
                <div className='row right-text '>
                  <div className='col-xs-12'>
                    <PaginationButtons max={pageCount} currentVal={forcePage + 1} refreshSearchCallback={this.handlePageClick}/>
                  </div>
                </div>
              </span>}
              {(this.state.numFound < 1 && this.state.serverError === false && this.state.initialLoading ===false) && <span>
                <div className='col-xs-12 center-text'>
                  <h1>No records were found for your search terms</h1>
                </div>
              </span>}
              {(this.state.initialLoading === true) && <span>
                <div className='col-xs-12 center-text'>
                  <h1>Loading Search Results...</h1>
                </div>
              </span>}
              {this.state.serverError === true && <span>
                <div className='col-xs-12 center-text has-error'>
                  <h2 className='control-label'>A server error has occurred that is preventing your search from completing</h2>
                </div>
              </span>}
            </div>
            <div className='col-lg-2'></div>
          </div>
        </div>
      </div>

    );
  }

}
