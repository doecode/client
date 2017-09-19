import React from 'react';
import ReactDOM from 'react-dom';
import {Dropdown, MenuItem, Modal} from 'react-bootstrap';
import SimpleDropdown from '../fragments/SimpleDropdown';
import {downloadJSONFile} from '../utils/utils';

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
        customAnchor: true,
        display: <a href={'/doecode/api/search/' + fieldMapdata.code_id + '?format=xml'} download={fieldMapdata.code_id + '.xml'}>XML</a>
      }, {
        customAnchor: true,
        display: <a href={'/doecode/api/search/' + fieldMapdata.code_id + '?format=yaml'} download={fieldMapdata.code_id + '.yaml'}>YAML</a>
      }, {
        customAnchor: true,
        display: <a href={'/doecode/api/search/' + fieldMapdata.code_id + '?format=json'} download={fieldMapdata.code_id + '.json'}>JSON</a>
      }
    ];
    const share_lbl = <span className="fa fa-share-alt shareAlt"></span>;
    const share_list = [
      {
        customAnchor: true,
        display: (
          <a href="" target="_blank" className="pure-menu-link social">
            <span className="fa fa-pinterest pintrest"></span>&nbsp;Pinterest</a>
        )
      }, {
        customAnchor: true,
        display: (
          <a href="" target="_blank" className="pure-menu-link social">
            <span className="fa fa-linkedin linkedin"></span>&nbsp;LinkedIn</a>
        )
      }, {
        customAnchor: true,
        display: (
          <a href="" target="_blank" className="pure-menu-link social">
            <span className="fa fa-tumblr tumblr"></span>&nbsp;Tumblr</a>
        )
      }
    ];
    return (
      <div className={this.props.sidebarClass}>
        <div className='row'>
          <div className='col-xs-12'>
            <div className='row biblio-sidebar-row'>
              <div className='col-xs-12'>
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
              <div className='col-xs-12'>
                <h4 className='biblio-sidebar-subtitle'>SAVE&nbsp;/&nbsp;SHARE</h4>
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
                        <a target="_blank" href={"https://www.facebook.com/sharer/sharer.php?u=" + window.location.href}>
                          <span className="fa fa-facebook facebook"></span>
                        </a>
                      </li>
                      <li className='biblio-social-link'>
                        <a target="_blank" href={'https://twitter.com/home?status=DOE Research from DOECODE: ' + window.location.href}>
                          <span className="fa fa-twitter twitter"></span>
                        </a>
                      </li>
                      <li className='biblio-social-link'>
                        <a target="_blank" href={'https://plus.google.com/share?url=' + window.location.href}>
                          <span className="fa fa-google-plus gplus"></span>
                        </a>
                      </li>
                      <li className='biblio-social-link'>
                        <a href={"mailto:?subject=Software Records from DOECODE&body=" + window.location.href}>
                          <span className="fa fa-envelope shareEmail"></span>
                        </a>
                      </li>
                      <li className='biblio-social-link'>
                        <SimpleDropdown noBtnPadding noToggleArrow ulClasses='dropdown-menu dropdown-menu-left' items={share_list} label={share_lbl}/>
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
