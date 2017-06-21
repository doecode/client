import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam, doAjax} from '../utils/utils';
import {Button} from 'react-bootstrap';
import {ListGroup, ListGroupItem, Panel} from 'react-bootstrap';

export default class WorkflowManagement extends React.Component {
    constructor(props) {
        super(props);
        this.buildDisplay = this.buildDisplay.bind(this);
        this.addRecord = this.addRecord.bind(this);

    }
    
    addRecord() {
    	window.location.href = '/wizard';
    }

    buildDisplay(obj) {


      const title = obj.title ? obj.title : 'Untitled';
      const currentState = obj.workflow_status;
      const editUrl = "/wizard?code_id=" + obj.code_id;

      return <li className="list-group-item">
      <div className="form-group form-group-xs">
       <strong>ID:</strong> {obj.code_id}
      </div>
      <div className="form-group form-group-xs">
      <strong>Title:</strong> {title}
      </div>
      <div className="form-group form-group-xs">
      <strong>Current Status:</strong> {currentState}
      </div>
      <div className="form-group form-group-xs ">
        <a href={editUrl}>Edit Record </a>
      </div>
    </li>
    }

    render() {
        const overflowStyle = {
            'overflow-y': 'auto',
            'maxHeight': '400px'
        };

        const marginStyle = {
          'margin-bottom' : '5px'
        };

        let savedRecords = [{'code_id': 1, 'title': 'My First Record', 'workflow_status' : 'Published'},
      {'code_id': 2, 'title': '', 'workflow_status' : 'Saved'},
    {'code_id': 3, 'title': 'A Study in Scarlet', 'workflow_status' : 'Saved'}];

        const savedRecordsDisplay = savedRecords.map(this.buildDisplay);

        return (
            <div>

                <div className="col-sm-12">

                  <button style={marginStyle} type="button" className="btn btn-success btn-lg pull-right" onClick={this.addRecord}>
                      Add New Record
                  </button>

                </div>

                <div className="col-sm-12">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <strong>Your Records</strong>
                        </div>

                        <ul style={overflowStyle} className="list-group">
                            {savedRecordsDisplay}

                        </ul>
                    </div>
                </div>
            </div>

        );
    }

}
