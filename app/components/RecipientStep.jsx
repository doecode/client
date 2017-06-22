import React from 'react';
import MetadataField from '../field//MetadataField';
import {observer,Provider} from "mobx-react";

@observer
export default class RecipientStep extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		return (

	            <div className="container-fluid form-horizontal">
	            	<MetadataField field="recipient_name" label="Name" elementType="input" />
	            	<MetadataField field="recipient_email" label="Email" elementType="input"  />
	            	<MetadataField field="recipient_phone" label="Phone" elementType="input"  />
	            	<MetadataField field="recipient_org" label="Organization" elementType="input" />
             </div>
		);
	}




}
