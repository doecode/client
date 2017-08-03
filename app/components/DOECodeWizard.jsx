import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, checkIsAuthenticated, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';
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

    this.parseAutopopulateResponse = this.parseAutopopulateResponse.bind(this);
    this.parseSaveResponse = this.parseSaveResponse.bind(this);
    this.parsePublishResponse = this.parsePublishResponse.bind(this);
    this.parseSubmitResponse = this.parseSubmitResponse.bind(this);
    this.autopopulate = this.autopopulate.bind(this);
    this.save = this.save.bind(this);
    this.publish = this.publish.bind(this);
    this.submit = this.submit.bind(this);
    this.parseReceiveResponse = this.parseReceiveResponse.bind(this);
    this.parseErrorResponse = this.parseErrorResponse.bind(this);
    this.setActivePanel = this.setActivePanel.bind(this);
    this.buildPanel = this.buildPanel.bind(this);
    this.showAdditionalFields = this.showAdditionalFields.bind(this);

    this.state = {
        "loading": false,
        "loadingMessage": "",
        "editLoad": false,
        "published": false,
        "showAll": false,
        "activePanel": 1
    };

    publishSteps = [
        {
            name: 'Repository Information',
            component: <EntryStep metadata={metadata} autopopulate={this.autopopulate}/>
        }, {
            name: 'Product Description',
            component: <MetadataPanel metadata={metadata}/>
        }, {
            name: 'Developers',
            component: <AgentsStep/>
        }, {
            name: 'DOI and Release Date',
            component: <DOIPanel metadata={metadata}/>
        }
    ];

    submitSteps = [
        {
            name: 'Supplemental Product Information',
            component: <SupplementalInfoStep/>
        }, {
            name: 'Organizations',
            component: <OrgsStep/>
        }, {
            name: 'Contributors and Contributing Organizations',
            component: <ContributorsStep/>
        }, {
            name: 'Identifiers',
            component: <RIsStep/>
        }, {
            name: 'Contact Information',
            component: <RecipientStep/>
        }
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
        publishSteps[i].key = "" + (i + 1);

    let x = 0;
    for (x = 0; x < submitSteps.length; x++)
        submitSteps[x].key = "" + (x + i + 1);
    }

parseErrorResponse(jqXhr, exception) {

    if (jqXhr.status === 401) {
        window.sessionStorage.lastLocation = window.location.href;
        window.sessionStorage.lastRecord = JSON.stringify(metadata.getData());
        window.location.href = '/doecode/login?redirect=true';

    } else if (jqXhr.status === 403) {
        window.location.href = '/doecode/forbidden';
    } else {
        window.location.href = '/doecode/error';
    }

}

componentDidMount() {
    const workflowStatus = getQueryParam("workflow");

    console.log(workflowStatus);
    if (window.location.pathname == '/doecode/submit') {
        this.setState({"showAll": true});
    } else {
        metadata.requireOnlyPublishedFields();
    }

    const codeID = getQueryParam("code_id");

    if (window.sessionStorage.lastRecord) {
        //do an authenticated ajax against our allowed endpoing to check if valid and then do this in the success response...
        checkIsAuthenticated();
        metadata.loadValues(JSON.parse(window.sessionStorage.lastRecord));
        window.sessionStorage.lastRecord = "";

    } else if (codeID) {
        this.setState({"loading" : true, "loadingMessage" : "Loading"});
        doAuthenticatedAjax('GET', "/doecode/api/metadata/" + codeID, this.parseReceiveResponse);
    } else {
        checkIsAuthenticated();
    }

    //else, do an authenticated check...

}

 showAdditionalFields() {
	 this.setState({"showAll" : true});
 }

parseReceiveResponse(data) {
    metadata.deserializeData(data.metadata);
    this.setState({"loading": false, "loadingMessage": ""});
}

