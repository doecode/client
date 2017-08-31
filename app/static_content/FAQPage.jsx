import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';

export default class FAQ extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12 static-content">
          <h2 className="static-content-title">FAQ's</h2>
          <br/>
          <br/>
          <span className='faq-page-subtitle'>What is DOE CODE?</span>
          <br/>
          <p>DOE CODE is a software submission and search tool that allows for scientific software to be provided to the U.S. Department of Energy (DOE). DOE CODE provides functionality for collaboration, archiving, and discovery of scientific software. DOE CODE replaces the Energy Science and Technology Software Center (ESTSC). DOE CODE is an open source project and is available on GitHub. Throughout these FAQs, the terms "software" and "code" are used interchangeably.
          </p>
          <br/>
          <span className='faq-page-subtitle'>What does it mean for DOE CODE to be released in Alpha?</span>
          <br/>
          <p>In Alpha, DOE CODE supports submission of unlimited distribution software projects, code repository services, and search and discovery of published software projects. As development of DOE CODE continues in toward Beta and Production releases, additional features and functionality will be included. Future requirements will include provenance and version tracking, social coding features, and additional profile features.</p>
          <br/>
          <span className='faq-page-subtitle'>How is the DOE CODE software submission and search tool different than&nbsp;
            <a target="_blank" href='https://github.com/doecode'>DOE CODE GitHub</a>
          </span>
          <br/>
          <p>Per the charge for Office of Scientific and Technical Information (OSTI) to fulfill the Department’s responsibilities to collect, preserve, and disseminate scientific and technical information, emanating from DOE R&D activities, the DOE CODE provides for the submission and search of software here. DOE CODE is an open source project and is available on GitHub.</p>
          <br/>
          <span className='faq-page-subtitle'>Do I need to have cookies enabled to use DOE CODE?</span>
          <br/>
          <p>Yes, you must select Accept All Cookies. Please see our&nbsp;
            <a target='_blank' href='https://www.osti.gov/elink/disclaimers.jsp'>Website Policies/Important Links</a>&nbsp; for further information.</p>
          <br/>
          <span className='faq-page-subtitle'>What does DOE CODE contain?</span>
          <br/>
          <p>DOE CODE contains records for DOE-funded software and links to the software or code repository. In addition to the code, the repositories may include manuals, examples, test data, etc.
          </p>
          <br/>
          <span className='faq-page-subtitle'>Does DOE CODE provide repository services?</span>
          <br/>
          <p>DOE CODE provides repository hosting services for the DOE community via GitLab at&nbsp;
            <a href='https://gitlab.osti.gov/'>https://gitlab.osti.gov/</a>. If you are interested in making use of this service please email&nbsp;
            <a href='mailto:doecoderepositories@osti.gov'>doecoderepositories@osti.gov</a>&nbsp;to request more information.</p>
          <br/>
          <span className='faq-page-subtitle'>What are the types of Software Availability?</span>
          <br/>
          <p>
            <strong>Open Source, publicly available repository</strong>
            - Software that can be freely accessed, used, changed and shared (in modified or unmodified form) by anyone in a public repository. Open Source software is made by many people, and distributed under licenses that comply with the Open Source Definition. See Open Source Initiative for more information and definitions.
          </p>
          <p>
            <strong>Open Source, no publicly available repository</strong>
            - Code is Open Source, but is not yet available in a public repository. Interested users can contact the developer(s) or responsibly parties for information regarding access and (re)use. A landing page URL is required for submitting Open Source, no publicly available repository, the URL is typically a landing page where interested parties can find out more information about obtaining access to the code.
          </p>
          <p>
            <strong>Closed Source</strong>
            - Software that is not Open Source and for which access must be granted by contacting a licensing official. Software is often Close Source because it is proprietary, sensitive, or has otherwise been deemed necessary for a limited distribution. A landing page URL is required for submitting Closed Source code, the URL should provide interested parties additional information on how they can obtain access to the code.</p>
          <br/>
          <span className='faq-page-subtitle'>Are there restrictions on the use of the material in DOE CODE?</span>
          <br/>
          <p>There may be restrictions on use of the material based on the associated license(s). Currently, DOE CODE supports the following list of Open Source licenses:</p>
          <div>
            <ul>
              <li>
                <a href='https://opensource.org/licenses/Apache-2.0'>Apache License 2.0</a>
              </li>
              <li>
                <a href='https://www.gnu.org/licenses/quick-guide-gplv3.html'>GNU General Public License v3.0</a>
              </li>
              <li>
                <a href='https://opensource.org/licenses/MIT'>MIT License</a>
              </li>
              <li>
                <a href='https://opensource.org/licenses/BSD-2-Clause'>BSD 2-clause "simplified" License</a>
              </li>
              <li>
                <a href='https://opensource.org/licenses/BSD-3-Clause'>BSD 3-clause "New or "Revised" License</a>
              </li>
              <li>
                <a href='https://opensource.org/licenses/EPL-1.0'>Eclipse Public License 1.0</a>
              </li>
              <li>
                <a href='https://www.gnu.org/licenses/licenses.html#AGPL'>GNU Affero General Public License v3.0</a>
              </li>
              <li>
                <a href='https://www.gnu.org/licenses/old-licenses/lgpl-2.0.html'>GNU General Public License v2.0</a>
              </li>
              <li>
                <a href='https://www.gnu.org/licenses/old-licenses/gpl-1.0.html'>GNU General Public License v1.0</a>
              </li>
              <li>
                <a href='https://www.gnu.org/licenses/old-licenses/lgpl-2.1.html'>GNU Lesser General Public License v2.1</a>
              </li>
              <li>
                <a href='https://www.gnu.org/licenses/licenses.html#LGPL'>GNU Lesser General Public License v3.0</a>
              </li>
              <li>
                <a href='https://opensource.org/licenses/MPL-2.0'>Mozilla Public License 2.0</a>
              </li>
              <li>
                <a href='http://unlicense.org/'>The Unlicense</a>
              </li>
            </ul>
            <br/>
            More information regarding these license can also be found here.
            <br/>
            <br/>
            If you choice to use a license not in the above list you may select "Other" and provide a URL to the landing page of the license.
          </div>
          <br/>
          <span className='faq-page-subtitle'>How is Software Submitted?</span>
          <br/>
          <p>Individual software records are directly submitted by the developer or the developing organization.  Metadata information about software can be submitted to OSTI through DOE CODE.</p>
          <p>DOE CODE offers two paths for users to provide code. Users can (1) <strong>publish</strong> code to DOE CODE, and (2) <strong>submit</strong> code to the Department of Energy for official review and release through DOE CODE. See the "How do I publish code to DOE CODE?" and "How do I submit code to the Department of Energy through DOE CODE?" for more details.</p>
          <br/>
          <span className='faq-page-subtitle'>How do I publish code to DOE CODE?</span>
          <br/>
          <p>Users may want to publish their code to DOE CODE. Publishing to DOE CODE is easy, with only a minimal set of metadata required. Publishing offers increased discoverability and the option to obtain a Digital Object Identifier (DOI) for the code, making it more easily citable and shared.  Codes in early development, along with those wanting to obtain DOIs early in the process, are the primary use case for this functionality.  (See more information about DOIs, below)</p>
          <br/>
          <span className='faq-page-subtitle'>How do I submit code to the Department of Energy through DOE CODE?</span>
          <br/>
          <p></p>
          <br/>
          <span className='faq-page-subtitle'>What is a YAML file? How do I auto populate the YAML file?</span>
          <br/>
          <p></p>
          <br/>
          <span className='faq-page-subtitle'>What are the Categories of Software?</span>
          <br/>
          <p></p>
          <br/>
          <span className='faq-page-subtitle'>What are Digital Object Identifiers (DOIs)?</span>
          <br/>
          <p></p>
          <br/>
          <span className='faq-page-subtitle'>What are the benefits of getting a DOI for code or software?</span>
          <br/>
          <p></p>
          <br/>
          <span className='faq-page-subtitle'>What if I need to have a project removed from DOE CODE?</span>
          <br/>
          <p></p>
          <br/>
          <span className='faq-page-subtitle'>How do I use the Advanced Search?</span>
          <br/>
          <p></p>
          <br/>
          <span className='faq-page-subtitle'>Are there APIs available for DOE CODE?</span>
          <br/>
          <p></p>
          <br/>
          <span className='faq-page-subtitle'>How can I find out more?</span>
          <br/>
          <p></p>
          <br/>
        </div>
        <div className="col-md-3"></div>
      </div>
    );
  }
}
