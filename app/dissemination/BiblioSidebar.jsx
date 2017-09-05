import React from 'react';
import ReactDOM from 'react-dom';

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

    return (
      <div className={this.props.sidebarClass}>
        <div className='row'>
          <div className='col-xs-12'>
            {(doi && fieldMapdata.release_date) && <div className='row  biblio-sidebar-row'>
              <div className='col-xs-12'>
                <div className='biblio-sidebar-subtitle'>Digital Object Identifier</div>
                <a href={doi} target='_blank' className='biblio-sidebar-traditional-anchor'>{fieldMapdata.doi}</a>
              </div>
            </div>}
            <div className='row  biblio-sidebar-row'>
              <div className='col-xs-12'>
                <div className='biblio-sidebar-subtitle'>{fulltextMsg}</div>
                <a href={fulltextURL} target='_blank' className='biblio-sidebar-traditional-anchor'>{fulltextURL}</a>
              </div>
            </div>
          </div>
        </div>
      </div>

    );
  }

}
