import React from 'react';
import ReactDOM from 'react-dom';

export default class ForbiddenPage extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
        <div className="row not-so-wide-row">
            <div className="col-md-3"></div>
            <div className="col-md-6 col-xs-12 static-content center-text">
                <h2 className="static-content-title">Forbidden</h2>
                <p>Access to this page is forbidden.</p>
            </div>
            <div className="col-md-3"></div>
        </div>
        );
    }
}

