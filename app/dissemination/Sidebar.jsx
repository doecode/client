import React from 'react';
import ReactDOM from 'react-dom';
import SearchCheckbox from './SearchCheckbox';
import SearchData from '../stores/SearchData';
import {doAjax, getQueryParam} from '../utils/utils';
import staticContstants from '../staticJson/constantLists';
import SearchField from '../field/SearchField';

const searchData = new SearchData();

export default class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.sidebarCallback = this.sidebarCallback.bind(this);
    searchData.loadValues(JSON.parse(window.sessionStorage.latestSearch));
    this.licenseList = searchData.getValue("licenses");
    this.accessibilityList = searchData.getValue("accessibility");
    this.sortListValue = searchData.getValue("sort");
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

    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    doAjax('POST', '/doecode/api/search/', this.props.parseSearchResponse, searchData.getData(), this.props.parseErrorResponse);
  }

  render() {
    var searchForText = (this.props.searchForText!=undefined)?this.props.searchForText:"All Records";
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
                  {searchForText}
                </div>
                <br/>
              </div>
              <div className="col-md-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-12 col-xs-12">
                <br/>
                <h4 className="search-sidebar-filter-title">Accessibility</h4>
                <div className="search-sidebar-text">
                  {staticContstants.availabilities.map((row) => <div key={row.key}>
                    <SearchCheckbox id={row.key} name={row.value} isChecked={this.accessibilityList.indexOf(row.value) > -1} value={row.value} type="accessibility" toggleCallback={this.sidebarCallback}/>&nbsp;
                    <label htmlFor={row.key}>{row.label}</label>
                  </div>)}
                </div>
              </div>
              <div className="col-md-1"></div>
            </div>
            <div className="row">
              <div className="col-md-1"></div>
              <div className="col-md-12 col-xs-12">
                <br/>
                <h4 className="search-sidebar-filter-title">Licenses</h4>
                <div className="search-sidebar-text">
                  {staticContstants.licenseOptions.map((row) => <div key={row.key}>
                    <label htmlFor={row.key}><SearchCheckbox id={row.key} name={row.value} isChecked={this.licenseList.indexOf(row.value) > -1} value={row.value} type="licenses" toggleCallback={this.sidebarCallback}/> {row.label}</label>
                  </div>)}
                </div>
              </div>
              <div className="col-md-1"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
