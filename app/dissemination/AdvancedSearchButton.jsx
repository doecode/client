import React from 'react';
import SearchData from '../stores/SearchData';

const searchData = new SearchData();
export default class AdvancedSearchButton extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
  }

  search() {
    searchData.setValue("start", 0);
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    window.location.href = "/doecode/results";
  }
  render() {
    return (
      <span>
        <button title='Advanced Search' type="button" className="pure-button button-success signin-buttons" onClick={this.search}>
          <span className="fa fa-search"></span>&nbsp; Search
        </button>
      </span>
    );
  }
}
