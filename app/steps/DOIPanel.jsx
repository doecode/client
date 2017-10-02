import React from 'react';
import MetadataField from '../field/MetadataField';
import uniqid from 'uniqid';
import {observer, Provider} from "mobx-react";
import MessageBoxModal from '../fragments/MessageBoxModal';
import {doAuthenticatedAjax} from '../utils/utils';

@observer
export default class DOIPanel extends React.Component {

  constructor(props) {
    super(props);
    this.handleInfix = this.handleInfix.bind(this);
    this.handleReserve = this.handleReserve.bind(this);
    this.reserveDOI = this.reserveDOI.bind(this);
    this.exitModalCallback = this.exitModalCallback.bind(this);
    this.reservationApproveResponse = this.reservationApproveResponse.bind(this);
    this.reservationErrorResponse = this.reservationErrorResponse.bind(this);

    this.state = {
      showModal: false,
      modalTitle: "Reserving DOI...",
      modalMessage: null,
      isError: false
    };
  }

  exitModalCallback() {
    this.setState({showModal: false, modalMessage: null, isError: false});
  }

  handleInfix(event) {
    let infix = event.target.value;
    this.props.metadata.setValue("doi_infix", infix);
    const doi = this.props.metadata.getValue("doi");
    const prefix = doi.substr(0, doi.indexOf('/') + 1);
    const id = doi.substr(doi.lastIndexOf('/') + 1, doi.length - 1);

    if (infix)
      infix += "/";
    this.props.metadata.setValue("doi", prefix + infix + id);
  }

  reserveDOI() {
    this.setState({showModal: true});
    doAuthenticatedAjax('GET', '/doecode/api/metadata/reservedoi', this.reservationApproveResponse, null, this.reservationErrorResponse);
  }

  reservationApproveResponse(data) {
    const doiInfo = this.props.metadata.getFieldInfo("doi");
    const infixInfo = this.props.metadata.getFieldInfo("doi_infix");
    this.props.metadata.setValue("doi", data.doi);
    this.props.metadata.setValue("doi_status", "RES");
    doiInfo.completed = true;
    doiInfo.ever_completed = true;
    doiInfo.error = '';
    infixInfo.completed = false;
    infixInfo.error = '';
    infixInfo.Panel = "DOI and Release Date"
    this.setState({showModal: false});
  }

  reservationErrorResponse(data) {
    this.setState({isError: true, modalMessage: "Unable to reserve a DOI at this time.  Please try again later."});
  }

  parseErrorResponse(jqXhr, exception)
    if (jqXhr.status === 401) {
      window.sessionStorage.lastLocation = window.location.href;
      window.sessionStorage.lastRecord = JSON.stringify(metadata.getData());
      window.location.href = '/doecode/login?redirect=true';

    } else if (jqXhr.status === 403) {
      window.location.href = '/doecode/forbidden';
    } else {
      let x = 0;
      let msg = "";

      if (jqXhr.responseJSON && jqXhr.responseJSON.errors) {
        for (x = 0; x < jqXhr.responseJSON.errors.length; x++) {
          msg += (msg == ""
            ? ""
            : "; ") + jqXhr.responseJSON.errors[x];
        }
      }

      if (msg == "")
        msg = "Internal Server Error: " + jqXhr.status;

      this.setState({"loading": false, "loadingMessage": ""});
      this.setState({"error": true, "errorMessage": msg});
    }
  }

  handleReserve() {
    //get if currently reserved then toggle
    const reserved = this.props.metadata.getValue("doi_status") === "RES";

    if (reserved) {
      //they are unreserving the DOI, so set doi,infix, and status to empty and add the validations back
      const doiInfo = this.props.metadata.getFieldInfo("doi");
      const infixInfo = this.props.metadata.getFieldInfo("doi_infix");
      this.props.metadata.setValue("doi", "");
      this.props.metadata.setValue("doi_infix", "");
      this.props.metadata.setValue("doi_status", "");

      doiInfo.completed = false;
      doiInfo.error = '';
      infixInfo.completed = false;
      infixInfo.error = '';
      infixInfo.Panel = "";
    } else {
      //reserve a new DOI in correct format, disabling validations first to let our own DOI pass through
      this.reserveDOI();
    }
  }

  render() {
    const metadata = this.props.metadata;

    //flag indicating whether DOI has already been registered for this record
    const registered = metadata.getValue("doi_status") === "REG";

    //flag indicating if doi is already reserved in this session
    const reserving = metadata.getValue("doi_status") === "RES" || registered;

    const buttonClass = "pure-button pure-button-primary btn-sm" + (reserving
      ? " active"
      : "");
    const buttonText = reserving
      ? "Clear Reserved DOI"
      : "Reserve DOI";
    const buttonIcon = reserving
      ? "fa fa-eraser"
      : "fa fa-pencil";

    let messageNode = null;
    if (reserving)
      messageNode = <span>
        <strong>
          Please Note:&nbsp;
        </strong>
        Your reserved DOI will not be registered on DataCite until a Release Date is provided.
      </span>;

    return (

      <div className="container-fluid form-horizontal">
        <div className="row">
          <div className="col-md-8 col-xs-12">
            <MetadataField field="doi" label="DOI" helpTooltip='DigitalObjectIdentifer' elementType="input" disabled={reserving} messageNode={messageNode}/> {!registered && <div className="form-group form-group-sm row">
              <div className="col-xs-8">
                <button title={buttonText} type="button" className={buttonClass} onClick={this.handleReserve}>
                  <span className={buttonIcon}></span>&nbsp; {buttonText}
                </button>
              </div>
            </div>}

            {reserving && <MetadataField field="doi_infix" label="DOI Infix" elementType="input" helpTooltip='DOIInfix' handleChange={this.handleInfix}/>}
            <MetadataField field="release_date" label="Release Date" helpTooltip='ReleaseDate' elementType="date"/>
          </div>
          <div className="col-md-4"></div>
        </div>
        <MessageBoxModal showModal={this.state.showModal} showSpinner isError={this.state.isError} title={this.state.modalTitle} items={[this.state.modalMessage]} showCloseButton={this.state.isError} exitCallback={this.exitModalCallback}/>
      </div>
    );
  }

}
