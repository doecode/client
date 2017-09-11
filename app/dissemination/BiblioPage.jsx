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
import SearchRowDescription from '../fragments/SearchRowDescription'

const metadata = new Metadata();

export default class BiblioPage extends React.Component {
  constructor(props) {
    super(props);
    this.parseReceiveResponse = this.parseReceiveResponse.bind(this);
    this.parseErrorResponse = this.parseErrorResponse.bind(this);
    this.generateContent = this.generateContent.bind(this);
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

  generateContent(obj) {
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
        <div className='biblio-row'>
          <div className='col-xs-12'>
            <h3 className='biblio-field-header'>
              {header}
            </h3>
            <div className='biblio-field-value'>
              {textContent}
            </div>
          </div>
        </div>
      );
    } else {
      return (null);
    }
  }

  render() {
    metadata.deserializeData(this.state.data);
    addBiblio(metadata.fieldMap);
    const fieldsContent = staticContstants.biblioFieldsList.map(this.generateContent);

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
            {/*Description and other Data*/}
            <div className="row">
              {/*Sidebar on the left*/}
              <BiblioSidebar pageData={metadata} sidebarClass='col-md-3 hide-xs hide-sm biblio-sidebar'/>
              <div className="col-md-9 col-xs-12 biblio-main-content">
                <div className="row">
                  <div className="col-xs-12 biblio-description  no-col-padding-left no-col-padding-right">
                    <h3 className='biblio-field-header'>Abstract</h3>
                    <SearchRowDescription text={abstract} moreLess={200}/>
                  </div>
                </div>
                <div className="row">
                  <div className="citation-details-div col-xs-12  no-col-padding-left no-col-padding-right">
                    {fieldsContent}
                  </div>
                </div>
              </div>
              <BiblioSidebar pageData={metadata} sidebarClass='col-xs-12 hide-md hide-lg biblio-sidebar'/>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
