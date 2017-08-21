import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from "mobx-react";
import {doAjax} from '../utils/utils';
import SearchData from '../stores/SearchData';
import SearchField from '../field/SearchField';
import staticLists from '../staticJson/staticLists';
import staticContstants from '../staticJson/constantLists';

const searchData = new SearchData();


@observer
export default class AdvancedSearch extends React.Component {
    constructor(props) {
    super(props);
    this.search = this.search.bind(this);
    }

    search() {
    searchData.setValue("start", 0);
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    window.location.href = "/doecode/results";
    }

    //parseSearchResponse

 	render() {

 	//console.log(searchData.getData());
 	return(
        <div className="row not-so-wide-row">
            <div className="col-md-3"></div>
            <div className="col-md-6 col-xs-12">
                <div className="row advanced-search-panel">
                    <div className="col-md-1"></div>
                    <div className="col-md-10 col-xs-12">
                        <br/>
                        <div className="row">
                            <div className="col-xs-12">    
                                <SearchField field="all_fields" label="All Fields" elementType="input" />
                                <SearchField field="software_title" label="Software Title" elementType="input" />
                                <SearchField field="developers_contributors" label="Developers/Contributors" elementType="input" />
                                <SearchField field="biblio_data" label="Bibliographic Data" elementType="input" />
                                <SearchField field="identifiers" label="Identifier Numbers" elementType="input" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-12">
                                <SearchField field="date_earliest" label="Earliest Release Date" elementType="date" />
                            </div>
                            <div className="col-md-6 col-xs-12">
                                <SearchField field="date_latest" label="Latest Release Date" elementType="date" />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <SearchField field="availability" label="Code Availability" elementType="select" options={staticContstants.availabilities} placeholder="Software's availability"  />
                                <SearchField  field="research_organization" label="Research Organization" elementType="select" allowCreate={true} placeholder="Enter or select an organization from the list." options={staticLists.researchOrgs}   />
                                <SearchField  field="sponsoring_organization" label="Sponsoring Organization" elementType="select" allowCreate={true} placeholder="Enter or select an organization from the list." options={staticLists.sponsorOrgs}   />
                                <SearchField field="sort" label="Sort" elementType="select" options={staticContstants.searchSortOptions} clearable={false}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-12">
                                <button type="button" className="btn btn-lg btn-primary" onClick={this.search}>
                                    <span className="fa fa-search"></span>  Search
                                </button>
                            </div>
                            <br/>
                        </div>
                        <br/>
                    </div>
                    <div className="col-md-1"></div>    
                </div>
                <br/>
            </div>
            <div className="col-md-3"></div>
        </div>
 	);

 	}

 }
