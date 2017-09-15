import React from 'react';
import MetadataListAuthors from './MetadataListAuthors';
import DelimitedDisplayList from './DelimitedDisplayList';
import OrgMetadataDL from './OrgMetadataDL';

export default class MetadataList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const delimiter = <span>,&nbsp;</span>;
    var metadataList = this.props.data;
    const dtClass= 'col-xs-4';
    const ddClass = 'col-xs-8';

    return (
      <div className="row">
        <div className='col-xs-12'>
          <dl className='row'>
            {metadataList.developers && <span>
              <dt className={dtClass}>Developers</dt>
              <dd className={ddClass}>
                <MetadataListAuthors items={metadataList.developers} prefix='developers-'/>
              </dd>
            </span>}
            {metadataList.release_date && <span>
              <dt className={dtClass}>Release Date</dt>
              <dd className={ddClass}>{metadataList.release_date}</dd>
            </span>}
            {metadataList.accessibility && <span>
              <dt className={dtClass}>Code Availability</dt>
              <dd className={ddClass}>{metadataList.accessibility == 'CS' ? 'Closed Source' : (metadataList.accessibility == 'ON' ? 'Open Source, No Publicly Available Repository' : (metadataList.accessibility == 'OS' ? 'Open Source, Publicly Available Repository' : metadataList.accessibility))}</dd>
            </span>}
            {(metadataList.licenses && metadataList.licenses.length > 0) && <span>
              <dt className={dtClass}>License</dt>
              <dd className={ddClass}><DelimitedDisplayList items={metadataList.licenses} keyprefix='licenses-' delimiter={delimiter}/></dd>
            </span>}
            {metadataList.site_accession_number && <span>
              <dt className={dtClass}>Site Accession Number</dt>
              <dd className={ddClass}>{metadataList.site_accession_number}</dd>
            </span>}
            {(metadataList.research_organizations && metadataList.research_organizations.length > 0) && <span>
              <dt className={dtClass}>Research Organizations</dt>
              <dd className={ddClass}>{metadataList.research_organizations.map((row, index) => <div className='row' key={index}>
                  <div className='col-xs-12'>
                    {row.organization_name}&nbsp;&nbsp;
                  </div>
                  <div className='col-md-6 col-xs-1'></div>
                  <div className='col-md-6 col-xs-11'>
                    <OrgMetadataDL data={row}/>
                  </div>
                </div>)}</dd>
            </span>}
            {(metadataList.contributors && metadataList.contributors.length > 0) && <span>
              <dt className={dtClass}>Contributors</dt>
              <dd className={ddClass}><MetadataListAuthors items={metadataList.contributors} prefix='contributors-'/></dd>
            </span>}
            {(metadataList.contributing_organizations && metadataList.contributing_organizations.length > 0) && <span>
              <dt className={dtClass}>Contributing Organizations</dt>
              <dd className={ddClass}>{metadataList.contributing_organizations.map((row, index) => <div className='row' key={index}>
                  <div className='col-md-6 col-xs-12'>
                    {row.organization_name}&nbsp;&nbsp;
                  </div>
                  <div className='col-md-6 col-xs-12'>
                    <OrgMetadataDL data={row}/>
                  </div>
                </div>)}</dd>
            </span>}
            {(metadataList.sponsoring_organization && metadataList.sponsoring_organization.length > 0) && <span>
              <dt className={dtClass}>Sponsoring Organizations</dt>
              <dd className={ddClass}>{metadataList.sponsoring_organization.map((row, index) => <div className='row' key={index}>
                  <div className='col-md-6 col-xs-12'>
                    {row.organization_name}&nbsp;&nbsp;
                  </div>
                  <div className='col-md-6 col-xs-12'>
                    <OrgMetadataDL data={row}/>
                  </div>
                </div>)}</dd>
            </span>}
            {metadataList.country_of_origin && <span>
              <dt className={dtClass}>Country of Origin</dt>
              <dd className={ddClass}>{metadataList.country_of_origin}</dd>
            </span>}
            {metadataList.other_special_requirements && <span>
              <dt className={dtClass}>Other Special Requirements</dt>
              <dd className={ddClass}>{metadataList.other_special_requirements}</dd>
            </span>}
            {metadataList.keywords && <span>
              <dt className={dtClass}>Keywords</dt>
              <dd className={ddClass}>{metadataList.keywords}</dd>
            </span>}

          </dl>
        </div>
      </div>
    );
  }
}
