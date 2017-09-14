import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam, doAuthenticatedAjax} from '../utils/utils';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid-addons';
import MessageBoxModal from '../fragments/MessageBoxModal';

const EmptyRowsView = React.createClass({
  render() {
    return (
      <div className='row'>
        <div className='col-xs-12 center-text'>
          <h1>No records to show.</h1>
        </div>
      </div>
    );
  }
});

export default class WorkflowManagement extends React.Component {
  constructor(props) {
    super(props);
    this.getRows = this.getRows.bind(this);
    this.getSize = this.getSize.bind(this);
    this.rowGetter = this.rowGetter.bind(this);
    this.handleGridSort = this.handleGridSort.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.onClearFilters = this.onClearFilters.bind(this);
    this.parseReceiveResponse = this.parseReceiveResponse.bind(this);

    this.wizardVersion = ($.isNumeric(parseInt(this.props.wizardVersion)) && this.props.wizardVersion > 0)
      ? this.props.wizardVersion
      : "";

    this._columns = [
      {
        key: 'id',
        name: 'Code ID',
        filterable: true,
        sortable: true
      }, {
        key: 'title',
        name: 'Title',
        filterable: true,
        sortable: true
      }, {
        key: 'status',
        name: 'Status',
        filterable: true,
        sortable: true
      }, {
        key: 'edit',
        name: 'Update Metadata'
      }, {
        key: 'submit',
        name: 'Submit to E-Link'
      }, {
        key: 'pending',
        name: 'Pending Status'
      }
    ];

    this.state = {
        rows: [],
        filters: {},
        sortColumn: null,
        sortDirection: null,
        showModal: false,
        isError: false
    };

  }

  componentDidMount() {

    this.setState({showModal: true});
    doAuthenticatedAjax('GET', "/doecode/api/metadata/projects", this.parseReceiveResponse);

  }

  parseReceiveResponse(data) {
    let rows = [];
    //console.log(data);
    const records = data.records;
    for (let i = 0; i < records.length; i++) {

      const record = records[i];
      const publishUrl = "/doecode/publish" + this.wizardVersion + "?code_id=" + record.code_id;
      const submitUrl = "/doecode/submit" + this.wizardVersion + "?code_id=" + record.code_id;
      let editUrl = "/submit" + this.wizardVersion + "?code_id=" + record.code_id;

      let editMessage = "Continue to E-Link Submission";

      if (record.workflow_status === 'Saved') {
        editMessage = "Continue to Publish Record";
        editUrl = "/publish" + this.wizardVersion + "?code_id=" + record.code_id;
      } else if (record.workflow_status === 'Published') {
        editUrl = "/submit" + this.wizardVersion + "?code_id=" + record.code_id;
      }

      let pendingStatus = (record.workflow_status == "Published" && <span className="pending">Pending Approval</span>);

      //console.log(JSON.stringify(record));
      rows.push({
        id: record.code_id, title: record.software_title, status: record.workflow_status, edit: <a href={publishUrl} className="btn btn-success btn-sm">
                <span className="fa fa-pencil"></span>
                Update Metadata
        </a>,
        submit: <a href={submitUrl} className="btn btn-info btn-sm">
                <span className="fa fa-pencil"></span>
                Submit to E-Link
        </a>,
        pending: <span>
            {pendingStatus}</span>
      });
    }

    this.setState({rows: rows});
    this.setState({showModal: false});
  }
  getRows() {
    return Data.Selectors.getRows(this.state);
  }

  getSize() {
    return this.getRows().length;
  }

  rowGetter(rowIdx) {
    const rows = this.getRows();
    return rows[rowIdx];
  }

  handleGridSort(sortColumn, sortDirection) {
    this.setState({sortColumn: sortColumn, sortDirection: sortDirection});
  }

  handleFilterChange(filter) {
    let newFilters = Object.assign({}, this.state.filters);
    if (filter.filterTerm) {
      newFilters[filter.column.key] = filter;
    } else {
      delete newFilters[filter.column.key];
    }

    this.setState({filters: newFilters});
  }

  onClearFilters() {
    this.setState({filters: {}});
  }

  render() {
    const toolbar_for_datagrid = <Toolbar enableFilter={true}/>;
    return (

      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12 static-content">
          <h2 className="static-content-title">Manage My Projects</h2>
          <div className="form-group-xs row">
            <div className="col-sm-12">
              <a href={"/doecode/publish" + this.wizardVersion} type="button" className="btn btn-success btn-lg pull-right workflow-publish-btn">
                Add New Record
              </a>
            </div>
          </div>
          <ReactDataGrid onGridSort={this.handleGridSort} enableCellSelect={true} columns={this._columns} rowGetter={this.rowGetter} rowsCount={this.getSize()} maxHeight={400} toolbar={toolbar_for_datagrid} onAddFilter={this.handleFilterChange} onClearFilters={this.onClearFilters} emptyRowsView={EmptyRowsView}/>
          <br/>
          <br/>
        </div>
        <div className="col-md-3"></div>
         <MessageBoxModal
                 showModal={this.state.showModal}
                 showSpinner
                 isError={this.state.isError}
         />
      </div>
    );

  }

}
