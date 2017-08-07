import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, checkIsAuthenticated, doAuthenticatedAjax, appendQueryString, getQueryParam, doAuthenticatedMultipartRequest} from '../utils/utils';
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
/*import css from '../css/main.css';*/

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
    this.doMultipartSubmission = this.doMultipartSubmission.bind(this);
    this.parseReceiveResponse = this.parseReceiveResponse.bind(this);
    this.parseErrorResponse = this.parseErrorResponse.bind(this);
    this.setActivePanel = this.setActivePanel.bind(this);
    this.buildPanel = this.buildPanel.bind(this);
    this.showAdditionalFields = this.showAdditionalFields.bind(this);
    this.panelSelect = this.panelSelect.bind(this);

    this.state = {
        "loading": false,
        "loadingMessage": "",
        "editLoad": false,
        "published": false,
        "showAll": false,
        "activePanel": 1,
        "activePanels" : [true,true,true,true,true,true,true,true,true]
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
        //window.location.href = '/doecode/error';
        console.log("Error...")
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
        doAuthenticatedAjax('GET', "/doecode/api/metadata/edit/" + codeID, this.parseReceiveResponse);
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

    if (metadata.getValue("accessibility") == 'OS' || (Array.isArray(metadata.getValue("files").slice()) && metadata.getValue("files").length == 0)) {
      doAuthenticatedAjax('POST', '/doecode/api/metadata/', this.parseSaveResponse, metadata.serializeData(), this.parseErrorResponse);
    } else {
      this.doMultipartSubmission('/doecode/api/metadata/',this.parseSaveResponse);
  }
}

publish() {
    console.log(metadata.getData());

    this.setState({"loading": true, "loadingMessage": "Publishing"});
    const justFileName = !Array.isArray(metadata.getValue("files").slice());
    if (metadata.getValue("accessibility") == 'OS' || justFileName || metadata.getValue("files").length == 0) {
      doAuthenticatedAjax('POST', '/doecode/api/metadata/publish', this.parsePublishResponse, metadata.serializeData(), this.parseErrorResponse);
    } else {
      this.doMultipartSubmission('/doecode/api/metadata/publish',this.parsePublishResponse);
  }
}

submit() {
    this.setState({"loading": true, "loadingMessage": "Submitting"});
    const justFileName = !Array.isArray(metadata.getValue("files").slice());
    if (metadata.getValue("accessibility") == 'OS' || justFileName) {
      doAuthenticatedAjax('POST', '/doecode/api/metadata/submit', this.parseSubmitResponse, metadata.serializeData(), this.parseErrorResponse);
  } else {
      this.doMultipartSubmission('/doecode/api/metadata/submit',this.parseSubmitResponse);
  }
}

doMultipartSubmission(url, successCallback) {
  const files = metadata.getValue("files");
  let formData = new FormData();
  formData.append('file', files[0]);
  formData.append('metadata', JSON.stringify(metadata.serializeData()));
  doAuthenticatedMultipartRequest(url,formData, successCallback, this.parseErrorResponse);
}

parseSaveResponse(data) {
    this.setState({"loading": false, "loadingMessage": ""});
    metadata.setValue("code_id", data.metadata.code_id);
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

panelSelect(currentKey) {
  let activePanels = this.state.activePanels;
  activePanels[currentKey - 1] = !activePanels[currentKey - 1];
  this.setState({"activePanels" : activePanels});
}

buildPanel(obj) {
        let requiredText = "";
        let optionalText = "";
        let panelStyle = "default";


        const panelStatus = metadata.getPanelStatus(obj.name);
        const required_status = panelStatus.remainingRequired>0 ? 'required-field-span':'';
             if (panelStatus.remainingRequired > 0) {
                  requiredText += " (Fields Required) ";
             }
             else {

            	 if (panelStatus.hasRequired) {
            		 requiredText += " (All Required Fields Completed) ";
            	 }
             }

/*
             if (panelStatus.remainingOptional > 0 && panelStatus.hasOptional) {
                  requiredText += " (Optional Fields) ";
             }
             else {

              if (panelStatus.hasOptional) {
                requiredText += " (All Required Fields Completed) ";
              }
             }
             */

        let arrowBool = this.state.activePanel == obj.key;

        console.log(this.state.activePanels);
        if (window.location.pathname == '/doecode/submit') {
              arrowBool = this.state.activePanels[obj.key - 1];
        }

        console.log(arrowBool);
        const heading = <div> <span className={required_status}>{obj.name}
                {requiredText}</span>
        {panelStatus.hasRequired && panelStatus.remainingRequired == 0 &&
        <span className="green glyphicon glyphicon-ok"></span>
        }
        {arrowBool &&
        <span className="pull-right glyphicon glyphicon-chevron-down"></span>
        }

        {!arrowBool &&
        <span className="pull-right glyphicon glyphicon-chevron-right"></span>
        }
      </div>;

        const expandedBool = window.location.pathname == '/doecode/submit';
        return <Panel header={heading} defaultExpanded={expandedBool} onSelect={this.panelSelect} collapsible bsStyle={panelStyle} eventKey={obj.key} key={obj.key}>

      	<div>


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

      const publishClass = publishDisabled ? "btn btn-lg pull-right doecode-wizard-btn" : "btn btn-primary btn-lg pull-right doecode-wizard-btn"
      const submitClass = submitDisabled ? "btn btn-lg pull-right doecode-wizard-btn" : "btn btn-primary btn-lg pull-right doecode-wizard-btn"
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

                            <div className="col-sm-9">
                                <button type="button" className="btn btn-info btn-lg pull-right doecode-wizard-btn" onClick={this.save}>
                                    Save Your Progress
                                  </button>
                            </div>
                            <div className="col-sm-3">
                                <button style={marginStyle} type="button" className={submitClass} disabled={submitDisabled} onClick={this.submit}>
                                    Submit Record to E-Link
                                </button>
                            </div>






                        </div>
        } else {
          button =           <div className="form-group-xs row">

                          <div className="col-sm-10">
                              <button type="button" className="btn btn-info btn-lg pull-right doecode-wizard-btn" onClick={this.save}>
                                  Save Your Progress
                              </button>
                          </div>
                          <div className="col-sm-2">
                              <button style={marginStyle} type="button" className={publishClass} disabled={publishDisabled} onClick={this.publish}>
                                  Publish Record
                              </button>
                          </div>


                      </div>
        }

        const accordionBool = window.location.pathname == '/doecode/publish';

        let content = <div>

        <PanelGroup defaultActiveKey="1" accordion={accordionBool} onSelect={this.setActivePanel}>
        {publishPanels}

        {submitPanels}

        </PanelGroup>

        {!this.state.showAll &&
        <div >
          <div>
            <button type="button" className="btn" onClick={this.showAdditionalFields}>
              <span className="glphicon glyphicon-plus"></span> Show Additional Optional Fields
            </button>
          </div>
        </div>
        }

        {button}


      </div>;

        return (


    <div className="row not-so-wide-row">
            <div className="col-md-3"></div>
             <div className="col-md-6 col-xs-12">
                 <div className="form-group form-group-sm row">
                     <div className="col-md-3"></div>
                     <div className="col-md-6 col-xs-12">
                         <h1 className="text-center"> {headerText} </h1>
                     </div>
                     <div className="col-md-3"></div>
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
             <div className="col-md-3"></div>
    </div>

        );
    }
}
