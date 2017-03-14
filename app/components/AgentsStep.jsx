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
		    this.isValidated = this._isValidated.bind(this);
		  }

	_isValidated() {

		return this.props.getSubmitPromise();

	}



	  render() {

		  
		    const metadata = this.props.metadataStore.metadata;
		    const myCurrent = {
		        	"arrName" : "developers",
		        	"type" : "developer",
		        	"label" : "developer"
		        }
		    tableStore.current = myCurrent;
		    const arr = metadata[tableStore.current.arrName].slice();
		    const arrLength = arr.length;
		    return (
		    <div>
		      <AgentsTable arr={arr} tableStore={tableStore} finished={false} />
		      <AgentsModal tableStore={tableStore} metadataStore={this.props.metadataStore} arrLength={arrLength} />
		    </div>
		      );
		  }
}
