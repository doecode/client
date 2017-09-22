import React from 'react';
import ReactDOM from 'react-dom';
import SearchItem from './SearchItem';
import {doAjax, getQueryParam, getSearchSortDisplay} from '../utils/utils';
import SearchData from '../stores/SearchData';
import SearchField from '../field/SearchField';
import Sidebar from './Sidebar';
import staticContstants from '../staticJson/constantLists';
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
      numFound: 1
    };
  }

  componentDidMount() {
    this.storeAndConductSearch();
  }

  parseSearchResponse(data) {
    window.scrollTo(0, 0);
    this.setState({"results": data.docs, numFound: data.num_found});
  }

  parseErrorResponse() {
    window.scrollTo(0, 0);
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
    //Facet Data
    var years_bargraph_style = 'stroke-color: #337ab7; stroke-opacity: 0.6; stroke-width: 1; fill-color: #337ab7; fill-opacity: 0.2';
    var years_list = [
      [
        'Year',
        'Results', {
          role: 'style'
        }
      ]
    ];

    years_list.push([
      new Date(1951, 0, 1),
      300,
      years_bargraph_style
    ]);
    years_list.push([
      new Date(1946, 0, 1),
      839,
      years_bargraph_style
    ]);
    years_list.push([
      new Date(1950, 0, 1),
      500,
      years_bargraph_style
    ]);

    return years_list;
  }

  render() {

    /*Got to make the pagination status*/
    let pagStartVal = searchData.getValue("start") + 1;
    let pagEndVal = (searchData.getValue("rows") + searchData.getValue("start") > this.state.numFound)
      ? this.state.numFound
      : searchData.getValue("rows") + searchData.getValue("start");
    let pageNum = Math.ceil(searchData.getValue("start") / searchData.getValue("rows")) + 1;

    var breadcrumbList = [
      {
        key: 'brdcrmb1',
        value: <span>
            <a href='/doecode'>DOE CODE</a>&nbsp;&nbsp;&nbsp;/&nbsp;&nbsp;&nbsp;
          </span>
      }, {
        key: 'brdcrmb2',
        value: 'Search Results '
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
              {this.state.numFound < 1 && <span>
                <div className='col-xs-12 center-text'>
                  <h1>No records were found for your search terms</h1>
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
