import React from 'react';

export default class BootstrapAlertMsg extends React.Component {
  constructor(props) {
    super(props);

  }

  render() {

    return (
      <div>
        {this.props.showMsg && <div className={this.props.alertClasses}>
          <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
          {this.props.message}
        </div>}
      </div>
    )
  }
}
