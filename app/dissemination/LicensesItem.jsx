import React from 'react';

export default class LicensesItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        {this.props.items.map((row, index) => <div key={index}>
          {row == 'Other' && <span>
            Other&nbsp;,&nbsp;<a href={this.props.proprietary_url}>{this.props.proprietary_url}</a>
          </span>}
          {row != 'Other' && <span>{row}</span>}
        </div>)}
      </div>
    );
  }
}
