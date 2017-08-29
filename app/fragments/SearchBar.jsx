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

  triggerSearch(event){
    console.log("triggered");
    if (event.key === 'Enter') {
      this.search();
    }
  }

  render() {
    return (
      <span>
        <div className={this.props.searchbarSize}>
          <div className='input-group'>
            <label htmlFor="allSearch" className="sr-only">Search DOE CODE for Published Software Entries</label>
            <input id='allSearch' onKeyPress={this.triggerSearch} onChange={this.onAllFieldsChange} type="text" value={this.state.allFields} className="form-control search-box" placeholder="Search DOE CODE for Published Software Entries"/>
            <span className='input-group-btn'>
              <button onClick={this.doAdvancedSearch} className='btn btn-default adv-search-button' type='button'>
                <span className="fa fa-caret-down adv-search-button-icon"></span>
              </button>
            </span>
          </div>
          {/*Advanced search dropdown*/}
          {this.state.show_dropdown && <div className='adv-search-dropdown row'>
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
        <div className="col-xs-2 search-btn-container text-left no-col-padding-left">
          <button type="button" className="btn btn-success search-btn" onClick={this.search}>
            <span className="fa fa-search"></span>
          </button>
        </div>
      </span>
    );
  }
}
