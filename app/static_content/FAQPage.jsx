import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button, COllapse} from 'react-bootstrap';
import SimpleCollapsible from '../fragments/SimpleCollapsible';

export default class FAQ extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    /*If you want something added to this page, just plop it right in to this array in the order you want*/
    const fa_items = [
      {
        text: <span className='faq-page-subtitle'>What is DOE CODE?</span>,
        content: <p>DOE CODE is a software submission and search tool that allows for scientific software to be provided to the U.S. Department of Energy (DOE). DOE CODE provides functionality for collaboration, archiving, and discovery of scientific software. DOE CODE replaces the Energy Science and Technology Software Center (ESTSC). DOE CODE is an open source project and is available on GitHub. Throughout these FAQs, the terms "software" and "code" are used interchangeably.
          </p>
      }, {
        text: <span className='faq-page-subtitle'>What does it mean for DOE CODE to be released in Alpha?</span>,
        content: <p>In Alpha, DOE CODE supports submission of unlimited distribution software projects, code repository services, and search and discovery of published software projects. As development of DOE CODE continues in toward Beta and Production releases, additional features and functionality will be included. Future requirements will include provenance and version tracking, social coding features, and additional profile features.</p>

      }, {
        text: <span className='faq-page-subtitle'>How is the DOE CODE software submission and search tool different than&nbsp;
          <a target="_blank" href='https://github.com/doecode'>DOE CODE GitHub</a>
        </span>,
        content: <p>Per the charge for Office of Scientific and Technical Information (OSTI) to fulfill the Department’s responsibilities to collect, preserve, and disseminate scientific and technical information, emanating from DOE R&D activities, the DOE CODE provides for the submission and search of software here. DOE CODE is an open source project and is available on GitHub.</p>

      }, {
        text: <span className='faq-page-subtitle'>Do I need to have cookies enabled to use DOE CODE?</span>,
        content: <p>Yes, you must select Accept All Cookies. Please see our&nbsp;
            <a target='_blank' href='https://www.osti.gov/elink/disclaimers.jsp'>Website Policies/Important Links</a>&nbsp; for further information.</p>
      }, {
        text: <span className='faq-page-subtitle'>What does DOE CODE contain?</span>,
        content: <p>DOE CODE contains records for DOE-funded software and links to the software or code repository. In addition to the code, the repositories may include manuals, examples, test data, etc.
          </p>
      }, {
        text: <span className='faq-page-subtitle'>Does DOE CODE provide repository services?</span>,
        content: <p>DOE CODE provides repository hosting services for the DOE community via GitLab at&nbsp;
            <a href='https://gitlab.osti.gov/'>https://gitlab.osti.gov/</a>. If you are interested in making use of this service please email&nbsp;
            <a href='mailto:doecoderepositories@osti.gov'>doecoderepositories@osti.gov</a>&nbsp;to request more information.</p>
      }, {
        text: <span className='faq-page-subtitle'>What are the types of Software Availability?</span>,
        content: <div>
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
          </div>
      }, {
        text: <span className='faq-page-subtitle'>Are there restrictions on the use of the material in DOE CODE?</span>,
        content: <div>
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
              More information regarding these license can also be found&nbsp;
              <a href='https://opensource.org/licenses/alphabetical'>here</a>.
              <br/>
              <br/>
              If you choice to use a license not in the above list you may select "Other" and provide a URL to the landing page of the license.
            </div>
          </div>
      }, {
        text: <span className='faq-page-subtitle'>How is Software Submitted?</span>,
        content: <div>
            <p>Individual software records are directly submitted by the developer or the developing organization. Metadata information about software can be submitted to OSTI through DOE CODE.</p>
            <p>DOE CODE offers two paths for users to provide code. Users can (1)&nbsp;
              <strong>publish</strong>&nbsp;code to DOE CODE, and (2)&nbsp;
              <strong>submit</strong>&nbsp;code to the Department of Energy for official review and release through DOE CODE. See the "How do I publish code to DOE CODE?" and "How do I submit code to the Department of Energy through DOE CODE?" for more details.</p>
          </div>
      }, {
        text: <span className='faq-page-subtitle'>How do I publish code to DOE CODE?</span>,
        content: <div>
            <p>Users may want to publish their code to DOE CODE. Publishing to DOE CODE is easy, with only a minimal set of metadata required. Publishing offers increased discoverability and the option to obtain a Digital Object Identifier (DOI) for the code, making it more easily citable and shared. Codes in early development, along with those wanting to obtain DOIs early in the process, are the primary use case for this functionality. (See more information about DOIs, below)</p>
            <div>
              Required Metadata to Publish to DOE CODE
              <ul>
                <li>Software Availability</li>
                <li>Repository Link* or Landing Page</li>
                <li>Software Title</li>
                <li>Description/Abstract</li>
                <li>License(s)</li>
                <li>Developers</li>
              </ul>
            </div>
            <p>
              *Currently only Git-based repositories are supported. Examples would be repositories hosted at git.com, bitbucket.org, sourcforge.org, and GitLab. There are plans to expand this functionality in future releases to support other repository types such as SVN and CVS.
            </p>
          </div>
      }, {
        text: <span className='faq-page-subtitle'>How do I submit code to the Department of Energy through DOE CODE?</span>,
        content: <div>
            <p>Users may need to submit their code to the Department of Energy to ensure proper handling, announcement, and dissemination in accordance with DOE statutory responsibilities. Codes in later stages of development are the primary use case for this functionality. For submission to the Department of Energy, there are basic requirements for metadata fields; however, other optional/non-mandatory data fields should be included during submission when possible.
            </p>
            <div>
              DOE national laboratories and other DOE facilities/contractors who have developed and/or modified software during work supported by DOE or during work carried out for others at DOE facilities are required to submit a record of the software to the Department of Energy, if the software meets the following criteria:
              <ul>
                <li>the software meets the definition of&nbsp;
                  <a href='https://www.osti.gov/stip/stidefined'>STI</a>
                </li>
                <li>the software is known or expected to be useful inside or outside the DOE community, or is not specific to the originating site; and</li>
                <li>a stable, usable, documented version of the software exists (i.e., the software is not under initial development);</li>
                <li>the software has undergone all appropriate reviews for sensitivity and export control.</li>
              </ul>
            </div>
            <br/>
            <p>
              For additional information about DOE scientific and technical software, refer to the&nbsp;<a href='https://www.osti.gov/includes/estsc/software_best_prac.html'>Software Best Practices document</a>.
            </p>
            <div>
              Software that meets the following criteria need not be submitted to the Department of Energy:
              <ul>
                <li>operational systems software that is site-specific, unique to a particular hardware, or necessary to ensure the fundamental operability of automated data processing equipment, whether supplied by the manufacturer of the system hardware or others;</li>
                <li>computer software programs developed and/or modified during work carried out for others at DOE facilities that are specifically excluded in the agreement under which the non-DOE funded work was performed;</li>
                <li>software generated under the auspices of the Energy Information Administration; and</li>
                <li>specific software used by power administrations for the operation, control, planning, and modeling of electric power transmission systems and the interconnected utilities; however, modifications/enhancements to portions of this software that are not an integral part of the whole and have potential application outside the power administrations should be submitted.</li>
              </ul>
            </div>
            <div>
              Required Metadata to Submit to the Department of Energy through DOE CODE
              <ul>
                <li>Software Availability</li>
                <li>Repository Link* or Landing Page</li>
                <li>Software Title</li>
                <li>Description/Abstract</li>
                <li>Licenses</li>
                <li>Developers</li>
                <li>Sponsoring Organization Name</li>
                <li>Primary Award Number</li>
                <li>Research Organization Name</li>
              </ul>
            </div>
            <p>
              *Currently only Git-based repositories are supported. Most repositories hosted at git.com, bitbucket.org, sourcforge.org, and GitLab support Git-based repositories. When submitting a repository please make sure you are using the direct URL to the actual repository. As an example, the direct repository URL for DOE CODE is https://www.github.com/doecode/doecode whereas the project landing page is&nbsp;
              <a target='_blank' href='https://www.github.com/doecode'>https://www.github.com/doecode</a>. There are plans to expand this functionality in future releases to support other repository types such as SVN and CVS.
            </p>
            <p>
              NOTE: If you are submitting Open Source, No Publicly Available Repository or Close Source code through DOE CODE you will also be required to upload an archive file containing of your source code. This will be used for archiving purposes. Supported file types include: .zip, .tar, .tar.gz, .tar.gz2, and .war.
            </p>
          </div>
      }, {
        text: <span className='faq-page-subtitle'>What is a YAML file? How do I auto populate the YAML file?</span>,
        content: <p>
            <a target='_blank' href='http://www.yaml.org/start.html'>YAML</a>&nbsp;is a human friendly data serialization standard for all programming languages. DOE CODE provides functionality to allow users to auto-populate their bibliographic data in DOE CODE by placing a specifically formatted YAML file their repository’s root main directory. The file must be named "metadata.yml" or "doecode.yml" and the file must be formatted correctly. For detailed information and an example file please see:&nbsp;<a href='https://github.com/doecode/doecode/tree/master/metadata-schema'>https://github.com/doecode/doecode/tree/master/metadata-schema</a>
          </p>
      }, {
        text: <span className='faq-page-subtitle'>What are the Categories of Software?</span>,
        content: <p>Different categories of software have different distribution requirements, limitations, and appropriate distribution channels, which are defined in the&nbsp;
            <a href='https://www.osti.gov/stip/softwarecategories'>Software Categories</a>&nbsp;table. The table is not intended to provide an exhaustive list.
          </p>
      }, {
        text: <span className='faq-page-subtitle'>What are Digital Object Identifiers (DOIs)?</span>,
        content: <p>A DOI is a persistent identifier assigned to facilitate accurate linkage between a document or published article and the specific datasets underlying it. OSTI is a member of and registering agency for DataCite and has the authority to assign Digital Object Identifiers to software and code that are submitted by DOE and its contractors or grantees. The assigning and registration of a DOI for software is a free service provided by OSTI to enhance DOE's management of this important resource.
          </p>
      }, {
        text: <span className='faq-page-subtitle'>What are the benefits of getting a DOI for code or software?</span>,
        content: <div>
            <ul>
              <li>
                Announcing and registering code or software with DOIs enables researchers, especially future researchers, to more easily discover the code or software, access it, and reuse it for verification of the original experiment or to produce new results with the latest methods.</li>
              <li>DOIs facilitate accurate linkage between a document or published article and the specific code or software underlying it.</li>
              <li>DOIs make code easy to cite in a standardized way (DOIs have become recognizable as pointers to important information around the globe), encouraging authors to include this step in their writing/publishing activities.</li>
              <li>Enabling your code or software to be easily citable means that code developers, contributors, and others involved in the development, but not necessarily in the authoring of a publication, can receive proper attribution.
              </li>
              <li>DOIs are designed to be more stable and persistent links than normal URLs. Registering the DOI with an international organization such as DataCite provides global resolving and the prospect of steadily increasing visibility of your research.</li>
            </ul>
          </div>
      }, {
        text: <span className='faq-page-subtitle'>What if I need to have a project removed from DOE CODE?</span>,
        content: <p>To have a project removed from DOE CODE please contact&nbsp;
            <a href='mailto:doecode@osti.gov'>doecode@osti.gov</a>.</p>
      }, {
        text: <span className='faq-page-subtitle'>How do I use the Advanced Search?</span>,
        content: <div>
            The advanced search will allow you to perform more complex searches, offering you a number of fields, such as Title, Developer(s), or Release date to help you refine your search results.
            <br/>
            <br/>
            <div className='faq-page-left-padded'>
              <strong>All Fields</strong>
              <br/>
              Searches all bibliographic data.
              <br/>
              <br/>
              <strong>Software Title</strong>
              <br/>
              Searches only software titles.
              <br/>
              <br/>
              <strong>
                Developers</strong>
              <br/>
              Searches all developer names, including ORCID if available.
              <br/>
              <br/>
              <strong>
                Identifier Numbers</strong>
              <br/>
              Searches for all identifying numbers, including DOE contract number, report number, non-DOE contract/award numbers, or other identifying numbers such as DOI.
              <br/>
              <br/>
              <strong>
                Release Date</strong>
              <br/>
              Searches for articles that were released within a specified timeframe. Select the starting date or ending date from the drop down calendar OR type MM/DD/YYYY, e.g. 01/01/2014.
              <br/>
              <br/>
              <strong>
                Code Availability</strong>
              <br/>
              Searches the fields for Open Source, Publicly Available; Open Source, Not Publicly Available; and Closed Source.
              <br/>
              <br/>
              <strong>
                Research Organization</strong>
              <br/>
              Searches by the name(s) of the organization(s) that was funded and developed the software.
              <br/>
              <br/>
              <strong>
                Sponsoring Organization</strong>
              <br/>
              Searches the name(s) of the DOE program office(s) or other organizations that provided the funding for the development contributing to the software.
              <br/>
              <br/>
              <strong>Sort</strong><br/>
              You can choose for your results to be sorted by Relevance, Publication Date (newest to oldest) or Publication Date (oldest to newest).
            </div>
          </div>
      }, {
        text: <span className='faq-page-subtitle'>Are there APIs available for DOE CODE?</span>,
        content: <p></p>
      }, {
        text: <span className='faq-page-subtitle'>How can I find out more?</span>,
        content: <p>
            For additional assitance,&nbsp;
            <a href='mailto:doecode@osti.gov'>Contact Us</a>
          </p>
      }
    ];
    return (
      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12 static-content">
          <h2 className="static-content-title">FAQ's</h2>
          <br/>
          <br/>
          <p>Click or tap on the questions below to see answers to frequently asked questions.</p>
          <br/>
          <div>
            {fa_items.map((row, index) => <div>
              <SimpleCollapsible toggleArrow button_text={row.text} contents={row.content}/>
            </div>)}
          </div>

        </div>
        <div className="col-md-3"></div>
      </div>
    );
  }
}
