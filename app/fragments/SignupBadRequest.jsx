import React from 'react';
import ReactDOM from 'react-dom';

export default class SignupBadRequest extends React.Component {
    constructor(props) {
        super(props);
        this.error_messages = this.props.errors.map((row)=>
        <div className="has-error" key={row.key}>
            <label className="control-label">{row.error}</label>
        </div>
        );
    }


    render() {

        return (

        <div>
                    {this.error_messages}
                </div>

        );
    }
}

