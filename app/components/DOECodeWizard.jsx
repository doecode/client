import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, appendQueryString, getQueryParam} from '../utils/utils';
import {observer} from "mobx-react";
import Metadata from '../stores/Metadata';
import EntryStep from './EntryStep';
import AgentsStep from './AgentsStep';
import OrgsStep from './OrgsStep';
import MetadataPanel from './MetadataPanel';
import DOIPanel from './DOIPanel';
import SupplementalInfoStep from './SupplementalInfoStep';
import ContributorsStep from './ContributorsStep';
import AccessStep from './AccessStep';
import RecipientStep from './RecipientStep';
import ConfirmStep from './ConfirmStep';
import RIsStep from './RIsStep';
import {PanelGroup, Panel} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';

import css from '../css/main.css';

const metadata = new Metadata();

let publishSteps = [];
let submitSteps = [];

@observer
export default class DOECodeWizard extends React.Component {
    constructor(props) {
        super(props);

        this.parseLoadResponse = this.parseLoadResponse.bind(this);
        this.parseSaveResponse = this.parseSaveResponse.bind(this);
        this.parsePublishResponse = this.parsePublishResponse.bind(this);
        this.parseSubmitResponse = this.parseSubmitResponse.bind(this);
        this.autopopulate = this.autopopulate.bind(this);
        this.save = this.save.bind(this);
        this.publish = this.publish.bind(this);
        this.submit = this.submit.bind(this);
        this.parseReceiveResponse = this.parseReceiveResponse.bind(this);
        this.parseErrorResponse = this.parseErrorResponse.bind(this);
        this.buildPanel = this.buildPanel.bind(this);
        this.showAdditionalFields = this.showAdditionalFields.bind(this);

        this.state= {"loading" : false, "loadingMessage" : "", "editLoad" : false, "published" : false, "showAll" : false};



        publishSteps = [
        {name: 'Repository Information', component: <EntryStep metadata={metadata} autopopulate={this.autopopulate}/> },
        {name: 'Product Description', component: <MetadataPanel metadata={metadata}/>},
        {name: 'Developers', component: <AgentsStep />},
        {name: 'DOI and Release Date', component: <DOIPanel metadata={metadata}/>}
        ];

       submitSteps = [
   		{name: 'Supplemental Product Information', component: <SupplementalInfoStep/>},
   		{name: 'Organizations', component: <OrgsStep />},
   		{name: 'Contributors and Contributing Organizations', component: <ContributorsStep/>},
   		{name: 'Identifiers', component: <RIsStep />},
   		{name: 'Contact Information', component: <RecipientStep />}
       ];
        /*

         *
        		{name: 'Licenses & Access Limitations', component: <AccessStep metadata={metadata} />},
         {name: 'Developers & Contributors', component: <AgentsStep metadata={metadata} />},
        		{name: 'Organizations', component: <OrgsStep metadata={metadata}/>},
        		{name: 'Identifiers', component: <RIsStep metadata={metadata}/>},
        		{name: 'Recipient Information', component: <RecipientStep metadata={metadata}/>},
        		{name: 'Summary', component: <ConfirmStep metadata={metadata}/> }
         */
        let i = 0;
        for (i = 0; i < publishSteps.length; i++)
        	publishSteps[i].key = "" + (i+1);

        let x = 0;
        for (x = 0; x < submitSteps.length; x++)
        	submitSteps[x].key = "" + (x+i+1);
    }

  parseErrorResponse() {
    this.setState({"loading" : false, "loadingMessage" : ""});
  }

 componentDidMount() {
        const workflowStatus = getQueryParam("workflow");

        console.log(workflowStatus);
        if (workflowStatus && workflowStatus === "published") {
            this.setState({"published" : true, "showAll" : true});
        } else {
           metadata.requireOnlyPublishedFields();
        }

        const codeID = getQueryParam("code_id");
        if (codeID) {
  //          this.setState({"loading" : true, "loadingMessage" : "Loading"});
        	doAjax('GET', "api/metadata/" + codeID, this.parseReceiveResponse, undefined, this.parseErrorResponse);
        }

    }
 
 showAdditionalFields() {
	 
	 console.log("Called");
	 this.setState({"showAll" : true});
 }

    parseReceiveResponse(data) {

    	metadata.deserializeData(data.metadata);
        this.setState({"loading" : false, "loadingMessage" : ""});
    }

    autopopulate(event) {
        this.setState({"loading" : true, "loadingMessage" : "Loading"});
    	doAjax('GET', "/api/metadata/autopopulate?repo=" + metadata.getValue('repository_link'),this.parseLoadResponse, undefined, this.parseErrorResponse);
    	event.preventDefault();
    }


    parseLoadResponse(responseData) {

    	if (responseData !== undefined)
    		metadata.updateMetadata(responseData.metadata);
        this.setState({"loading" : false, "loadingMessage" : ""});
    }

    save() {

        this.setState({"loading" : true, "loadingMessage" : "Saving"});
    	doAjax('POST', '/api/metadata/',this.parseSaveResponse, metadata.serializeData(), this.parseErrorResponse);
    }

