import Field from './Field';
import React from 'react';
import SponsoringOrganization from '../stores/SponsoringOrganization';

const sponsoringOrganization = new SponsoringOrganization();
export default class SponsoringOrganizationField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Field linkedData={sponsoringOrganization} properties={this.props}/>
            </div>
        );
    }
}
