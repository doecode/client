import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';

export default class Policy extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row not-so-wide-row">
        <div className="col-lg-3 col-md-1"></div>
        <div className="col-lg-6 col-md-10 col-xs-12 static-content">
          <h2 className="static-content-title">Software Policy</h2>
          <br/>
          <p>
            DOE CODE is a software service platform and search tool that allows for scientific software to be provided to the U.S. Department of Energy (DOE). DOE CODE provides functionality for collaboration, archiving, and discovery of scientific software. DOE CODE replaces the Energy Science and Technology Software Center (ESTSC).</p>
          <p>
            The DOE Office of Scientific and Technical Information (OSTI) is charged with fulfilling the Department’s responsibilities to collect, preserve, and disseminate scientific and technical information, including software, emanating from DOE R&D activities. Throughout this policy, the terms "software" and "code" are used interchangeably.</p>
          <p>
            DOE CODE offers two paths for users to provide code. Users can (1) Submit code to DOE CODE, and (2) Announce code to the Department of Energy for official review and release through DOE CODE.
          </p>
          <br/>
          <ul>
            <li>
              <a href='#submit-code-to-doe-code'>Submit Code to DOE CODE</a>
            </li>
            <li>
              <a href='#required-metadata-to-submit-to-doe-code'>Required Metadata to submit to DOE CODE</a>
            </li>
            <li>
              <a href='#announce-code-to-department-of-energy'>Announce Code to the Department of Energy through DOE CODE</a>
            </li>
            <li>
              <a href='#required-metadata-to-announce-to-elink'>Required Metadata to Announce to the Department of Energy through DOE CODE</a>
            </li>
            <li>
              <a href='#software-categories'>Software Categories</a>
            </li>
          </ul>
          <br/>
          <p>
            <a name='submit-code-to-doe-code'></a>
            <strong>Submit Code to DOE CODE</strong>
            <br/>
            Users may want to submit their code to DOE CODE. Submitting to DOE CODE is easy, with only a minimal set of metadata required. Submitting offers increased discoverability and the option to obtain a Digital Object Identifier (DOI) for the code, making it more easily citable and shared. Codes in early development, along with those wanting to obtain DOIs early in the process, are the primary use case for this functionality.
            <br/>
            <br/>
            <a name='required-metadata-to-submit-to-doe-code'></a>
            <strong>Required Metadata to Submit to DOE CODE:</strong>
            <ul>
              <li>Software Availability</li>
              <li>Repository Link</li>
              <li>Software Title</li>
              <li>Description/Abstract</li>
              <li>Licenses</li>
              <li>Developers</li>
            </ul>
          </p>
          <br/>
          <p>
            <a name='announce-code-to-department-of-energy'></a>
            <strong>Announce Code to the Department of Energy through DOE CODE</strong>
            <br/>
            Users may need to announce their code to the Department of Energy to ensure announcement and dissemination in accordance with DOE statutory responsibilities. Codes in later stages of development are the primary use case for this functionality. For announcement to the Department of Energy, there are basic requirements for metadata fields; however, other optional/non-mandatory data fields should be included during announcement when possible.
            <br/>
            <br/>
            DOE national laboratories and other DOE facilities/contractors who have developed and/or modified software during work supported by DOE or during work carried out for others at DOE facilities are required to announce a record of the software to the Department of Energy, if the software meets the following criteria:
            <br/>
            <ul>
              <li>the software meets the definition of&nbsp;
                <a title='STI' target='_blank' href='https://www.osti.gov/stip/stidefined'>STI</a>
              </li>
              <li>the software is known or expected to be useful inside or outside the DOE community, or is not specific to the originating site; and</li>
              <li>a stable, usable, documented version of the software exists (i.e., the software is not under initial development);</li>
              <li>the software has undergone all appropriate reviews for sensitivity and export control.</li>
            </ul>
          </p>
          <p>
            For additional information about DOE scientific and technical software, refer to the&nbsp;
            <a title='Best Practices' target='_blank' href='https://www.osti.gov/includes/estsc/software_best_prac.html'>Software Best Practices document</a>.
            <br/>
            <br/>
            Software that meets the following criteria need not be announced to the Department of Energy:
            <ul>
              <li>operational systems software that is site-specific, unique to a particular hardware, or necessary to ensure the fundamental operability of automated data processing equipment, whether supplied by the manufacturer of the system hardware or others;</li>
              <li>computer software programs developed and/or modified during work carried out for others at DOE facilities that are specifically excluded in the agreement under which the non-DOE funded work was performed;</li>
              <li>software generated under the auspices of the Energy Information Administration; and</li>
              <li>specific software used by power administrations for the operation, control, planning, and modeling of electric power transmission systems and the interconnected utilities; however, modifications/enhancements to portions of this software that are not an integral part of the whole and have potential application outside the power administrations should be announced.</li>
            </ul>
          </p>
          <p>
            <a name='required-metadata-to-announce-to-elink'></a>
            <strong>Required Metadata to Announce to the Department of Energy through DOE CODE:</strong>
            <ul>
              <li>Software Availability</li>
              <li>Repository Link</li>
              <li>Software Title</li>
              <li>Description/Abstract</li>
              <li>Licenses</li>
              <li>Developers</li>
              <li>Sponsoring Organization Name</li>
              <li>Primary Award Number</li>
              <li>Research Organization Name</li>
            </ul>
          </p>
          <br/>
          <p>
            <a name='software-categories'></a>
            <strong>Software Categories</strong>
            <br/>
            Different categories of software have different distribution requirements, limitations, and appropriate distribution channels, which are defined in the&nbsp;
            <a title='Software Categories' target='_blank' href='https://www.osti.gov/stip/softwarecategories'>Software Categories table</a>. The table is not intended to provide an exhaustive list. Contact DOE CODE at (865) 576-2606 or&nbsp;
            <a title='Email doecode@osti.gov' href='mailto:doecode@osti.gov'>doecode@osti.gov</a>&nbsp;with questions.
            <br/>
          </p>
        </div>
        <div className="col-lg-3 col-md-1"></div>
      </div>
    );
  }
}
