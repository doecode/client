import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam, doAuthenticatedAjax} from '../utils/utils';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid-addons';


const EmptyRowsView = React.createClass({
  render() {
    return (<p>No records to show.</p>);
  }
});

export default class WorkflowManagement2 extends React.Component {
    constructor(props) {
        super(props);
        this.getRows = this.getRows.bind(this);
        this.getSize = this.getSize.bind(this);
        this.rowGetter = this.rowGetter.bind(this);
        this.handleGridSort = this.handleGridSort.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onClearFilters = this.onClearFilters.bind(this);
        this.parseReceiveResponse = this.parseReceiveResponse.bind(this);

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
        console.log(data);
        const records = data.records.records;
        for (let i = 0; i < records.length; i++) {

        const record = records[i];
        const publishUrl = "/doecode/publish2?code_id=" + record.code_id;
        const submitUrl = "/doecode/submit2?code_id=" + record.code_id;
        let editUrl = "/submit2?code_id=" + record.code_id;

        let editMessage = "Continue to E-Link Submission";

        if (record.workflow_status === 'Saved') {
        	editMessage = "Continue to Publish Record";
          editUrl = "/publish2?code_id=" + record.code_id;
        }
        else if (record.workflow_status === 'Published') {
          editUrl = "/submit2?code_id=" + record.code_id;
        }

          rows.push({
            id: record.code_id,
            title: record.software_title,
            status: record.workflow_status,
            edit: <div className="form-group-xs row">
          <div className="col-xs-3">
          <a href={publishUrl} className="btn btn-success btn-sm">
		<span className="glyphicon glyphicon-pencil"></span> Update Metadata
	</a>
          </div>
            <div className="col-xs-2">
            <a  href={submitUrl} className="btn btn-info btn-sm">
  		<span className="glyphicon glyphicon-pencil"></span> Submit to E-Link
  	</a> </div></div>
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
          const marginStyle = {
                  'margin-bottom' : '5px'
                };





        return  (
        		<div>
            <h2> Manage My Projects </h2>
        		<div className="form-group-xs row">
                <div className="col-sm-12">
                    <a href="/doecode/publish2" style={marginStyle} type="button" className="btn btn-success btn-lg pull-right" >
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

        </div>
        );

         }


}