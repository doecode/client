import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam, doAuthenticatedAjax} from '../utils/utils';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid-addons';


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

        doAuthenticatedAjax('GET', "api/metadata/projects", this.parseReceiveResponse, undefined, this.parseErrorResponse);


    }

    parseReceiveResponse(data) {
        let rows = [];
        console.log(data);
        const records = data.records.records;
        for (let i = 0; i < records.length; i++) {

        const record = records[i];
        let editUrl = "/wizard?code_id=" + record.code_id;

        let editMessage = "Continue to E-Link Submission";

        if (record.workflow_status === 'Saved') {
        	editMessage = "Continue to Publish Record";
        }
        else if (record.workflow_status === 'Published') {
        	editUrl += "&workflow=published";
        }

          rows.push({
            id: record.code_id,
            title: record.software_title,
            status: record.workflow_status,
            edit: <div className="form-group-xs row">
          <div className="col-xs-5">
          <a href="/wizard" className="btn btn-success btn-sm">
		<span className="glyphicon glyphicon-pencil"></span> {editMessage}
	</a>
          </div>
            <div className="col-xs-2">
            <a  href="/registerdoi" className="btn btn-info btn-sm">
  		<span className="glyphicon glyphicon-pencil"></span> Register DOI
  	</a> </div></div>
          });
        }


        this.setState({rows : rows});
    }

    parseErrorResponse() {
    	console.log("Encountered error");
    }


      getRandomDate(start, end) {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toLocaleDateString();
      }

      createRows(numberOfRows) {
        let rows = [];
        for (let i = 1; i < numberOfRows; i++) {
          rows.push({
            id: i,
            title: 'Task ' + i,
            status: ['Saved', 'Published', 'Submitted'][Math.floor((Math.random() * 3) + 1)],
            edit: <div className="form-group-xs row">
          <div className="col-xs-5">
          <a href="/wizard" className="btn btn-success btn-sm">
		<span className="glyphicon glyphicon-pencil"></span> Continue to E-Link Submission
	</a>
          </div>
            <div className="col-xs-2">
            <a  href="/registerdoi" className="btn btn-info btn-sm">
  		<span className="glyphicon glyphicon-pencil"></span> Register DOI
  	</a> </div></div>
          });
        }
        return rows;
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

        		<div className="form-group-xs row">
                <div className="col-sm-12">
                    <a href="/wizard" style={marginStyle} type="button" className="btn btn-success btn-lg pull-right" >
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
            onClearFilters={this.onClearFilters} />
        </div>
        );

         }


}
