import React from 'react';
import SearchData from '../stores/SearchData';
import AdvancedSearchButton from '../dissemination/AdvancedSearchButton';
import SearchField from '../field/SearchField';
import DatePicker from 'react-datepicker';
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';

const searchData = new SearchData();
export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.onAllFieldsChange = this.onAllFieldsChange.bind(this);
    this.search = this.search.bind(this);
    this.doAdvancedSearch = this.doAdvancedSearch.bind(this);
    this.triggerSearch = this.triggerSearch.bind(this);
    this.storeSearch = this.storeSearch.bind(this);
    this.handleAdvancedSearchClick = this.handleAdvancedSearchClick.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);

    this.searchBarStyles = "form-control pure-input-1 search-box";
    this.advSearchButtonStyles = "adv-search-button hide-xs";
    this.searchButtonStyles = "pure-button button-success search-btn";
    this.advDropdownStyles = "adv-search-dropdown row";
    this.advSearchIconStyles = "fa fa-caret-down adv-search-button-icon";
    this.date_earliest_styles = "col-lg-6 col-md-6 col-sm-6 text-left publication-date-start-container left-text";
    this.date_latest_styles = "col-lg-6 col-md-6 col-sm-6 publication-date-end-container left-text";
    this.state = {
      all_fields: searchData.getValue("all_fields"),
      show_dropdown: false,
      date_earliest: searchData.getValue("date_earliest"),
      date_latest: searchData.getValue("date_latest")
    };

    if (this.props.isHomepage) {
      this.searchBarStyles += "  homepage-searchbar";
      this.searchButtonStyles += " homepage-search-btn";
      this.advSearchButtonStyles += " homepage-adv-search-btn";
      this.advSearchIconStyles += " homepage-adv-search-icon";
      this.advDropdownStyles += " homepage-adv-search-dropdown";
      this.date_earliest_styles = "col-lg-6 col-md-6 col-xs-12 publication-date-start-container-homepage left-text";
      this.date_latest_styles = "col-lg-6 col-md-6 col-xs-12 publication-date-end-container-homepage left-text";
    }
  }
  onAllFieldsChange(event) {
    this.setState({"all_fields": event.target.value});
    searchData.setValue("all_fields", event.target.value);
  }

  search() {
    searchData.clearValues();
    searchData.setValue("start", 0);
    this.storeSearch();
    window.location.href = "/doecode/results";
  }

  doAdvancedSearch() {
    this.setState({
      show_dropdown: !this.state.show_dropdown
    });

    if (!this.state.show_dropdown) {
      this.setState({"all_fields": ""});
      searchData.setValue("all_fields", "");
    } else {
      searchData.clearValues();
      if (window.sessionStorage.latestSearch)
        searchData.loadValues(JSON.parse(window.sessionStorage.latestSearch));
      }
    }

  triggerSearch(event) {
    if (event.key === 'Enter') {
      this.search();
    }
  }

  storeSearch() {
    searchData.setValue("all_fields", this.state.all_fields);
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
  }

  handleAdvancedSearchClick(event) {
    this.storeSearch();
    window.location.href = '/doecode/search';
  }

  handleDateChange(value, field) {
    var newDateValue = (value != null)
      ? value
      : '';
    searchData.setValue(field, newDateValue);
    if (field == 'date_earliest') {
      this.setState({'date_earliest': newDateValue});
    } else if (field == 'date_latest') {
      this.setState({'date_latest': newDateValue});
    }
  }

  render() {
    var notSoWideSearchbar = this.props.notSoWideSearchbar
      ? this.props.notSoWideSearchbar
      : 'row searchbar-container';
    const to_span = <span className='to-span'>to</span>;
    return (
      <div className={notSoWideSearchbar}>
        <div className={this.props.searchbarSize}>
          <div>
            <input id='allSearch' onKeyPress={this.triggerSearch} onChange={this.onAllFieldsChange} type="text" value={this.state.all_fields} className={this.searchBarStyles} placeholder="Search DOE CODE for published software entries"/>
            <button onClick={this.doAdvancedSearch} className={this.advSearchButtonStyles} type='button'>
              <span className={this.advSearchIconStyles}></span>
            </button>
          </div>
          {/*Advanced search dropdown*/}
          {this.state.show_dropdown && <div className={this.advDropdownStyles}>
            <div className='col-xs-12 pure-form'>
              <div className='row adv-search-dropdown-title-row'>
                <div className='col-xs-12 no-col-padding-left left-text adv-search-dropdown-label'>
                  Advanced Search options
                </div>
              </div>
              <br/>
              <div className='row text-left'>
                <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                  Software Title:
                </div>
                <div className='col-xs-12'>
                  <SearchField field="software_title" elementType="input" noExtraLabelText/>
                </div>
                <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                  Developers&nbsp;/&nbsp;Contributors:
                </div>
                <div className='col-xs-12'>
                  <SearchField field="developers_contributors" elementType="input" noExtraLabelText/>
                </div>
                <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                  Identifier Numbers:
                </div>
                <div className='col-xs-12'>
                  <SearchField field="identifiers" elementType="input" noExtraLabelText/>
                </div>
              </div>
              <div className="row">
                <div className='col-xs-12 left-text no-col-padding-left adv-search-dropdown-label'>
                  Release Date:
                </div>
                <div className={this.date_earliest_styles}>
                  <SearchField field="date_earliest" elementType="date" noExtraLabelText textAfter={to_span}/>
                </div>
                <div className={this.date_latest_styles}>
                  <SearchField field="date_latest" elementType="date" noExtraLabelText/>
                </div>
              </div>
              <div className='row adv-search-dropdown-title-row left-text'>
                <div className='col-xs-12 no-col-padding-left'>
                  <a onClick={this.handleAdvancedSearchClick} className='more-adv-search clickable'>
                    <span className='fa fa-plus-square-o'></span>&nbsp;More Options&hellip;</a>
                </div>
              </div>
              <br/>
              <div className='row'>
                <div className='col-xs-12 right-text'>
                  <AdvancedSearchButton/>
                </div>
              </div>
            </div>
          </div>}
        </div>
        <div className="col-lg-1 col-md-2 col-sm-1 col-xs-2 search-btn-container text-left minimal-col-padding-left">
          <button type="button" className={this.searchButtonStyles} onClick={this.search}>
            <span className="fa fa-search"></span>
          </button>
        </div>
      </div>
    );
  }
}
