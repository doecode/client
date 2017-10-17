import React from 'react';
import HelpToolTip from './HelpTooltip';
import {checkIsAuthenticated} from '../utils/utils';

export default class HelpPage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    checkIsAuthenticated();
  }

  render() {
    return (
      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12 static-content">
          <h2 className="static-content-title">Help</h2>
          {/*THE VALUES FOR item MAP TO THE BIG IF ELSE STATEMENT IN THE HelpTooltip MODULE*/}
          <br/>
          <br/>
          <strong className='help-page-subtitle'>How is Software Submitted?</strong>
          <br/>
          <br/>
          <p>
            Individual software records are directly submitted by the developer or the developing organization.
            <br/>
            <br/>
            DOE CODE offers two paths for users to provide code. Users can (1)&nbsp;
            <strong>submit</strong>&nbsp;code to DOE CODE, and (2)&nbsp;
            <strong>announce</strong>&nbsp;code to the Department of Energy for official review and release through DOE CODE. See the "
            <a title='What does it mean to submit code to DOE CODE?' href='faq#what-does-it-mean-to-submit'>What does it mean to submit code to DOE CODE?</a>" and "
            <a title='What does it mean to announce code to DOE CODE?' href='faq#what-does-it-mean-to-announce'>What does it mean to announce code to DOE CODE?</a>" FAQs for more details.
          </p>
          <br/>
          <strong className='help-page-subtitle'>Repository Information</strong>
          <br/>
          <br/>
          <strong>Software Availability&nbsp;-</strong>&nbsp; Please describe the availability of your software:
          <div className='help-page-software-availability'>
            <br/>
            <div className="row">
              <div className='col-xs-12'>
                <strong>Open Source, publicly available repository&nbsp;-</strong>&nbsp;<HelpToolTip item="OpenSourcePublic" justText/>
              </div>
            </div>
            <br/>
            <div className="row">
              <div className='col-xs-12'>
                <strong>Open Source, no publicly available repository&nbsp;-</strong>&nbsp;<HelpToolTip item="OpenSourceNotPublic" justText/>
              </div>
            </div>
            <br/>
            <div className="row">
              <div className='col-xs-12'>
                <strong>Closed Source&nbsp;-</strong>&nbsp;<HelpToolTip item="ClosedSource" justText/>
              </div>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Repository Link&nbsp;-</strong>&nbsp;<HelpToolTip item="RepositoryLink" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>NOTE:
              </strong>&nbsp;Currently only Git-based repositories are supported. Most repositories hosted at git.com, bitbucket.org, sourcforge.org, and GitLab support Git-based repositories. There are plans to expand this functionality in future releases to support other repository types such as SVN and CVS.
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Landing Page&nbsp;-</strong>&nbsp;<HelpToolTip item="LandingPage" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Autopopulate from Repository&nbsp;-</strong>&nbsp;<HelpToolTip item="Autopopulate" justText/>
            </div>
          </div>
          <br/>
          <hr/>
          <br/>
          <strong className='help-page-subtitle'>Product Description</strong>
          <br/>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Software Title&nbsp;-</strong>&nbsp;<HelpToolTip item="SoftwareTitle" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Description/Abstract&nbsp;-</strong>&nbsp;<HelpToolTip item="DescriptionAbstract" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>License(s)&nbsp;-</strong>&nbsp;<HelpToolTip item="License" justText/>
            </div>
          </div>
          <br/>
          <hr/>
          <br/>
          <strong className='help-page-subtitle'>Developers</strong>
          <br/>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Developer(s)&nbsp;-</strong>&nbsp;<HelpToolTip item="Developers" justText/>
            </div>
          </div>
          <br/>
          <hr/>
          <br/>
          <strong className='help-page-subtitle'>DOI and Release Date</strong>
          <br/>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Digital Object Identifier (DOI)&nbsp;-</strong>&nbsp;<HelpToolTip item="DigitalObjectIdentifer" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Reserve DOI&nbsp;-</strong>&nbsp;<HelpToolTip item="ReserveDoi" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>DOI Infix&nbsp;-</strong>&nbsp;<HelpToolTip item="DOIInfix" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Release Date&nbsp;-</strong>&nbsp;<HelpToolTip item="ReleaseDate" justText/>
            </div>
          </div>
          <br/>
          <hr/>
          <br/>
          <strong className='help-page-subtitle'>Supplemental Product Information</strong>
          <br/>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Short Title or Acronym&nbsp;-</strong>&nbsp;<HelpToolTip item="ShortTitle" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Country of Origin&nbsp;-</strong>&nbsp;<HelpToolTip item="CountryOfOrigin" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Keywords&nbsp;-</strong>&nbsp;<HelpToolTip item="Keywords" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Other Special Requirements&nbsp;-</strong>&nbsp;<HelpToolTip item="OtherSpecialRequirements" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Site Accession Number&nbsp;-</strong>&nbsp;<HelpToolTip item="SiteAccessionNumber" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Upload Source Code&nbsp;-</strong>&nbsp;<HelpToolTip item="FileUpload" justText/>
            </div>
          </div>
          <br/>
          <hr/>
          <br/>
          <strong className='help-page-subtitle'>Organizations</strong>
          <br/>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Sponsoring Organization(s)&nbsp;-</strong>&nbsp;<HelpToolTip item="SponsoringOrg" justText/>
              <br/>
              <br/>
              <ul>
                <li>
                  <strong>DOE Organization&nbsp;-</strong>&nbsp;<HelpToolTip item="SponsorOrgDOEOrg" justText/></li>
                <br/>
                <li>
                  <strong>Name&nbsp;-</strong>&nbsp;<HelpToolTip item="SponsorOrgName" justText/></li>
                <br/>
                <li>
                  <strong>Primary Contract/Award Number&nbsp;-</strong>&nbsp;<HelpToolTip item="SponsorOrgContractNumber" justText/></li>
                <br/>
                <li>
                  <strong>Additional Award(s)&nbsp;-</strong>&nbsp;<HelpToolTip item="SponsorOrgAdditionalRewards" justText/></li>
                <br/>
                <li>
                  <strong>
                    B&amp;R Code(s)&nbsp;-</strong>&nbsp;<HelpToolTip item="SponsorOrgBRClassification" justText/></li>
                <br/>
                <li>
                  <strong>FWP Numbers&nbsp;-</strong>&nbsp;<HelpToolTip item="SponsorOrgFWPNum" justText/></li>
              </ul>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Research Organization(s)&nbsp;-</strong>&nbsp;<HelpToolTip item="ResearchOrg" justText/>
              <br/>
              <br/>
              <ul>
                <li>
                  <strong>DOE Organization&nbsp;-</strong>&nbsp;<HelpToolTip item="ResearchOrgDOEOrg" justText/></li>
                <br/>
                <li>
                  <strong>Name&nbsp;-</strong>&nbsp;<HelpToolTip item="ResearchOrgName" justText/></li>
              </ul>
            </div>
          </div>
          <br/>
          <hr/>
          <br/>
          <strong className='help-page-subtitle'>Contributors and Contributing Organizations</strong>
          <br/>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Contributor(s)&nbsp;-</strong>&nbsp;<HelpToolTip item="Contributor" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <ul>
                <li>
                  <strong>Contributor Type&nbsp;-</strong>&nbsp;<HelpToolTip item="ContributorType" justText/></li>
              </ul>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Contributing Organization(s)&nbsp;-</strong>&nbsp;<HelpToolTip item="ContributorOrg" justText/>
              <br/>
              <br/>
              <ul>
                <li>
                  <strong>Contributor Type&nbsp;-</strong>&nbsp;<HelpToolTip item="ContributorType" justText/></li>
              </ul>
            </div>
          </div>
          <br/>
          <hr/>
          <br/>
          <strong className='help-page-subtitle'>Identifiers</strong>
          <br/>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <HelpToolTip item="RelatedIdentifier" justText/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <ul>
                <li>
                  <strong>Identifier Type&nbsp;-</strong>&nbsp;<HelpToolTip item="IdentifierType" justText/>
                </li>
                <li>
                  <strong>Relation Type&nbsp;-</strong>&nbsp;<HelpToolTip item="RelationType" justText/>
                </li>
                <li>
                  <strong>Identifier(s)&nbsp;-</strong>&nbsp;<HelpToolTip item="Identifier" justText/>
                </li>
              </ul>
            </div>
          </div>
          <br/>
          <hr/>
          <br/>
          <strong className='help-page-subtitle'>Contact Information</strong>
          <br/>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Contact Information&nbsp;-</strong>&nbsp;<HelpToolTip item="ContactInformation" justText/>
            </div>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    );
  }
}
