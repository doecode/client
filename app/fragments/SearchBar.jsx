import React from 'react';
import SearchData from '../stores/SearchData';
import AdvancedSearchButton from '../dissemination/AdvancedSearchButton';
import SearchField from '../field/SearchField';

const searchData = new SearchData();
export default class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_fields: searchData.getValue("all_fields"),
      show_dropdown: false
    };
    this.onAllFieldsChange = this.onAllFieldsChange.bind(this);
    this.search = this.search.bind(this);
    this.doAdvancedSearch = this.doAdvancedSearch.bind(this);
    this.triggerSearch = this.triggerSearch.bind(this);
    this.storeSearch = this.storeSearch.bind(this);
    this.handleAdvancedSearchClick = this.handleAdvancedSearchClick.bind(this);

    if (this.props.largerBar !== undefined) {
      this.searchBarStyles = "form-control input-lg search-box";
      this.advSearchButtonStyles = "adv-search-button hide-xs";
      this.searchButtonStyles = "pure-button button-success search-btn ";
      this.advDropdownStyles = "adv-search-dropdown adv-search-dropdown-lg row";
    } else {
      this.searchBarStyles = "form-control pure-input-1 search-box";
      this.advSearchButtonStyles = "adv-search-button hide-xs";
      this.searchButtonStyles = "pure-button button-success search-btn";
      this.advDropdownStyles = "adv-search-dropdown row";
    }
  }
  onAllFieldsChange(event) {
    this.setState({"all_fields": event.target.value});
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

  render() {
    var notSoWideSearchbar = this.props.notSoWideSearchbar
      ? this.props.notSoWideSearchbar
      : 'row searchbar-container';

    return (
      <div className={notSoWideSearchbar}>
        <div className={this.props.searchbarSize}>
          <div>
            <input id='allSearch' onKeyPress={this.triggerSearch} onChange={this.onAllFieldsChange} type="text" value={this.state.allFields} className={this.searchBarStyles} placeholder="Search DOE CODE for published software entries"/>
            <button onClick={this.doAdvancedSearch} className={this.advSearchButtonStyles} type='button'>
              <span className="fa fa-caret-down adv-search-button-icon"></span>
            </button>
          </div>
          {/*Advanced search dropdown*/}
          {this.state.show_dropdown && <div className={this.advDropdownStyles}>
            <div className='col-xs-12 '>
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
                  Publication Date:
                </div>
                <div className="col-lg-5 col-xs-12 text-left ">
                  <SearchField field="date_earliest" elementType="date" noExtraLabelText/>
                </div>
                <div className='col-lg-1 no-col-padding-left to-field adv-search-dropdown-label'>to</div>
                <div className="col-lg-5 col-xs-12 ">
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
