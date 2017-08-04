import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';

import emailImage from = 'images/E-Mail.png';
import phoneImage from = 'images/Phone.png';
import mailImage from = 'images/Writing.png';

export default class Splash extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
        <div className="row not-so-wide-row">
            <div className="col-md-6 order-page-content">
                <div className="page-title"><h2>Contacts</h2></div>
                <div className="row">
                    <div className="col-md-2 hidden-xs hidden-sm">
                        <img src={emailImage} className="img-rounded img-responsive contact-img" alt="email"/>
                    </div>
                    <div className="col-md-10 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 contact-page-header"><strong>EMAIL</strong></div>
                            <div className="col-xs-12">
                                <p>For administrative/policy questions, contact: <a href="mailto:Douglas.Harden@hq.doe.gov?subject=OpenNet Administrative/Policy Comments or Suggestions">Douglas.Harden@hq.doe.gov</a> </p>
                                <p>For system/technical questions or comments, contact: <a href="mailto:opennet@osti.gov?subject=OpenNet System/Technical Comments or Suggestions">opennet@osti.gov</a> </p>
                                <p>Email messages to <a href="mailto:opennet@osti.gov?subject=OpenNet System/Technical Comments or Suggestions">opennet@osti.gov</a> are answered throughout the work week. We do our best to respond within 48 hours.</p>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>

                <div className="row">
                    <div className="col-md-2 hidden-xs hidden-sm">
                        <img src={phoneImage} className="img-rounded img-responsive contact-img" alt="email"/>
                    </div>
                    <div className="col-md-10 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 contact-page-header"><strong>PHONE</strong></div>
                            <div className="col-xs-12">
                                301-903-1145
                            </div>
                        </div>
                    </div>
                </div>
                <br/>

                <div className="row">
                    <div className="col-md-2 hidden-xs hidden-sm">
                        <img src={mailImage} className="img-rounded img-responsive contact-img" alt="email"/>
                    </div>
                    <div className="col-md-10 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 contact-page-header"><strong>MAIL</strong></div>
                            <div className="col-xs-12">
                                Douglas Harden
                                <br/>
                                U.S. Department of Energy
                                <br/>
                                Office of Classification, AU-61 (GTN)
                                <br/>
                                1000 Independence Ave., SW
                                <br/>
                                Washington, DC 20585-1290 
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
