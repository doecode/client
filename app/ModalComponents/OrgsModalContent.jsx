import React from 'react';
import InputHelper from '../components/PInputHelper'
import Select from 'react-select';
import {observer,Provider} from "mobx-react";


@observer
export default class OrgsModalContent extends React.Component {

	constructor(props) {
		super(props);
	}
	
	render() {
        const data = this.props.tableStore.currentData();
		const contributorTypes = [
			{label: 'Contact Person', value: 'ContactPerson'},
			{label: 'Data Collector', value: 'DataCollector'}
			];
		
		const orgNames = [
			{label: 'USDOE', value: 'USDOE'},
			{label: 'USDOE Advanced Research Projects Agency - Energy (ARPA-E)', value: 'USDOE Advanced Research Projects Agency - Energy (ARPA-E)'}
		];
        
        
		return(

            <div className="container-fluid">
            <Provider dataStore={data}>
            <div>     
                <div className="form-horizontal">
                    {this.props.isEdit && 
                    
                    <div className="form-group form-group-sm row">
                        <InputHelper divStyle="col-sm-6" field="place" label="#" elementType="input"  />
                    </div>
                    }
                    <div className="form-group form-group-sm row">
                        <InputHelper divStyle="col-sm-6" field="organization_name" label="Name" elementType="select" allowCreate={true} placeholder="Enter or select from the list your organization" options={orgNames}   />
                    </div>

                    <div className="form-group form-group-sm row">
                        <InputHelper divStyle="col-sm-6" field="email" label="Email" elementType="input"  />
                    </div>
                        
                    <div className="form-group form-group-sm row">
                        <InputHelper divStyle="col-sm-6" field="orcid" label="ORCID" elementType="input"  />
                    </div>
                        
                    {data.primary_award !== undefined &&
                    <div className="form-group form-group-sm row">
                        <InputHelper divStyle="col-sm-6" field="primary_award" label="Primary Award" elementType="input"  />
                    </div>
                        
                    }
                    
                    {data.primary_award !== undefined &&
                    <div className="form-group form-group-sm row">
                    <InputHelper divStyle="col-sm-6" field="award_numbers" label="Additional Awards" elementType="select" allowCreate={true} multi={true} placeholder="Enter any additional awards"   />
                    </div>
                    }

                    {data.contributor_type !== undefined &&
                    <div className="form-group form-group-sm row">
                    <InputHelper divStyle="col-sm-6" options={contributorTypes} field="contributor_type" label="Contributor Type" elementType="select"  />
                    </div>
                    }

                </div>
                </div>
                </Provider>
            </div>
		);
	}

}