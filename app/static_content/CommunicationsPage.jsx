import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';

export default class Communications extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="row not-so-wide-row">
        <div className="col-lg-3 col-md-1"></div>
        <div className="col-lg-6 col-md-10 col-xs-12 static-content">
          <span className="static-content-title">Communications and Resources</span>
          <h2>Communications</h2>
          <div className="padblock">
            <h4>Blogs</h4>
            <ul>
              <li>11/12/16 OSTIblog&nbsp;<a title='OSTI Blog' href="https://www.osti.gov/ostiblog/osti-developing-open-source-social-coding-platform-doe-scientific-software">OSTI Developing Open Source, Social Coding Platform for DOE Scientific Software</a>
              </li>
            </ul>
            <h4>OSTI.gov Newsletter Articles</h4>
            <ul>
              <li>January/February 2017 OSTI.gov Newsletter:&nbsp;
                <a title='2017 Newsletter' href="https://www.osti.gov/home/newsletter/issue-18-january-february-2017#doesoftware">OSTI Developing New DOE Software Center</a>
              </li>
            </ul>
          </div>
          <h2>Resources</h2>
          <div className="padblock">
            <h4>Selected Articles and Presentations</h4>
            <ul>
              <li>05/03/2017&nbsp;
                <a title='Energy Science Tech Software Center' href="https://github.com/doecode/doecode.github.io/blob/master/docs/billings_stip_20170503.pdf?raw=true">The New Energy Science and Technology Software Center</a>&nbsp;presented at the DOE Scientific and Technical Information Program (STIP) Annual Working Meeting (Jay Jay Billings, Oak Ridge National Laboratory (ORNL))</li>
              <li>04/21/2017&nbsp;
                <a title='DOE CODE Metadata' href="https://github.com/doecode/doecode.github.io/blob/master/docs/DOE_Code_Code4LibSE_2017.pptx.zip?raw=true">DOE CODE Metadata</a>&nbsp;by Katie Knight, Oak Ridge National Laboratory,&nbsp;<a title='Code4LibSE' href="https://wiki.code4lib.org/Southeast_2017#Code4LibSE_2017_Emory_Meeting">Code4LibSE 2017 Emory Meeting</a>
              </li>
              <li>03/01/2017 Poster presented at SIAM CSE17 PP108 Minisymposterium:&nbsp;
                <a title='Software Productivity' href="https://figshare.com/articles/billings_doecode_siamcse2017_20170301_jpg/4730203">Software Productivity and Sustainability for CSE and Data Science</a>&nbsp; by Jay Jay Billings, Oak Ridge National Laboratory</li>
            </ul>
          </div>
          <h2>External Links</h2>
          <div className="padblock">
            <ul>
              <li>
                <a title='Github' href="https://github.com/doecode">DOE CODE GitHub site</a>
              </li>
              <li>
                <a title='Code.gov' href="https://code.gov/">Code.gov</a>
              </li>
              <li>The Better Scientific Software Portal
                <ul>
                  <li>GitHub,&nbsp;
                    <a title='Better Scientific Software' className='word-break' href="https://betterscientificsoftware.github.io/">https://betterscientificsoftware.github.io/</a>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
        <div className="col-lg-3 col-md-1"></div>
      </div>
    );
  }
}
