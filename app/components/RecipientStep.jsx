import React from 'react';
import InputHelper from './InputHelper';
import {observer,Provider} from "mobx-react";

@observer
export default class RecipientStep extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		
		return (
				
	            <div className="container-fluid form-horizontal">
	            
	            
	            <Provider dataStore={this.props.metadataStore}>
	            <div>
	            
	            
	    	    <div className="form-group form-group-sm row">
	            	<InputHelper field="recipient_name" label="Name" elementType="input" />
	            </div>
	            
	            
	            <div className="form-group form-group-sm row">
	            	<InputHelper field="recipient_email" label="Email" elementType="input"  />                
	            </div>
	            
	            <div className="form-group form-group-sm row">
	            	<InputHelper field="recipient_phone" label="Phone" elementType="input"  />              
	            </div>
	            
	            	
	            <div className="form-group form-group-sm row">
	            	<InputHelper field="recipient_org" label="Organization" elementType="input" />
	            </div>

	            
	            </div>
                </Provider>

               
                </div>
		);
	}




}