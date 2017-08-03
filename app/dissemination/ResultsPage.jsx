import React from 'react';
import ReactDOM from 'react-dom';
import SearchItem from './SearchItem';
import ReactPaginate from 'react-paginate';
import {doAjax, getQueryParam} from '../utils/utils';
import SearchData from '../stores/SearchData';
import SearchField from '../field/SearchField';

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
    //console.log(JSON.stringify(searchData.getData()));
    searchData.loadValues(JSON.parse(window.sessionStorage.latestSearch));
    console.log(searchData.getData());
    doAjax('POST', '/doecode/api/search/',this.parseSearchResponse, searchData.getData(), this.parseErrorResponse);
  }

  parseSearchResponse(data) {
    console.log(JSON.stringify(data));

    this.setState({"results" : data.response});
    this.setState({"numFound" : data.response.numFound});

  }

  parseErrorResponse() {
    console.log("Error....")
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

    const rowOptions = [
      {label: '10', value: 10},
      {label: '25', value: 25},
      {label: '50', value: 50},
      {label: '100', value: 100}
    ];

    let content = null;
    if (this.state.results !== undefined) {
         console.log(this.state.results.docs);
         content = this.state.results.docs.map(this.buildContent);
   }

   console.log("Page: " + (searchData.getValue("start")/searchData.getValue("rows") + 1));
    return(
    <div className="row">
        {/*Sidebar*/}
        <div className="col-xs-2">
            
        </div>
        
                 {/*Center Content*/}
        <div className="col-xs-8">
            
            <div className='row'>
            {/*previous next*/}
      <div className="col-md-6 col-xs-12 center-text">
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
            {/*Row count*/}
      <div className="col-md-6 col-xs-12 center-text">
        <SearchField field="rows" label="Rows" elementType="select" options={rowOptions} changeCallback={this.refreshSearch}  />
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
        <div className="col-xs-2"></div>
    </div>
    
    );
  }

}
