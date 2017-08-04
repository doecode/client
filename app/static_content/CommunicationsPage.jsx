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
            <div className="col-md-3"></div>
            <div className="col-md-6 col-xs-12 static-content">

                <h2 className="static-content-title">Communications and Resources</h2>

                <h3>Communications</h3>
                <div className="padblock">

                    <h4>Blogs</h4>
                    <ul>
                        <li>11/12/16 OSTIblog
                            <br/>
                            <a href="https://www.osti.gov/ostiblog/osti-developing-open-source-social-coding-platform-doe-scientific-software">OSTI Developing Open Source, Social Coding Platform for DOE Scientific Software</a>
                        </li>
                    </ul>

                    <h4>OSTI.gov Newsletter Articles</h4>
                    <ul>
                        <li>January/February 2017 OSTI.gov Newsletter:  <a href="https://www.osti.gov/home/newsletter/issue-18-january-february-2017#doesoftware">OSTI Developing New DOE Software Center</a>
                        </li>
                    </ul>

                </div>

                <h3>Resources</h3>
                <div className="padblock">              
                    <h4>Selected Articles and Presentations</h4>
                    <ul>
                        <li>05/03/2017 <a href="docs/billings_stip_20170503.pdf">The New Energy Science and Technology Software Center</a> presented at the DOE Scientific and Technical Information Program (STIP) Annual Working Meeting (Jay Jay Billings, Oak Ridge National Laboratory (ORNL))</li>
                        <li>04/21/2017 <a href="docs/DOE_Code_Code4LibSE_2017.pptx.zip">DOE Code Metadata</a> by Katie Knight, Oak Ridge National Laboratory, <a href="https://wiki.code4lib.org/Southeast_2017#Code4LibSE_2017_Emory_Meeting">Code4LibSE 2017 Emory Meeting</a></li>
                        <li>03/01/2017 Poster presented at SIAM CSE17 PP108 Minisymposterium: <a href="https://figshare.com/articles/billings_doecode_siamcse2017_20170301_jpg/4730203">Software Productivity and Sustainability for CSE and Data Science</a> by Jay Jay Billings, Oak Ridge National Laboratory</li>
                    </ul>

                </div>

                <h3>External Links</h3>
                <div className="padblock">
                    <ul>
                        <li><a href="https://github.com/doecode">DOE Code GitHub site</a></li>
                        <li><a href="https://code.gov/">Code.gov</a></li>
                        <li>The Better Scientific Software Portal
                            <ul>
                                <li>GitHub,  <a href="https://betterscientificsoftware.github.io/">https://betterscientificsoftware.github.io/</a></li>
                                <li>Web page, <a href="http://betterscientificsoftware.info/">http://betterscientificsoftware.info/</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </div>
            <div className="col-md-3"></div>
        </div>
        );
    }
}

