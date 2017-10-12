import React from 'react';

export default class SecurityHostingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='row not-so-wide-row'>
        <div className='col-lg-2 col-sm-1'></div>
        <div className='col-lg-8 col-sm-10 col-xs-12'>
          <div className='row security-host-even'>
            <div className='col-xs-12 security-host-row-content'>
              <span className="security-host-page-title">DOE CODE Hosting Security</span>
              <img alt='DOE CODE' className='security-host-image float-right img-responsive hide-xs' id='security-host-doecode-about' title='DOE CODE' src='https://www.osti.gov/includes/doecode/images/DOEcodeFeatures350px-min.png'/>
              <br/>
              <br/>
              <br/>
              <div id='doecode-security-implementation' className='security-host-text'>
                Implementation of account management
                best practices, use of advanced
                cyber security tools, and application of
                intelligence data offers visitors a trusted
                source of DOE CODE and projects
              </div>
            </div>
          </div>
          <div className='row security-host-odd'>
            <div className='col-xs-12 security-host-row-content'></div>
          </div>
          <div className='row security-host-even'>
            <div className='col-xs-12 security-host-row-content'></div>
          </div>
          <div className='row security-host-odd'>
            <div className='col-xs-12 security-host-row-content'></div>
          </div>
          <div className='row security-host-even'>
            <div className='col-xs-12 security-host-row-content'></div>
          </div>
        </div>
        <div className='col-lg-2 col-sm-1'></div>
      </div>
    );
  }
}
