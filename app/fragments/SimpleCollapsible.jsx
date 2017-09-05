import React from 'react';
import {Collapse} from 'react-bootstrap';

export default class SimpleCollapsible extends React.Component {
  constructor(props) {
    super(props);
    this.toggleState = this.toggleState.bind(this);
    this.state = {
      isOpen: false,
      useToggleArrow: this.props.toggleArrow !== undefined
    }
  }

  toggleState() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    var arrow_class = this.state.isOpen
      ? 'fa fa-caret-down fa-page-caret clickable'
      : 'fa fa-caret-right fa-page-caret clickable';
    return (
      <div>
        <div className='faq-page-btn-wrapper'>
          {this.state.useToggleArrow && <span onClick={this.toggleState} className={arrow_class}></span>}&nbsp;
          <a className='faq-page-btn clickable' onClick={this.toggleState}>{this.props.button_text}</a>
        </div>
        <Collapse in={this.state.isOpen}>
          <div className={this.props.collapseContainerClasses}>
            {this.props.contents}
          </div>
        </Collapse>
      </div>
    );
  }

}
