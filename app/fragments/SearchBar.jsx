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

    if (this.props.largerBar !== undefined) {
      this.searchBarStyles = "form-control input-lg search-box";
      this.advSearchButtonStyles = "btn btn-default btn-lg adv-search-button";
      this.searchButtonStyles = "btn btn-success search-btn btn-lg";
      this.advDropdownStyles = "adv-search-dropdown adv-search-dropdown-lg row";
    } else {
      this.searchBarStyles = "form-control search-box";
      this.advSearchButtonStyles = "btn btn-default adv-search-button";
      this.searchButtonStyles = "btn btn-success search-btn";
      this.advDropdownStyles="adv-search-dropdown row";
    }
  }
  onAllFieldsChange(event) {
    this.setState({"all_fields": event.target.value});
  }

  search() {
    searchData.clearValues();
    searchData.setValue("start", 0);
    searchData.setValue("all_fields", this.state.all_fields);
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    window.location.href = "/doecode/results";
  }

  doAdvancedSearch() {
    this.setState({
      show_dropdown: !this.state.show_dropdown
    });
  }

  triggerSearch(event) {
    console.log("triggered");
    if (event.key === 'Enter') {
      this.search();
    }
  }

  render() {
    return (
      <span>
        <div className='col-sm-1 hide-md hide-lg'></div>
        <div className={this.props.searchbarSize}>
          <div className='input-group'>
            <label htmlFor="allSearch" className="sr-only">Search DOE CODE for published software entries</label>
            <input id='allSearch' onKeyPress={this.triggerSearch} onChange={this.onAllFieldsChange} type="text" value={this.state.allFields} className={this.searchBarStyles} placeholder="Search DOE CODE for published sotware entries"/>
            <span className='input-group-btn hide-xs '>
              <button onClick={this.doAdvancedSearch} className={this.advSearchButtonStyles} type='button'>
                <span className="fa fa-caret-down adv-search-button-icon"></span>
              </button>
            </span>
          </div>
          {/*Advanced search dropdown*/}
          {this.state.show_dropdown && <div className={this.advDropdownStyles}>
            <div className='col-xs-12 '>
              <div className='row adv-search-dropdown-title-row'>
                <div className='col-xs-12 no-col-padding-left'>
                  Advanced Search options
                </div>
              </div>
              <br/>
              <div className='row'>
                <div className='col-xs-12'>
                  <SearchField field="software_title" label="Software Title" elementType="input" noExtraLabelText/>
                  <SearchField field="developers_contributors" label="Developers/Contributors" elementType="input" noExtraLabelText/>
                  <SearchField field="identifiers" label="Identifier Numbers" elementType="input" noExtraLabelText/>
                </div>
              </div>
              <div className="row">
                <div className="col-md-5 col-xs-12">
                  <SearchField field="date_earliest" label="Earliest Release Date" elementType="date" noExtraLabelText/>
                </div>
                <div className="col-md-5 col-xs-12">
                  <SearchField field="date_latest" label="Latest Release Date" elementType="date" noExtraLabelText/>
                </div>
              </div>
              <div className='row adv-search-dropdown-title-row'>
                <div className='col-xs-12  no-col-padding-left'>
                  <a href='/doecode/search'>More Advanced Search Options</a>
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
        <div className="col-sm-1 col-md-2 col-lg-2 col-xs-2 search-btn-container text-left minimal-col-padding-left">
          <button type="button" className={this.searchButtonStyles} onClick={this.search}>
            <span className="fa fa-search"></span>
          </button>
        </div>
      </span>
    );
  }
}
