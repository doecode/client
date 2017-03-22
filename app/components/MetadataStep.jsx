import React from 'react';
import InputHelper from './InputHelper';
import {observer} from "mobx-react";

@observer
export default class MetadataStep extends React.Component {

	constructor(props) {
		super(props);

		this.onFieldChange = this.onFieldChange.bind(this);
		this.isValidated = this._isValidated.bind(this);
	}

	_isValidated() {
		//adding validations later

		return true;
	}

    onFieldChange(id, value) {
        this.props.metadataStore.metadata[id] = value;
    }




	render() {
		const metadata = this.props.metadataStore.metadata;
		
		
		return (
	            <div className="container-fluid form-horizontal">

	            {metadata.repository_link &&
	            	
	            <div className="form-group form-group-sm row">
            		<InputHelper field="repository_link" label="Repository Link: " elementType="display" value={metadata.repository_link}/>
            	</div>
	            }
	            
                
                <div className="form-group form-group-sm row">
                	<InputHelper field="software_title" label="Software Title" elementType="input" value={metadata.software_title} onChange={this.onFieldChange}/>
                </div>
                
                
                <div className="form-group form-group-sm row">
                	<InputHelper field="acronym" label="Short Title or Acronym" elementType="input" value={metadata.acronym} onChange={this.onFieldChange}/>                
                </div>
                
                <div className="form-group form-group-sm row">
                	<InputHelper field="doi" label="DOI" elementType="input" value={metadata.doi} onChange={this.onFieldChange}/>              
                </div>
                
                	
                <div className="form-group form-group-sm row">
                	<InputHelper field="description" label="Description/Abstract" elementType="textarea" value={metadata.description} onChange={this.onFieldChange}/>
                </div>
                	
                	
               <div className="form-group form-group-sm row">
                	<InputHelper divStyle="col-sm-10" field="date_of_issuance" label="Date of Issuance" elementType="date" value={metadata.date_of_issuance} onChange={this.onFieldChange}/>
                </div>
                	
                	
                <hr/>	
                <div className="form-group form-group-sm row">
                <InputHelper field="keywords" label="Keywords" elementType="input" value={metadata.keywords} onChange={this.onFieldChange}/>
                <InputHelper field="other_special_requirements" label="Other Special Requirements" elementType="input" value={metadata.other_special_requirements} onChange={this.onFieldChange}/>
                </div>
                
                <div className="form-group form-group-sm row">
                <InputHelper field="related_software" label="Related Software" elementType="input" value={metadata.related_software} onChange={this.onFieldChange}/>
                <InputHelper field="site_accession_number" label="Site Accession Number" elementType="input" value={metadata.site_accession_number} onChange={this.onFieldChange}/>
                </div>
                

               
                </div>
		);
	}




}
