import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam, doAuthenticatedAjax} from '../utils/utils';
import {Button} from 'react-bootstrap';
import MetadataList from '../fragments/MetadataList';

export default class Confirmation extends React.Component {
  constructor(props) {
    super(props);

    this.newRecord = this.newRecord.bind(this);
    this.editRecord = this.editRecord.bind(this);
    this.parseMetadataCall = this.parseMetadataCall.bind(this);
    this.parseMetadataCallError = this.parseMetadataCallError.bind(this);

    let mintedDoi = getQueryParam("mintedDoi");

    if (!mintedDoi) {
      mintedDoi = "";
    }

    this.state = {
      "mintedDoi": mintedDoi,
      "codeID": getQueryParam("code_id"),
      "workflow": getQueryParam("workflow"),
      "metadata":{}
    };
  }

  componentDidMount() {
    doAuthenticatedAjax('GET', '/doecode/api/metadata/edit/' + this.state.codeID, this.parseMetadataCall, null, this.parseMetadataCallError);
  }

  parseMetadataCall(data) {
    console.log("SUccess in metadata");
    this.setState({metadata:data.metadata});
  }

  parseMetadataCallError() {
    console.log("ERror in metadata");
  }

  newRecord() {
    window.location.href = '/doecode/publish';
  }

  editRecord() {
    window.location.href = "/doecode/submit?code_id=" + this.state.codeID;
  }

  render() {
    const ymlDownload = "/doecode/api/metadata/edit/" + this.state.codeID + "?format=yaml";

    return (
      <div className="row not-so-wide-row">
        <div className='col-md-3'></div>
        <div className='col-md-6 col-xs-12'>
          <div className="form-group form-group-sm row">
            <div className='col-xs-12'>
              <h1>
                Record Successfully Published to DOE CODE</h1>
              <h2>
                DOE CODE ID: #{this.state.codeID}
              </h2>
              {this.state.mintedDoi && <h2>
                DOI: {this.state.mintedDoi}
              </h2>}
              <h2>
                <a target="_blank" type="text/yaml" href={ymlDownload}>
                  Download Metadata.yml
                </a>
              </h2>
            </div>
          </div>
          <div className="form-group form-group-sm row">
            {this.state.workflow === "published" && <div className="col-md-6 col-xs-12">
              <button type="button" className="btn btn-success btn-lg" onClick={this.editRecord}>
                Continue to E-Link Submission
              </button>
            </div>}
            <div className="col-md-6 col-xs-12">
              <button type="button" className="btn btn-primary btn-lg" onClick={this.newRecord}>
                Create New Record
              </button>
            </div>
          </div>
          <br/>
          <br/>
          <div className='row'>
            <div className='col-xs-12'>
              <MetadataList data={this.state.metadata}/>
            </div>
          </div>
        </div>
        <div className='col-md-3'></div>
      </div>
    );
  }

}
