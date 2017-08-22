import React from 'react';
import AgentsModal from './AgentsModal';
import AgentsTable from './AgentsTable';
import TableStore from '../stores/TableStore';
import EditableDataTable from './EditableDataTable';
import Developer from '../stores/Developer';
import Contributor from '../stores/Contributor';
import Metadata from '../stores/Metadata';
import {observer} from 'mobx-react';
import {Tabs, Tab} from 'react-bootstrap';
import Promise from 'promise';
import {getChildData} from '../utils/utils'


const tableStore = new TableStore();
const metadata = new Metadata();

@observer
export default class AgentsStep extends React.Component {

	constructor(props) {
		    super(props);
			this.state = {"key" : 0};

		    this.isValidated = this._isValidated.bind(this);
		    this.onTabSelect = this.onTabSelect.bind(this);
		  }

	_isValidated() {

		//return this.props.getSubmitPromise();

	}

	onTabSelect(key) {
	    this.setState({"key" : key});

	}



	  render() {


			const tableConfig = [{
					 "columnName": "place",
					 "order": 1,
					 "locked": false,
					 "visible": false,
					 "displayName": "#"

				 },
				 {
					 "columnName": "first_name",
					 "order": 2,
					 "locked": false,
					 "visible": true,
					 "displayName": "First Name"
				 },
				 {
					 "columnName": "middle_name",
					 "order": 3,
					 "locked": false,
					 "visible": true,
					 "displayName": "Middle Name"

				 },
				 {
					 "columnName": "last_name",
					 "order": 4,
					 "locked": false,
					 "visible": true,
					 "displayName": "Last Name"
				 },
				 {
					 "columnName": "email",
					 "order": 5,
					 "locked": false,
					 "visible": true,
					 "displayName": "Email"
				 },
				 {
					 "columnName": "orcid",
					 "order": 6,
					 "locked": false,
					 "visible": true,
					 "displayName": "ORCID"
				 },
				 {
						 "columnName": "affiliations",
						 "order": 7,
						 "locked": false,
						 "visible": true,
						 "displayName": "Affiliations"
					 },

						 {
								 "columnName": "id",
									 "order": 8,
									 "locked": false,
									 "visible": false,
									 "displayName": "id"
							},


					];


			const opts = ["developers"];
			const parentName = opts[this.state.key];

			const columns = ["first_name", "last_name", "affiliations"];


			const contentType = "Devs";


				const content = <EditableDataTable columns={columns} contentType={contentType} config={tableConfig} parentName={parentName}/>
		    return (

                    <div className="container-fulid form-horizontal">
                        <div className="row">
                            <div className="col-md-9 col-xs-12">
                                <h2> Developers </h2>
                                {content}
                            </div>
                            <div className="col-md-3"></div>
                        </div>
                    </div>

		      );
		  }
}
