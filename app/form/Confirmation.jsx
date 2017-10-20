import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam, doAuthenticatedAjax, doAuthenicatedFileDownloadAjax} from '../utils/utils';
import {Button} from 'react-bootstrap';
import MetadataList from '../fragments/MetadataList';

export default class Confirmation extends React.Component {
  constructor(props) {
    super(props);

    this.newRecord = this.newRecord.bind(this);
    this.editRecord = this.editRecord.bind(this);
    this.parseMetadataCall = this.parseMetadataCall.bind(this);
    this.parseMetadataCallError = this.parseMetadataCallError.bind(this);
    this.parseYMLDownloaderSuccess = this.parseYMLDownloaderSuccess.bind(this);
    this.parseYMLDownloader = this.parseYMLDownloader.bind(this);

    let mintedDoi = getQueryParam("mintedDoi");

    if (!mintedDoi) {
      mintedDoi = "";
    }

    this.state = {
      "mintedDoi": mintedDoi,
      "codeID": getQueryParam("code_id"),
      "workflow": getQueryParam("workflow"),
      "metadata": {},
      "showYMLDownload": false
    };
  }

  componentDidMount() {
    doAuthenticatedAjax('GET', '/doecode/api/metadata/' + this.state.codeID, this.parseMetadataCall, null, this.parseMetadataCallError);
    doAuthenicatedFileDownloadAjax(('/doecode/api/metadata/' + this.state.codeID + "?format=yaml"), this.parseYMLDownloaderSuccess, this.parseYMLDownloader);
  }

  parseMetadataCall(data) {
    this.setState({metadata: data.metadata, loadedDOI: data.metadata.doi});
  }

  parseMetadataCallError() {
    // silent error
  }

  newRecord() {
    window.location.href = '/doecode/submit';
  }

  editRecord() {
    window.location.href = "/doecode/announce?code_id=" + this.state.codeID;
  }

  parseYMLDownloaderSuccess(data) {
    this.setState({
      showYMLDownload: true,
      ymlHREF: 'data:text/yaml;charset=utf-8,' + encodeURIComponent(data),
      ymlFILE: 'metadata-' + this.state.codeID + ".yml"
    });
  }

  parseYMLDownloader(data) {
    this.setState({
      showYMLDownload: true,
      ymlHREF: 'data:text/yaml;charset=utf-8,' + encodeURIComponent(data.responseText),
      ymlFILE: 'metadata-' + this.state.codeID + ".yml"
    });
  }

  render() {
    var actionPhrase = '';
    switch (this.state.workflow) {
      case 'submitted':
        actionPhrase = 'Project Successfully Submitted to DOE CODE';
        document.title = 'DOE CODE: CODE ID #' + this.state.codeID + ' Successfully Submitted to DOE CODE';
        break;
      case 'announced':
        actionPhrase = 'Project Successfully Announced to E-Link';
        document.title = 'DOE CODE: CODE ID #' + this.state.codeID + ' Successfully Announced to E-Link';
        break;
    }

    return (
      <div className="row not-so-wide-row">
        <div className='col-md-3'></div>
        <div className='col-md-6 col-xs-12'>
          <div className="form-group form-group-sm row">
            <div className='col-xs-12'>
              <h1>
                {actionPhrase}</h1>
              <h2>
                DOE CODE ID: #{this.state.codeID}
              </h2>
              {this.state.mintedDoi && <div>
                <h2>
                  Minted DOI: {this.state.mintedDoi}
                </h2>
              </div>}

              {this.state.loadedDOI && <div>
                <h2>
                  DOI: {this.state.loadedDOI}
                </h2>
              </div>}
              {this.state.showYMLDownload && <h2>
                <a title='Download YAML File' id='yml-anchor' target="_blank" type="text/yaml" href={this.state.ymlHREF} download={this.state.ymlFILE}>
                  Download Metadata.yml
                </a>
              </h2>}

            </div>
          </div>
          <div className="form-group form-group-sm row">
            {this.state.workflow === "submitted" && <div className="col-sm-4 col-xs-12">
              <button title='Continue to E-Link Submission' type="button" className="pure-button button-success btn-lg" onClick={this.editRecord}>
                Continue to E-Link Announcement
              </button>
            </div>}
            <div className='col-sm-4 col-xs-12'></div>
            <div className="col-sm-4 col-xs-12 right-text">
              <button title='Create New Project' type="button" className="pure-button pure-button-primary btn-lg" onClick={this.newRecord}>
                Create New Project
              </button>
            </div>
          </div>
          <br/>
          <br/>
          <div className='row static-content'>
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
