import React from 'react';

export default class IconRowIcon extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.container_classes}>
        <a title={this.props.text} href={this.props.destination} className="icon-row-icon">
          <span className={this.props.icon_classes}></span>
        </a>
        <br/>
        <small>
          <a className='icon-row-icon-text' title={this.props.text} href={this.props.destination}>{this.props.text}</a>
        </small>
      </div>
    );
  }
}