autopopulate(event) {
    this.setState({"loading": true, "loadingMessage": "Loading"});
    doAjax('GET', "/doecode/api/metadata/autopopulate?repo=" + metadata.getValue('repository_link'), this.parseAutopopulateResponse);
    event.preventDefault();
}

parseAutopopulateResponse(responseData) {

    if (responseData !== undefined) {
        metadata.updateMetadata(responseData.metadata);
      }
    this.setState({"loading": false, "loadingMessage": ""});
}

save() {

    this.setState({"loading": true, "loadingMessage": "Saving"});
    doAuthenticatedAjax('POST', '/doecode/api/metadata/', this.parseSaveResponse, metadata.serializeData(), this.parseErrorResponse);
}

parseSaveResponse(data) {
    this.setState({"loading": false, "loadingMessage": ""});
    metadata.setValue("code_id", data.metadata.code_id);
}

publish() {
    console.log(metadata.getData());

    this.setState({"loading": true, "loadingMessage": "Publishing"});
    doAuthenticatedAjax('POST', '/doecode/api/metadata/publish', this.parsePublishResponse, metadata.serializeData(), this.parseErrorResponse);
}

submit() {
    this.setState({"loading": true, "loadingMessage": "Submitting"});
    doAuthenticatedAjax('POST', '/doecode/api/metadata/submit', this.parseSubmitResponse, metadata.serializeData(), this.parseErrorResponse);
}

parsePublishResponse(data) {
    window.location.href = "/doecode/confirm?workflow=published&code_id=" + data.metadata.code_id;
}

parseSubmitResponse(data) {

    window.location.href = "/doecode/confirm?workflow=submitted&code_id=" + data.metadata.code_id;
}

setActivePanel(currentKey) {
    console.log(currentKey);
    console.log(this.state.activePanel);
    if (currentKey == this.state.activePanel) {
        this.setState({"activePanel": -1});
    } else {
        this.setState({"activePanel": currentKey});
    }
}

buildPanel(obj) {
        let requiredText = "";
        let optionalText = "";
        let panelStyle = "default";


        const panelStatus = metadata.getPanelStatus(obj.name);

             if (panelStatus.remainingRequired > 0) {
                  requiredText += " (Required Fields Remaining: " + panelStatus.remainingString + ")";
             }
             else {

            	 if (panelStatus.hasRequired) {
            		 requiredText += " (All Required Fields Completed) ";
            	 } else {
            		 requiredText += " (No Required Fields) ";
            	 }
             }



        if (panelStatus.hasOptional) {
             if (panelStatus.remainingOptional > 0) {
                  optionalText += " (" + panelStatus.remainingOptional + " Optional Field(s) Remaining)";
             }
             else {

            	 if (panelStatus.hasOptional) {
                 optionalText += " (All Optional Fields Completed) ";
            	 }
             }
        }

        const heading = <div> {obj.name}
        {requiredText}
        {panelStatus.hasRequired && panelStatus.remainingRequired == 0 &&
        <span className="green glyphicon glyphicon-ok"></span>
        }
        {optionalText}
        {this.state.activePanel == obj.key &&
        <span className="pull-right glyphicon glyphicon-chevron-down"></span>
        }

        {this.state.activePanel != obj.key &&
        <span className="pull-right glyphicon glyphicon-chevron-right"></span>
        }
      </div>;

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

      </Panel>;
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

        if (window.location.pathname == '/doecode/submit') {
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

        <PanelGroup defaultActiveKey="1" accordion onSelect={this.setActivePanel}>
        {publishPanels}
        {submitPanels}


        </PanelGroup>
        {button}
        {!this.state.showAll &&
        <div className="form-group-xs row text-center">
        <div className="col-xs-offset-3 col-xs-6">
        <button type="button" className="btn btn-info btn-lg" onClick={this.showAdditionalFields}>
        <span className="glyphicon glyphicon-plus"></span> Show Additional Optional Fields
        </button>
        </div>
        </div>
        }

      </div>;

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
