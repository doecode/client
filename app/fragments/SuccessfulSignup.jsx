import React from 'react';
import ReactDOM from 'react-dom';

export default class SuccessfulSignup extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
        <div className="row not-so-wide-row">
            <div className="col-md-3"> </div>
            <div className="col-md-6 col-xs-12 center-text static-content">
                <br/>
                <br/>
                <br/>
                <p>
                    A confirmation email has been sent to the email address you used to register your DOE CODE account. Please follow the instructions
                    in that email to being using DOE CODE.
                </p>
            </div>
            <div className="col-md-3"> </div>
        </div>
        );
    }
}
