import React from 'react';
import InputHelper from '../components/InputHelper'
import {observer,Provider} from "mobx-react";
import Select from 'react-select';
import 'react-select/dist/react-select.css';


@observer
export default class DevsModalContent extends React.Component {

	constructor(props) {
		super(props);
	}
    
	render() {
        const dev = this.props.data;
        
		const contributorTypes = [
			{label: 'Contact Person', value: 'ContactPerson'},
			{label: 'Data Collector', value: 'DataCollector'}
			];
		return(

            <div className="container-fluid">
            <Provider dataStore={dev}>
            <div>     
                <div className="form-horizontal">
                    {dev.getValue("place") > -1 && <div className="form-group form-group-sm row">
                        <InputHelper field="place" label="#" elementType="input" value={dev.place} />
                    </div>
                    }
                    <div className="form-group form-group-sm row">
                        <InputHelper field="first_name" label="First Name" elementType="input" />
                    </div>
                    <div className="form-group form-group-sm row">
                        <InputHelper field="middle_name" label="Middle Name" elementType="input"  />
                    </div>
                    <div className="form-group form-group-sm row">
                        <InputHelper field="last_name" label="Last Name" elementType="input"  />
                    </div>
                    <div className="form-group form-group-sm row">
                        <InputHelper field="email" label="Email" elementType="input"  />
                    </div>
                        
                    <div className="form-group form-group-sm row">
                        <InputHelper field="orcid" label="ORCID" elementType="input"  />
                    </div>

                    <div className="form-group form-group-sm row">
                        <InputHelper field="affiliations" label="Affiliations" elementType="input"  />
                    </div>

                        
                    {dev.getValue("contributor_type") !== undefined &&
                    <div className="form-group form-group-sm row">
                        <InputHelper field="contributor_type" label="Contributor Type" elementType="select"  options={contributorTypes} />
                    </div>
                        }
                        


                </div>
                </div>
                </Provider>
            </div>
		);
	}

}
