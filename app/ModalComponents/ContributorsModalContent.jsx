import React from 'react';
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

            <div className="container-fluid">
                <div className="form-horizontal">
                {this.props.data.getValue("first_name") !== undefined &&
                <div>
                    <div className="form-group form-group-sm row">
                        <SpecificField field="first_name" label="First Name" elementType="input" />
                    </div>
                    <div className="form-group form-group-sm row">
                        <SpecificField field="middle_name" label="Middle Name" elementType="input"  />
                    </div>
                    <div className="form-group form-group-sm row">
                        <SpecificField field="last_name" label="Last Name" elementType="input"  />
                    </div>
                    <div className="form-group form-group-sm row">
                        <SpecificField field="email" label="Email" elementType="input"  />
                    </div>

                    <div className="form-group form-group-sm row">
                        <SpecificField field="orcid" label="ORCID" elementType="input"  />
                    </div>

                    <div className="form-group form-group-sm row">
                        <SpecificField field="affiliations" label="Affiliations" elementType="input"  />
                    </div>
                    
                </div>

				}
				
				{this.props.data.getValue("organization_name") !== undefined &&
				<div>
				    <div className="form-group form-group-sm row">
                    	<SpecificField field="DOE" label="DOE Organization?" elementType="checkbox"  />
                    </div>
                    
                    <div className="form-group form-group-sm row">
                        <SpecificField  field="organization_name" label="Organization Name" elementType="input" />
                    </div>
                
                </div>        
				}
				
				    <div className="form-group form-group-sm row">
                        <SpecificField field="contributor_type" label="Contributor Type" elementType="select"  options={contributorTypes} />
                    </div>


                </div>
            </div>
		);
	}

}
