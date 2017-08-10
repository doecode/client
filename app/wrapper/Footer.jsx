import React from 'react';
import ReactDOM from 'react-dom';

let footer_classes = "";
export default class Footer extends React.Component {
    constructor(props) {
        super(props);
        footer_classes = (this.props.is_homepage==true)?"footer":"footer footer-bottom";
    }

    render() {
        return (

            <footer className={footer_classes}>
                <div className="container">
                    <div className="row">
                        <div className="col text-center">
                            <img src="https://www.osti.gov/scitech/img/ui/DOE_SC_OSTI_70th_white.png" className="mt-3 mb-1" alt="U.S. Department of Energy"/>
                        </div>
                    </div>
                    <div className="row text-center mt-1 mb-1 white">
                        <a href="/doecode/disclaimer" className="footer-link">Website Policies / Important Links</a>
                        &nbsp;&bull;&nbsp;
                        <a href="/doecode/contact" className="footer-link">Contact Us</a>
                    </div>
                </div>
            </footer>
        
        );
    }

}
