import Field from './Field';
import React from 'react';
import ContributingOrganization from '../stores/ContributingOrganization';

const contributingOrganization = new ContributingOrganization();
export default class ContributingOrganizationField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Field linkedData={contributingOrganization} properties={this.props}/>
            </div>
        );
    }
}
