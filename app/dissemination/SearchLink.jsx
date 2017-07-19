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
        searchData.setValue(this.props.field,this.props.value);
        window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
        window.location.href = "/results";

      }


      render() {

        const searchUrl = "/search?searchData=" + JSON.stringify(this.props.searchData);
        return (
          <a href="#" onClick={this.search}>{this.props.value}</a>
        );
      }

    }
