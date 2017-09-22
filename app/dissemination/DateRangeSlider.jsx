import React from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';
import {Chart} from 'react-google-charts';
import SearchData from '../stores/SearchData';

const searchData = new SearchData();

export default class DateRangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleDateSlide = this.handleDateSlide.bind(this);
    this.createSliderOptions = this.createSliderOptions.bind(this);

    this.state = {
      startYear: this.props.minDate,
      endYear: this.props.maxDate
    };
  }

  handleDateChange(event, ui) {
    this.setState({
      startYear: ui.values[0],
      endYear: ui.values[1],
    });
  }

  handleDateSlide(event, ui) {
    $("#date-slider-start").html(ui.values[0]);
    $("#date-slider-end").html(ui.values[1]);
  }

  createSliderOptions(minDate, maxDate) {
    return {
      range: true,
      min: parseInt(minDate),
      max: parseInt(maxDate),
      values: [
        parseInt(minDate), parseInt(maxDate)
      ],
      classes: {
        'ui-slider-handle': 'slider-btn',
        'ui-slider-range': 'slider-bar'
      },
      change: this.handleDateChange,
      slide: this.handleDateSlide
    };
  }

  componentDidMount() {
    $("#date-range-slider").slider(this.createSliderOptions(this.props.minDate, this.props.maxDate));
    $("#date-slider-start").html(this.props.minDate);
    $("#date-slider-end").html(this.props.maxDate);
  }

  componentWillReceiveProps(newProps) {
    //this.setState({startYear: newProps.minDate, endYear: newProps.maxDate});
  }

  render() {
    return (
      <div>
        <div id='date-range-slider'></div>
        <div className='row yearsDisplayContainer'>
          <div id='date-slider-start' className='col-xs-6 text-muted left-text no-col-padding-right yearsDisplayValue'></div>
          <div id='date-slider-end' className='col-xs-6 text-muted right-text no-col-padding-right no-col-padding-left yearsDisplayValue'></div>
        </div>
      </div>
    );
  }
}
