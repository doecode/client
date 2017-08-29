import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from "mobx-react";
import {doAjax} from '../utils/utils';
import SearchData from '../stores/SearchData';
import SearchField from '../field/SearchField';
import staticLists from '../staticJson/staticLists';
import staticContstants from '../staticJson/constantLists';
import AdvancedSearchButton from './AdvancedSearchButton';

const searchData = new SearchData();

@observer
export default class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12">
          <br/>
          <div className="row advanced-search-panel">
            <div className="col-md-1"></div>
            <div className="col-md-10 col-xs-12">
              <br/>
              <div className="row">
                <div className="col-xs-12">
                  <SearchField field="all_fields" label="All Fields" elementType="input" noExtraLabelText/>
                  <SearchField field="software_title" label="Software Title" elementType="input" noExtraLabelText/>
                  <SearchField field="developers_contributors" label="Developers/Contributors" elementType="input" noExtraLabelText/>
                  <SearchField field="identifiers" label="Identifier Numbers" elementType="input" noExtraLabelText/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6 col-xs-12">
                  <SearchField field="date_earliest" label="Earliest Release Date" elementType="date" noExtraLabelText/>
                </div>
                <div className="col-md-6 col-xs-12">
                  <SearchField field="date_latest" label="Latest Release Date" elementType="date" noExtraLabelText/>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <SearchField field="accessibility" label="Code Accessibility" isArray={true} elementType="select" options={staticContstants.availabilities} placeholder="Software's Accessibility" noExtraLabelText/>
                  <SearchField field="licenses" label="Licenses" isArray={true} elementType="select" options={staticContstants.licenseOptions} placeholder="Software License" noExtraLabelText/>
                  <SearchField field="research_organization" label="Research Organization" elementType="select" allowCreate={true} placeholder="Enter or select an organization from the list." options={staticLists.researchOrgs} noExtraLabelText/>
                  <SearchField field="sponsoring_organization" label="Sponsoring Organization" elementType="select" allowCreate={true} placeholder="Enter or select an organization from the list." options={staticLists.sponsorOrgs} noExtraLabelText/>
                  <SearchField field="sort" label="Sort" elementType="select" options={staticContstants.searchSortOptions} clearable={false} noExtraLabelText/>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12 no-col-padding-left">
                  <AdvancedSearchButton/>
                </div>
                <br/>
              </div>
              <br/>
            </div>
            <div className="col-md-1"></div>
          </div>
          <br/>
        </div>
        <div className="col-md-3"></div>
      </div>
    );

  }

}
