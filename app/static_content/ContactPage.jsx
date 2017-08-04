import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';

export default class Splash extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
        <div className="row not-so-wide-row">
            <div className="col-md-1"></div>
            <div className="col-md-10 col-xs-12 static-content">
                <h2 className="static-content-title">Contacts</h2>
                <br/>
                <div className="row">
                    <div className="col-md-2 hidden-xs hidden-sm">
                        <img src="https://www.osti.gov/opennet/images/E-Mail.png" className="img-rounded img-responsive contact-img" alt="email"/>
                    </div>
                    <div className="col-md-10 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 contact-page-header"><strong>EMAIL</strong></div>
                            <div className="col-xs-12">
                                <p>
                                    <a href="mailto:scitechcomments@osti.gov?subject=Comments or Suggestions">scitechcomments@osti.gov</a>
                                </p>
                                <p> NOTE: Email messages are answered Monday - Friday, 9 a.m. - 4 p.m. We do our best to respond within 48 hours. </p>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>

                <div className="row">
                    <div className="col-md-2 hidden-xs hidden-sm">
                        <img src="https://www.osti.gov/opennet/images/Phone.png" className="img-rounded img-responsive contact-img" alt="email"/>
                    </div>
                    <div className="col-md-10 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 contact-page-header"><strong>PHONE</strong></div>
                            <div className="col-xs-12">
                                555-555-5555
                            </div>
                        </div>
                    </div>
                </div>
                <br/>

                <div className="row">
                    <div className="col-md-2 hidden-xs hidden-sm">
                        <img src="https://www.osti.gov/opennet/images/Writing.png" className="img-rounded img-responsive contact-img" alt="email"/>
                    </div>
                    <div className="col-md-10 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 contact-page-header"><strong>MAIL</strong></div>
                            <div className="col-xs-12">
                                <p>
                                    U.S. Department of Energy
                                    <br/>
                                    Office of Scientific and Technical Information
                                    <br/>
                                    P.O. Box 62
                                    <br/>
                                    Oak Ridge,TN 37831
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-1"></div>
            </div>
        </div>
        );
    }
}
