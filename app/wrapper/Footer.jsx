import React from 'react';
import ReactDOM from 'react-dom';

export default class Footer extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {

        const background = {
            "backgroundColor": "#013588",
            "marginTop": "10px"
        };
        const white = {
            "color": "white"
        };

        return (
            <div style={background}>
                <div className="container">

                    <div className="row">
                        <div className="col text-center">
                            <img src="https://www.osti.gov/scitech/img/ui/DOE_SC_OSTI_70th_white.png" className="mt-3 mb-1" alt="U.S. Department of Energy"/>
                        </div>
                    </div>
                    <div className="row text-center mt-1 mb-1 white">
                        <a href="#" style={white}>Website Policies / Important Links</a>
                        &nbsp;•&nbsp;
                        <a href="#" style={white}>Site Map</a>
                        &nbsp;•&nbsp;
                        <a href="#" style={white}>Contact Us</a>
                    </div>
                </div>
            </div>
        );
    }

}
