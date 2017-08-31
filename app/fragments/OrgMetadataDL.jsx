import React from 'react';

export default class OrgMetadataDL extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    console.log(JSON.stringify(this.props.data))
    return (
      <dl className='dl-horizontal biblio-sub-dl'>
        {this.props.data.primary_award && <span>
          <dt>Primary Award:</dt>
          <dd>{this.props.data.primary_award}</dd>
        </span>}
        {(this.props.data.award_numbers && this.props.data.award_numbers.length > 0) && <span>
          <dt>Award Numbers:</dt>
          <dd>
            {this.props.data.award_numbers.map((awardNum, index) => <div key={"award-" + index}>{awardNum}</div>)}
          </dd>
        </span>}
        {(this.props.data.br_codes && this.props.data.br_codes.length > 0) && <span>
          <dt>B&amp;R Codes:</dt>
          <dd>
            {this.props.data.br_codes.map((brcodes, index) => <div key={"brcode-" + index}>{brcodes}</div>)}
          </dd>
        </span>}
        {(this.props.data.fwp_numbers && this.props.data.fwp_numbers.length > 0) && <span>
          <dt>FWP Numbers:</dt>
          <dd>
            {this.props.data.fwp_numbers.map((fwpnumbers, index) => <div key={"fwpNum-" + index}>{fwpnumbers}</div>)}
          </dd>
        </span>}
      </dl>
    );
  }
}
