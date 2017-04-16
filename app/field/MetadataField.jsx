import Field from './Field';
import React from 'react';
import Metadata from '../stores/Metadata';

const metadata = new Metadata();
export default class MetadataField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Field linkedData={metadata} properties={this.props}/>
            </div>
        );
    }
}
