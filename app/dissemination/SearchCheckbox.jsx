import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchCheckbox extends React.Component {
  constructor(props) {
    super(props);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
  }

  toggleCheckbox(event) {
    var newState = !this.props.isChecked;
    this.props.toggleCallback(newState, this.props.value, this.props.type);
  }

  render() {
    return (
      <span>
        <input className='styled-checkbox' id={this.props.id} name={this.props.name} type="checkbox" checked={this.props.isChecked} onChange={this.toggleCheckbox}/>
      </span>
    );
  }

}
