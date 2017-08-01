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
    window.location.href = "/results";
    }





    render() {

        const inputStyle = {
            "fontSize": "20px"
        };

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">

                  <div className="mt-1">
                    <div className="col-xs-offset-1 col-xs-3">
                        <a href="/">
                          <img className="img-responsive" src="https://www.osti.gov/doecode/images/DOEcode_logo_300px_72ppi.png" alt="DOECode" width="300"/>
                        </a>
                    </div>
                    <div className="col-xs-4">
                        <label htmlFor="allSearch" className="sr-only">Search DOE Code for Published Software Entries</label>
                        <input onChange={this.onAllFieldsChange} type="text" value={this.state.allFields} id="allSearch" className="form-control" style={inputStyle} placeholder="Search DOE Code for Published Software Entries"></input>

                    </div>
                    <div className="col-xs-4">
                      <button type="button" className="btn btn-success" onClick={this.search}>
                        <span className="glyphicon glyphicon-search"></span>  Search
                      </button>
                    </div>
                  </div>
                    <div className="col-xs-offset-1 col-xs-9">
                        <ul className="nav navbar-nav">
                            <li>
                                <a href="#">Software Policy</a>
                            </li>
                            <li>
                                <a href="/publish">Submit Sofware/Code</a>
                            </li>
                            <li>
                                <a href="#">About</a>
                            </li>
                            <li>
                                <a href="#">Communications/Resources</a>
                            </li>
                            <li>
                                <a href="#">FAQs</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        );

    }
  }
