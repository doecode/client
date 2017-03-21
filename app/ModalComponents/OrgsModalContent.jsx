import React from 'react';
import InputHelper from '../components/InputHelper'
import Select from 'react-select';
import {observer} from "mobx-react";


@observer
export default class OrgsModalContent extends React.Component {

	constructor(props) {
		super(props);
		this.onModalChange = this.onModalChange.bind(this);
	}

    onModalChange(field, value) {
        this.props.tableStore.setCurrentField(field,value);
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
                <div className="form-horizontal">
                    {this.props.isEdit && 
                    
                    <div className="form-group form-group-sm row">
                        <InputHelper field="place" label="#" elementType="input" value={data.place} onChange={this.onModalChange}/>
                    </div>
                    }
                    <div className="form-group form-group-sm row">
                        <InputHelper field="organization_name" label="Name" elementType="select" value={data.organization_name} allowCreate={true} placeholder="Enter or select from the list your organization" options={orgNames} onChange={this.onModalChange}  />
                    </div>

                    <div className="form-group form-group-sm row">
                        <InputHelper field="email" label="Email" elementType="input" value={data.email} onChange={this.onModalChange}/>
                    </div>
                        
                    <div className="form-group form-group-sm row">
                        <InputHelper field="orcid" label="ORCID" elementType="input" value={data.orcid} onChange={this.onModalChange}/>
                    </div>
                        
                    {data.primary_award !== undefined &&
                    <div className="form-group form-group-sm row">
                        <InputHelper field="primary_award" label="Primary Award" elementType="input" value={data.primary_award} onChange={this.onModalChange}/>
                    </div>
                        
                    }
                    
                    {data.primary_award !== undefined &&
                    <div className="form-group form-group-sm row">
                    <InputHelper field="award_numbers" label="Additional Awards" elementType="select" allowCreate={true} multi={true} placeholder="Enter any additional awards" onChange={this.onModalChange} value={data.award_numbers.slice()} />
                    </div>
                    }

                    {data.contributor_type !== undefined &&
                    <div className="form-group form-group-sm row">
                    <InputHelper options={contributorTypes} field="contributor_type" label="Contributor Type" elementType="select" value={data.contributor_type} onChange={this.onModalChange}/>
                    </div>
                    }

                </div>
            </div>
		);
	}

}