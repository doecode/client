import Field from './Field';
import React from 'react';
import Contributor from '../stores/Contributor';

const contributor = new Contributor();
export default class ContributorField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Field linkedData={contributor} properties={this.props}/>
            </div>
        );
    }
}