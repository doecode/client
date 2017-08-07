import React from 'react';
import staticLists from '../staticJson/staticLists';
import {observer} from "mobx-react";


@observer
export default class DevsModalContent extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {


		const contributorTypes = [
			{label: 'Contact Person', value: 'ContactPerson'},
			{label: 'Data Collector', value: 'DataCollector'}
			];



		const SpecificField = this.props.SpecificField;
		return(

            <div className="container-fluid form-horizontal">

                        <SpecificField field="first_name" label="First Name" elementType="input" />
                        <SpecificField field="middle_name" label="Middle Name" elementType="input"  />
                        <SpecificField field="last_name" label="Last Name" elementType="input"  />
                        <SpecificField field="email" label="Email" elementType="input"  />
                        <SpecificField field="orcid" label="ORCID" elementType="input"  />
												<SpecificField field="affiliations" label="Affiliations" elementType="select" options={staticLists.affiliations} allowCreate={true}  isArray={true} multi={true} placeholder="Enter any affiliations."   />

                    {this.props.data.getValue("contributor_type") !== undefined &&
                        <SpecificField field="contributor_type" label="Contributor Type" elementType="select"  options={contributorTypes} />
                        }

            </div>
		);
	}

}
