import React from 'react';
import AgentsModal from './AgentsModal';
import AgentsTable from './AgentsTable';
import TableStore from '../stores/TableStore';
import EditableDataTable from './EditableDataTable';
import {observer} from 'mobx-react';
import {Tabs, Tab} from 'react-bootstrap';
import Promise from 'promise';


const tableStore = new TableStore();

@observer
export default class OrgsStep extends React.Component {

	constructor(props) {
		    super(props);
			this.state = {"key" : 0};

		    this.onTabSelect = this.onTabSelect.bind(this);
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
					 "columnName": "organization_name",
					 "order": 2,
					 "locked": false,
					 "visible": true,
					 "displayName": "Name"
				 },
				 {
					 "columnName": "email",
					 "order": 3,
					 "locked": false,
					 "visible": true,
					 "displayName": "Email"

				 },
				 {
					 "columnName": "orcid",
					 "order": 4,
					 "locked": false,
					 "visible": true,
					 "displayName": "ORCID"

				 },
				 {
					 "columnName": "primary_award",
					 "order": 5,
					 "locked": false,
					 "visible": true,
					 "displayName": "Primary Award"
				 }
				];

			const opts = ["sponsoring_organizations", "research_organizations", "contributing_organizations"];
			const parentName = opts[this.state.key];
			const contentType = "Orgs";
			let columns = ["organization_name","email","orcid"];
			if (parentName === 'sponsoring_organizations')
				columns.push("primary_award")


      const content = <EditableDataTable columns={columns} contentType={contentType} config={tableConfig} parentName={parentName}/>
		    return (
		       <div>
		      <Tabs activeKey={this.state.key} onSelect={this.onTabSelect} id="orgsStepTabs">
		      <Tab eventKey={0} title="Sponsoring Organizations"> {content} </Tab>
		      <Tab eventKey={1} title="Research Organizations"> {content} </Tab>
		      <Tab eventKey={2} title="Contributing Organizations"> {content} </Tab>
		      </Tabs>
		      </div>
		      );
		  }
}
