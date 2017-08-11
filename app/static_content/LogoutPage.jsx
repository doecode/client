import React from 'react';
import ReactDOM from 'react-dom';

export default class LogoutPage extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
        <div className="row not-so-wide-row">
            <div className="col-md-3"></div>
            <div className="col-md-6 col-xs-12 static-content center-text">
                <h2 className="static-content-title">Logout</h2>
                <p>You have been successfully logged out</p>
            </div>
            <div className="col-md-3"></div>
        </div>
        );
    }
}

