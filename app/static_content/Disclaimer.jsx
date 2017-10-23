import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';

export default class Disclaimer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12 static-content">
          <div className="body-disclaimer">
            <h3 className="lead static-content-title">Website Policies / Important Links</h3>
            <p>This page provides a comprehensive overview of the policies of this federal website, consistent with guidance established by the U.S. Office of Management and Budget (OMB) as implemented by the U.S. Department of Energy.</p>
            <table cellSpacing="6" width='100%'>
              <tbody>
                <tr>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#disclaimer">Disclaimer</a>
                  </td>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#freedom">Freedom of Information</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#acceptable">Acceptable Use Policy</a>
                  </td>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#quality">Information Quality</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#privacy">User Privacy</a>
                  </td>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#nofear">No Fear Act</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#copyright">Copyright</a>
                  </td>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#schedule">Schedule for Posting Information</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#attribution">Attribution</a>
                  </td>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#comments">Comments Policy</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#accessibility">Accessibility/Section 508</a>
                  </td>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#usajobs">USAJOBS</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#security">Website Security</a>
                  </td>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#grants">Grants</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#linkto">Linking to OSTI Website</a>
                  </td>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#regulations">Regulations</a>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#linkout">Linking to Outside Websites</a>
                  </td>
                  <td>
                    <span className='fa fa-chevron-right'></span>&nbsp;
                    <a href="#usagov">USA.gov</a>
                  </td>
                </tr>
              </tbody>
            </table>
            <br/><span className='fake-h2'>
              <a name="disclaimer"></a>Disclaimer</span>
            <p>This system is made available by an agency of the United States Government. Neither the United States Government nor any agency thereof, nor any of their employees, makes any warranty, express or implied, or assumes any legal liability or responsibility for the accuracy, completeness, or usefulness of any information, apparatus, product or process disclosed, or represents that its use would not infringe privately owned right. Reference herein to any specific commercial product, process, or service by trade name, trademark, manufacturer, or otherwise, does not necessarily constitute or imply its endorsement, recommendation, or favoring by the United States Government or any agency thereof. The views and opinions of originators expressed herein do not necessarily state or reflect those of the United States Government or any agency thereof.<br/><br/>
              Any or all uses of this system and all files on this system may be intercepted, monitored, recorded, copied, audited, inspected, transferred and disclosed to authorized site, Department of Energy, and law enforcement personnel, as well as authorized officials of other agencies, both domestic and foreign. By using this system, the user consents to such interception, monitoring, recording, copying, auditing, inspection, transfer and disclosure at the discretion of authorized site or Department of Energy personnel.
            </p>
            <br/><span className='fake-h2'>
              <a name="acceptable"></a>Acceptable Use Policy</span>
            <p>This site employs an Acceptable Use Policy (AUP) to help safeguard and enhance the use of publicly accessible information by prohibiting unauthorized excessive content requests or activities. This includes requests initiated by any network host, individual user, or automated means to query, capture, or download data from this system.</p>
            <p>Exemptions may be granted to individuals or organizations on a case by case basis.</p>
            <p>Email
              <a href="mailto:OSTIWebmaster@osti.gov">&nbsp;OSTIWebmaster@osti.gov</a>&nbsp;with any questions.</p>
            <p></p>
            <br/><span className='fake-h2'>
              <a name="privacy"></a>User Privacy</span>
            <p></p>
            <strong>
              <em>Information Collected: Web Traffic</em>
            </strong>
            <p></p>
            <p>For each page that is visited on OSTI.gov, the following technical information is automatically captured in what is called a web server log file:</p>
            <ul>
              <li>
                <p>Date and time of access</p>
              </li>
              <li>
                <p>URL address of the webpage visited</p>
              </li>
              <li>
                <p>Internet domain and IP address from which our website was accessed</p>
              </li>
              <li>
                <p>Type of browser and operating system used to access our site (if provided by the browser)</p>
              </li>
              <li>
                <p>URL address of the referring page (if provided by the browser)</p>
              </li>
              <li>
                <p>Completion or success status of the request for a web page or other on-line item</p>
              </li>
              <li>
                <p>File size of the webpage visited</p>
              </li>
            </ul>
            <p>This information does not contain personally identifiable information nor do we use this information to remember a user’s online interactions with our site. This information is used to track server load, identify operational problems, to prevent fraud and to improve the effectiveness, security and integrity of the site.</p>
            <strong>
              <em>Information Collected: Web Measurement and Tracking</em>
            </strong>
            <p>This site employs the use of two separate types of cookies, session and persistent, to collect non-personal information related to how users traverse the website. A cookie is a small file that a website transfers to your computer to allow the retrieval of specific information about your session while you are connected to a website.</p>
            <ul>
              <li>
                <p>
                  <u>Session cookies</u>&nbsp;last only as long as your browser is open; once the browser is closed the cookie disappears.</p>
              </li>
              <li>
                <p>
                  <u>Persistent cookies</u>&nbsp;will remain on your hard drive until it reaches its expiration date or is deleted by you. This type of cookie is stored on your computer so the website that placed it there can recognize and remember when you return visit and keep track of which pages on their website you visit.</p>
              </li>
            </ul>
            <p>The federal government has&nbsp;
              <a href="https://obamawhitehouse.archives.gov/sites/default/files/omb/assets/memoranda_2010/m10-22.pdf">guidelines on the use of persistent cookies</a>&nbsp;related to web measurement and tracking. The goals of the guidelines are to enable the useful functioning of federal websites while protecting individual privacy.</p>
            <p>This site does not automatically collect or store personal information in identifiable form about users. Certain non-personally identifiable information is collected and stored automatically via session cookies, including:</p>
            <ul>
              <li>
                <p>the Internet Protocol (IP) address of the domain from which you access the Internet (i.e., 123.456.789.012), whether yours individually or provided as a proxy by your Internet Service Provider (ISP);</p>
              </li>
              <li>
                <p>the domain from which you access the Internet;</p>
              </li>
              <li>
                <p>the date and time you accessed the site;</p>
              </li>
              <li>
                <p>the search queries, bibliographic citations viewed, and reports viewed; and</p>
              </li>
              <li>
                <p>the Internet address of the Website from which you linked directly to our site.</p>
              </li>
            </ul>
            <p>This information is used to compile summary statistics to help us make the site more valuable to its users. It is not shared with anyone beyond the professional support staff of this site, except when required by Law Enforcement investigation, and is used only as a source of anonymous statistical information.</p>
            <p>The Office of Management and Budget (OMB) classifies the use of this type of technology as Tier 1 usage, since we are utilizing a single session web measurement technology that does not collect any personally identifiable information (PII).</p>
            <p>This site may also use session cookies to provide salient session-related information and to enable product-specific functions not related to web measurement and tracking. In no case will cookies be used to capture information that might compromise or threaten personal privacy.</p>
            <p>Visitors to this site who have JavaScript enabled are by default anonymously tracked with persistent cookies using a web measurement technology known as Google Analytics. Google Analytics collects the following types of information from users:</p>
            <ul>
              <li>
                <p>Type of user agent (web browser) used, software manufacture, and version number</p>
              </li>
              <li>
                <p>Type of operating system
                </p>
              </li>
              <li>
                <p>Screen colors (color processing ability of the users screen)
                </p>
              </li>
              <li>
                <p>JavaScript support
                </p>
              </li>
              <li>
                <p>Flash version
                </p>
              </li>
              <li>
                <p>Screen resolution
                </p>
              </li>
              <li>
                <p>Network location and IP address
                </p>
              </li>
              <ul>
                <li>
                  <p>Can include country, city, state, region, county, or any other geographic data</p>
                </li>
                <li>
                  <p>Hostname
                  </p>
                </li>
                <li>
                  <p>Bandwidth (internet connection speed)
                  </p>
                </li>
              </ul>
              <li>
                <p>Time of visit</p>
              </li>
              <li>
                <p>Pages visited</p>
              </li>
              <li>
                <p>Time spent on each page of the website</p>
              </li>
              <li>
                <p>Referring site statistics
                </p>
              </li>
              <ul>
                <li>
                  <p>The website (URL) the user came through in order to arrive at this website (for example: clicking on a hyperlink from www.osti.gov that took the user to this website)
                  </p>
                </li>
                <li>
                  <p>Search engine query used (example: typing in a phrase into a search engine like Google, and clicking on a link from that search engine)
                  </p>
                </li>
              </ul>
            </ul>
            <p>Google Analytics data is shared with Google. For more information on Google's Privacy Policies, visit:&nbsp;
              <a target='_blank' href="http://www.google.com/privacy.html">http://www.google.com/privacy.html</a>
            </p>
            <p>The Office of Management and Budget (OMB) classifies the use of this type of technology as Tier 2 usage, since we are utilizing a multi-session web measurement technology that does not collect any personally identifiable information (PII).</p>
            <p>The information collected by Google Analytics is used to optimize our website; helping us determine top tasks, improve our user interface, and diversify our content offerings to meet the needs of our customers. No personally identifiable information is collected, so the anonymity of the end user is protected. The measurement data that is collected is retained for as long as is needed for proper analysis and optimization of the website and is accessible only to employees whose job function requires it.</p>
            <p>Users who do not wish to participate in these web measurement and tracking activities may visit&nbsp;
              <a target='_blank' href="http://www.osti.gov/home/optout">http://www.osti.gov/home/optout</a>&nbsp;for step-by-step instructions of how to opt-out. Google also provides a browser plug-in that will allow you to opt-out of all Google Analytics measurements, which you can find at&nbsp;
              <a target='_blank' href="http://tools.google.com/dlpage/gaoptout">http://tools.google.com/dlpage/gaoptout</a>. Please note that opting-out in no way affects your access to content within the site.</p>
            <p>Users may choose to provide personal information containing comments or questions or to enable use of specialized site features. This information is only used to provide service to the user or to respond to a user inquiry.</p>
            <br/><span className='fake-h2'>
              <a name="copyright"></a>Copyright</span>
            <p>OSTI is committed and empowered to provide public access to DOE-sponsored scientific and technical information. However, public access does not connote that the materials on this or other DOE websites are in the&nbsp;
              <em>public domain</em>. When accessing OSTI websites, you may encounter documents, illustrations, photographs, or other information resources that are protected by U.S. or foreign copyright laws. OSTI provides access to such content under the authority of the government’s retained license to distribute publications and data resulting from federal funding.&nbsp; Although you may legally access such works via OSTI, the copyright owners retain rights that govern the reproduction, redistribution, and re-use of copyrighted works. You are&nbsp;
              <u>solely responsible</u>&nbsp;for complying with applicable copyright law restrictions, including seeking the permission of the copyright owners when your intended activities fall outside the limited uses provided for by fair use and other legal principles.</p>
            <p>Many documents and other materials available via OSTI are marked with a copyright notice or other statement designed to inform the reader or user of applicable restrictions (or lack thereof). For example, documents labeled "U.S. Government Work" or similar are not copyrightable under U.S. law, and therefore may be freely copied and redistributed. Other works, such as journal articles or conference proceedings, clearly indicate the copyright holder, year copyrighted, and so forth. Finally, some OSTI materials may lack an explicit copyright statement; if so, you should treat these works as if they are protected by copyright. For more information on copyright law, please visit&nbsp;
              <a target='_blank' href="http://copyright.gov/.">http://copyright.gov</a>.
            </p>
            <br/><span className='fake-h2'>
              <a name="attribution"></a>Attribution</span>
            <p>In an effort to respect each author's intellectual and creative contributions, please give acknowledgement when re-using or redistributing U.S. Government works and other public domain works available via OSTI. For example, if you use images or other information that originated at OSTI, please credit us as the source. If you use a report generated at a DOE lab, please acknowledge the lab, the authors, and the DOE funding program, as appropriate.</p>
            <br/><span className='fake-h2'>
              <a name="accessibility"></a>Accessibility/Section 508</span>
            <p>The U.S. Department of Energy is committed to making its electronic and information technologies accessible to individuals with disabilities in accordance with&nbsp;
              <a target='_blank' title="Section 508 details" href="http://www.access-board.gov/the-board/laws/rehabilitation-act-of-1973#508">Section 508 of the Rehabilitation Act (29 U.S.C. 794d), as amended in 1998</a>. Send feedback or concerns related to the accessibility of this website to&nbsp;
              <a title="DOE Section 508 Coordinator" href="mailto:DOESection508Coordinator@hq.doe.gov">DOE Section 508 Coordinator</a>&nbsp;mailbox.</p>
            <p>For more information about Section 508, please visit the&nbsp;
              <a target='_blank' title="DOE Section 508 website" href="http://energy.gov/cio/department-energy-doe-and-section-508">DOE Section 508 website</a>.</p>
            <div>
              <strong>
                <em>Persons with Disabilities</em>
              </strong>
              <p>
                This Website complies with Section 508 of the Rehabilitation Act, which requires that individuals with disabilities who are members of the public or are Federal employees have access to and use of information and data comparable to that provided to the public at large, unless it is determined that such access would impose undue burden or compromise functionality of the Website.
              </p>
              <strong>
                <em>PDF or Other Image Based Documents</em>
              </strong>
              <p>
                If you use assistive technology (such as a Braille reader, a screen reader, TTY, etc.) and the format of any material on this Website interferes with your ability to access the information, please contact the designated contact individual listed on the "Contact Us" or "Feedback" page.
              </p>
            </div>
            <br/><span className='fake-h2'>
              <a name="security"></a>Website Security</span>
            <p>This Website is part of a Federal computer system used to accomplish Federal functions. The Department of Energy uses software programs to monitor this website for security purposes to ensure it remains available to all users and to protect information in the system. By accessing this Website, you are expressly consenting to these monitoring activities. Unauthorized attempts to defeat or circumvent security features; to use the system for other than intended purposes; to deny service to authorized users; to access, obtain, alter, damage; or destroy information; or otherwise to interfere with the system or its operation are prohibited. Evidence of such acts may be disclosed to law enforcement authorities and result in criminal prosecution under the Computer Fraud and Abuse Act of 1986 and the National Information Infrastructure Protection Act of 1996, codified at section 1030 of Title 18 of the United States Code, or other applicable criminal laws.</p>
            <br/><span className='fake-h2'>
              <a name="linkto"></a>Linking to OSTI Website</span>
            <p>
              Links may be made to the OSTI website from other personal and organizational websites as long as OSTI endorsement or approval is not implied. We request that you link to the OSTI site rather than downloading portions of it to another web server, so that our viewers will see our most up-to-date information.
            </p>
            <br/><span className='fake-h2'>
              <a name="linkout"></a>Linking to Outside Websites</span>
            <p>
              OSTI's websites include links to a variety of websites and other content hosted or maintained by third parties. These links are provided for convenience, and do not constitute any endorsement or recommendation of the third parties, their websites, or their view or opinions. Further, OSTI and DOE accept no liability for any linked sites or their content, and make no warranty as to the quality, safety, suitability, or reliability of linked sites. In short, you click on these links at your own risk.
            </p>
            <br/><span className='fake-h2'>
              <a name="freedom"></a>Freedom of Information</span>
            <p>Most publicly-releasable information is already available through OSTI web products. If you do not find information you are seeking through OSTI web products, it may not yet be in a digitized format or it may not be in OSTI's collection. You may request that documents be digitized by contacting the&nbsp;
              <a href="mailto:OSTIWebmaster@osti.gov">OSTIWebmaster@osti.gov</a>,&nbsp;and we will respond promptly during regular business hours. You also have the option of filing a Freedom of Information Act (FOIA) request.<br/>
              <a target='_blank' href="http://www.osti.gov/home/freedom-information-act-foia">OSTI Freedom of Information Act (FOIA)</a>
            </p>
            <br/><span className='fake-h2'>
              <a name="quality"></a>Information Quality</span>
            <p>
              As appropriate, this Website complies with&nbsp;
              <a target='_blank' href="https://obamawhitehouse.archives.gov/omb/inforeg_information_quality/">OMB Specific Information Quality</a>&nbsp;specifically the Guidance for Ensuring and Maximizing the Quality, Objectivity, Utility and Integrity of Information Dissemination by Federal Organization.
            </p>
            <br/><span className='fake-h2'>
              <a name="nofear"></a>No Fear Act</span>
            <p>As appropriate, this Website provides information in compliance with the&nbsp;
              <a target='_blank' href="http://www.energy.gov/diversity/services/protecting-civil-rights/no-fear-act">"No Fear" Act</a>. You may review&nbsp;
              <a target='_blank' href="http://www.eeoc.gov/eeoc/statistics/nofear/">Government-wide data pertaining to the "No Fear" Act</a>.</p>
            <br/><span className='fake-h2'>
              <a name="schedule"></a>Schedule for Posting Information</span>
            <p>
              Information is posted to this Website on an intermittent basis as it is made available from a wide variety of disparate sources, unless otherwise required by law.</p>
            <br/><span className='fake-h2'>
              <a name="comments"></a>Comments Policy</span>
            <p>
              On websites where comments and submission of web links are accepted and posted, we look forward to civil discourse on a variety of science and technology information topics. We will review comments prior to posting and we reserve the right to not post comments.</p>
            <p>Preference will be given to comments and links that are specific to the subject under discussion.</p>
            <p>You are fully responsible for everything that you submit and all posted comments are in the public domain. This means that your comments could be distributed widely.</p>
            <p>You may comment anonymously. Your name, website, and email are not required.
            </p>
            <p>By selecting the preview button, submit button, and/or by submitting anti-spam answers, you accept these terms and conditions.</p>
            <br/><span className='fake-h2'>
              <a name="usajobs"></a>USAJOBS</span>
            <p>
              <a target='_blank' href="http://www.usajobs.gov/">USAJOBS</a>&nbsp;is the official online, one-stop jobsite of the U.S. federal government.</p>
            <br/><span className='fake-h2'>
              <a name="grants"></a>Grants</span>
            <p>
              <a target='_blank' href="http://www.grants.gov/">Grants.gov</a>&nbsp;is an online resource to find and apply for federal government grants. It is a central storehouse for information on over 1,000 grant programs and provides access to approximately $500 billion in annual awards.</p>
            <br/><span className='fake-h2'>
              <a name="regulations"></a>Regulations</span>
            <p>
              <a target='_blank' href="http://regulations.gov/">Regulations.gov</a>&nbsp;is an online resource for all regulations (or rulemakings) issued by U.S. government agencies. On this site, the following can be found:</p>
            <ul>
              <li>all Federal regulations that are open for public comment (i.e., proposed rules) and closed for comment (i.e., final rules) as published in the&nbsp;
                <a target='_blank' href="https://www.federalregister.gov/">Federal Register</a>.</li>
              <li>many Federal agency notices published in the Federal Register.</li>
              <li>additional supporting materials, public comments, and Federal agency guidance and adjudications.<p></p>
              </li>
            </ul>
            <br/><span className='fake-h2'>
              <a name="usagov"></a>USA.gov</span>
            <p>
              <a target='_blank' href="http://www.usa.gov/">USA.gov</a>&nbsp;is an interagency initiative administered by the&nbsp;
              <a target='_blank' href="http://www.gsa.gov/portal/category/100000">U.S. General Services Administration</a>. The site provides official information and services from the U.S. government.</p><br/>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    );
  }
}
