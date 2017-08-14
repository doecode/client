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
            <div className="col-md-3"></div>
            <div className="col-md-6 col-xs-12 static-content">
                <h2 className="static-content-title">Software Policy</h2>
                <br/>
                <p>
                    DOE CODE is a software submission and search tool that allows for scientific software to be provided to the U.S. Department of Energy (DOE).
                    DOE CODE provides functionality for collaboration, archiving, and discovery of scientific software. DOE CODE replaces the Energy Science and
                    Technology Software Center (ESTSC).  
                </p>
                <p>
                    The DOE Office of Scientific and Technical Information (OSTI) is charged with fulfilling the Department’s responsibilities to collect, preserve,
                    and disseminate scientific and technical information, including software, emanating from DOE R&D activities. Throughout this policy, the terms 
                    "software" and "code" are used interchangeably. 
                </p>
                <p>
                    DOE CODE offers two paths for users to provide code. Users can (1) publish code to DOE CODE, and (2) submit code to the Department of Energy 
                    for official review and release through DOE CODE. 
                </p>
                <br/>
                <p>
                    <strong>Publish Code to DOE Code</strong>
                    <br/>
                    Users may want to publish their code to DOE CODE. Publishing to DOE CODE is easy, with only a minimal set of metadata required. Publishing offers 
                    increased discoverability  and the option to obtain a Digital Object Identifier (DOI) for the code, making it more easily citable and shared. 
                    Codes in early development,  along with those wanting to obtain DOIs early in the process, are the primary use case for this functionality.
                    <br/>
                    <br/>
                    Required Metadata to Publish to DOE Code:
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
                    <strong>Submit Code to the Department of Energy through DOE CODE</strong>
                    <br/>
                    Users may need to submit their code to the Department of Energy to ensure proper handling, announcement, and dissemination in accordance with DOE 
                    statutory responsibilities. Codes in later stages of development are the primary use case for this functionality. For submission to the Department
                    of Energy, there are basic requirements for metadata fields; however, other optional/non-mandatory data fields should be included during submission
                    when possible.   
                    <br/>
                    <br/>
                    DOE national laboratories and other DOE facilities/contractors who have developed and/or modified software during work supported by DOE or during 
                    work carried out for others at DOE facilities are required to submit a record of the software to the Department of Energy, if the software meets 
                    the following criteria:
                    <br/>
                <ul>
                    <li>the software meets the definition of <a target='_blank' href='https://www.osti.gov/stip/stidefined'>STI</a></li>
                    <li>the software is known or expected to be useful inside or outside the DOE community, or is not specific to the originating site; and</li>
                    <li>a stable, usable, documented version of the software exists (i.e., the software is not under initial development);</li>
                    <li>the software has undergone all appropriate reviews for sensitivity and export control.</li>
                </ul>
                </p>
                <br/>
                <p>
                    For additional information about DOE scientific and technical software, refer to the <a target='_blank' href='https://www.osti.gov/includes/estsc/software_best_prac.html'>Software Best Practices document</a>.
                    <br/>
                    Software that meets the following criteria need not be submitted to the Department of Energy:
                <ul>
                    <li>operational systems software that is site-specific, unique to a particular hardware, or necessary to ensure the fundamental operability 
                        of automated data processing equipment, whether supplied by the manufacturer of the system hardware or others;</li>
                    <li>computer software programs developed and/or modified during work carried out for others at DOE facilities that are specifically excluded 
                        in the agreement under which the non-DOE funded work was performed;</li>
                    <li>software generated under the auspices of the Energy Information Administration; and</li>
                    <li>specific software used by power administrations for the operation, control, planning, and modeling of electric power transmission 
                        systems and the interconnected utilities; however, modifications/enhancements to portions of this software that are not an integral 
                        part of the whole and have potential application outside the power administrations should be submitted.</li>
                </ul>
                </p>
                <br/>
                <p>
                    <strong>Required Metadata to Submit to the Department of Energy through DOE CODE</strong>
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
                    <strong>Software Categories</strong>
                    <br/>
                    Different categories of software have different distribution requirements, limitations, and appropriate distribution channels, which are defined 
                    in the <a target='_blank' href='https://www.osti.gov/stip/softwarecategories'>Software Categories table</a>.  The table is not intended to provide an exhaustive list. 
                    Contact DOE CODE at (865) 576-2606 or <a href='mailto:doecode@osti.gov'>doecode@osti.gov</a> with questions.
                    <br/>
                </p>
            </div>
            <div className="col-md-3"></div>
        </div>
        );
    }
}
