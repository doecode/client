import React from 'react';
import ReactDOM from 'react-dom';
import {getQueryParam, doAuthenticatedAjax} from '../utils/utils';
import ReactDataGrid from 'react-data-grid';
import {Toolbar, Data} from 'react-data-grid-addons';
import UserData from '../stores/UserData';

const userData = new UserData();

const EmptyRowsView = React.createClass({
  render() {
    return (<p>No requests to show.</p>);
  }
});

export default class ApproveRoles extends React.Component {
    constructor(props) {
        super(props);
        this.getRows = this.getRows.bind(this);
        this.getSize = this.getSize.bind(this);
        this.rowGetter = this.rowGetter.bind(this);
        this.handleGridSort = this.handleGridSort.bind(this);
        this.handleFilterChange = this.handleFilterChange.bind(this);
        this.onClearFilters = this.onClearFilters.bind(this);
        this.parseReceiveResponse = this.parseReceiveResponse.bind(this);
        this.approve = this.approve.bind(this);
        this.disapprove = this.disapprove.bind(this);

        this._columns = [
            {
              key: 'user',
              name: 'Requesting User',
              filterable: true,
              sortable: true
            },
            {
              key: 'requested_role',
              name: 'Requested Role',
              filterable: true,
              sortable: true
            },
            {
              key: 'approval',
              name: 'Approve/Disapprove'
            }
          ];

        this.state = { rows: [], filters: {}, sortColumn: null, sortDirection: null };

    }

    componentDidMount() {

        //doAuthenticatedAjax('GET', "/doecode/api/user/requests", this.parseReceiveResponse);
        const data = {"requests" : [{"user" : "email@ORNL.com", "requested_role" : "ORNL"}]}
        this.parseReceiveResponse(data);

    }

    approve(email) {
      userData.setValue("email", email)
      //doAuthenticatedAjax('POST', "/doecode/api/user/approve", this.parseReceiveResponse);
    }

    disapprove(email) {
      userData.setValue("email", email)
      //doAuthenticatedAjax('POST', "/doecode/api/user/approve", this.parseReceiveResponse);
    }

    parseReceiveResponse(data) {
        let rows = [];
        console.log(data);
        const requests = data.requests;
        const approveClick = this.approve.bind(this,1);
        for (let i = 0; i < requests.length; i++) {

        const request = requests[i];
          rows.push({
            user: request.user,
            requested_role: request.requested_role,
            approval: <div className="form-group-xs row">
          <div className="col-xs-3">
          <a onClick={() => this.approve(request.user)} className="btn btn-success btn-sm">
		<span className="glyphicon glyphicon-ok"></span> Approve
	</a>
          </div>
            <div className="col-xs-2">
            <a  onClick={() => this.disapprove(request.user)} className="btn btn-danger btn-sm">
  		<span className="glyphicon glyphicon-remove"></span> Disapprove
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

        return  (

        <div className="row not-so-wide-row">
            <div className="col-md-3"></div>
            <div className="col-md-6 col-xs-12 static-content">
                <h2 className="static-content-title">Manage My Projects</h2>
                <div className="form-group-xs row">
                    <div className="col-sm-12">
                        <a href="/doecode/publish" type="button" className="btn btn-success btn-lg pull-right workflow-publish-btn" >
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
