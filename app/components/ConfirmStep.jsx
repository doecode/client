import React from 'react';
import AgentsTable from './AgentsTable';
import MetadataStep from './MetadataStep';

export default class ConfirmStep extends React.Component {

	constructor(props) {
		    super(props);

		  }


	  render() {
			const metadata = this.props.metadataStore.metadata;
		    return (
		    <div>
		    <h2> The summary page</h2>
		    </div>
		      );
		  }
}
