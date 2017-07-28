import React from 'react';
import ReactDOM from 'react-dom';
import SearchItem from './SearchItem';
import ReactPaginate from 'react-paginate';
import {doAjax, getQueryParam} from '../utils/utils';
import SearchData from '../stores/SearchData';

const searchData = new SearchData();

export default class ResultsPage extends React.Component {
    constructor(props) {
      super(props);
      this.parseSearchResponse = this.parseSearchResponse.bind(this);
      this.parseErrorResponse = this.parseErrorResponse.bind(this);
      this.buildContent = this.buildContent.bind(this);
      this.handlePageClick = this.handlePageClick.bind(this);
      this.state = {results: undefined};
    }


  componentDidMount() {
    //console.log(JSON.stringify(searchData.getData()));
    const latestSearch = JSON.parse(window.sessionStorage.latestSearch);

    doAjax('POST', '/api/search/',this.parseSearchResponse, latestSearch, this.parseErrorResponse);
  }

  parseSearchResponse(data) {
    console.log(JSON.stringify(data));

    this.setState({"results" : data.response});

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

  handlePageClick(data) {
    let selected = data.selected;
    console.log(selected);
  }

  render() {
    let content = null;
    if (this.state.results !== undefined) {
         console.log(this.state.results.docs);
         content = this.state.results.docs.map(this.buildContent);
   }
    return(
    <div className="container-fluid">

      <div className=" col-xs-offset-2 col-xs-10">
        <ReactPaginate previousLabel={"previous"}
               nextLabel={"next"}
               breakLabel={<a href="#">...</a>}
               breakClassName={"break-me"}
               pageCount={20}
               marginPagesDisplayed={2}
               pageRangeDisplayed={5}
               onPageChange={this.handlePageClick}
               containerClassName={"pagination"}
               subContainerClassName={"pages pagination"}
activeClassName={"active"} />
      </div>
      <div className=" col-xs-offset-2 col-xs-10">
      {content}
      </div>
    </div>);
  }

}
