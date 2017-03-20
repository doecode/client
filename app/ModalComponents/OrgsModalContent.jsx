import React from 'react';
import TextField from '../components/TextField'
import Select from 'react-select';
import {observer} from "mobx-react";


@observer
export default class OrgsModalContent extends React.Component {

	constructor(props) {
		super(props);
		this.onModalChange = this.onModalChange.bind(this);
		this.onAwardsChange = this.onAwardsChange.bind(this);
	}

    onModalChange(field, value) {
        this.props.tableStore.setCurrentField(field,value);
    }
    
    onAwardsChange(value) {
    		console.log(value);
    		console.log(this.props.tableStore.makeCurrentCopy().award_numbers);
    		if (value.trim())
    			this.props.tableStore.setCurrentField("award_numbers",value);
    		else
    			this.props.tableStore.setCurrentField("award_numbers",[]);
    }


	render() {
        const data = this.props.tableStore.currentData();
        const contributorTypes = {
        	"Select One" : "",
        	"Contact Person": "ContactPerson",
        	"Data Collector": "DataCollector"
        };
        
		const awards = [
			{label: 'None', value: ''},
			];
        
		return(

            <div className="container-fluid">
                <div className="form-horizontal">
                    {this.props.isEdit && <div className="form-group form-group-sm row">
                        <TextField field="place" label="#" elementType="input" value={data.place} onChange={this.onModalChange}/>
                    </div>
                    }
                    <div className="form-group form-group-sm row">
                        <TextField field="organization_name" label="Name" elementType="input" value={data.organization_name} onChange={this.onModalChange}/>
                    </div>

                    <div className="form-group form-group-sm row">
                        <TextField field="email" label="Email" elementType="input" value={data.email} onChange={this.onModalChange}/>
                    </div>
                        
                    <div className="form-group form-group-sm row">
                        <TextField field="orcid" label="ORCID" elementType="input" value={data.orcid} onChange={this.onModalChange}/>
                    </div>
                        
                    {data.primary_award !== undefined &&
                    <div className="form-group form-group-sm row">
                        <TextField field="primary_award" label="Primary Award" elementType="input" value={data.primary_award} onChange={this.onModalChange}/>
                    </div>
                        
                    }
                    
                    {data.primary_award !== undefined &&
                    <div className="form-group form-group-sm row">
                    <label className="col-sm-2 control-label">
                    Additional Awards
                    </label>
                    <div className="col-sm-4">
                    	<Select allowCreate multi simpleValue placeholder="Enter any additional awards" onChange={this.onAwardsChange} value={data.award_numbers.slice()} />
                    </div>
                    </div>
                    }

                    {data.contributor_type !== undefined &&
                    <div className="form-group form-group-sm row">
                    <TextField options={contributorTypes} field="contributor_type" label="Contributor Type" elementType="select" value={data.contributor_type} onChange={this.onModalChange}/>
                    </div>
                    }

                </div>
            </div>
		);
	}

}