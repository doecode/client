import React from 'react';
import MetadataField from '../field/MetadataField';
import {observer,Provider} from 'mobx-react';
import {Button} from 'react-bootstrap';
import Metadata from '../stores/Metadata';
import EntryStepStore from '../stores/EntryStepStore';

const metadata = new Metadata();

const entryStore = new EntryStepStore();

@observer
export default class EntryStep extends React.Component {

	constructor(props) {
		super(props);
		this.onRadioChange = this.onRadioChange.bind(this);

	}

    onRadioChange(field,value) {
    	let stateObj = this.state;
    	metadata.setValue("accessibility",value);
			const landingPageInfo = metadata.getFieldInfo("landing_page");
			const repoLinkInfo = metadata.getFieldInfo("repository_link");
    	if (value === 'OS') {
    		metadata.setValue("open_source", true);
    		metadata.setValue("files", []);
    		metadata.setValue("landing_page", "");
				repoLinkInfo.required = "pub";
				landingPageInfo.required = "";
				repoLinkInfo.Panel = "Repository Information";
				landingPageInfo.Panel = "";
    	} else if (value === 'ON') {
    		metadata.setValue("open_source", true);
    		metadata.setValue("repository_link", "");
				repoLinkInfo.required = "";
				landingPageInfo.required = "pub";
				repoLinkInfo.Panel = "";
				landingPageInfo.Panel = "Repository Information";
    	} else if (value === 'CS') {
    		metadata.setValue("open_source", false);
    		metadata.setValue("repository_link", "");
				repoLinkInfo.required = "";
				landingPageInfo.required = "pub";
				repoLinkInfo.Panel = "";
				landingPageInfo.Panel = "Repository Information";
    	}

			repoLinkInfo.completed = false;
			landingPageInfo.completed = false;
    }




	render() {
		const accessibility = metadata.getValue("accessibility");

		return (

        <div className="container-fluid form-horizontal">

		  <div className="form-group form-group-sm row">
		  <h3>Please describe the availability of your software: </h3>
		  </div>


		  <MetadataField checked={accessibility=== 'OS'} elementType="radio" label="Open Source, Publicly Available" field="availability" value="OS" onChange={this.onRadioChange}/>
		  <MetadataField checked={accessibility === 'ON'} elementType="radio" label= "Open Source, Not Publicly Available" field="availability" value="ON" onChange={this.onRadioChange}/>
		  <MetadataField checked={accessibility === 'CS'} elementType="radio" label="Closed Source" field="availability" value="CS" onChange={this.onRadioChange}/>

		  {accessibility === 'OS' &&
          <MetadataField field="repository_link" label="Repository Link" elementType="input" />

		  }


		  {accessibility === 'OS' &&

	          <div className="form-group form-group-sm row">
	          <div className="col-xs-8">
			  <button className="btn btn-primary btn-sm" onClick={this.props.autopopulate}> Autopopulate from Repository</button>
			  </div>
	          </div>

		  }

		  {(accessibility === 'ON' || accessibility === 'CS')  &&
	          <MetadataField field="landing_page" label="Landing Page" elementType="input" />
		  }

	   </div>
		);
	}




}
