import React from 'react';
import ReactDOM from 'react-dom';
import SearchData from '../stores/SearchData';

const searchData = new SearchData();

export default class SearchLink extends React.Component {
  constructor(props) {
    super(props);
    this.search = this.search.bind(this);
  }

  search() {
    searchData.setValue("start", 0);
    searchData.setValue(this.props.field, this.props.value);
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    window.location.href = "/doecode/results";
  }

  render() {
    const display_val = (this.props.displayVal)
      ? (this.props.displayVal)
      : (this.props.value);
    return (
      <a className='clickable' title={display_val} onClick={this.search}>{display_val}</a>
    );
  }

}
