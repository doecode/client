import React from 'react';
import ReactDOM from 'react-dom';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (

            <footer className="footer footer-bottom">
                <div className="container">
                    <div className="row">
                        <div className="col text-center">
                            <img src="https://www.osti.gov/scitech/img/ui/DOE_SC_OSTI_70th_white.png" className="mt-3 mb-1" alt="U.S. Department of Energy"/>
                        </div>
                    </div>
                    <div className="row text-center mt-1 mb-1 white">
                        <a href="/doecode/disclaimer" className="footer-link">Website Policies / Important Links</a>
                        &nbsp;•&nbsp;
                        <a href="/doecode/contact" className="footer-link">Contact Us</a>
                    </div>
                </div>
            </footer>
        
        );
    }

}
