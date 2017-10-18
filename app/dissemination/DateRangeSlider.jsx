import React from 'react';
import ReactDOM from 'react-dom';
import Slider, {Range} from 'rc-slider';
import 'rc-slider/assets/index.css';
import SearchData from '../stores/SearchData';

const searchData = new SearchData();

export default class DateRangeSlider extends React.Component {
  constructor(props) {
    super(props);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.handleSliderChangePermanent = this.handleSliderChangePermanent.bind(this);

    this.state = {
      earliestDate: this.props.minDate,
      latestDate: this.props.maxDate,
      earliestDateMin: this.props.minDate,
      latestDateMax: this.props.maxDate,
      earliestDateValue: this.props.minDate,
      latestDateValue: this.props.maxDate,
      renderSlider: true
    };

  }

  handleSliderChange(event) {
    this.setState({earliestDate: event[0], latestDate: event[1]});
  }

  handleSliderChangePermanent(event) {
    var doRefresh = false;
    if (this.state.earliestDateValue != event[0]) {
      var newDate = event[0].toString() + "-01-01T05:00:01.000Z";
      searchData.setValue("date_earliest", newDate);
      doRefresh = true;
    }
    if (this.state.latestDateValue != event[1]) {
      var newDate = event[1].toString() + "-12-31T23:59:59.001Z";
      searchData.setValue("date_latest", newDate);
      doRefresh = true;
    }
    if (doRefresh == true) {
      searchData.setValue("start", 0);
      this.setState({renderSlider: false});
      this.props.refreshSearch();
    }
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      earliestDate: newProps.minDate,
      latestDate: newProps.maxDate,
      earliestDateMin: newProps.minDate,
      latestDateMax: newProps.maxDate,
      earliestDateValue: newProps.minDate,
      latestDateValue: newProps.maxDate
    });
  }

  render() {
    return (
      <div>
        <div>
          <div className='rc-track-container' title='Date range slider'>
            <Range min={this.state.earliestDateMin} max={this.state.latestDateMax} value={[this.state.earliestDate, this.state.latestDate]} defaultValue={[this.props.minDate, this.props.maxDate]} step={1} allowCross={false} pushable={false} onChange={this.handleSliderChange} onAfterChange={this.handleSliderChangePermanent}/>
          </div>
          <div className='row yearsDisplayContainer'>
            <div className='col-xs-6 text-muted left-text no-col-padding-right yearsDisplayValue'>{this.state.earliestDate}</div>
            <div className='col-xs-6 text-muted right-text no-col-padding-right no-col-padding-left yearsDisplayValue'>{this.state.latestDate}</div>
          </div>
        </div>
      </div>
    );
  }
}
