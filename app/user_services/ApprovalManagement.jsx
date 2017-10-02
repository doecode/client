import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam, doAuthenticatedAjax} from '../utils/utils';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid-addons';
import MessageBoxModal from '../fragments/MessageBoxModal';

function EmptyRowsView(props) {
  return (
    <div className='row'>
      <div className='col-xs-12 center-text'>
        <h1>No records to show.</h1>
      </div>
    </div>
  );
};

export default class ApprovalManagement extends React.Component {
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
        width: 90,
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
        width: 90,
        filterable: true,
        sortable: true
      }, {
        key: 'edit',
        name: 'View Record',
        width: 135
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
    doAuthenticatedAjax('GET', "/doecode/api/metadata/projects/pending", this.parseReceiveResponse);

  }

  parseReceiveResponse(data) {
    let rows = [];

    const records = data.records;
    for (let i = 0; i < records.length; i++) {

      const record = records[i];
      const approveUrl = "/doecode/approve" + this.wizardVersion + "?code_id=" + record.code_id;

      rows.push({
        id: record.code_id, title: record.software_title, status: record.workflow_status, edit: <div className="form-group-xs row" title="">
            <div className="col-xs-2 grid-button" title="View for Approval">
              <a href={approveUrl} className="pure-button pure-button-primary btn-sm">
                <span className="fa fa-pencil"></span>&nbsp;
                View for Approval
              </a>
            </div>
          </div>
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

    return (

      <div className="row not-so-wide-row">
        <div className="col-md-2"></div>
        <div className="col-md-8 col-xs-12 static-content">
          <h2 className="static-content-title">Approve Projects</h2>
          <ReactDataGrid onGridSort={this.handleGridSort} enableCellSelect={true} columns={this._columns} rowGetter={this.rowGetter} rowsCount={this.getSize()} maxHeight={400} toolbar={< Toolbar enableFilter = {
            true
          } />} onAddFilter={this.handleFilterChange} onClearFilters={this.onClearFilters} emptyRowsView={EmptyRowsView}/>
          <br/>
          <br/>
        </div>
        <div className="col-md-2"></div>
        <MessageBoxModal
                showModal={this.state.showModal}
                showSpinner
                isError={this.state.isError}
        />
      </div>
    );

  }

}