    parseSaveResponse(data) {
        this.setState({"loading" : false, "loadingMessage" : ""});
        metadata.setValue("code_id", data.metadata.code_id);
    }

    publish() {
        this.setState({"loading" : true, "loadingMessage" : "Publishing"});
    	doAjax('POST', '/api/metadata/publish',this.parsePublishResponse, metadata.serializeData(), this.parseErrorResponse);
    }

    submit() {
        this.setState({"loading" : true, "loadingMessage" : "Submitting"});
    	doAjax('POST', '/api/metadata/submit',this.parseSubmitResponse, metadata.serializeData(), this.parseErrorResponse);
    }

    parsePublishResponse(data) {
    	window.location.href = "confirm?workflow=published&code_id=" + data.metadata.code_id;
    }

    parseSubmitResponse(data) {

      window.location.href = "confirm?workflow=submitted&code_id=" + data.metadata.code_id;
    }

    buildPanel(obj) {
        let heading = obj.name;
        let panelStyle = "default";


        const panelStatus = metadata.getPanelStatus(obj.name);

             if (panelStatus.remainingRequired > 0) {
                  heading += " (Required Fields Remaining: " + panelStatus.remainingString + ")";
             }
             else {

            	 if (panelStatus.hasRequired) {
            		 heading += " (All Required Fields Completed) ";
                     panelStyle = "success";
            	 } else {
            		 heading += " (No Required Fields) ";
                     panelStyle = "success";
            	 }

             }



        if (panelStatus.hasOptional) {
             if (panelStatus.remainingOptional > 0) {
                  heading += " (" + panelStatus.remainingOptional + " Optional Field(s) Remaining)";
             }
             else {

            	 if (panelStatus.hasOptional) {
                 heading += " (All Optional Fields Completed) ";
            	 }
             }
        }

        if (panelStatus.errors) {

        	heading += " This section contains errors. "
        	panelStyle = "danger";
        }
        return <Panel header={heading} bsStyle={panelStyle} eventKey={obj.key} key={obj.key}>

      	<div>
      	<div className="row">

        <div className="col-sm-12">
		<button type="button" className="btn btn-info btn-lg pull-right" onClick={this.save}>
		Save Your Progress
		</button>
		</div>


		</div>

		</div>

        {panelStatus.errors &&
        <div className="error-color">
        <h3> <strong> {panelStatus.errors} </strong> </h3>
        </div>
        }

        {obj.component}

        </Panel>
        }



    render() {

      const info = metadata.infoSchema;
      const submitDisabled = !metadata.validateSchema();
      const publishDisabled = !metadata.validatePublishedFields();
      const codeID = metadata.getValue("code_id");

      let headerText = "Create a New Software Record";

      if (codeID !== undefined && codeID > 0)
    	  headerText = "Editing Software Record #" + codeID;

      const self = this;

        const publishHeader = <div> <strong> Fields Required to Publish this Record on DOE Code </strong>


        </div>

        ;
        const publishPanels = publishSteps.map(this.buildPanel);

        const submitHeader = <strong> Additional Fields Required to Submit to E-Link </strong>;
        
        let submitPanels = null;
        
        if (this.state.showAll) {
        	submitPanels = submitSteps.map(this.buildPanel);
        }
        
        const marginStyle = {
          'margin-bottom' : '5px'
        };
        

        let button = null;

        if (this.state.published) {
        button =             <div className="form-group-xs row">
                            <div className="col-sm-12">
                                <button style={marginStyle} type="button" className="btn btn-primary btn-lg pull-right" disabled={submitDisabled} onClick={this.submit}>
                                    Submit Record to E-Link
                                </button>
                            </div>
                        </div>
        } else {
          button =           <div className="form-group-xs row">
                          <div className="col-sm-12">
                              <button style={marginStyle} type="button" className="btn btn-lg btn-primary pull-right" disabled={publishDisabled} onClick={this.publish}>
                                  Publish Record
                              </button>
                          </div>
                      </div>
        }

        let content = <div>
        {button}
        <PanelGroup defaultActiveKey="1" accordion>
        {publishPanels}        
        {submitPanels}
        
        
        </PanelGroup>
        {!this.state.showAll &&
        <div className="form-group-xs row text-center">
        <div className="col-xs-offset-3 col-xs-6">
        <button type="button" className="btn btn-info btn-lg" onClick={this.showAdditionalFields}>
        <span className="glyphicon glyphicon-plus"></span> Show Additional Optional Fields
        </button>
        </div>
        </div>
        }
        
        </div>

        return (


      <div>




        <div className="form-group form-group-sm row">
        <div className="col-xs-offset-3 col-xs-6">

        <h1 className="text-center"> {headerText} </h1>
        </div>

        </div>
        {content}



    <Modal show={this.state.loading} >
        <Modal.Header closeButton>
            <Modal.Title>{this.state.loadingMessage}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="loader"></div>
        </Modal.Body>
    </Modal>



    </div>

        );
    }
}
