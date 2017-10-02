import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, checkIsAuthenticated, doAuthenticatedAjax, appendQueryString, getQueryParam, doAuthenticatedMultipartRequest} from '../utils/utils';
import {observer} from "mobx-react";
import Metadata from '../stores/Metadata';
import EntryStep from '../steps/EntryStep';
import AgentsStep from '../steps/AgentsStep';
import OrgsStep from '../steps/OrgsStep';
import MetadataPanel from '../steps/MetadataPanel';
import DOIPanel from '../steps/DOIPanel';
import SupplementalInfoStep from '../steps/SupplementalInfoStep';
import ContributorsStep from '../steps/ContributorsStep';
import AccessStep from '../steps/AccessStep';
import RecipientStep from '../steps/RecipientStep';
import ConfirmStep from '../steps/ConfirmStep';
import Confirmation from '../confirmation/Confirmation';
import RIsStep from '../steps/RIsStep';
import {PanelGroup, Panel} from 'react-bootstrap';
import {Modal} from 'react-bootstrap';
import StepZilla from 'react-stepzilla';
import InterfaceStep from '../steps/InterfaceStep';
/*import css from '../css/main.css';*/


const metadata = new Metadata();

let publishSteps = [];
let submitSteps = [];

@observer
export default class DOECodeSubmissionInterface extends React.Component {
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

    this.state = {
        "loading": false,
        "loadingMessage": "",
        "editLoad": false,
        "published": false
    };

    publishSteps = [
          {
              name: 'Step 1',
              component: <InterfaceStep name="Repository Information" panel={<EntryStep metadata={metadata} autopopulate={this.autopopulate} page={this.props.page}/>} />
          }, {
              name: 'Step 2',
              component: <InterfaceStep name="Product Description" panel={<MetadataPanel metadata={metadata}/>} />
          }, {
              name: 'Step 3',
              component: <InterfaceStep name="Developers" panel={<AgentsStep/>} />
          }, {
              name: 'Step 4',
              component: <InterfaceStep name="DOI and Release Date" panel={<DOIPanel metadata={metadata}/>} />
          }
    ];

    submitSteps = [
          {
              name: 'Step 1',
              component: <InterfaceStep name="Repository Information" panel={<EntryStep metadata={metadata} autopopulate={this.autopopulate} page={this.props.page}/>} />
          }, {
              name: 'Step 2',
              component: <InterfaceStep name="Product Description" panel={<MetadataPanel metadata={metadata}/>} />
          }, {
              name: 'Step 3',
              component: <InterfaceStep name="Developers" panel={<AgentsStep/>} />
          }, {
              name: 'Step 4',
              component: <InterfaceStep name="DOI and Release Date" panel={<DOIPanel metadata={metadata}/>} />
          }, {
              name: 'Step 5',
              component: <InterfaceStep name="Supplemental Product Information" panel={<SupplementalInfoStep page={this.props.page}/>} />
          }, {
              name: 'Step 6',
              component: <InterfaceStep name="Organizations" panel={<OrgsStep/>} />
          }, {
              name: 'Step 7',
              component: <InterfaceStep name="Contributors and Contributing Organizations" panel={<ContributorsStep/>} />
          }, {
              name: 'Step 8',
              component: <InterfaceStep name="Identifiers" panel={<RIsStep/>} />
          }, {
              name: 'Step 9',
              component: <InterfaceStep name="Contact Information" panel={<RecipientStep/>} />
          }
    ];

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
    if (this.props.page == 'submit') {
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
      doAuthenticatedAjax('POST', '/doecode/api/metadata/save', this.parseSaveResponse, metadata.serializeData(), this.parseErrorResponse);
    } else {
      this.doMultipartSubmission('/doecode/api/metadata/save',this.parseSaveResponse);
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



    render() {

      const info = metadata.infoSchema;
      const submitDisabled = !metadata.validateSchema();
      const publishDisabled = !metadata.validatePublishedFields();

      const publishClass = publishDisabled ? "pure-button btn-lg pull-right doecode-wizard-btn" : "pure-button pure-button-primary btn-lg pull-right doecode-wizard-btn"
      const submitClass = submitDisabled ? "pure-button btn-lg pull-right doecode-wizard-btn" : "pure-button pure-button-primary btn-lg pull-right doecode-wizard-btn"
      const codeID = metadata.getValue("code_id");

      let headerText = "Create a New Software Record";

      if (codeID !== undefined && codeID > 0)
    	  headerText = "Editing Software Record #" + codeID;


        const marginStyle = {
          'marginBottom' : '5px'
        };


        let button = null;

        if (this.props.page == 'submit') {
        button =             <div className="form-group-xs row">

                            <div className="col-sm-9">
                                <button title='Save Your Progress' type="button" className="pure-button button-secondary btn-lg pull-right doecode-wizard-btn" onClick={this.save}>
                                    Save Your Progress
                                  </button>
                            </div>
                            <div className="col-sm-3">
                                <button title='Submit Record to E-Link' style={marginStyle} type="button" className={submitClass} disabled={(submitDisabled==true) ? 'disabled' : ''} onClick={this.submit}>
                                    Submit Record to E-Link
                                </button>
                            </div>

                        </div>
        } else {
          button =           <div className="form-group-xs row">

                          <div className="col-sm-10">
                              <button title='Save Your Progress' type="button" className="pure-button button-secondary btn-lg pull-right doecode-wizard-btn" onClick={this.save}>
                                  Save Your Progress
                              </button>
                          </div>
                          <div className="col-sm-2">
                              <button title='Publish Record' style={marginStyle} type="button" className={publishClass} disabled={(publishDisabled==true) ? 'disabled' : ''} onClick={this.publish}>
                                  Publish Record
                              </button>
                          </div>


                      </div>
        }


          let content;

        if (this.props.page == 'submit') {
          content =
          <div>
                <div className="step-progress">
                    <StepZilla
                      steps={submitSteps}
                      preventEnterSubmission={true}
                      stepsNavigation={false}
                      startAtStep={4}
                    />
                </div>
          </div>
        }
        else {
          content =
          <div>
                <div className="step-progress">
                    <StepZilla
                      steps={publishSteps}
                      preventEnterSubmission={true}
                      stepsNavigation={false}
                    />
                </div>
          </div>
        };

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
                <div className="pub-btns">
                  <hr/>
                 {button}
                 </div>
             </div>
             <div className="col-md-3"></div>
    </div>

        );
    }
}
