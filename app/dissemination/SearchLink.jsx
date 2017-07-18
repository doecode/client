import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchLink extends React.Component {
    constructor(props) {
        super(props);
      }


      render() {

        const searchUrl = "/search?searchData=" + JSON.stringify(this.props.searchData);
        return (
          <a href={searchUrl}>{this.props.searchText}</a>
        );
      }

    }
