import React from 'react';
import ReactDOM from 'react-dom';
import {observer} from "mobx-react";
import SearchData from '../stores/SearchData';
import SearchField from '../field/SearchField';

const searchData = new SearchData();


@observer
export default class AdvancedSearch extends React.Component {
    constructor(props) {
    super(props);
    }
 
 	render() {	
 		
		const orgNames = [
			{label: 'USDOE', value: 'USDOE'},
			{label: 'USDOE Advanced Research Projects Agency - Energy (ARPA-E)', value: 'USDOE Advanced Research Projects Agency - Energy (ARPA-E)'}
		];
		
		const availabilities = [
			{label: 'Open Source, Publicly Available', value: 'OS'},
			{label: 'Open Source, Not Publicly Available', value: 'ON'},
			{label: 'Closed Source', value: 'CS'}
		];
		
		const sortOptions = [
			{label: 'Relevance (highest to lowest)', value: 'relevance'},
			{label: 'Publication Date (newest to oldest)', value: 'pub_date_desc'},
			{label: 'Publication Date (oldest to newest)', value: 'pub_date_asc'}
		];
 	//console.log(searchData.getData());
 	return(
 	
    <div className="container-fluid form-horizontal">
 	
    <SearchField field="all_fields" label="All Fields" elementType="input" />
	<SearchField field="software_title" label="Software Title" elementType="input" />
	<SearchField field="developers_contributors" label="Developers/Contributors" elementType="input" />
	<SearchField field="bib_data" label="Bibliographic Data" elementType="input" />	
	<SearchField field="identifiers" label="Identifier Numbers" elementType="input" />	
	<SearchField field="date_earliest" label="Earliest Release Date" elementType="date" />	
	<SearchField field="date_latest" label="Latest Release Date" elementType="date" />
	<SearchField field="availability" label="Code Availability" elementType="select" options={availabilities} placeholder="Software's availability"  />
 	<SearchField  field="research_organization" label="Research Organization" elementType="select" allowCreate={true} placeholder="Enter or select an organization from the list." options={orgNames}   />
 	<SearchField  field="sponsoring_organization" label="Sponsoring Organization" elementType="select" allowCreate={true} placeholder="Enter or select an organization from the list." options={orgNames}   />
    <SearchField field="sort" label="Sort" elementType="select" options={sortOptions}  />	
	
    </div>
 	
 	);
 	
 	}
    
 }


