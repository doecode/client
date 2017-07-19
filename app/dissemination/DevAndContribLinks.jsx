import React from 'react';
import ReactDOM from 'react-dom';
import SearchLink from './SearchLink';


export default class DevAndContribLinks extends React.Component {
    constructor(props) {
        super(props);
        this.createLink = this.createLink.bind(this);
      }

      createLink(name) {
        
        return (
          <span key={name}>
            <SearchLink field="developers_contributors" value={name.trim()}/>;&nbsp;
          </span>
        );

      }


      render() {
        const content = this.props.devsAndContributors.map(this.createLink);
        const searchUrl = "/search?searchData=" + JSON.stringify(this.props.searchData);
        return (
          <div>
            {content}
          </div>
        );
      }

    }
