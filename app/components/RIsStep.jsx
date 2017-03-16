import React from 'react';
import AgentsModal from './AgentsModal';
import AgentsTable from './AgentsTable';
import TableStore from '../stores/TableStore';
import {observer} from 'mobx-react';


const tableStore = new TableStore();

@observer
export default class RIsStep extends React.Component {

	constructor(props) {
		    super(props);
			const currentOpt = {
				"arrName" : "related_identifiers",
				"type" : "relatedIdentifier",
				"label" : "Related Identifiers"
			};
			tableStore.current = currentOpt;

		    this.isValidated = this._isValidated.bind(this);
		  }

	_isValidated() {

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
					 "columnName": "identifier_type",
					 "order": 2,
					 "locked": false,
					 "visible": true,
					 "displayName": "Identifier Type"
				 },
				 {
					 "columnName": "relation_type",
					 "order": 3,
					 "locked": false,
					 "visible": true,
					 "displayName": "Relation Type"

				 },
				 {
					 "columnName": "identifier",
					 "order": 4,
					 "locked": false,
					 "visible": true,
					 "displayName": "Identifier"
				 }
					];

		    const arr = this.props.metadataStore.metadata[tableStore.current.arrName].slice();
		    const arrLength = arr.length;

		    return (
		       <div>
             <h2> {tableStore.current.label} </h2>
             <AgentsTable arr={arr} tableStore={tableStore} config={tableConfig} finished={false} />
   		      <AgentsModal tableStore={tableStore} metadataStore={this.props.metadataStore} arrLength={arrLength} contentType="RIs" />
		      </div>
		      );
		  }
}
