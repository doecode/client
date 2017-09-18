import React from 'react';
import MetadataListAuthors from './MetadataListAuthors';
import DelimitedDisplayList from './DelimitedDisplayList';
import OrgMetadataDL from './OrgMetadataDL';
import {getAvailabilityDisplay} from '../utils/utils';

export default class MetadataList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const delimiter = <span>,&nbsp;</span>;
    var metadataList = this.props.data;
    const dtClass = 'col-xs-4';
    const ddClass = 'col-xs-8';

    return (
      <div className="row">
        <div className='col-xs-12'>
          <dl className='row confirmation-page-metadata'>
            {metadataList.developers && <dt className={dtClass}>Developers</dt>}
            {metadataList.developers && <dd className={ddClass}>
              <MetadataListAuthors items={metadataList.developers} prefix='developers-'/>
            </dd>}
            {metadataList.release_date && <dt className={dtClass}>Release Date</dt>}
            {metadataList.release_date && <dd className={ddClass}>{metadataList.release_date}</dd>}
            {metadataList.accessibility && <dt className={dtClass}>Code Availability</dt>}
            {metadataList.accessibility && <dd className={ddClass}>{getAvailabilityDisplay(metadataList.accessibility)}</dd>}
            {(metadataList.licenses && metadataList.licenses.length > 0) && <dt className={dtClass}>License</dt>}
            {(metadataList.licenses && metadataList.licenses.length > 0) && <dd className={ddClass}><DelimitedDisplayList items={metadataList.licenses} keyprefix='licenses-' delimiter={delimiter}/></dd>}
            {metadataList.site_accession_number && <dt className={dtClass}>Site Accession Number</dt>}
            {metadataList.site_accession_number && <dd className={ddClass}>{metadataList.site_accession_number}</dd>}
            {(metadataList.research_organizations && metadataList.research_organizations.length > 0) && <dt className={dtClass}>Research Organizations</dt>}
            {(metadataList.research_organizations && metadataList.research_organizations.length > 0) && <dd className={ddClass}>{metadataList.research_organizations.map((row, index) => <div className='row' key={index}>
                <div className='col-xs-12'>
                  {row.organization_name}&nbsp;&nbsp;
                </div>
                <div className='col-md-6 col-xs-1'></div>
                <div className='col-md-6 col-xs-11'>
                  <OrgMetadataDL data={row}/>
                </div>
              </div>)}</dd>}
            {(metadataList.contributors && metadataList.contributors.length > 0) && <dt className={dtClass}>Contributors</dt>}
            {(metadataList.contributors && metadataList.contributors.length > 0) && <dd className={ddClass}><MetadataListAuthors items={metadataList.contributors} prefix='contributors-'/></dd>}
            {(metadataList.contributing_organizations && metadataList.contributing_organizations.length > 0) && <dt className={dtClass}>Contributing Organizations</dt>}
            {(metadataList.contributing_organizations && metadataList.contributing_organizations.length > 0) && <dd className={ddClass}>{metadataList.contributing_organizations.map((row, index) => <div className='row' key={index}>
                <div className='col-md-6 col-xs-12'>
                  {row.organization_name}&nbsp;&nbsp;
                </div>
                <div className='col-md-6 col-xs-12'>
                  <OrgMetadataDL data={row}/>
                </div>
              </div>)}</dd>}
            {(metadataList.sponsoring_organization && metadataList.sponsoring_organization.length > 0) && <dt className={dtClass}>Sponsoring Organizations</dt>}
            {(metadataList.sponsoring_organization && metadataList.sponsoring_organization.length > 0) && <dd className={ddClass}>{metadataList.sponsoring_organization.map((row, index) => <div className='row' key={index}>
                <div className='col-md-6 col-xs-12'>
                  {row.organization_name}&nbsp;&nbsp;
                </div>
                <div className='col-md-6 col-xs-12'>
                  <OrgMetadataDL data={row}/>
                </div>
              </div>)}</dd>}
            {metadataList.country_of_origin && <dt className={dtClass}>Country of Origin</dt>}
            {metadataList.country_of_origin && <dd className={ddClass}>{metadataList.country_of_origin}</dd>}
            {metadataList.other_special_requirements && <dt className={dtClass}>Other Special Requirements</dt>}
            {metadataList.other_special_requirements && <dd className={ddClass}>{metadataList.other_special_requirements}</dd>}
            {metadataList.keywords && <dt className={dtClass}>Keywords</dt>}
            {metadataList.keywords && <dd className={ddClass}>{metadataList.keywords}</dd>}

          </dl>
        </div>
      </div>
    );
  }
}
