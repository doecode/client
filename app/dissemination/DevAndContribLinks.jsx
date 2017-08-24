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
      <span key={name}>
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
    const content = this.props.devsAndContributors.map(this.createLink);
    let affiliations_list = [];

    if (this.props.devsAndContributorsObj !== undefined) {
      this.props.devsAndContributorsObj.forEach(function(item) {
        item.affiliations.forEach(function(item) {
          if (affiliations_list.indexOf(item) < 0) {
            affiliations_list.push(item);
          }
        });
      });
    }
    const afiliationsList = affiliations_list.map((item,index) => <li key={index}>
      {item}
    </li>);

    return (
      <div>
        <div>
          {content}
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
