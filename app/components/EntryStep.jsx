import React from 'react';
import InputHelper from './InputHelper';
import EntryStepStore from '../stores/EntryStepStore';
import {observer,Provider} from 'mobx-react';
import {Button} from 'react-bootstrap';
import Dropzone from 'react-dropzone';

const entryStore = new EntryStepStore();

@observer
export default class EntryStep extends React.Component {

	constructor(props) {
		super(props);
		this.onRadioChange = this.onRadioChange.bind(this);
		this.onDrop = this.onDrop.bind(this);		
		this.deleteFile = this.deleteFile.bind(this);
	}


	onDrop(files) {
		console.log('Received files: ', files);
		this.props.metadataStore.files = files;
	}
	
	deleteFile() {
		this.props.metadataStore.files = [];
	}
	
    onFieldChange(field, value) {
        this.props.metadataStore.metadata[field] = value;
    }
    
    onRadioChange(field,value) {
    	let stateObj = this.state;
    	entryStore.availabilitySelected = value;
    	if (value === 'OS') {
    		this.props.metadataStore.metadata.open_source = true;
    		this.props.metadataStore.files = [];
    	} else if (value === 'ON') {
    		this.props.metadataStore.metadata.open_source = true;
    	} else if (value === 'CS') {
    		this.props.metadataStore.metadata.open_source = false;
    		this.props.metadataStore.metadata.repository_link = "";
    	}
    }




	render() {
		const metadata = this.props.metadataStore.metadata;
		return (
				
        <div className="container-fluid">

        <Provider dataStore={metadata}>
        <div>        
		  
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
		  
		  {(entryStore.availabilitySelected === 'OS' || entryStore.availabilitySelected === 'ON') && this.props.metadataStore.files.length === 0 &&
		  
			 
          <div className="form-group form-group-sm row">
          <InputHelper field="repository_link" label="Repository Link" elementType="input" />
			<button className="btn btn-primary btn-sm" onClick={this.props.autopopulate}> Autopopulate </button>								
		  </div>
		  }
		  
		  {(entryStore.availabilitySelected === 'ON' || entryStore.availabilitySelected === 'CS') && !metadata.repository_link &&
		<div className="form-group form-group-sm row">
		  <label className="col-sm-2">
		  File Upload
	      </label>
		  <div className="col-sm-4">
		  		<Dropzone onDrop={this.onDrop}>
		  		<h2> Drag files here or click to browse. </h2>
		  		</Dropzone>
		  </div>
		  </div>
		 
		  
		  }
		  
		  {this.props.metadataStore.files.length > 0 &&
		 <div className="form-group form-group-sm row">
		 <label className="col-sm-2">
		 Uploaded File
		 </label>
		 <div className="col-sm-4">

		 {this.props.metadataStore.files[0].name}
		 </div>
		 <div className="col-sm-4">
		 <Button bsStyle="danger" active onClick={this.deleteFile}> Delete File </Button>
		 </div>
		 
		 </div>
			  
		  }
		  
		  </div>
		  </Provider>
		  
	   </div>
		);
	}




}

