import React from 'react';
import ReactDOM from 'react-dom';
import SearchLink from './SearchLink';
import SimpleDropdown from '../fragments/SimpleDropdown';
import {Button, Collapse, Well} from 'react-bootstrap';

export default class DevAndContribLinks extends React.Component {
  constructor(props) {
    super(props);
    this.showAffiliationsBtn = this.showAffiliationsBtn.bind(this);
    this.createAuthorsLink = this.createAuthorsLink.bind(this);
    this.createAffiliationsList = this.createAffiliationsList.bind(this);
    this.createORCIDLink = this.createORCIDLink.bind(this);

    this.state = {
      affiliationsOpen: false,
      affiliationStateLabel: <span>
          <span className='fa fa-plus-square-o'></span>&nbsp; Show Author Affiliations</span>
    }
  }

  createORCIDLink(row) {
    var dropdown_list = [
      {
        link: '',
        display: <SearchLink displayVal={'Search DOE CODE for ' + this.props.groupType + ' ' + row.name.trim()} field="developers_contributors" value={row.name.trim()}/>,
        customAnchor: true
      }, {
        link: '',
        display: <SearchLink displayVal={'Search DOE CODE for ORCID' + ' ' + row.orcid} field="orcid" value={row.orcid}/>,
        customAnchor: true
      }, {
        link: 'https://orcid.org/orcid-search/quick-search?searchQuery=' + row.orcid,
        display: 'Search orcid.org for ORCID "' + row.orcid + '"'
      }
    ];

    return (
      <span>
        <SimpleDropdown extraBtnClasses=' biblio-authors' noBtnPadding noToggleArrow items={dropdown_list} label={row.name.trim()}/>
        &nbsp;
        <img title='ORCID' alt='ORCID' className='orc-id-img' src={require('../images/orcid_16x16(1).png')}/>
      </span>
    );
  }

  /*Make the search link. Things are a little different if it's got an orcid*/
  createAuthorsLink(row, index, array) {
    var search_link = (row.orcid)
      ? (this.createORCIDLink(row))
      : (<SearchLink field="developers_contributors" value={row.name.trim()}/>);

    return (
      <span key={index}>
        {search_link}
        {(row.sup_count && row.sup_count.length > 0) && <span>
          {row.sup_count.map((item, index2) => <sup key={index2}>[{item}]</sup>)}
        </span>}

        {((index + 1) < array.length) && <span>
          ;&nbsp;
        </span>}
      </span>
    );
  }

  createAffiliationsList(items) {
    var affiliations_list = [];
    var affiliation_index = 0;

    items.forEach(function(row) {
      if (row.affiliations && row.affiliations.length > 0) {
        row.affiliations.forEach(function(affiliation) {
          if (affiliation && affiliation != 'null') {
            affiliations_list.push(
              <li key={affiliation_index}>{affiliation}</li>
            );
          }
          affiliation_index++;
        });
      }
    });

    return affiliations_list;
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
    var authors = this.props.items;
    /*First, we go through and strip out all "none, none"*/
    var refinedAuthorsList = [];
    authors.forEach(function(row) {
      //If it's the search page, we'll have this
      if (row.name && row.name.toLowerCase().trim() != 'none, none') {
        refinedAuthorsList.push(row);
      } else if (row.first_name) { //We'll have this on the biblio page
        var conjoined_name = row.last_name + ", " + row.first_name;
        if (conjoined_name.toLowerCase() != 'none, none') {
          row.name = conjoined_name;
          refinedAuthorsList.push(row);
        }
      }
    });

    /*Now then, if we are on the search page, we will go ahead and trim out all but 3 authors*/
    if (this.props.searchPage && refinedAuthorsList.length > 3) {
      refinedAuthorsList = refinedAuthorsList.slice(0, 3);
    }

    /*Now we go through, and assign a series of numbers that will be the affiliations references. You'll see what I mean*/
    var affiliations_count = 1;
    for (var i = 0; i < refinedAuthorsList.length; i++) {
      var countArr = [];
      //Go through each affiliation. If it's a valid one, tack on another number to show in the superscript thing in the link
      if (refinedAuthorsList[i].affiliations) {
        refinedAuthorsList[i].affiliations.forEach(function(row) {
          if (row && row != 'null') {
            countArr.push(affiliations_count);
            affiliations_count++;
          }
        });
      }
      refinedAuthorsList[i].sup_count = countArr;
    }

    /*Map everything with in the refined authors list*/
    const authorsContent = refinedAuthorsList.map(this.createAuthorsLink);
    /*Map every affiliation we've got*/
    const affiliations_list = this.createAffiliationsList(refinedAuthorsList);

    var btnTitle = this.state.affiliationsOpen == true
      ? 'Hide Affiliations'
      : 'Show Affiliations';
    return (
      <div>
        <div>
          {authorsContent}
          {(this.props.searchPage && authors.length > 3) && <span>;&nbsp;&hellip;</span>}{authors && <span>&nbsp;</span>}{this.props.releaseDate}
        </div>
        {(affiliations_list && affiliations_list.length > 0 && !this.props.searchPage) > 0 && <div className='affiliations-div'>
          <button title={btnTitle} type="button" className="btn btn-link" onClick={this.showAffiliationsBtn}>{this.state.affiliationStateLabel}</button>
          <Collapse in={this.state.affiliationsOpen}>
            <div>
              <ol>
                {affiliations_list}
              </ol>
            </div>
          </Collapse>
        </div>}
      </div>
    );
  }

}
