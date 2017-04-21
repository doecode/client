import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam} from '../utils/utils';
import {Button} from 'react-bootstrap';

export default class Splash extends React.Component {
    constructor(props) {
        super(props);

        this.newRecord = this.newRecord.bind(this);
        this.editRecord = this.editRecord.bind(this);
        let mintedDoi = getQueryParam("mintedDoi");

        if (!mintedDoi) {
          mintedDoi = "";
        }

        this.state = {"mintedDoi" : mintedDoi, "codeID" : getQueryParam("code_id"), "submissionType" : getQueryParam("submissionType")};

      }


      newRecord() {
        window.location.href = 'wizard';
      }

      editRecord() {
                window.location.href = "wizard?code_id=" + this.state.codeID;
      }


      parseReceiveResponse() {

      }



render() {

    const ymlDownload = "/api/metadata/" + this.state.codeID;
    return (
        <div className="container-fluid">

            <div className="form-group form-group-sm row">

                <h1>
                    Record Successfully Published to DOE Code</h1>
                <h2>
                    DOE Code ID: #{this.state.codeID}

                </h2>

                {this.state.mintedDoi &&
                <h2>
                    DOI: {this.state.mintedDoi}
                </h2>
}
                <h2>
                    <a target="_blank" href={ymlDownload}>
                        Download Metadata.yml
                    </a>
                </h2>
            </div>
            <div className="form-group form-group-sm row">
                <div className="col-sm-3">
                    <button type="button" className="btn btn-success btn-lg" onClick={this.editRecord}>
                        Edit Record #{this.state.codeID}
                    </button>
                </div>
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
