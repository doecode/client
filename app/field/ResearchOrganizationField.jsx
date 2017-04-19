import Field from './Field';
import React from 'react';
import ResearchOrganization from '../stores/ResearchOrganization';

const researchOrganization = new ResearchOrganization();
export default class ResearchOrganizationField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Field linkedData={researchOrganization} properties={this.props}/>
            </div>
        );
    }
}
