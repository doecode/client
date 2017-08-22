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
          <div className="row">
            <div className='col-xs-12'>
              <strong>Repository Information -</strong>&nbsp;<HelpToolTip item="RepositoryInfo" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Publish Record -</strong>&nbsp;<HelpToolTip item="PublishRecord" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Save Your Progress -</strong>&nbsp;<HelpToolTip item="SaveProgress" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Repository Link -</strong>&nbsp;<HelpToolTip item="RepositoryLink" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Autopopulate from Repository -</strong>&nbsp;<HelpToolTip item="Autopopulate" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Open Source, publicly available -</strong>&nbsp;<HelpToolTip item="OpenSourcePublic" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Open Source, not publicly available -</strong>&nbsp;<HelpToolTip item="OpenSourceNotPublic" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Closed Source -</strong>&nbsp;<HelpToolTip item="ClosedSource" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Software Title -</strong>&nbsp;<HelpToolTip item="SoftwareTitle" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Description/Abstract -</strong>&nbsp;<HelpToolTip item="DescriptionAbstract" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>License(s) -</strong>&nbsp;<HelpToolTip item="License" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Developer(s) -</strong>&nbsp;<HelpToolTip item="Developers" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Digital Object Identifier (DOI) -</strong>&nbsp;<HelpToolTip item="DigitalObjectIdentifer" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Reserve DOI -</strong>&nbsp;<HelpToolTip item="ReserveDoi" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>DOI Infix -</strong>&nbsp;<HelpToolTip item="DOIInfix" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Release Date -</strong>&nbsp;<HelpToolTip item="ReleaseDate" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Short Title or Acronym -</strong>&nbsp;<HelpToolTip item="ShortTitle" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Country of Origin -</strong>&nbsp;<HelpToolTip item="CountryOfOrigin" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Keywords -</strong>&nbsp;<HelpToolTip item="Keywords" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Other Special Requirements -</strong>&nbsp;<HelpToolTip item="OtherSpecialRequirements" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Site Accession Number -</strong>&nbsp;<HelpToolTip item="SiteAccessionNumber" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className='col-xs-12'>
              <strong>Sponsoring Organization(s) -</strong>&nbsp;<HelpToolTip item="SponsoringOrg" justText/>
              <br/>
              <ul>
                <li>
                  <strong>DOE Organization -</strong>&nbsp;<HelpToolTip item="SponsorOrgDOEOrg" justText/></li>
                <li>
                  <strong>Name -</strong>&nbsp;<HelpToolTip item="SponsorOrgName" justText/></li>
                <li>
                  <strong>Primary Contract/Award Number -</strong>&nbsp;<HelpToolTip item="SponsorOrgContractNumber" justText/></li>
                <li>
                  <strong>Additional Award(s) -</strong>&nbsp;<HelpToolTip item="SponsorOrgAdditionalRewards" justText/></li>
                <li>
                  <strong>
                    B&R Classification Code(s)-</strong>&nbsp;<HelpToolTip item="SponsorOrgBRClassification" justText/></li>
                <li>
                  <strong>FWP Number -</strong>&nbsp;<HelpToolTip item="SponsorOrgFWPNum" justText/></li>
              </ul>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Research Organization(s) -</strong>&nbsp;<HelpToolTip item="ResearchOrg" justText/>
              <br/>
              <ul>
                <li>
                  <strong>DOE Organization -</strong>&nbsp;<HelpToolTip item="ResearchOrgDOEOrg" justText/></li>
                <li>
                  <strong>Name -</strong>&nbsp;<HelpToolTip item="ResearchOrgName" justText/></li>
              </ul>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Contributor(s) -</strong>&nbsp;<HelpToolTip item="Contributor" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Contributing Organization(s) -</strong>&nbsp;<HelpToolTip item="ContributorOrg" justText/>
              <br/>
              <ul>
                <li>
                  <strong>DOE Organization -</strong>&nbsp;<HelpToolTip item="ContributorDOEOrg" justText/></li>
                <li>
                  <strong>Name -</strong>&nbsp;<HelpToolTip item="ContributorName" justText/></li>
                <li>
                  <strong>Contributor Type-</strong>&nbsp;<HelpToolTip item="ContributorType" justText/></li>
              </ul>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Related Identifier(s)-</strong>&nbsp;<HelpToolTip item="RelatedIdentifier" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Identifier Type-</strong>&nbsp;<HelpToolTip item="IdentifierType" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Relation Type-</strong>&nbsp;<HelpToolTip item="RelationType" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Identifier(s)-</strong>&nbsp;<HelpToolTip item="Identifier" justText/>
            </div>
          </div>
          <br/>
          <div className="row">
            <div className="col-xs-12">
              <strong>Contact Information-</strong>&nbsp;<HelpToolTip item="ContactInformation" justText/>
            </div>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    );
  }
}
