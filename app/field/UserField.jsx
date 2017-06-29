import Field from './Field';
import React from 'react';
import UserData from '../stores/UserData';

const userData = new UserData();
export default class UserField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Field linkedData={userData} properties={this.props}/>
            </div>
        );
    }
}
