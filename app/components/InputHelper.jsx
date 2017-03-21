import React from 'react';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

export default class InputHelper extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
 }

  handleChange(event) {
    this.props.onChange(this.props.field,event.target.value);
  }
  
  handleSelectChange(value) {
	  
	  if (this.props.multi) {
		let retArray = [];
	  	if (value.trim())
	  		retArray = value.split(',');
	  	this.props.onChange(this.props.field,retArray);
	  } else {
		  this.props.onChange(this.props.field,value);
	  }
  }

  render() {
	  const labelStyle = this.props.labelStyle != undefined ? this.props.labelStyle : "col-sm-2 control-label";
	  const divStyle = this.props.divStyle != undefined ? this.props.divStyle : "col-sm-4 ";

	  
	  let input = null;
	  const elementType = this.props.elementType;

	  if (this.props.displayOnly) {
		  input = this.props.value;
	  }
	  else if (elementType === 'input') {
		input = <input type="text" className="form-control" value={this.props.value} onChange={this.handleChange} />
	  } else if (elementType === 'select') {
	    let ph = this.props.placeholder ? this.props.placeholder : "Select any that apply";
      	input = <Select allowCreate={this.props.allowCreate} multi={this.props.multi} options={this.props.options} simpleValue placeholder={ph} onChange={this.handleSelectChange} value={this.props.value} />
	  } else if (elementType === 'textarea') {
		 input = <textarea type="text" className="form-control" value={this.props.value} onChange={this.handleChange} />
	  } else if (elementType === 'radio') {
			 input = <input type="radio" checked={this.props.checked} name={this.props.field} value={this.props.value} onChange={this.handleChange} />
	  }
	  
	  return(
      <div>
      {this.props.label && 
      <label className={labelStyle}>
        {this.props.label}
      </label>
      }
      <div className={divStyle}>
        {input}
      </div>
      </div>
    );
  }

}
