import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, getQueryParam} from '../utils/utils';

export default class ResultsPage extends React.Component {
    constructor(props) {
      super(props);
      this.parseSearchResponse = this.parseSearchResponse.bind(this);
      this.parseErrorResponse = this.parseErrorResponse.bind(this);
    }


  componentDidMount() {
    //console.log(JSON.stringify(searchData.getData()));
    console.log("Mounting...")
    const searchData = window.sessionStorage.latestSearch;
    console.log(searchData);
    doAjax('POST', '/api/search/',this.parseSearchResponse, searchData, this.parseErrorResponse);
  }

  parseSearchResponse(data) {
    console.log(data);
  }

  parseErrorResponse() {
    console.log("Error....")
  }

  render() {

    return(
    <div>
      Results Page
    </div>);
  }

}
