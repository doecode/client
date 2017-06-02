import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, appendQueryString, getQueryParam} from '../utils/utils';
import {observer} from "mobx-react";
import Metadata from '../stores/Metadata';
import EntryStep from './EntryStep';
import AgentsStep from './AgentsStep';
import OrgsStep from './OrgsStep';
import MetadataPanel from './MetadataPanel';
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

        this.state= {"loading" : false, "loadingMessage" : "", "editLoad" : false};



        publishSteps = [
        {name: 'Repository Information', component: <EntryStep metadata={metadata} autopopulate={this.autopopulate}/> },
        {name: 'Product Description', component: <MetadataPanel metadata={metadata}/>},
        {name: 'Developers', component: <AgentsStep />},
        ];

       submitSteps = [
   		{name: 'Supplemental Product Information', component: <SupplementalInfoStep/>},
   		{name: 'Sponsors and Research Organizations', component: <OrgsStep />},
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
        
        for (var x = 0; x < submitSteps.length; x++)
        	submitSteps[x].key = "" + (x+1);
    }

  parseErrorResponse() {
    this.setState({"loading" : false, "loadingMessage" : ""});
  }

    componentDidMount() {
        const codeID = getQueryParam("code_id");
        if (codeID) {
  //          this.setState({"loading" : true, "loadingMessage" : "Loading"});
        	doAjax('GET', "api/metadata/" + codeID, this.parseReceiveResponse, undefined, this.parseErrorResponse);
        }
    	
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
    	window.location.href = "confirm?code_id=" + data.metadata.code_id;
    }

    parseSubmitResponse(data) {
    	
      let url = "confirm?code_id=" + data.metadata.code_id;
    	  url += "&mintedDoi=" + data.metadata.doi;
      
      window.location.href = url;

    }

    buildPanel(obj) {
        let heading = obj.name;
        let panelStyle = "default";


        const panelStatus = metadata.getPanelStatus(obj.name);

             if (panelStatus.remainingRequired > 0) {
                  heading += " (" + panelStatus.remainingRequired + " Required Field(s) Remaining)";
             }
             else {
                 heading += " (All Required Fields Completed) ";
                 panelStyle = "success";
             }
        


        if (panelStatus.hasOptional) {
             if (panelStatus.remainingOptional > 0) {
                  heading += " (" + panelStatus.remainingOptional + " Optional Field(s) Remaining)";
             }
             else {
                 heading += " (All Optional Fields Completed) ";
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

		<button type="button" className="btn btn-sm btn-primary pull-right" disabled={publishDisabled} onClick={this.publish}>
		Publish Record on DOE Code
		</button>
        </div>
        
        ;
        const publishPanels = publishSteps.map(this.buildPanel);
        
        const submitHeader = <strong> Additional Fields Required to Submit to E-Link </strong>;
        const submitPanels = submitSteps.map(this.buildPanel);
        
        let content = <div>
        
        <Panel bsStyle="default" header={publishHeader}>
        	
        <PanelGroup defaultActiveKey="1" accordion>
        {publishPanels}
        
        </PanelGroup>
       

        </Panel>
        
        
        <Panel bsStyle="default" header={submitHeader}>
    	
        <PanelGroup accordion>
        {submitPanels}
        
        </PanelGroup>
        
        <div className="row">



        <div className="col-sm-12">
 		<button type="button" className="btn btn-primary btn-lg pull-right" disabled={submitDisabled} onClick={this.submit}>
 		Publish Record and Submit
 		</button>
 		</div>


 	    </div>
        </Panel>
        </div>
        
        return (


      <div>




        <div className="form-group form-group-sm row">
        <div className="col-sm-offset-4">
        
        <h1> {headerText} </h1>
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
