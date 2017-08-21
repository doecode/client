
import React from 'react';
import ReactDOM from 'react-dom';

import SearchData from '../stores/SearchData';
import NavigationBar from '../fragments/NavigationBar';
import SigninStatus from '../fragments/SigninStatus';

const searchData = new SearchData();
let navbar_classes = "";
export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {all_fields : searchData.getValue("all_fields")};
        this.onAllFieldsChange = this.onAllFieldsChange.bind(this);
        this.search = this.search.bind(this);
    }

    onAllFieldsChange(event) {
      this.setState({"all_fields" : event.target.value});
    }

    search() {
    searchData.clearValues();
    searchData.setValue("start", 0);
    searchData.setValue("all_fields", this.state.all_fields);
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    window.location.href = "/doecode/results";
    }

    doAdvancedSearch(){
        window.location.href="/doecode/search";
    }

    render() {
        return (

        <nav className="navbar navbar-default main-header" >
            <div className="container-fluid">
                <div className="pull-right hidden-xs hidden-sm visible-md visible-lg header-signin-links">
                    <SigninStatus />
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
                                <input onChange={this.onAllFieldsChange} type="text" value={this.state.allFields} className="form-control search-box input-lg"  placeholder="Search DOE CODE for Published Software Entries"/>
                                <span className='input-group-btn'>
                                    <button onClick={this.doAdvancedSearch} className='btn btn-default btn-lg adv-search-button' type='button'><span className="fa fa-cog"></span></button>
                                </span>
                            </div>
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
                <NavigationBar />
            </div>
        </nav>

        );

    }
  }
