import React from 'react';
import ReactDOM from 'react-dom';
import SearchItem from './SearchItem';
import ReactPaginate from 'react-paginate';
import {doAjax, getQueryParam} from '../utils/utils';
import SearchData from '../stores/SearchData';
import SearchField from '../field/SearchField';
import Sidebar from './Sidebar';
import staticContstants from '../staticJson/constantLists';
import BreadcrumbTrail from '../fragments/BreadcrumbTrail';
import SearchResultsDescription from '../fragments/SearchResultsDescription';

const searchData = new SearchData();

export default class ResultsPage extends React.Component {
  constructor(props) {
    super(props);
    this.parseSearchResponse = this.parseSearchResponse.bind(this);
    this.parseErrorResponse = this.parseErrorResponse.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
    this.refreshSearch = this.refreshSearch.bind(this);
    this.state = {
      results: undefined,
      numFound: 1
    };
  }

  componentDidMount() {
    searchData.loadValues(JSON.parse(window.sessionStorage.latestSearch));
    doAjax('POST', '/doecode/api/search/', this.parseSearchResponse, searchData.getData(), this.parseErrorResponse);
  }

  parseSearchResponse(data) {
    this.setState({"results": data.response});
    this.setState({"numFound": data.response.numFound});
  }

  parseErrorResponse() {
    console.log("Error....");
  }

  refreshSearch() {
    searchData.setValue("start", Math.floor(searchData.getValue("start") / searchData.getValue("rows")) * searchData.getValue("rows"));
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    doAjax('POST', '/doecode/api/search/', this.parseSearchResponse, searchData.getData(), this.parseErrorResponse);
  }

  handlePageClick(data) {
    searchData.setValue("start", searchData.getValue("rows") * data.selected);
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    doAjax('POST', '/doecode/api/search/', this.parseSearchResponse, searchData.getData(), this.parseErrorResponse);
  }

  render() {

    /*Got to make the pagination status*/
    let pagStartVal = searchData.getValue("start") + 1;
    let pagEndVal = (searchData.getValue("rows") + searchData.getValue("start") > this.state.numFound)
      ? this.state.numFound
      : searchData.getValue("rows") + searchData.getValue("start");
    let pageNum = Math.ceil(searchData.getValue("start") / searchData.getValue("rows")) + 1;

    const breadcrumbList = [
      {
        key: 'brdcrmb1',
        value: <span>
            <a href='/doecode'>DOE CODE</a>&nbsp;/&nbsp;
          </span>
      }, {
        key: 'brdcrmb2',
        value: 'Search Results / '
      }, {
        key: 'brdcrmb3',
        value: 'Page ' + pageNum + ' of ' + Math.ceil(this.state.numFound / searchData.getValue("rows"))
      }
    ];
    var searchDescription = <SearchResultsDescription/>;
    var searchNumCounter = pagStartVal;
    return (
      <div className="row not-so-wide-row">
        <div className='col-xs-12'>
          <div className='row'>
            <div className='col-xs-12'>
              <BreadcrumbTrail list={breadcrumbList}/>
              <br/>
            </div>
          </div>
          <div className='row'>
            <div className='col-md-2'></div>
            <div className='col-md-8 col-xs-12'>
              <h1 className='search-results-count'>{this.state.numFound}&nbsp; Search Results</h1>
            </div>
            <div className='col-md-2'></div>
          </div>
          <div className='row'>
            <div className='col-md-2'></div>
            <Sidebar sidebarClass="col-md-2 col-xs-12 sidebar" searchForText={searchDescription} parseSearchResponse={this.parseSearchResponse} parseErrorResponse={this.parseErrorResponse} refreshSearch={this.refreshSearch}/>
            <div className="col-md-6 col-xs-12 all-search-results-row">
              <br/>
              <div className="row">
                <div className="col-xs-12 no-col-padding-left">
                  {this.state.results != undefined && <div>
                    {this.state.results.docs.map((row, index) => <div className='search-result-row' key={index}>
                      <SearchItem listNumber={searchNumCounter++} data={row}/>
                    </div>)}
                  </div>}
                </div>
              </div>
              <div className="row center-text">
                <div className="col-xs-12 center-text">
                  <ReactPaginate previousLabel={"Prev"} nextLabel={"Next"} breakLabel={< a href = "#" > ...</a>} breakClassName={"break-me"} pageCount={Math.ceil(this.state.numFound / searchData.getValue("rows"))} marginPagesDisplayed={2} pageRangeDisplayed={3} forcePage={(searchData.getValue("start") / searchData.getValue("rows"))} onPageChange={this.handlePageClick} containerClassName={"pagination"} subContainerClassName={"pages pagination"} activeClassName={"active"}/>
                </div>
              </div>
            </div>

            <div className='col-md-2'></div>
          </div>
        </div>
      </div>

    );
  }

}
