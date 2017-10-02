import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';

export default class Contact extends React.Component {
    constructor(props) {
        super(props);
    }


    render() {

        return (
        <div className="row not-so-wide-row">
            <div className="col-lg-3 col-md-1"></div>
            <div className="col-lg-6 col-md-10 col-xs-12 static-content">
                <h2 className="static-content-title">Contacts</h2>
                <br/>
                <div className="row">
                    <div className="col-sm-2 hidden-xs ">
                        <img title='Email' src='https://www.osti.gov/includes/doecode/images/E-Mail.png' className="img-rounded img-responsive contact-img" alt="email"/>
                    </div>
                    <div className="col-sm-10 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 contact-page-header"><strong>EMAIL</strong></div>
                            <div className="col-xs-12">
                                <p>
                                    <a title='Email doecode@osti.gov' href="mailto:doecode@osti.gov?subject=Comments or Suggestions">doecode@osti.gov</a>
                                </p>
                                <p> NOTE: Email messages are answered Monday - Friday, 9 a.m. - 4 p.m. We do our best to respond within 48 hours. </p>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>

                <div className="row">
                    <div className="col-sm-2 hidden-xs ">
                        <img title='Phone' src={require('../images/Phone.png')} className="img-rounded img-responsive contact-img" alt="phone"/>
                    </div>
                    <div className="col-sm-10 col-xs-12">
                        <div className="row">
                            <div className="col-xs-12 contact-page-header"><strong>PHONE</strong></div>
                            <div className="col-xs-12">
                                865-241-6435
                            </div>
                        </div>
                    </div>
                </div>
                <br/>

                <div className="row">
                    <div className="col-sm-2 hidden-xs ">
                        <img title='Writing' src={require('../images/Writing.png')} className="img-rounded img-responsive contact-img" alt="writing"/>
                    </div>
                    <div className="col-sm-10 col-xs-12">
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
                <div className="col-lg-3 col-md-1"></div>
            </div>
        </div>
        );
    }
}
