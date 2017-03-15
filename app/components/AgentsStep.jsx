import React from 'react';
import AgentsModal from './AgentsModal';
import AgentsTable from './AgentsTable';
import TableStore from '../stores/TableStore';
import {observer} from 'mobx-react';
import Promise from 'promise';


const tableStore = new TableStore();

@observer
export default class AgentsStep extends React.Component {

	constructor(props) {
		    super(props);

				const myCurrent = {
							"arrName" : "developers",
							"type" : "developer",
							"label" : "Developers"
			 }
				tableStore.current = myCurrent;


		    this.isValidated = this._isValidated.bind(this);
		  }

	_isValidated() {

		return this.props.getSubmitPromise();

	}



	  render() {


		    const metadata = this.props.metadataStore.metadata;


		    const arr = metadata.developers.slice();
		    const arrLength = arr.length;
		    return (
		    <div>
		      <AgentsTable arr={arr} tableStore={tableStore} finished={false} />
		      <AgentsModal tableStore={tableStore} metadataStore={this.props.metadataStore} arrLength={arrLength} />
		    </div>
		      );
		  }
}
