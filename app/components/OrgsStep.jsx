import React from 'react';
import AgentsModal from './AgentsModal';
import AgentsTable from './AgentsTable';
import TableStore from '../stores/TableStore';
import {observer} from 'mobx-react';
import {Tabs, Tab} from 'react-bootstrap';
import Promise from 'promise';


const tableStore = new TableStore();

@observer
export default class OrgsStep extends React.Component {

	constructor(props) {
		    super(props);
			const currentOpts = [{
				"arrName" : "sponsoring_organizations",
				"type" : "sponsoring_organization",
				"label" : "Sponsoring Organizations"
			},
			{
				"arrName" : "research_organizations",
				"type" : "research_organization",
				"label" : "Research Organizations"
			},
			{
				"arrName" : "contributing_organizations",
				"type" : "contributing_organization",
				"label" : "Contributing Organizations"
			}

			];
			this.state = {"key" : 0};
			tableStore.current = currentOpts[0];

		    this.isValidated = this._isValidated.bind(this);
		    this.onTabSelect = this.onTabSelect.bind(this);
		  }

	_isValidated() {

		//return this.props.getSubmitPromise();

	}

	onTabSelect(key) {

		const currentOpts = [{
			"arrName" : "sponsoring_organizations",
			"type" : "sponsoring_organization",
			"label" : "Sponsoring Organizations"
		},
		{
			"arrName" : "research_organizations",
			"type" : "research_organization",
			"label" : "Research Organizations"
		},
		{
			"arrName" : "contributing_organizations",
			"type" : "contributing_organization",
			"label" : "Contributing Organizations"
		}

		];

	    tableStore.current = currentOpts[key];
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
			
			let columns = ["place","organization_name","email","orcid"];
			if (tableStore.current.type === 'sponsoring_organization')
				columns.push("primary_award")

		    const arr = this.props.metadataStore.metadata[tableStore.current.arrName].slice();
		    const arrLength = arr.length;
		    const content = <div>
		      <AgentsTable arr={arr} tableStore={tableStore} config={tableConfig} finished={false} columns={columns} />
		      <AgentsModal tableStore={tableStore} metadataStore={this.props.metadataStore} arrLength={arrLength} contentType="Orgs" />
		    </div>
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
