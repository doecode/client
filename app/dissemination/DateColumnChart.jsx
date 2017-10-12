import React from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';
import {Chart} from 'react-google-charts';
import SearchData from '../stores/SearchData';

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
    var self = this;
    const chartEvents = [
      {
        eventName: 'click',
        callback(chart, target) {
          if (target.targetID.indexOf("#") > 0) {
            //Take the innertext and break it out by newline
            var innertext_broken = chart.chart.container.innerText.split("\n");

            //Get the target id
            var targetIDPattern = new RegExp(/\d+$/);
            var targetIDValue = targetIDPattern.exec(target.targetID);

            //Now, let's get the value out of the array
            var yearRawString = innertext_broken[parseInt(targetIDValue) + 2]

            //Now, we get the year out of that string
            var yearRegex = new RegExp(/, \d{4}/);
            var year = yearRegex.exec(yearRawString);
            year = year.toString().replace(", ", "");

            searchData.setValue("date_earliest", (year + "-01-01T00:00:01.001Z"));
            searchData.setValue("date_latest", (year + "-12-31T23:59:59.001Z"));
            self.props.refreshSearch();
          }
        }
      }
    ];
    return (
      <div>
        <Chart chartType="ColumnChart" data={this.props.years} options={this.columnChartOptions} graph_id="DateColumnChart" width="100%" height="100px" legend_toggle={true} chartEvents={chartEvents}/>
      </div>
    );
  }
}
