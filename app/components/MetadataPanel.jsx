import React from 'react';
import MetadataField from '../field/MetadataField';
import {observer,Provider} from "mobx-react";

@observer
export default class MetadataPanel extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		const metadata = this.props.metadata;
		
		const countries = [
			{label: 'United States', value: 'United States'},
			{label: 'Canada', value: 'Canada'},
			{label: 'France', value: 'France'},
			{label: 'Switzerland', value: 'Switzerland'},
			{label: 'United Kingdom', value: 'United Kingdom'}
			];



		return (

	            <div className="container-fluid form-horizontal">



	            {metadata.getValue("repository_link") &&
	            <div className="form-group form-group-sm row">
	        		<MetadataField field="repository_link" label="Repository Link: " elementType="display" />
	        	</div>
	            }



	    	    <div className="form-group form-group-sm row">
	            	<MetadataField field="software_title" label="Software Title" elementType="input" />
	            </div>


	            <div className="form-group form-group-sm row">
	            	<MetadataField field="acronym" label="Short Title or Acronym" elementType="input"  />
	            </div>

	            <div className="form-group form-group-sm row">
	            	<MetadataField field="doi" label="DOI" elementType="input"  />
	            </div>


	            <div className="form-group form-group-sm row">
	            	<MetadataField field="description" label="Description/Abstract" elementType="textarea" />
	            </div>


	           <div className="form-group form-group-sm row">
	            	<MetadataField  field="date_of_issuance" label="Date of Issuance" elementType="date"  />
	            </div>

	 	        <div className="form-group form-group-sm row">
	            	<MetadataField  field="country_of_origin" label="Country of Origin" options={countries} elementType="select"  />
	            </div>

	            <hr/>
	            <div className="form-group form-group-sm row">
	            <MetadataField field="keywords" label="Keywords" elementType="input" />
	            <MetadataField field="other_special_requirements" label="Other Special Requirements" elementType="input" />
	            </div>

	            <div className="form-group form-group-sm row">
	            <MetadataField field="related_software" label="Related Software" elementType="input" />
	            <MetadataField field="site_accession_number" label="Site Accession Number" elementType="input"  />
	            </div>


                </div>
		);
	}




}
