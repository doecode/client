import React from 'react';
import ReactDOM from 'react-dom';
import SearchLink from './SearchLink';
import {Button, Collapse, Well} from 'react-bootstrap';

export default class DevAndContribLinks extends React.Component {
  constructor(props) {
    super(props);
    this.createLink = this.createLink.bind(this);
    this.showAffiliationsBtn = this.showAffiliationsBtn.bind(this);

    this.state = {
      affiliationsOpen: false,
      affiliationStateLabel: <span>
          <span className='fa fa-plus-square-o'></span>&nbsp; Show Author Affiliations</span>
    }
  }

  createLink(name, index, array) {
    return (
      <span key={name + this.props.groupType + index}>
        <SearchLink field="developers_contributors" value={name.trim()}/> {index != array.length - 1 && <span>
          ;&nbsp;
        </span>}
      </span>
    );
  }

  showAffiliationsBtn() {
    var new_state = !this.state.affiliationsOpen
    var new_state_label = (this.state.affiliationsOpen == false)
      ? (
        <span>
          <span className='fa fa-minus-square-o'></span>
          &nbsp;Hide Affiliations
        </span>
      )
      : (
        <span>
          <span className='fa fa-plus-square-o'></span>
          &nbsp;Show Affiliations
        </span>
      );
    this.setState({
      affiliationsOpen: !this.state.affiliationsOpen,
      affiliationStateLabel: new_state_label
    });
  }

  render() {
    var devContribPropsList = this.props.devsAndContributors;
    //Use a temporary list that will contain what we'll keep
    var tempPropsList = [];
    //Strip out all "None, None" entries
    devContribPropsList.forEach(function(row) {
      if (row.trim() != 'None, None') {
        tempPropsList.push(row);
      }
    });
    devContribPropsList = tempPropsList;

    //If we're on the search page, and there are more than 3 items in the array, let's take out only 3, and show ... for the rest
    if (this.props.searchPage !== undefined && devContribPropsList.length > 3) {
      devContribPropsList = devContribPropsList.slice(0, 3);
    }
    const content = devContribPropsList.map(this.createLink);
    let affiliations_list = [];

    if (this.props.devsAndContributorsObj !== undefined) {
      this.props.devsAndContributorsObj.forEach(function(row) {
        row.affiliations.forEach(function(item) {
          if (item && affiliations_list.indexOf(item) < 0) {
            affiliations_list.push(item);
          }
        });
      });
    }
    const afiliationsList = affiliations_list.map((item, index) => <li key={this.props.groupType + "-" + index}>
      {item}
    </li>);

    return (
      <div>
        <div>
          {content}
          {(this.props.searchPage && this.props.devsAndContributors.length > 3) && <span>;&nbsp;&hellip;</span>}
          {this.props.releaseDate}
        </div>
        <div>
          {affiliations_list.length > 0 && <div>
            <button type="button" className="btn btn-link" onClick={this.showAffiliationsBtn}>{this.state.affiliationStateLabel}</button>
            <Collapse in={this.state.affiliationsOpen}>
              <div>
                <ol>
                  {afiliationsList}
                </ol>
              </div>
            </Collapse>
          </div>}
        </div>
      </div>
    );
  }

}
