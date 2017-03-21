import React from 'react';
import InputHelper from '../components/InputHelper'
import {observer} from "mobx-react";
import Select from 'react-select';
import 'react-select/dist/react-select.css';


@observer
export default class DevsModalContent extends React.Component {

	constructor(props) {
		super(props);
		this.onModalChange = this.onModalChange.bind(this);
		this.onContribsChange = this.onContribsChange.bind(this);
	}

    onModalChange(field, value) {
        this.props.tableStore.setCurrentField(field,value);
    }
    
    onContribsChange(value) {
    	this.props.tableStore.setCurrentField('contributor_type', value);
    }


	render() {
        const dev = this.props.tableStore.currentData();
        
		const contributorTypes = [
			{label: 'Contact Person', value: 'ContactPerson'},
			{label: 'Data Collector', value: 'DataCollector'}
			];
		return(

            <div className="container-fluid">
                <div className="form-horizontal">
                    {this.props.isEdit && <div className="form-group form-group-sm row">
                        <InputHelper field="place" label="#" elementType="input" value={dev.place} onChange={this.onModalChange}/>
                    </div>
                    }
                    <div className="form-group form-group-sm row">
                        <InputHelper field="first_name" label="First Name" elementType="input" value={dev.first_name} onChange={this.onModalChange}/>
                    </div>
                    <div className="form-group form-group-sm row">
                        <InputHelper field="middle_name" label="Middle Name" elementType="input" value={dev.middle_name} onChange={this.onModalChange}/>
                    </div>
                    <div className="form-group form-group-sm row">
                        <InputHelper field="last_name" label="Last Name" elementType="input" value={dev.last_name} onChange={this.onModalChange}/>
                    </div>
                    <div className="form-group form-group-sm row">
                        <InputHelper field="email" label="Email" elementType="input" value={dev.email} onChange={this.onModalChange}/>
                    </div>
                        
                    <div className="form-group form-group-sm row">
                        <InputHelper field="orcid" label="ORCID" elementType="input" value={dev.orcid} onChange={this.onModalChange}/>
                    </div>

                    <div className="form-group form-group-sm row">
                        <InputHelper field="affiliations" label="Affiliations" elementType="input" value={dev.affiliations} onChange={this.onModalChange}/>
                    </div>

                        
                    {dev.contributor_type !== undefined &&
                    <div className="form-group form-group-sm row">
                        <InputHelper field="contributor_type" label="Contributor Type" elementType="select" value={dev.contributor_type} options={contributorTypes} onChange={this.onModalChange}/>
                    </div>
                        }
                        
                        

                </div>
            </div>
		);
	}

}
