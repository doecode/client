import React from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import {observer} from "mobx-react";
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';

@observer
export default class Field extends React.Component {
  constructor(props) {
    super(props);
    this.toggleCheckbox = this.toggleCheckbox.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.handleBlur = this.handleBlur.bind(this);
    this.handleDateBlur = this.handleDateBlur.bind(this);
 }


  toggleCheckbox(event) {
	  const newVal = !(this.props.linkedData.getValue(this.props.properties.field));
	  this.props.linkedData.setValue(this.props.properties.field, newVal);
  }

  handleBlur(event) {
	  this.props.linkedData.validateField(this.props.properties.field);
  }

  handleDateBlur() {

    this.props.linkedData.validateField(this.props.properties.field);
  }

  handleChange(event) {
	  this.props.linkedData.setValue(this.props.properties.field,event.target.value);
  }

  handleDateChange(date) {
		this.props.linkedData.setValue(this.props.properties.field,date);
		this.props.linkedData.validateField(this.props.properties.field);
  }

  handleRadioChange(event) {
	  this.props.properties.onChange(this.props.properties.field,event.target.value);
  }

  handleSelectChange(value) {

    if (this.props.properties.isArray) {
        if (value.trim()) {
            this.props.linkedData.setValue(this.props.properties.field, value.split(','));
        } else {
            this.props.linkedData.setValue(this.props.properties.field, []);
        }
    } else {
        this.props.linkedData.setValue(this.props.properties.field, value);
    }
}

  render() {
    const field = this.props.properties.field;
    const info = this.props.linkedData.getFieldInfo(field);
	  let labelStyle = this.props.properties.labelStyle != undefined ? this.props.properties.labelStyle : "control-label";
	  const divStyle = this.props.properties.divStyle != undefined ? this.props.properties.divStyle : "";

    const elementType = this.props.properties.elementType;


    let label = this.props.properties.label;
    let val = this.props.linkedData.getValue(field);
    let required = false;
    let error = '';

    if (this.props.properties.value !== undefined)
          val = this.props.properties.value;





    if (info) {
      required = info.required;
      error = info.error;
    }

    if (required)
         labelStyle += " req ";




     let wrapperStyle = "col-xs-8";
	 wrapperStyle = error ? wrapperStyle + " has-error has-feedback" : wrapperStyle;

	 let input = null;


	  if (elementType === 'display') {
		  input = val;
	  }
	  else if (elementType === 'input') {
		input = <input type="text" className="form-control" value={val} onChange={this.handleChange} onBlur={this.handleBlur} />
	  }
	  else if (elementType === 'checkbox') {
		  input = <input type="checkbox" className="" checked={val} onChange={this.toggleCheckbox} />
	  }
	  else if (elementType === 'select') {
	    let ph = this.props.properties.placeholder ? this.props.properties.placeholder : "Select any that apply";
	    const errorClass = error ? "field-error" : ""

      if (this.props.properties.isArray)
            val = val.slice();
      	input = <Select className={errorClass} allowCreate={this.props.properties.allowCreate} multi={this.props.properties.multi} options={this.props.properties.options} simpleValue placeholder={ph} onChange={this.handleSelectChange} onBlur={this.handleBlur} value={val} />
	  }
	  else if (elementType === 'textarea') {

		 input = <textarea className="form-control" value={val} onChange={this.handleChange} onBlur={this.handleBlur} />
	  }
	  else if (elementType === 'radio') {
			 return (
					 <div className={wrapperStyle}>
					 <label><input type="radio" checked={this.props.properties.checked} name={field} value={val} onChange={this.handleRadioChange} /> {label}</label>
					 </div>
					 );
	  }
	  else if (elementType === 'date') {
		  input = <DatePicker placeholderText="Click to select a date" selected={val} onChange={this.handleDateChange} showMonthDropdown showYearDropdown dropdownMode="select"/>
	  }




	  return(
      <div className={wrapperStyle}>
      {label &&
      <label className={labelStyle}>
        {label}
      </label>
      }
      <div className={divStyle}>
        {input}
        {error &&
        <span className="error-color">
        <strong>{error} </strong>
        </span>
        }
      </div>
      </div>
    );
  }

}
