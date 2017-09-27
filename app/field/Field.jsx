import React from 'react';
import Select from 'react-select';
import {Creatable} from 'react-select';
import DatePicker from 'react-datepicker';
import HelpTooltip from '../help/HelpTooltip';
import {observer} from "mobx-react";
import 'react-select/dist/react-select.css';
import 'react-datepicker/dist/react-datepicker.css';
import Moment from 'moment';

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
    this.handleCreatablePrompt = this.handleCreatablePrompt.bind(this);
    this.optionExists = this.optionExists.bind(this);
    this.validate = this.validate.bind(this);
  }

  toggleCheckbox(event) {
    const newVal = !(this.props.linkedData.getValue(this.props.properties.field));
    this.props.linkedData.setValue(this.props.properties.field, newVal);

    if (this.props.properties.toggleCallback !== undefined) {
      this.props.properties.toggleCallback();
    }
  }

  validate() {
    this.props.linkedData.validateField(this.props.properties.field);
  }

  handleBlur(event) {
    this.validate();
  }

  handleChange(event) {
    this.props.linkedData.setValue(this.props.properties.field, event.target.value);
    if (this.props.properties.changeCallback !== undefined) {
      this.props.properties.changeCallback();
    }
  }

  handleDateChange(date) {
    this.props.linkedData.setValue(this.props.properties.field, (date == null
      ? ""
      : date));
    this.props.linkedData.validateField(this.props.properties.field);
  }

  handleRadioChange(event) {
    this.props.properties.onChange(this.props.properties.field, event.target.value);
  }

  handleCreatablePrompt(label) {
    return "Add \"" + label + "\"";
  }

  handleSelectChange(value) {
    if (this.props.properties.isArray) {
      // comes in as string, because of simpleValue on Select component
      if (value.trim()) {
        this.props.linkedData.setValue(this.props.properties.field, value.split("\n"));
      } else {
        this.props.linkedData.setValue(this.props.properties.field, []);
      }
    } else {
      this.props.linkedData.setValue(this.props.properties.field, value);
    }

    if (this.props.properties.changeCallback !== undefined) {
      this.props.properties.changeCallback(value);
    }

    // autoBlur was causing onBlur to fire before onChange in Chrome and Firefox.  Removing react-select onBlur callback and putting validation here instead.
    this.validate();
  }

  optionExists(json, value) {
    let contains = false;

    if (!json)
      return contains;

    Object.keys(json).some(key => {
      contains = typeof json[key] === 'object'
        ? this.optionExists(json[key], value)
        : json[key] === value;
      return contains;
    });
    return contains;
  }

  emptyFunction() {}

  render() {
    const field = this.props.properties.field;
    const info = this.props.linkedData.getFieldInfo(field);

    let labelStyle = this.props.properties.labelStyle != undefined
      ? this.props.properties.labelStyle
      : "control-label";
    const divStyle = this.props.properties.divStyle != undefined
      ? this.props.properties.divStyle
      : "";
    const inputStyle = this.props.properties.inputStyle != undefined
      ? "form-control " + this.props.properties.inputStyle
      : "form-control";
    const messageNode = this.props.properties.messageNode;
    const onKeypressFunction = this.props.properties.keypressMethod != undefined
      ? this.props.properties.keypressMethod
      : this.emptyFunction;

    const wrapperStyleExtra = this.props.properties.wrapperStyleExtra != undefined
      ? this.props.properties.wrapperStyleExtra
      : "";
    const elementType = this.props.properties.elementType;
    const noval = this.props.properties.noval;
    const noExtraLabelText = this.props.properties.noExtraLabelText;

    let completed = false;
    let disabled = this.props.properties.disabled
      ? this.props.properties.disabled
      : false;
    let label = this.props.properties.label;
    let val = this.props.linkedData.getValue(field);
    let required = false;
    let error = '';

    if (this.props.properties.value !== undefined)
      val = this.props.properties.value;

    const handleChange = this.props.properties.handleChange
      ? this.props.properties.handleChange
      : this.handleChange;

    const handleBlur = this.props.properties.handleBlur
      ? this.props.properties.handleBlur
      : this.handleChange;

    if (info) {
      required = info.required;
      error = info.error;
      completed = info.completed;
    }

    let wrapperStyle = "form-group row" + wrapperStyleExtra;

    if (!noval) {

      if (error) {
        wrapperStyle += " has-error has-feedback"
      } else if (completed) {
        wrapperStyle += " has-success has-feedback"
      }

    }

    if (!noExtraLabelText) {
      if (required) {
        label += " (Required Field)";
        labelStyle += " req ";
      } else if (elementType !== 'radio') {
        label += " (Optional Field)";
      }
    }

    let input = null;

    if (elementType === 'display') {
      input = <div>val</div>;
    } else if (elementType === 'input') {
      if (!disabled) {
        input = <input name={field} type="text" className={inputStyle} value={val} onChange={handleChange} onBlur={this.handleBlur} onKeyPress={onKeypressFunction} placeholder={this.props.properties.placeholderText}/>
      } else {
        input = <input name={field} type="text" className={inputStyle} value={val} onChange={handleChange} onBlur={this.handleBlur} disabled placeholder={this.props.placeholderText}/>
      }
    } else if (elementType === 'password') {
      input = <input name={field} type="password" className={inputStyle} value={val} onChange={handleChange} onBlur={this.handleBlur} onKeyPress={onKeypressFunction} placeholder={this.props.properties.placeholderText}/>
    } else if (elementType === 'checkbox') {
      input = <input name={field} type="checkbox" checked={val} onChange={this.toggleCheckbox}/>
    } else if (elementType === 'select') {
      const ph = this.props.properties.placeholder
        ? this.props.properties.placeholder
        : "Select any that apply";
      const clearable = this.props.properties.clearable !== undefined
        ? this.props.properties.clearable
        : true;
      const errorClass = error
        ? "field-error"
        : ""

      // multis must be array of object
      if (this.props.properties.multi) {
        let newVal = [];
        if (val instanceof Array) {
          let arrayLength = val.length;
          for (var i = 0; i < arrayLength; i++) {
            let tmpVal = val[i];
            // when option exists, no need to create object version
            if (!this.optionExists(this.props.properties.options, tmpVal))
              tmpVal = {
                label: tmpVal,
                value: tmpVal
              };

            newVal.push(tmpVal);
          }
        } else {
          // when option exists, no need to create object version
          if (!this.optionExists(this.props.properties.options, val))
            val = {
              label: val,
              value: val
            };
          newVal.push(val);
        }
        val = // singles must be object, not array
        newVal;
      } else {
        if (val instanceof Array) {
          val = val.join("\n");
        }

        // when option exists, no need to create object version
        if (!this.optionExists(this.props.properties.options, val))
          val = {
            label: val,
            value: val
          };
      }

      if (this.props.properties.allowCreate) {
        input = <Creatable name={field} className={errorClass} clearable={clearable} simpleValue joinValues delimiter={"\n"} multi={this.props.properties.multi} options={this.props.properties.options} placeholder={ph} onChange={this.handleSelectChange} autoBlur={true} value={val} promptTextCreator={this.handleCreatablePrompt}/>;
      } else {
        input = <Select name={field} className={errorClass} clearable={clearable} simpleValue joinValues delimiter={"\n"} multi={this.props.properties.multi} options={this.props.properties.options} placeholder={ph} onChange={this.handleSelectChange} autoBlur={true} value={val}/>;
      }
    } else if (elementType === 'textarea') {
      input = <textarea name={field} className={inputStyle} value={val} onChange={this.handleChange} onBlur={this.handleBlur}/>;
    } else if (elementType === 'radio') {
      return (
        <div className="form-group form-group-sm row">
          <div>
            <label htmlFor={field}><input type="radio" checked={this.props.properties.checked} name={field} value={val} onChange={this.handleRadioChange}/> {label}</label>{this.props.properties.helpTooltip!=undefined &&<span>&nbsp; <HelpTooltip item={this.props.properties.helpTooltip} shortVersion={this.props.properties.tooltipShort}/></span>}
          </div>
        </div>
      );
    } else if (elementType === 'date') {
      let dateVal = Moment(val);

      if (dateVal == null || !dateVal.isValid())
        dateVal = null;

      input = <DatePicker name={field} placeholderText="Click to select a date" selected={dateVal} onChange={this.handleDateChange} showMonthDropdown showYearDropdown dropdownMode="select"/>
    }

    return (
      <div className={wrapperStyle}>
        <div className="">
          {label && <label htmlFor={field} className={labelStyle}>
            {label}
          </label>}
          {this.props.properties.helpTooltip!=undefined &&
            <span>&nbsp;
              <span>
                <HelpTooltip item={this.props.properties.helpTooltip} shortVersion={this.props.properties.tooltipShort} />
              </span>
            </span>}
          <div className={divStyle}>
            {input}
            {error && <span className="error-color">
              <strong>{error}
              </strong>
            </span>}
          </div>
          {messageNode}
          {completed && (elementType === 'input' || elementType === 'textarea') && !noval && <span className="fa fa-check form-control-feedback"></span>}
        </div>
      </div>
    );
  }

}
