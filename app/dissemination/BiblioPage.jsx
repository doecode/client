import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, appendQueryString, getQueryParam, addBiblio} from '../utils/utils';
import DevAndContribLinks from './DevAndContribLinks';
import Metadata from '../stores/Metadata';
import BreadcrumbTrail from '../fragments/BreadcrumbTrail';
import BiblioSidebar from './BiblioSidebar';
import staticContstants from '../staticJson/constantLists';
import ResearchOrgItem from './ResearchOrgItem';
import ContributingOrgItem from './ContributingOrgItem';
import SponsoringOrgItem from './SponsoringOrgItem';
import LicensesItem from './LicensesItem';
import SearchRowDescription from '../fragments/SearchRowDescription';
import MLA from '../citation/MLA';
import APA from '../citation/APA';
import Chicago from '../citation/Chicago';
import Bibtex from '../citation/Bibtex';

const metadata = new Metadata();

export default class BiblioPage extends React.Component {
  constructor(props) {
    super(props);
    this.parseReceiveResponse = this.parseReceiveResponse.bind(this);
    this.parseErrorResponse = this.parseErrorResponse.bind(this);
    this.generateContent = this.generateContent.bind(this);
    this.generateSummaryContent = this.generateSummaryContent.bind(this);
    this.state = {
      data: undefined
    }

  }

  componentDidMount() {
    //Grabs number at end of string
    var patt = new RegExp(/(\d+)$/);
    const codeID = patt.exec(window.location.href)[0];
    if (codeID) {
      doAjax('GET', "/doecode/api/search/" + codeID, this.parseReceiveResponse, undefined, this.parseErrorResponse);
    }
  }

  parseReceiveResponse(data) {
    this.setState({"data": data.metadata});
  }

  parseErrorResponse() {
    console.log("Error?");
  }

  generateContent(obj, index) {
    let textContent = null;
    let show_val = false;
    var header = obj.header;

    /*These headers must match the biblioFieldsList header values in the constantLists json*/
    if (header == "Developers") {
      let devs = metadata.getValue("developers");
      var valid_devs = false;
      devs.forEach(function(item) {
        if (item.first_name != "None" && item.last_name != 'None') {
          valid_devs = true;
          return false;
        }
      });
      textContent = <span><DevAndContribLinks groupType="developer" items={devs}/></span>;
      show_val = valid_devs;

    } else if (header == "Contributors") {
      let contributors = metadata.getValue("contributors");
      //This is just here to make sure that there are valid names
      var valid_contributors = false;
      contributors.forEach(function(item) {
        if (item.first_name != 'None' && item.last_name != 'None') {
          valid_contributors = true;
          return false;
        }
      });

      textContent = <div className='biblio-authors'><DevAndContribLinks groupType="contributor" items={contributors}/></div>;
      show_val = valid_contributors;

    } else if (header == "Licenses") {
      const licenses = metadata.getValue("licenses");
      textContent = <span><LicensesItem items={licenses} proprietary_url={metadata.getValue("proprietary_url")}/></span>;
      show_val = licenses.length > 0;

    } else if (header == "Release Date") {
      textContent = <span>
        {metadata.getValue("release_date")._i}
      </span>;
      show_val = metadata.getValue("release_date") != '';

    } else if (header == 'Code Availability') {
      staticContstants.availabilities.forEach(function(item) {
        if (item.value === metadata.getValue("accessibility")) {
          textContent = <span>{item.label}</span>;
          show_val = true;
          return false;
        }
      });
    } else if (header == 'Research Organizations') {
      var research_orgs = metadata.getValue("research_organizations");
      show_val = research_orgs.length > 0;
      textContent = <ResearchOrgItem items={research_orgs}/>;

    } else if (header == 'Sponsoring Organizations') {
      var sponsoring_orgs = metadata.getValue("sponsoring_organizations");
      show_val = sponsoring_orgs.length > 0;
      textContent = <SponsoringOrgItem items={sponsoring_orgs}/>

    } else if (header == 'Contributing Organizations') {
      var contributing_orgs = metadata.getValue("contributing_organizations");
      show_val = contributing_orgs.length > 0;
      textContent = <ContributingOrgItem items={contributing_orgs}/>

    } else {
      textContent = <span>{metadata.getValue(obj.field)}</span>;
      show_val = metadata.getValue(obj.field);
    }

    if (show_val) {
      return (
        <div className='biblio-row' key={index}>
          <div className='col-xs-12'>
            <dl className='row'>
              <dt className='col-md-3 col-xs-12 biblio-field-header'>{header}:</dt>
              <dd className='col-md-9 col-xs-12 biblio-field-value'>{textContent}</dd>
            </dl>
          </div>
        </div>
      );
    } else {
      return (null);
    }
  }

  generateSummaryContent(obj) {
    var content = null;
    switch (obj.header) {
      case 'Developers':
      case 'Release Date':
      case 'Sponsoring Organizations':
      case 'Code ID':
        content = this.generateContent(obj);
        break;
    }
    return content;
  }

