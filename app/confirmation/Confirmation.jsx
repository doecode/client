import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam} from '../utils/utils';
import {Button} from 'react-bootstrap';

export default class Confirmation extends React.Component {
    constructor(props) {
        super(props);

        this.newRecord = this.newRecord.bind(this);
        this.editRecord = this.editRecord.bind(this);
        let mintedDoi = getQueryParam("mintedDoi");

        if (!mintedDoi) {
          mintedDoi = "";
        }

        this.state = {"mintedDoi" : mintedDoi, "codeID" : getQueryParam("code_id"), "workflow" : getQueryParam("workflow")};

      }


      newRecord() {
        window.location.href = '/doecode/publish';
      }

      editRecord() {
      window.location.href = "/doecode/submit?code_id=" + this.state.codeID;
      }


      parseReceiveResponse() {

      }



render() {

    const ymlDownload = "/doecode/api/metadata/"+ this.state.codeID + "?format=yaml";


    return (
    <div className="container-fluid">

        <div className="form-group form-group-sm row">

            <h1>
                Record Successfully Published to DOE CODE</h1>
            <h2>
                DOE CODE ID: #{this.state.codeID}

            </h2>

            {this.state.mintedDoi &&
            <h2>
                DOI: {this.state.mintedDoi}
            </h2>
            }
            <h2>
                <a target="_blank" type="text/yaml" href={ymlDownload}>
                    Download Metadata.yml
                </a>
            </h2>
        </div>
        <div className="form-group form-group-sm row">
            {this.state.workflow === "published" &&
            <div className="col-sm-3">
                <button type="button" className="btn btn-success btn-lg" onClick={this.editRecord}>
                    Continue to E-Link Submission
                </button>
            </div>
            }
            <div className="col-sm-3">
                <button type="button" className="btn btn-primary btn-lg" onClick={this.newRecord}>
                    Create New Record
                </button>
            </div>

        </div>

    </div>
    );
}

}
