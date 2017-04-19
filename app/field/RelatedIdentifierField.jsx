import Field from './Field';
import React from 'react';
import RelatedIdentifier from '../stores/RelatedIdentifier';

const relatedIdentifier = new RelatedIdentifier();
export default class RelatedIdentifierField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Field linkedData={relatedIdentifier} properties={this.props}/>
            </div>
        );
    }
}
