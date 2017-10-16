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
            //Grab the first year we see. It'll be the year we want
            var year_pattern = new RegExp(/\d{4}/ig);
            var year = year_pattern.exec(chart.chart.container.innerText.trim());

            //Reconduct the search
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
