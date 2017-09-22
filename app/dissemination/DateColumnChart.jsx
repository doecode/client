import React from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';
import {Chart} from 'react-google-charts';
import SearchData from '../stores/SearchData';
import DateRangeSlider from './DateRangeSlider';

const searchData = new SearchData();

export default class DateColumnChart extends React.Component {
  constructor(props) {
    super(props);
    this.columnChartOptions = {
      "axisTitlesPosition": "none",
      "backgroundColor": "#f9f9f9",
      "width": 200,
      "height": 100,
      "bar": {
        "groupWidth": 2
      },
      "vAxis": {
        "minValue": 0,
        "baselineColor": "#ddd",
        "gridlines": {
          "color": "transparent"
        }
      },
      "hAxis": {
        "gridlines": {
          "color": "transparent"
        }
      },
      "chartArea": {
        "width": "100%",
        "height": "100%"
      }
    };

  }

  render() {
    return (
      <div>
        <Chart chartType="ColumnChart" data={this.props.years} options={this.columnChartOptions} graph_id="DateColumnChart" width="100%" height="90px" legend_toggle/>
        <br/>
        <DateRangeSlider minDate={this.props.minDate} maxDate={this.props.maxDate}/>
      </div>
    );
  }
}
