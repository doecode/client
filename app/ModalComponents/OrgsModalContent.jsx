import React from 'react';
import {observer} from "mobx-react";


@observer
export default class OrgsModalContent extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {

		const orgNames = [
			{label: 'USDOE', value: 'USDOE'},
			{label: 'USDOE Advanced Research Projects Agency - Energy (ARPA-E)', value: 'USDOE Advanced Research Projects Agency - Energy (ARPA-E)'}
		];

				const SpecificField = this.props.SpecificField;
				const data = this.props.data;


		return(

            <div className="container-fluid">
                <div className="form-horizontal">

                    <div className="form-group form-group-sm row">
                    <SpecificField field="DOE" label="DOE Organization?" elementType="checkbox"  />
                    </div>
                    <div className="form-group form-group-sm row">
                        <SpecificField  field="organization_name" label="Name" elementType="select" allowCreate={true} placeholder="Enter or select from the list your organization" options={orgNames}   />
                    </div>

                    {data.getValue("primary_award") !== undefined &&
                    <div className="form-group form-group-sm row">
                        <SpecificField  field="primary_award" label="Primary Award" elementType="input"  />
                    </div>

                    }

                    {this.props.data.getValue("award_numbers") !== undefined &&
                    <div className="form-group form-group-sm row">
                    <SpecificField field="award_numbers" label="Additional Awards" elementType="select" allowCreate={true} multi={true} placeholder="Enter any additional awards"   />
                    </div>
                    }

                    {this.props.data.getValue("br_codes") !== undefined &&
                    <div className="form-group form-group-sm row">
                    <SpecificField field="br_codes" label="B&R Codes" elementType="select" allowCreate={true} multi={true} placeholder="Enter B&R Codes"   />
                    </div>
                    }

                    {this.props.data.getValue("fwp_numbers") !== undefined &&
                    <div className="form-group form-group-sm row">
                    <SpecificField field="fwp_numbers" label="FWP Numbers" elementType="select" allowCreate={true} multi={true} placeholder="Enter FWP Numbers"   />
                    </div>
                    }

                </div>
            </div>
		);
	}

}
