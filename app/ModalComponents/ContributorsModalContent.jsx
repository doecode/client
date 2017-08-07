import React from 'react';
import staticLists from '../staticJson/staticLists';
import {observer} from "mobx-react";


@observer
export default class ContributorsModalContent extends React.Component {

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
                {this.props.data.getValue("first_name") !== undefined &&
                <div>

                        <SpecificField field="first_name" label="First Name" elementType="input" />
                        <SpecificField field="middle_name" label="Middle Name" elementType="input"  />
                        <SpecificField field="last_name" label="Last Name" elementType="input"  />
                        <SpecificField field="email" label="Email" elementType="input"  />
                        <SpecificField field="orcid" label="ORCID" elementType="input"  />
                        <SpecificField field="affiliations" label="Affiliations" elementType="select" options={staticLists.affiliations} allowCreate={true}  isArray={true} multi={true} placeholder="Enter any affiliations."   />
                </div>

				}

				{this.props.data.getValue("organization_name") !== undefined &&
				<div>

                    	  <SpecificField field="DOE" label="DOE Organization?" elementType="checkbox"  />
                        <SpecificField  field="organization_name" label="Organization Name" elementType="input" />

        </div>
				}

                        <SpecificField field="contributor_type" label="Contributor Type" elementType="select"  options={contributorTypes} />
            </div>
		);
	}

}