  render() {
    metadata.deserializeData(this.state.data);
    addBiblio(metadata.fieldMap);
    const summaryContent = staticContstants.biblioFieldsList.map(this.generateSummaryContent);
    const fieldsContent = staticContstants.biblioFieldsList.map(this.generateContent);
    console.log(JSON.stringify(metadata.fieldMap));
    const breadcrumbList = [
      {
        key: 'brdcrmb1',
        value: <span>
            <a href='/doecode'>DOE CODE</a>&nbsp;/&nbsp;</span>
      }, {
        key: 'brdcrmb2',
        value: <span>
            <a href='/doecode/results'>Search Results</a>&nbsp;/&nbsp;</span>
      }, {
        key: 'brdcrmb3',
        value: <span>{metadata.getValue("software_title")}</span>
      }
    ];
    const abstract = metadata.getValue("description");
    return (
      <div className="row not-so-wide-row">
        <div className="col-xs-12">
          {/*Breadcrumb trail*/}
          <div className='container'>
            <div className="row">
              <div className='no-col-padding-left col-xs-12'>
                <BreadcrumbTrail list={breadcrumbList}/>
              </div>
            </div>
          </div>
          <br/>
          <div className='container'>
            {/*Title*/}
            <div className="row">
              <div className="col-xs-12 no-col-padding-left no-col-padding-right biblio-title-container">
                <div className="biblio-title">
                  {metadata.getValue("software_title")}
                </div>
                <br/>
              </div>
            </div>
            <div className='row'>
              <div className='col-xs-12'>
                <ul className="nav nav-tabs biblio-page-ul">
                  <li className="active">
                    <a data-toggle="tab" href="#summary">Summary</a>
                  </li>
                  <li>
                    <a data-toggle="tab" href="#fullrecord">Full Record</a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div id="summary" className="tab-pane fade in active">
                    {/*Description and other Data*/}
                    <div className="row">
                      {/*Sidebar on the left*/}
                      <BiblioSidebar pageData={metadata} sidebarClass='no-col-padding-left-mobile no-col-padding-right-mobile hide-xs hide-sm col-md-3 biblio-sidebar'/>
                      <div className="col-md-9 col-xs-12 biblio-summary-main-content">
                        <div className="row">
                          <div className="col-xs-12 biblio-description  no-col-padding-left no-col-padding-right">
                            <h3 className='citation-formats'>Abstract</h3>
                            <SearchRowDescription text={abstract} moreLess={200}/>
                          </div>
                        </div>
                        <div className="row summary-row">
                          <div className="citation-details-div col-xs-12  no-col-padding-left no-col-padding-right">
                            {summaryContent}
                          </div>
                        </div>
                        <div className='row'>
                          <div className='col-xs-12'>
                            <h3 className='citation-formats'>Citation Format</h3>
                            <ul className="nav nav-tabs biblio-page-ul">
                              <li className="active">
                                <a data-toggle="tab" href="#mla">MLA</a>
                              </li>
                              <li>
                                <a data-toggle="tab" href="#apa">APA</a>
                              </li>
                              <li>
                                <a data-toggle="tab" href="#chicago">Chicago</a>
                              </li>
                              <li>
                                <a data-toggle="tab" href="#bibtex">Bibtex</a>
                              </li>
                            </ul>

                            <div className="tab-content">
                              <div id="mla" className="tab-pane fade in active">
                                <div className='row'>
                                  <div className='col-xs-12 citation-format-div'><MLA data={metadata.fieldMap} /></div>
                                </div>
                              </div>
                              <div id="apa" className="tab-pane fade">
                                <div className='row'>
                                  <div className='col-xs-12 citation-format-div'><APA data={metadata.fieldMap} /></div>
                                </div>
                              </div>
                              <div id="chicago" className="tab-pane fade">
                                <div className='row'>
                                  <div className='col-xs-12 citation-format-div'><Chicago data={metadata.fieldMap} /></div>
                                </div>
                              </div>
                              <div id="bibtex" className="tab-pane fade">
                                <div className='row'>
                                  <div className='col-xs-12 citation-format-div'><Bibtex data={metadata.fieldMap} /></div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <BiblioSidebar pageData={metadata} sidebarClass='no-col-padding-left-mobile no-col-padding-right-mobile hide-md hide-lg col-xs-12 biblio-sidebar'/>
                    </div>
                  </div>
                  <div id="fullrecord" className="tab-pane fade">
                    {/*Description and other Data*/}
                    <div className="row">
                      {/*Sidebar on the left*/}
                      <BiblioSidebar pageData={metadata} sidebarClass='no-col-padding-left-mobile no-col-padding-right-mobile hide-xs hide-sm col-md-3 col-xs-12 biblio-sidebar'/>
                      <div className="col-md-9 col-xs-12 biblio-main-content">
                        <div className="row">
                          <div className="col-xs-12 biblio-description  no-col-padding-left no-col-padding-right">
                            <h3 className='citation-formats'>Abstract</h3>
                            <SearchRowDescription text={abstract} moreLess={200}/>
                          </div>
                        </div>
                        <div className="row">
                          <div className="citation-details-div col-xs-12  no-col-padding-left no-col-padding-right">
                            {fieldsContent}
                          </div>
                        </div>
                      </div>
                      <BiblioSidebar pageData={metadata} sidebarClass='no-col-padding-left-mobile no-col-padding-right-mobile hide-md hide-lg col-md-3 col-xs-12 biblio-sidebar'/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
