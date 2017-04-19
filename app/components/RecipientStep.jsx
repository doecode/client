import React from 'react';
import MetadataField from '../field//MetadataField';
import {observer,Provider} from "mobx-react";

@observer
export default class RecipientStep extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		
		return (
				
	            <div className="container-fluid form-horizontal">
	            
	            
	            
	            
	    	    <div className="form-group form-group-sm row">
	            	<MetadataField field="recipient_name" label="Name" elementType="input" />
	            </div>
	            
	            
	            <div className="form-group form-group-sm row">
	            	<MetadataField field="recipient_email" label="Email" elementType="input"  />                
	            </div>
	            
	            <div className="form-group form-group-sm row">
	            	<MetadataField field="recipient_phone" label="Phone" elementType="input"  />              
	            </div>
	            
	            	
	            <div className="form-group form-group-sm row">
	            	<MetadataField field="recipient_org" label="Organization" elementType="input" />
	            </div>

               
                </div>
		);
	}




}