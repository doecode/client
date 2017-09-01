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
      ? 'fa fa-caret-down fa-page-caret'
      : 'fa fa-caret-right fa-page-caret';
    return (
      <div>
        {this.state.useToggleArrow && <span className={arrow_class}></span>}&nbsp;<button type='button' className='btn btn-link faq-page-btn' onClick={this.toggleState}>{this.props.button_text}</button>
        <Collapse in={this.state.isOpen}>
          <div className={this.props.collapseContainerClasses}>
            {this.props.contents}
          </div>
        </Collapse>
      </div>
    );
  }

}
