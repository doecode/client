import React from 'react';
import ReactDOM from 'react-dom';
import SearchItem from './SearchItem';
import ReactPaginate from 'react-paginate';
import {doAjax, getQueryParam} from '../utils/utils';
import SearchData from '../stores/SearchData';
import SearchField from '../field/SearchField';
import Sidebar from './Sidebar';
import staticContstants from '../staticJson/constantLists';

const searchData = new SearchData();

export default class ResultsPage extends React.Component {
    constructor(props) {
      super(props);
      this.parseSearchResponse = this.parseSearchResponse.bind(this);
      this.parseErrorResponse = this.parseErrorResponse.bind(this);
      this.buildContent = this.buildContent.bind(this);
      this.handlePageClick = this.handlePageClick.bind(this);
      this.refreshSearch = this.refreshSearch.bind(this);
      this.state = {results: undefined, numFound: 1};
    }


  componentDidMount() {
    searchData.loadValues(JSON.parse(window.sessionStorage.latestSearch));
    doAjax('POST', '/doecode/api/search/',this.parseSearchResponse, searchData.getData(), this.parseErrorResponse);
  }

  parseSearchResponse(data) {

    this.setState({"results" : data.response});
    this.setState({"numFound" : data.response.numFound});

  }

  parseErrorResponse() {
    console.log("Error....");
  }


  buildContent(obj) {
    return (
      <div className="panel panel-default search-result-row" key={obj.codeId}>
        <SearchItem data={obj}/>
      </div>
    )
  }

 refreshSearch() {
      searchData.setValue("start",Math.floor(searchData.getValue("start")/searchData.getValue("rows")) * searchData.getValue("rows"));
      window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
      doAjax('POST', '/doecode/api/search/',this.parseSearchResponse, searchData.getData(), this.parseErrorResponse);
 }

  handlePageClick(data) {
    searchData.setValue("start", searchData.getValue("rows") * data.selected);
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    doAjax('POST', '/doecode/api/search/',this.parseSearchResponse, searchData.getData(), this.parseErrorResponse);
  }

  render() {


    let content = null;
    if (this.state.results !== undefined) {
         content = this.state.results.docs.map(this.buildContent);
   }

    return(
    <div className="row not-so-wide-row">
        {/*Sidebar*/}
            <Sidebar parseSearchResponse={this.parseSearchResponse} parseErrorResponse={this.parseErrorResponse} refreshSearch={this.refreshSearch} sidebarClass="col-xs-2"/>
        {/*Center Content*/}
        <div className="col-xs-10">
            <div className="row center-text">
                {/*previous next*/}
                <div className="col-xs-6 center-text">
                    <ReactPaginate previousLabel={"previous"}
                                   nextLabel={"next"}
                                   breakLabel={<a href="#">...</a>}
                        breakClassName={"break-me"}
                        pageCount={Math.ceil(this.state.numFound/searchData.getValue("rows"))}
                        marginPagesDisplayed={2}
                        pageRangeDisplayed={3}
                        forcePage={(searchData.getValue("start")/searchData.getValue("rows"))}
                        onPageChange={this.handlePageClick}
                        containerClassName={"pagination"}
                        subContainerClassName={"pages pagination"}
                        activeClassName={"active"} />
                </div>
                <div className='col-xs-6 right-text'>
                    Showing <strong>{searchData.getValue("start")+1}-
                        {(searchData.getValue("rows")+searchData.getValue("start")>this.state.numFound)?this.state.numFound:searchData.getValue("rows")+searchData.getValue("start")}</strong> of <strong>{this.state.numFound}</strong> results
                </div>
            </div>
            {/*Actual search results*/}
            <div className="row">
                <div className="col-xs-12">
                    {content}
                </div>
            </div>
        </div>
        {/*Empty sidebar*/}
    </div>

    );
  }

}
