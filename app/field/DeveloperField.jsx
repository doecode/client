import Field from './Field';
import React from 'react';
import Developer from '../stores/Developer';

const developer = new Developer();
export default class DeveloperField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Field linkedData={developer} properties={this.props}/>
            </div>
        );
    }
}
