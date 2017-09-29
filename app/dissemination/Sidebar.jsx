import React from 'react';
import ReactDOM from 'react-dom';
import SearchCheckbox from './SearchCheckbox';
import SearchData from '../stores/SearchData';
import {doAjax, getQueryParam} from '../utils/utils';
import AvailabilitiesList from '../staticJson/availabilityList';
import LicenseOptionsList from '../staticJson/licenseOptionsList';
import SearchField from '../field/SearchField';
import SimpleCollapsible from '../fragments/SimpleCollapsible';
import SearchResultsDescription from '../fragments/SearchResultsDescription';
import SortDropdown from './SortDropdown';
import DateColumnChart from './DateColumnChart';
import DateRangeSlider from './DateRangeSlider';

const searchData = new SearchData();

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.sidebarCallback = this.sidebarCallback.bind(this);

    this.constructSidebarFilter = this.constructSidebarFilter.bind(this);
    this.refreshSidebarSearch = this.refreshSidebarSearch.bind(this);
  }

  sidebarCallback(checked, value, type) {
    searchData.loadValues(JSON.parse(window.sessionStorage.latestSearch));
    let list = searchData.getValue(type);

    if (checked) {
      list.push(value)
    } else {
      let index = list.indexOf(value);

      if (index > -1) {
        list.splice(index, 1);
      }
    }

    searchData.setValue(type, list);
    searchData.setValue("start", 0);

    this.props.refreshSearch();
  }

  constructSidebarFilter() {
    if (!window.sessionStorage.latestSearch)
      return;

    searchData.loadValues(JSON.parse(window.sessionStorage.latestSearch));
    var licenseList = searchData.getValue("licenses")
      ? searchData.getValue("licenses")
      : [];
    var accessibilityList = searchData.getValue("accessibility")
      ? searchData.getValue("accessibility")
      : [];
    var sortListValue = searchData.getValue("sort")
      ? searchData.getValue("sort")
      : [];
    return (

      <span>
        <div className='row hide-sm hide-md hide-lg'>
          <div className='col-xs-12'>
            <div className='search-sort-dropdown'>
              <SortDropdown searchCallback={this.props.refreshSearch}/>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-1"></div>
          <div className="col-md-12 col-xs-12">
            <br/>
            <h4 className="search-sidebar-filter-title">REFINE BY:</h4>
            <span className='search-for-filter-text search-for-filter-header'>ACCESSIBILITY</span>
            <div className="search-sidebar-text">
              {AvailabilitiesList.availabilities.map((row) => <div key={row.key}>
                <SearchCheckbox id={row.key} name={row.value} isChecked={accessibilityList.indexOf(row.value) > -1} label={row.label} value={row.value} type="accessibility" toggleCallback={this.sidebarCallback}/>
              </div>)}
            </div>
          </div>
          <div className="col-md-1"></div>
        </div>
        <div className="row">
          <div className="col-md-12 col-xs-12">
            <br/>
            <span className='search-for-filter-text search-for-filter-header'>LICENSES</span>
            <div className="search-sidebar-text">
              {LicenseOptionsList.licenseOptions.map((row) => <div key={row.key}>
                <SearchCheckbox id={row.key} name={row.value} isChecked={licenseList.indexOf(row.value) > -1} label={row.label} value={row.value} type="licenses" toggleCallback={this.sidebarCallback}/>
              </div>)}
            </div>
          </div>
        </div>
        <br/>
        <div className='row'>
          {this.props.facetData.release_dates.min_year > 0 && <div className='col-xs-12'>
            <br/>
            <span className='search-for-filter-text search-for-filter-header'>Release Date</span>
            <DateColumnChart minDate={this.props.facetData.release_dates.min_year} maxDate={this.props.facetData.release_dates.max_year} years={this.props.facetData.release_dates.years_list} refreshSearch={this.refreshSidebarSearch}/>
          </div>}
        </div>
        <div className='row'>
          {this.props.facetData.release_dates.min_year > 0 && <div className='col-xs-12'>
            <DateRangeSlider minDate={this.props.facetData.release_dates.min_year} maxDate={this.props.facetData.release_dates.max_year} refreshSearch={this.refreshSidebarSearch}/>
          </div>}
        </div>
      </span>
    );
  }

  refreshSidebarSearch() {
    this.props.refreshSearch();
  }

  render() {
    /*Wire where these things are updated too*/
    const sidebarFilters = this.constructSidebarFilter();
    return (
      <div className={this.props.sidebarClass}>
        {/*Checkbox Filters*/}
        <div className="row">
          <div className="col-xs-12">
            <div className="row search-for-sidebar-row">
              <div className="col-md-1"></div>
              <div className="col-md-12 col-xs-12">
                <br/>
                <h4 className="search-sidebar-filter-title">SEARCH FOR:</h4>
                <div className="search-sidebar-text">
                  <SearchResultsDescription refreshSearch={this.refreshSidebarSearch}/>
                </div>
                <br/>
              </div>
              <div className="col-md-1"></div>
            </div>
            {/*Show on larger screens*/}
            <span className='hide-xs hide-sm'>
              {sidebarFilters}
            </span>
            {/*Show on tinier screens*/}
            <span className='hide-md hide-lg'>
              <SimpleCollapsible toggleArrow button_text='Filter Search' contents={sidebarFilters}/>
            </span>
          </div>
        </div>
      </div>
    );
  }

}
