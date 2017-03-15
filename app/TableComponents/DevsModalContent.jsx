import React from 'react';
import TextField from '../components/TextField'
import {observer} from "mobx-react";


@observer
export default class DevsModalContent extends React.Component {
	
	constructor(props) {
		super(props);
		this.onModalChange = this.onModalChange.bind(this);
	}
	
    onModalChange(field, value) {
        this.props.tableStore.setCurrentField(field,value);
    }
    
	
	render() {
        const dev = this.props.tableStore.currentData();
        const contributorTypes = {
        	"Select One" : "",
        	"Contact Person": "ContactPerson",
        	"Data Collector": "DataCollector"
        }
		return(
			
            <div className="container-fluid">
                <div className="form-horizontal">
                    {this.props.isEdit && <div className="form-group form-group-sm row">
                        <TextField field="place" label="Place" elementType="input" value={dev.place} onChange={this.onModalChange}/>
                    </div>
                    }
                    <div className="form-group form-group-sm row">
                        <TextField field="first_name" label="First Name" elementType="input" value={dev.first_name} onChange={this.onModalChange}/>
                    </div>
                    <div className="form-group form-group-sm row">
                        <TextField field="middle_name" label="Middle Name" elementType="input" value={dev.middle_name} onChange={this.onModalChange}/>
                    </div>
                    <div className="form-group form-group-sm row">
                        <TextField field="last_name" label="Last Name" elementType="input" value={dev.last_name} onChange={this.onModalChange}/>
                    </div>
                    <div className="form-group form-group-sm row">
                        <TextField field="email" label="Email" elementType="input" value={dev.email} onChange={this.onModalChange}/>
                    </div>

                    <div className="form-group form-group-sm row">
                        <TextField field="affiliations" label="Affiliations" elementType="input" value={dev.affiliations} onChange={this.onModalChange}/>
                    </div>
                      
                    {dev.contributor_type !== undefined &&
                    <div className="form-group form-group-sm row">
                    <TextField options={contributorTypes} field="contributor_type" label="Contributor Type" elementType="select" value={dev.contributor_type} onChange={this.onModalChange}/>        		    
                    </div>
                    }
        		    
                </div>
            </div>
		);
	}
	
}