import React from 'react';
import InputHelper from '../components/PInputHelper'
import {observer, Provider} from "mobx-react";


@observer
export default class RIsModalContent extends React.Component {

	constructor(props) {
		super(props);
	}


	render() {
        const ri = this.props.tableStore.currentData();
        
		const identifierTypes = [
			{label: 'DOI', value: 'DOI'},
			{label: 'URL', value: 'URL'}
			];
		
		const relationTypes = [
			{label: 'Cites', value: 'Cites'},
			{label: 'Contains', value: 'Contains'}
			];


		return(

            <div className="container-fluid">
                <Provider dataStore={ri}>
                <div>
                <div className="form-horizontal">
                    {this.props.isEdit && <div className="form-group form-group-sm row">
                        <InputHelper field="place" label="#" elementType="input"/>
                    </div>
                    }
                    <div className="form-group form-group-sm row">
                        <InputHelper field="identifier_type" label="Identifier Type" elementType="select" options={identifierTypes}/>
                    </div>
                    <div className="form-group form-group-sm row">
                        <InputHelper field="relation_type" label="Relation Type" elementType="select" options={relationTypes}  />
                    </div>
                    <div className="form-group form-group-sm row">
                        <InputHelper field="identifier" label="Identifier" elementType="input"/>
                    </div>

                </div>
                </div>
                </Provider>
            </div>
		);
	}

}
