import React from 'react';
import AgentsModal from './AgentsModal';
import AgentsTable from './AgentsTable';
import TableStore from '../stores/TableStore';
import Developer from '../stores/Developer';
import Contributor from '../stores/Contributor';
import {observer} from 'mobx-react';
import {Tabs, Tab} from 'react-bootstrap';
import Promise from 'promise';
import {getChildData} from '../utils/utils'


const tableStore = new TableStore();

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
					 "visible": true,
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
						 "order": 6,
						 "locked": false,
						 "visible": true,
						 "displayName": "Affiliations"
					 },
					 {
							 "columnName": "contributor_type",
								 "order": 7,
								 "locked": false,
								 "visible": true,
								 "displayName": "Contributor Type"
						}
					];

			const opts = ["developers", "contributors"];
			const currentParent = opts[this.state.key];
			const metadata = this.props.metadata;
			const currentArray = metadata.getValue(currentParent);
			const data = getChildData(currentParent);
			
			if (tableStore.currentId) {
				const index = currentArray.findIndex(item => item.id === tableStore.currentId);
				data.loadValues(currentArray[index]);
			}
			

		    const content = <div>
		      <AgentsTable arr={currentArray.slice()} tableStore={tableStore} config={tableConfig} finished={false} />
		      <AgentsModal tableStore={tableStore} dataType={currentParent} data={data} metadata={this.props.metadata} contentType="Devs" />
		    </div>
		    return (
		       <div>
		      <Tabs activeKey={this.state.key} onSelect={this.onTabSelect} id="devsStepTabs">
		      <Tab eventKey={0} title="Developers"> {content} </Tab>
		      <Tab eventKey={1} title="Contributors"> {content} </Tab>
		      </Tabs>
		      </div>
		      );
		  }
}
