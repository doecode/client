import React from 'react';
import MetadataListAuthors from './MetadataListAuthors';

export default class MetadataList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var metadataList = this.props.data;
    return (
      <div className="row not-so-wide-row">
        <div className='col-xs-12'>
          <dl className='row'>
            {metadataList.developers && <span>
              <dt className='col-xs-5'>Developers</dt>
              <dd className='col-xs-7'>
                <MetadataListAuthors items={metadataList.developers} prefix='developers-'/>
              </dd>
            </span>}
            {metadataList.release_date && <span>
              <dt className='col-xs-5'>Release Date</dt>
              <dd className='col-xs-7'>{metadataList.release_date}</dd>
            </span>}
            {metadataList.accessibility && <span>
              <dt className='col-xs-5'>Code Availability</dt>
              <dd className='col-xs-7'></dd>
            </span>}
            {metadataList.licenses && <span>
              <dt className='col-xs-5'>License</dt>
              <dd className='col-xs-7'></dd>
            </span>}
            {metadataList.site_accession_number && <span>
              <dt className='col-xs-5'>Site Accession Number</dt>
              <dd className='col-xs-7'></dd>
            </span>}
            {metadataList.research_organizations && <span>
              <dt className='col-xs-5'>Research Organizations</dt>
              <dd className='col-xs-7'></dd>
            </span>}
            {metadataList.contributors && <span>
              <dt className='col-xs-5'>Contributors</dt>
              <dd className='col-xs-7'></dd>
            </span>}
            {metadataList.contributing_organizations && <span>
              <dt className='col-xs-5'>Contributing Organizations</dt>
              <dd className='col-xs-7'></dd>
            </span>}
            {metadataList.sponsoring_organization && <span>
              <dt className='col-xs-5'>Sponsoring Organizations</dt>
              <dd className='col-xs-7'></dd>
            </span>}
            {metadataList.country_of_origin && <span>
              <dt className='col-xs-5'>Country of Origin</dt>
              <dd className='col-xs-7'></dd>
            </span>}
            {metadataList.other_special_requirements && <span>
              <dt className='col-xs-5'>Other Special Requirements</dt>
              <dd className='col-xs-7'></dd>
            </span>}
            {metadataList.keywords && <span>
              <dt className='col-xs-5'>Keywords</dt>
              <dd className='col-xs-7'></dd>
            </span>}

          </dl>
        </div>
      </div>
    );
  }
}
