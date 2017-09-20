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
        <input className='search-checkbox' id={this.props.id} name={this.props.name} type="checkbox" checked={this.props.isChecked} onChange={this.toggleCheckbox}/>
        <label htmlFor={this.props.id}></label>
        &nbsp;<label htmlFor={this.props.id}>{this.props.label}</label>
      </span>
    );
  }

}
