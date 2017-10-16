import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from "mobx-react";
import {doAjax} from '../utils/utils';
import SearchData from '../stores/SearchData';
import SearchField from '../field/SearchField';
import AvailabilitiesList from '../staticJson/availabilityList';
import LicenseOptionsList from '../staticJson/licenseOptionsList';
import SearchSortOptionsList from '../staticJson/searchSortOptionsList';
import ResearchOrgsList from '../staticJson/researchOrgList';
import SponsorOrgsList from '../staticJson/sponsorOrgsList';
import AdvancedSearchButton from './AdvancedSearchButton';

const searchData = new SearchData();

@observer
export default class AdvancedSearch extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    searchData.loadValues(JSON.parse(window.sessionStorage.latestSearch));
  }

  render() {

    return (
      <div className="row not-so-wide-row">
        <div className="col-lg-3 col-sm-1"></div>
        <div className="col-lg-6 col-sm-10 col-xs-12">
          <br/>
          <div className="row advanced-search-panel">
            <div className="col-md-1"></div>
            <div className="col-md-10 col-xs-12">
              <br/>
              <div className="row">
                <div className="col-xs-12">
                  <div className='row'>
                    <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                      All Fields
                    </div>
                    <div className='col-xs-12'>
                      <SearchField title='All Fields' field="all_fields" elementType="input" noExtraLabelText/>
                    </div>
                    <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                      Software Title
                    </div>
                    <div className='col-xs-12'>
                      <SearchField title='Software Title' field="software_title" elementType="input" noExtraLabelText/>
                    </div>
                    <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                      Developers&nbsp;/&nbsp;Contributors
                    </div>
                    <div className='col-xs-12'>
                      <SearchField title='Developers / Contributors' field="developers_contributors" elementType="input" noExtraLabelText/>
                    </div>
                    <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                      Identifier Numbers
                    </div>
                    <div className='col-xs-12'>
                      <SearchField title='Identifiers' field="identifiers" elementType="input" noExtraLabelText/>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className='col-xs-12'>
                  <div className='row'>
                    <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                      Release Date:
                    </div>
                    <div className="col-xs-4 text-left">
                      <SearchField title='Date Earliest' field="date_earliest" elementType="date" noExtraLabelText/>
                    </div>
                    <div className='col-xs-1 no-col-padding-left to-field adv-search-dropdown-label'>to</div>
                    <div className="col-xs-4">
                      <SearchField title='Date Latest' field="date_latest" elementType="date" noExtraLabelText/>
                    </div>
                    <div className='col-xs-1'></div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xs-12">
                  <div className='row'>
                    <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                      Code Accessibility
                    </div>
                    <div className='col-xs-12'>
                      <SearchField title='Accessibility' field="accessibility" isArray={true} multi={true} elementType="select" options={AvailabilitiesList.availabilities} placeholder=" " noExtraLabelText/>
                    </div>
                    <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                      Licenses
                    </div>
                    <div className='col-xs-12'>
                      <SearchField title='Licenses' field="licenses" isArray={true} multi={true} elementType="select" options={LicenseOptionsList.licenseOptions} placeholder=" " noExtraLabelText/>
                    </div>
                    <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                      Research Organization
                    </div>
                    <div className='col-xs-12'>
                      <SearchField title='Research Organization' field="research_organization" isArray={true} multi={true} elementType="select" allowCreate={true} placeholder=" " options={ResearchOrgsList.researchOrgs} noExtraLabelText/>
                    </div>
                    <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                      Sponsoring Organization
                    </div>
                    <div className='col-xs-12'>
                      <SearchField title='Sponsoring Organization' field="sponsoring_organization" isArray={true} multi={true} elementType="select" allowCreate={true} placeholder=" " options={SponsorOrgsList.sponsorOrgs} noExtraLabelText/>
                    </div>
                    <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                      Sort
                    </div>
                    <div className='col-xs-12'>
                      <SearchField title='Sort' field="sort" elementType="select" options={SearchSortOptionsList.searchSortOptions} clearable={false} noExtraLabelText/>
                    </div>
                  </div>
                </div>
              </div>
              <div className='row adv-search-dropdown-title-row'>
                <div className='col-xs-12'></div>
              </div>
              <div className="row">
                <div className="col-xs-12 no-col-padding-left text-right">
                  <br/>
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
        <div className="col-lg-3 col-sm-1"></div>
      </div>
    );

  }

}
