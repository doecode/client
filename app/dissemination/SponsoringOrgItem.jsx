import React from 'react';
import OrgMetadataDL from '../fragments/OrgMetadataDL';

export default class SponsoringOrgItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.items.map((row, index) => <div key={index} className='sponsor-org-row'>
          <div className='row'>
            <div className='col-xs-12'>
              {row.organization_name}
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <OrgMetadataDL data={row}/>
            </div>
          </div>
          {((index + 1) < this.props.items.length) && <div className='row'>
            <div className='col-xs-1'></div>
            <div className='col-xs-10 sponsor-org-bottom-row'></div>
            <div className='col-xs-1'></div>
          </div>}

        </div>)}
      </div>
    );
  }
}
