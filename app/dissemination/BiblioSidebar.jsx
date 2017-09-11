import React from 'react';
import ReactDOM from 'react-dom';
import {Dropdown, MenuItem} from 'react-bootstrap';
import SimpleDropdown from '../fragments/SimpleDropdown';

export default class BiblioSidebar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const fieldMapdata = this.props.pageData.fieldMap;
    const doi = (fieldMapdata.doi)
      ? "https://dx.doi.org/" + fieldMapdata.doi
      : "";

    var fulltextURL = "";
    var fulltextMsg = "";

    if (fieldMapdata.repository_link !== '') {
      fulltextURL = fieldMapdata.repository_link;
      fulltextMsg = "Publicly Accessible Repository";
    } else {
      fulltextURL = fieldMapdata.landing_page;
      fulltextMsg = "Project Landing Page";
    }

    var has_http = new RegExp(/^http:\/\/|https:\/\//);
    if (!has_http.test(fulltextURL)) {
      fulltextURL = ("http://" + fulltextURL);
    }

    const citation_list = [
      {
        link: '#',
        display: 'MLA'
      }, {
        link: '#',
        display: 'APA'
      }, {
        link: '#',
        display: 'Chicago'
      }, {
        link: '#',
        display: 'Bibtex'
      }
    ];
    const export_metadata = [
      {
        link: '#',
        display: 'Endnote'
      }, {
        link: '#',
        display: 'RIS'
      }, {
        link: '#',
        display: 'CSV'
      }, {
        link: '#',
        display: 'XML'
      }
    ];
    return (
      <div className={this.props.sidebarClass}>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='row  biblio-sidebar-row'>
              <div className='col-xs-12 no-col-padding-left'>
                <h4 className='biblio-sidebar-subtitle'>Resource:</h4>
                {(doi && fieldMapdata.release_date) && <span>
                  DOI:&nbsp;<a href={doi} target='_blank' className='biblio-sidebar-traditional-anchor'>{fieldMapdata.doi}</a>
                  <br/>
                  <span className='text-muted doi-subnotice'>Select the DOI to obtain a copy of this journal article from the publisher.</span>
                  <br/>
                  <br/>
                </span>}
                <span className='biblio-sidebar-secondary-subtitle'>{fulltextMsg}</span>
                <br/>
                <a href={fulltextURL} target='_blank' className='biblio-sidebar-traditional-anchor word-break'>{fulltextURL}</a>
              </div>
            </div>
            <div className='row biblio-sidebar-row'>
              <div className='col-xs-12 no-col-padding-left'>
                <h4 className='biblio-sidebar-subtitle'>SAVE/SHARE</h4>
                <div>
                  <SimpleDropdown noBtnPadding items={citation_list} label='Citation Formats'/>
                </div>
                <div>
                  <SimpleDropdown noBtnPadding items={export_metadata} label='Export Metadata'/>
                </div>
                <br/>
                <div className="row ">
                  <div className='col-xs-12'>
                    <ul className="list-inline">
                      <li className='biblio-social-link'>
                        <a target="_blank" href="#">
                          <span className="fa fa-facebook facebook"></span>
                        </a>
                      </li>
                      <li className='biblio-social-link'>
                        <a target="_blank" href="#">
                          <span className="fa fa-twitter twitter"></span>
                        </a>
                      </li>
                      <li className='biblio-social-link'>
                        <a target="_blank" href="#">
                          <span className="fa fa-google-plus gplus"></span>
                        </a>
                      </li>
                      <li className='biblio-social-link'>
                        <a target="_blank" href="#">
                          <span className="fa fa-linkedin linkedin"></span>
                        </a>
                      </li>
                      <li className='biblio-social-link'>
                        <a target="_blank" href="#">
                          <span className="fa fa-share-alt shareAlt"></span>
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }

}
