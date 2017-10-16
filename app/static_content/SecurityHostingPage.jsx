import React from 'react';

export default class SecurityHostingPage extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='row not-so-wide-row'>
        <div className='col-lg-2 special-lg-2 col-md-1'></div>
        <div className='col-lg-8 special-lg-8 col-md-10 col-xs-12'>
          <div className='row security-host-even'>
            <div className='col-xs-12 security-host-row-content hide-xs'>
              <span className="security-host-page-title">DOE CODE Hosting Security</span>
              <img alt='DOE CODE' className='security-host-image security-host-right-image img-responsive hide-xs' title='DOE CODE' src='https://www.osti.gov/includes/doecode/images/DOEcodeFeatures350px-min.png'/>
              <br/>
              <br/>
              <br/>
              <br/>
              <div className='security-host-text security-host-left-text'>
                Implementation of account management best practices, use of advanced cyber security tools, and application of intelligence data offers visitors a trusted source of DOE CODE and projects.
              </div>
            </div>
            {/*Mobile Version*/}
            <div className='col-xs-12 security-host-row-content  hide-sm hide-md hide-lg'>
              <div className='container'>
                <div className="security-host-page-title center-text">DOE CODE Hosting Security</div>
                <br/>
                <div className='security-host-text'>
                  Implementation of account management best practices, use of advanced cyber security tools, and application of intelligence data offers visitors a trusted source of DOE CODE and projects.
                </div>
              </div>
            </div>
          </div>
          <div className='row security-host-odd '>
            <div className='col-xs-12 security-host-row-content hide-xs'>
              <br/>
              <img alt='DOE CODE' className='security-host-image security-host-right-image img-responsive hide-xs' title='DOE CODE' src='https://www.osti.gov/includes/doecode/images/GITLABsecurity300px-min.png'/>
              <br/>
              <span className="security-host-title">GITLAB SECURITY</span>
              <br/>
              <br/>
              <br/>
              <div className='security-host-text security-host-list-text-left'>
                <ul>
                  <li>OSTI limits registrations to known/trusted entities to reduce attack surface.</li>
                  <li>Native GitLab features give owners granular control of their project and project contributors.</li>
                </ul>
              </div>
              <br/>
              <div className='security-host-arrow security-host-odd '></div>
            </div>
            {/*Mobile Version*/}
            <div className='col-xs-12 security-host-row-content  hide-sm hide-md hide-lg'>
              <div className='container'>
                <br/>
                <div className="security-host-title">GITLAB SECURITY</div>
                <br/>
                <div className='security-host-text '>
                  <ul>
                    <li>OSTI limits registrations to known/trusted entities to reduce attack surface.</li>
                    <li>Native GitLab features give owners granular control of their project and project contributors.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='row security-host-even'>
            <div className='col-xs-12 security-host-row-content hide-xs'>
              <br/>
              <img alt='DOE CODE' className='security-host-image security-host-left-image img-responsive hide-xs' title='DOE CODE' src='https://www.osti.gov/includes/doecode/images/SoftwareDetonation300px-min.png'/>
              <br/>
              <div className='text-right'>
                <span className="security-host-title" id='security-host-detonation'>Software Detonation</span>
              </div>
              <br/>
              <br/>
              <div className='security-host-text security-host-list-text-right float-right'>
                <ul>
                  <li>Compatible executable code is safely detonated by a software suite in an isolated environment.</li>
                  <li>Machine-based learning identifies and quarantines suspicious behavior.</li>
                </ul>
              </div>
              <br/>
              <div className='security-host-arrow security-host-even '></div>
            </div>
            {/*Mobile Version*/}
            <div className='col-xs-12 security-host-row-content  hide-sm hide-md hide-lg'>
              <div className='container'>
                <br/>
                <div className="security-host-title">Software Detonation</div>
                <br/>
                <div className='security-host-text'>
                  <ul>
                    <li>Compatible executable code is safely detonated by a software suite in an isolated environment.</li>
                    <li>Machine-based learning identifies and quarantines suspicious behavior.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='row security-host-odd'>
            <div className='col-xs-12 security-host-row-content hide-xs'>
              <br/>
              <img alt='DOE CODE' className='security-host-image security-host-right-image img-responsive hide-xs' title='DOE CODE' src='https://www.osti.gov/includes/doecode/images/IntelData300px-min.png'/>
              <br/>
              <span className="security-host-title">Intelligence Data</span>
              <br/>
              <br/>
              <br/>
              <div className='security-host-text security-host-list-text-left'>
                <ul>
                  <li>Daily intelligence feed processing includes newly-identified malicious files and adversary tactics.</li>
                </ul>
              </div>
              <br/>
              <div className='security-host-arrow security-host-odd '></div>
            </div>
            {/*Mobile Version*/}
            <div className='col-xs-12 security-host-row-content  hide-sm hide-md hide-lg'>
              <div className='container'>
                <br/>
                <div className="security-host-title">Intelligence Data</div>
                <br/>
                <div className='security-host-text'>
                  <ul>
                    <li>Daily intelligence feed processing includes newly-identified malicious files and adversary tactics.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className='row security-host-even'>
            <div className='col-xs-12 security-host-row-content hide-xs'>
              <br/>
              <img alt='DOE CODE' className='security-host-image security-host-left-image img-responsive hide-xs' title='DOE CODE' src='https://www.osti.gov/includes/doecode/images/FileScans300px-min.png'/>
              <br/>
              <div className='text-right'>
                <span className="security-host-title" id='security-host-file-scans'>File Scans</span>
              </div>
              <br/>
              <br/>
              <div className='security-host-text security-host-list-text-right float-right'>
                <ul>
                  <li>Endpoint protection software scans raw source code and executable code for known signatures.</li>
                  <li>Searches on files are supported to identify undesirable content.</li>
                </ul>
              </div>
              <br/>
            </div>
            {/*Mobile Version*/}
            <div className='col-xs-12 security-host-row-content  hide-sm hide-md hide-lg'>
              <div className='container'>
                <br/>
                <div className="security-host-title">File Scans</div>
                <br/>
                <div className='security-host-text'>
                  <ul>
                    <li>Endpoint protection software scans raw source code and executable code for known signatures.</li>
                    <li>Searches on files are supported to identify undesirable content.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-lg-2 special-lg-2 col-md-1'></div>
      </div>
    );
  }
}
