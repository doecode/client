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
    var btn_wrapper_class = this.props.btnWrapperClass
      ? this.props.btnWrapperClass
      : 'faq-page-btn-wrapper';
    var anchorClass = this.props.anchorClass
      ? this.props.anchorClass
      : 'faq-page-btn clickable';
    return (
      <div>
        <div className={btn_wrapper_class}>
          {this.state.useToggleArrow && <span onClick={this.toggleState} className={arrow_class}></span>}&nbsp;&nbsp;
          <a className={anchorClass} onClick={this.toggleState}>{this.props.button_text}</a>
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
