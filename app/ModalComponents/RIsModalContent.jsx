import React from 'react';
import {observer} from "mobx-react";


@observer
export default class RIsModalContent extends React.Component {

	constructor(props) {
		super(props);
	}


	render() {
        
		const identifierTypes = [
			{label: 'DOI', value: 'DOI'},
			{label: 'URL', value: 'URL'}
			];
		
		const relationTypes = [
			{label: 'Cites', value: 'Cites'},
			{label: 'Contains', value: 'Contains'}
			];

		const SpecificField = this.props.SpecificField;

		return(

            <div className="container-fluid">
                <div className="form-horizontal">
                    <div className="form-group form-group-sm row">
                        <SpecificField field="identifier_type" label="Identifier Type" elementType="select" options={identifierTypes}/>
                    </div>
                    <div className="form-group form-group-sm row">
                        <SpecificField field="relation_type" label="Relation Type" elementType="select" options={relationTypes}  />
                    </div>
                    <div className="form-group form-group-sm row">
                        <SpecificField field="identifier" label="Identifier" elementType="input"/>
                    </div>

                </div>
            </div>
		);
	}

}
