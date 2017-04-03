import React from 'react';
import InputHelper from './InputHelper';
import EntryStepStore from '../stores/EntryStepStore';
import {observer,Provider} from "mobx-react";

const entryStore = new EntryStepStore();

@observer
export default class EntryStep extends React.Component {

	constructor(props) {
		super(props);

		this.onFieldChange = this.onFieldChange.bind(this);
		this.onRadioChange = this.onRadioChange.bind(this);
		this.isValidated = this._isValidated.bind(this);
		
		
	}
	

	_isValidated() {
		//adding validations later

		return true;
	}

    onFieldChange(field, value) {
        this.props.metadataStore.metadata[field] = value;
    }
    
    onRadioChange(field,value) {
    	let stateObj = this.state;
    	entryStore.availabilitySelected = value;
    	if (value === 'OS') {
    		this.props.metadataStore.metadata.open_source = true;
    		entryStore.showFile = false;
    	} else if (value === 'ON') {
    		this.props.metadataStore.metadata.open_source = true;
    		entryStore.showFile = true;
    	} else if (value === 'CS') {
    		this.props.metadataStore.metadata.open_source = false;
    		this.props.metadataStore.metadata.repository_link = "";
    		entryStore.showFile = true;
    	}
    }




	render() {
		const metadata = this.props.metadataStore.metadata;
		return (
				
        <div className="container-fluid">
        <div className="form-group form-group-sm row">
        <h1> Create a new software record </h1>
        </div>
        
        <div className="form-group form-group-sm row">
        <h3> A software record will contain related metadata for the submitted software. </h3>
        </div>
        <hr></hr>

        <Provider dataStore={metadata}>
        <div>        
          <div className="form-group form-group-sm row">
           <InputHelper field="repository_link" label="Repository Link" elementType="input" value={metadata.repository_link} onChange={this.onFieldChange}/>
			<button className="btn btn-primary btn-sm" onClick={this.props.autopopulate}> Autopopulate </button>								
		  </div>
		  
		  <div className="form-group form-group-sm row">
		  <h3>Please describe the availability of your software: </h3>
		  </div>
		  
		  <div className="form-group form-group-sm row">
		  <InputHelper checked={entryStore.availabilitySelected=== 'OS'} elementType="radio" label="Open Source, Publicly Available" field="availability" value="OS" onChange={this.onRadioChange}/>	  
		  </div>
		  
		  <div className="form-group form-group-sm row">
		  <InputHelper checked={entryStore.availabilitySelected === 'ON'} elementType="radio" label= "Open Source, Not Publicly Available" field="availability" value="ON" onChange={this.onRadioChange}/>	  
		  </div>
		  
		  <div className="form-group form-group-sm row">
		  <InputHelper checked={entryStore.availabilitySelected === 'CS'} elementType="radio" label="Closed Source" field="availability" value="CS" onChange={this.onRadioChange}/>	  
		  </div>
		  
		  {entryStore.showFile &&
			  <div className="form-group form-group-sm row">
		  		<label htmlFor="project_file">Software File Upload</label>
		  		<input type="file" className="form-control-file" id="project_file" name="project_file"/>
		  	  </div>
		  }
		  
		  </div>
		  </Provider>
		  
	   </div>
		);
	}




}

