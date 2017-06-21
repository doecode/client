import React from 'react';
import MetadataField from '../field/MetadataField';
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
		this.props.metadata.setValue("files", files);
	}
	
	deleteFile() {
		this.props.metadata.setValue("files", []);
	}
	
    
    onRadioChange(field,value) {
    	let stateObj = this.state;
    	this.props.metadata.setValue("accessibility",value);
    	if (value === 'OS') {
    		this.props.metadata.setValue("open_source", true);
    		this.props.metadata.setValue("files", []);
    		this.props.metadata.setValue("landing_page", "");
    		this.props.metadata.setRequired("repository_link", "pub");
    		this.props.metadata.setRequired("landing_page", "");

    	} else if (value === 'ON') {
    		this.props.metadata.setValue("open_source", true);
    		this.props.metadata.setValue("repository_link", "");
    		this.props.metadata.setRequired("repository_link", "");
    		this.props.metadata.setRequired("landing_page", "pub");
    	} else if (value === 'CS') {
    		this.props.metadata.setValue("open_source", false);
    		this.props.metadata.setValue("repository_link", "");
    		this.props.metadata.setRequired("repository_link", "");
    		this.props.metadata.setRequired("landing_page", "pub");
    	}
    	
    	//hacky way of setting complete status for both to false
	    this.props.metadata.validateField("repository_link");
	    this.props.metadata.validateField("landing_page");
    }




	render() {
		const metadata = this.props.metadata;
		const repository_link = metadata.getValue("repository_link");
		const files = metadata.getValue("files");
		const accessibility = metadata.getValue("accessibility");
		
		return (
				
        <div className="container-fluid">

        <div>        
		  
		  <div className="form-group form-group-sm row">
		  <h3>Please describe the availability of your software: </h3>
		  </div>
		  
		  <div className="form-group form-group-sm row">
		  <MetadataField checked={accessibility=== 'OS'} elementType="radio" label="Open Source, Publicly Available" field="availability" value="OS" onChange={this.onRadioChange}/>	  
		  </div>
		  
		  <div className="form-group form-group-sm row">
		  <MetadataField checked={accessibility === 'ON'} elementType="radio" label= "Open Source, Not Publicly Available" field="availability" value="ON" onChange={this.onRadioChange}/>	  
		  </div>
		  
		  <div className="form-group form-group-sm row">
		  <MetadataField checked={accessibility === 'CS'} elementType="radio" label="Closed Source" field="availability" value="CS" onChange={this.onRadioChange}/>	  
		  </div>
		  
		  {accessibility === 'OS' &&
		  
          <div className="form-group form-group-sm row">
          <MetadataField field="repository_link" label="Repository Link" elementType="input" />
						
		  </div>	  
		  
		  }
		  
		  
		  {accessibility === 'OS' &&
			  
	          <div className="form-group form-group-sm row">
	          <div className="col-xs-8">
			  <button className="btn btn-primary btn-sm" onClick={this.props.autopopulate}> Autopopulate from Repository</button>	
			  </div>
	          </div>
		  
		  }
		  
		  {(accessibility === 'ON' || accessibility === 'CS')  &&
			  
	          <div className="form-group form-group-sm row">
	          <MetadataField field="landing_page" label="Landing Page" elementType="input" />							
			  </div>	  
			  
		  }
		  
		  
		  {(accessibility === 'ON' || accessibility === 'CS') &&
		<div className="form-group form-group-sm row">
		<div className="col-xs-8">
		  <label className="form-label">
		  File Upload
	      </label>
		  <div >
		  		<Dropzone onDrop={this.onDrop}>
		  		<h2> Drag files here or click to browse. </h2>
		  		</Dropzone>
		  </div>
		  
		</div>
		</div>
		 
		  
		  }
		  
		  {files.length > 0 &&
		 <div className="form-group form-group-sm row">
		 <label className="col-sm-2">
		 Uploaded File
		 </label>
		 <div className="col-sm-4">

		 {files[0].name}
		 </div>
		 <div className="col-sm-4">
		 <Button bsStyle="danger" active onClick={this.deleteFile}> Delete File </Button>
		 </div>
		 
		 </div>
			  
		  }
		  
		  </div>

	   </div>
		);
	}




}

