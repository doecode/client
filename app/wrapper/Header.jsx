
import React from 'react';
import ReactDOM from 'react-dom';

import SearchData from '../stores/SearchData';

const searchData = new SearchData();
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
                    <a className="nav-menu-item" href="/doecode/login"><span className="fa fa-user"></span> Sign In</a>
                </div>
                <span id="hideable-header">
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
                                    <label htmlFor="allSearch" className="sr-only">Search DOE Code for Published Software Entries</label>
                                    <input onChange={this.onAllFieldsChange} type="text" value={this.state.allFields} className="form-control search-box input-lg"  placeholder="Search DOE Code for Published Software Entries"/>
                                    <span className='input-group-btn'>
                                        <button className='btn btn-default btn-lg adv-search-button' type='button'><span className="fa fa-cog"></span></button>
                                    </span>
                                </div>
                            </div>
                            <div className="col-xs-2">
                                <button type="button" className="btn btn-success btn-lg" onClick={this.search}>
                                    <span className="glyphicon glyphicon-search"></span>  Search
                                </button>
                            </div>
                        </div>
                        <br/>
                        <br/>
                    </div>
                    <div className='container'>
                        <div className='row'>
                            <div className='col-xs-12'>
                                <div className="navbar-header">
                                    <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#header-nav-collapse">
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                        <span className="icon-bar"></span>
                                    </button>
                                </div>
                                <div className="collapse navbar-collapse" id='header-nav-collapse'>
                                    <ul className='nav navbar-nav nav-menu'>
                                        <li className='nav-menu-item-special'>
                                            <a className='nav-menu-item' href="/doecode/"><span className='fa fa-home'></span> Home</a>
                                        </li>
                                        <li>
                                            <a className='nav-menu-item' href="/doecode/policy"><span className='fa fa-folder-open-o'></span> Software Policy</a>
                                        </li>
                                        <li>
                                            <a className='nav-menu-item' href="/doecode/publish"><span className="fa fa-sign-in"></span> Submit Software/Code</a>
                                        </li>
                                        <li>
                                            <a className='nav-menu-item' href="/doecode/about"><span className="fa fa-building-o"></span> About</a>
                                        </li>
                                        <li>
                                            <a className='nav-menu-item' href="/doecode/communcations"><span className='fa fa-newspaper-o'></span> News/Resources</a>
                                        </li>
                                        <li>
                                            <a className='nav-menu-item' href="/doecode/faq"><span className="fa fa-question"></span> FAQs</a>
                                        </li>
                                        <li className='visible-xs visible-sm hidden-md hidden-lg'>
                                            <a className="nav-menu-item" href="/doecode/login"><span className="fa fa-user"></span> Login</a>
                                        </li>
                                        <li className='visible-xs visible-sm hidden-md hidden-lg'>
                                            <a className="nav-menu-item" href="/doecode/contact"><span className="fa fa-envelope-o"></span> Contact Us</a>
                                        </li>
                                        {/*
                                        <li className='visible-xs visible-sm hidden-md hidden-lg'>
                                            <label htmlFor="allSearch" className="sr-only">Search DOE Code for Published Software Entries</label>
                                            <input onChange={this.onAllFieldsChange} type="text" value={this.state.allFields} className="form-control search-box"  placeholder="Search DOE Code for Published Software Entries"/>
                                        </li>
                                        */}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </span>
            </div>
        </nav>

        );

    }
  }
