import React from 'react';
import InputHelper from '../components/InputHelper'
import {observer,Provider} from "mobx-react";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {getChildField} from '../utils/utils';
import DeveloperField from '../field/DeveloperField';
import ContributorField from '../field/ContributorField';


@observer
export default class DevsModalContent extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		const fields = {
				"developers" : DeveloperField,
				"contributors" : ContributorField
		};
		const contributorTypes = [
			{label: 'Contact Person', value: 'ContactPerson'},
			{label: 'Data Collector', value: 'DataCollector'}
			];
		
		console.log(this.props.type);
		const SpecificField = fields[this.props.type];
		return(

            <div className="container-fluid">
                <div className="form-horizontal">
                    {this.props.data.getValue("place") > -1 && <div className="form-group form-group-sm row">
                        <SpecificField field="place" label="#" elementType="input" />
                    </div>
                    }
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


                    {this.props.data.getValue("contributor_type") !== undefined &&
                    <div className="form-group form-group-sm row">
                        <SpecificField field="contributor_type" label="Contributor Type" elementType="select"  options={contributorTypes} />
                    </div>
                        }



                </div>
            </div>
		);
	}

}
