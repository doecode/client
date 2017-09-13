import React from 'react';
import ReactDOM from 'react-dom';
import {Dropdown, MenuItem, Modal} from 'react-bootstrap';
import SimpleDropdown from '../fragments/SimpleDropdown';
import {downloadJSONFile} from '../utils/utils';

export default class BiblioSidebar extends React.Component {
  constructor(props) {
    super(props);
    this.toggleShareModal = this.toggleShareModal.bind(this);
    this.state = {
      showShareModal: false
    };
  }

  toggleShareModal() {
    this.setState({
      showShareModal: !this.state.showShareModal
    });
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
                <h4 className='biblio-sidebar-subtitle'>SAVE/SHARE</h4>
                <div>
                  <SimpleDropdown noBtnPadding items={citation_list} label='Citation Formats'/>
                </div>
                <div>
                  <SimpleDropdown noBtnPadding items={export_metadata} label='Export Metadata'/>
                </div>
                <div>
                  <a className='clickable' onClick={this.toggleShareModal}>Send to Email</a>
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
        {/*Modal for the share function*/}
        <Modal show={this.state.showShareModal}>
          <Modal.Header>
            <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>

          <Modal.Body>
            bODY
          </Modal.Body>

          <Modal.Footer></Modal.Footer>

        </Modal>
      </div>
    );
  }
}
