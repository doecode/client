import React from 'react';
import ReactDOM from 'react-dom';
import SearchData from '../stores/SearchData';
import NavigationBar from '../fragments/NavigationBar';
import SigninStatus from '../fragments/SigninStatus';
import SearchField from '../field/SearchField';
import AdvancedSearchButton from '../dissemination/AdvancedSearchButton';

const searchData = new SearchData();
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      all_fields: searchData.getValue("all_fields"),
      show_dropdown: false
    };
    this.onAllFieldsChange = this.onAllFieldsChange.bind(this);
    this.search = this.search.bind(this);
    this.doAdvancedSearch = this.doAdvancedSearch.bind(this);
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
    //window.location.href = "/doecode/search";
    this.setState({
      show_dropdown: !this.state.show_dropdown
    });
  }

  render() {
    return (

      <nav className="navbar navbar-default main-header">
        <div className="container-fluid">
          <div className="pull-right hidden-xs hidden-sm visible-md visible-lg header-signin-links">
            <SigninStatus/>
          </div>
          <div className='container hidden-xs hidden-sm visible-md visible-lg'>
            <br/>
            <br/>
            <br/>
            <div className='row'>
              <div className="col-xs-4 right-text">
                <a href="/doecode">
                  <img src="https://www.osti.gov/doecode/images/DOEcode300px_white.png" alt="DOECode" width="300"/>
                </a>
              </div>
              <div className="col-xs-6">
                <div className='input-group'>
                  <label htmlFor="allSearch" className="sr-only">Search DOE CODE for Published Software Entries</label>
                  <input onChange={this.onAllFieldsChange} type="text" value={this.state.allFields} className="form-control search-box input-lg" placeholder="Search DOE CODE for Published Software Entries"/>
                  <span className='input-group-btn'>
                    <button onClick={this.doAdvancedSearch} className='btn btn-default btn-lg adv-search-button' type='button'>
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
                    <div classname='row'>
                      <div className='col-xs-12 right-text'>
                        <AdvancedSearchButton/>
                      </div>
                    </div>
                  </div>
                </div>}
              </div>
              <div className="col-xs-2 search-btn-container">
                <button type="button" className="btn btn-success btn-lg" onClick={this.search}>
                  <span className="fa fa-search"></span>
                </button>
              </div>
            </div>
            <br/>
            <br/>
          </div>
          {/*Actual Navbar*/}
          <NavigationBar/>
        </div>
      </nav>

    );

  }
}
