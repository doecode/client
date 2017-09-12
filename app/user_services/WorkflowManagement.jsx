import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam, doAuthenticatedAjax} from '../utils/utils';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid-addons';


const EmptyRowsView = React.createClass({
  render() {
    return (<div className='row'><div className='col-xs-12'>No records to show</div></div>);
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

        this.wizardVersion = ($.isNumeric(parseInt(this.props.wizardVersion)) && this.props.wizardVersion > 0) ? this.props.wizardVersion : "";

        this._columns = [
            {
              key: 'id',
              name: 'Code ID',
              width: 80,
              filterable: true,
              sortable: true
            },
            {
              key: 'title',
              name: 'Title',
              filterable: true,
              sortable: true
            },
            {
                key: 'status',
                name: 'Status',
                width: 100,
                filterable: true,
                sortable: true
            },
            {
              key: 'edit',
              name: 'Modify Record'
            }
          ];

        this.state = { rows: [], filters: {}, sortColumn: null, sortDirection: null };

    }

    componentDidMount() {

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
        }
        else if (record.workflow_status === 'Published') {
          editUrl = "/submit" + this.wizardVersion + "?code_id=" + record.code_id;
        }

        let pendingStatus = (
          record.workflow_status == "Published" && <div className="col-xs-4" title="Pending Approval" ><span className="pending">Pending Approval</span></div>
        );

        //console.log(JSON.stringify(record));
          rows.push({
            id: record.code_id,
            title: record.software_title,
            status: record.workflow_status,
            edit: <div className="form-group-xs row" title="" >
          <div className="col-xs-4" title="Update Metadata" >
          <a href={publishUrl} className="btn btn-success btn-sm">
		<span className="fa fa-pencil"></span> Update Metadata
	</a>
          </div>
            <div className="col-xs-4" title="Submit to E-Link" >
            <a  href={submitUrl} className="btn btn-info btn-sm">
  		<span className="fa fa-pencil"></span> Submit to E-Link
  	</a> </div>
    {pendingStatus}
    </div>
          });
        }


        this.setState({rows : rows});
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
        this.setState({ sortColumn: sortColumn, sortDirection: sortDirection });
      }

      handleFilterChange(filter) {
        let newFilters = Object.assign({}, this.state.filters);
        if (filter.filterTerm) {
          newFilters[filter.column.key] = filter;
        } else {
          delete newFilters[filter.column.key];
        }

        this.setState({ filters: newFilters });
      }

      onClearFilters() {
        this.setState({ filters: {} });
      }

      render() {

        return  (

        <div className="row not-so-wide-row">
            <div className="col-md-3"></div>
            <div className="col-md-6 col-xs-12 static-content">
                <h2 className="static-content-title">Manage My Projects</h2>
                <div className="form-group-xs row">
                    <div className="col-sm-12">
                        <a href={"/doecode/publish" + this.wizardVersion} type="button" className="btn btn-success btn-lg pull-right workflow-publish-btn" >
                            Add New Record
                        </a>
                    </div>
                </div>
                <ReactDataGrid
                    onGridSort={this.handleGridSort}
                    enableCellSelect={true}
                    columns={this._columns}
                    rowGetter={this.rowGetter}
                    rowsCount={this.getSize()}
                    maxHeight={400}
                    toolbar={<Toolbar enableFilter={true}/>}
                    onAddFilter={this.handleFilterChange}
                    onClearFilters={this.onClearFilters}
                    emptyRowsView={EmptyRowsView}
                    />
                    <br/>
                    <br/>
            </div>
            <div className="col-md-3"></div>
        </div>
        );

         }


}
