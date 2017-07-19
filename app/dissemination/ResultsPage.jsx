import React from 'react';
import ReactDOM from 'react-dom';
import SearchItem from './SearchItem';
import {doAjax, getQueryParam} from '../utils/utils';

export default class ResultsPage extends React.Component {
    constructor(props) {
      super(props);
      this.parseSearchResponse = this.parseSearchResponse.bind(this);
      this.parseErrorResponse = this.parseErrorResponse.bind(this);
      this.buildContent = this.buildContent.bind(this);
      this.state = {results: undefined};
    }


  componentDidMount() {
    //console.log(JSON.stringify(searchData.getData()));
    const searchData = JSON.parse(window.sessionStorage.latestSearch);

    doAjax('POST', '/api/search/',this.parseSearchResponse, searchData, this.parseErrorResponse);
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

      <div className="panel panel-default" key={obj.codeId}>
        <SearchItem data={obj}/>
      </div>

    )
  }

  render() {
    let content = null;
    if (this.state.results !== undefined) {
         console.log(this.state.results.docs);
         content = this.state.results.docs.map(this.buildContent);
   }
    return(
    <div>
      {content}
    </div>);
  }

}
