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
			const fileInfo = metadata.getFieldInfo("file_name");
    	if (value === 'OS') {
    		metadata.setValue("open_source", true);
    		metadata.setValue("files", []);
    		metadata.setValue("landing_page", "");
				repoLinkInfo.required = "pub";
			  repoLinkInfo.Panel = "Repository Information";
				landingPageInfo.required = "";
				landingPageInfo.Panel = "";
				landingPageInfo.completed = false;
				fileInfo.required = "";
				fileInfo.Panel = "";
				fileInfo.completed = false;

    	} else {
				metadata.setValue("repository_link", "");
				repoLinkInfo.required = "";
				repoLinkInfo.completed = false;
				repoLinkInfo.Panel = "";
				landingPageInfo.required = "pub";
				landingPageInfo.Panel = "Repository Information";
				if (this.props.page == 'submit') {
							fileInfo.required = "sub";
				}
				fileInfo.Panel = "Supplemental Product Information";
			}

			if (value === 'CS') {
				metadata.setValue("open_source", false);
			} else {
				metadata.setValue("open_source", true);
			}



    }




	render() {
		const accessibility = metadata.getValue("accessibility");

		return (

                <div className="container-fluid form-horizontal">

                    <div className="form-group form-group-sm row">
                        <div className="col-xs-12">
                            <h3>Please describe the availability of your software: </h3>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <MetadataField checked={accessibility=== 'OS'} elementType="radio" label="Open Source, Publicly Available" field="availability" value="OS" onChange={this.onRadioChange}/>
                            <MetadataField checked={accessibility === 'ON'} elementType="radio" label= "Open Source, Not Publicly Available" field="availability" value="ON" onChange={this.onRadioChange}/>
                            <MetadataField checked={accessibility === 'CS'} elementType="radio" label="Closed Source" field="availability" value="CS" onChange={this.onRadioChange}/>
                        </div>
                    </div>
                    {accessibility === 'OS' &&
                    <div className="row">
                        <div className="col-md-8 col-xs-12">
                            <MetadataField field="repository_link" label="Repository Link" elementType="input" messageNode="Git Repositories Only"/>
                            
                        </div>
                        <div className="col-md-4">

                        </div>
                    </div>
                    }

                    {accessibility === 'OS' &&
                    <div className="form-group form-group-sm row">
                        <div className="col-xs-12">
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
