import React from 'react';
import SearchData from '../stores/SearchData';
import moment from 'moment';
import {getAvailabilityDisplay} from '../utils/utils';

const searchData = new SearchData();
export default class SearchResultsDescription extends React.Component {
  constructor(props) {
    super(props);
    this.removeFilter = this.removeFilter.bind(this);
  }

  removeFilter(field, value) {
    if (field == 'accessibility' || field == 'licenses') {
      var newArray = searchData.getValue(field).filter(function(word) {
        return word != value;
      });
      searchData.setValue(field, newArray);
    } else {
      searchData.setValue(field, '');
    }
    this.props.refreshSearch();
  }

  render() {
    var searchDescriptionArr = [];
    if (searchData.getValue("all_fields")) {
      searchDescriptionArr.push({displayField: 'Bibliographic Data', display: searchData.getValue("all_fields"), field: 'all_fields'});
    }
    if (searchData.getValue("software_title")) {
      searchDescriptionArr.push({displayField: 'Software Title', display: searchData.getValue("software_title"), field: 'software_title'});
    }
    if (searchData.getValue("developers_contributors")) {
      searchDescriptionArr.push({displayField: 'Developers/Contributors', display: searchData.getValue("developers_contributors"), field: 'developers_contributors'});
    }
    if (searchData.getValue("biblio_data")) {
      searchDescriptionArr.push({displayField: 'Bibliographic Data', display: searchData.getValue("biblio_data"), field: 'biblio_data'});
    }
    if (searchData.getValue("identifiers")) {
      searchDescriptionArr.push({displayField: 'Identifiers', display: searchData.getValue("identifiers"), field: 'identifiers'});
    }
    if (searchData.getValue("date_earliest")) {
      var date_earliest = searchData.getValue("date_earliest");
      var date_earliest_date = moment(date_earliest.substr(0, date_earliest.indexOf('T')), "YYYY-MM-DD");
      searchDescriptionArr.push({displayField: 'Earliest Release Date', display: date_earliest_date.format("MM-DD-YYYY"), field: 'date_earliest'});
    }
    if (searchData.getValue("date_latest")) {
      var date_latest = searchData.getValue("date_latest");
      var date_latest_date = moment(date_latest.substr(0, date_latest.indexOf('T')), "YYYY-MM-DD");
      searchDescriptionArr.push({displayField: 'Latest Release Date', display: date_latest_date.format("MM-DD-YYYY"), field: 'date_latest'});
    }
    if (searchData.getValue("accessibility") && searchData.getValue("accessibility").length > 0) {

      searchData.getValue("accessibility").forEach(function(row) {
        searchDescriptionArr.push({displayField: 'Accessibility', display: getAvailabilityDisplay(row), field: 'accessibility', value: row});
      });
    }
    if (searchData.getValue("licenses") && searchData.getValue("licenses").length > 0) {
      searchData.getValue("licenses").forEach(function(row) {
        searchDescriptionArr.push({displayField: 'Licenses', display: row, field: 'licenses', value: row});
      });

    }
    if (searchData.getValue("research_organization")) {
      searchDescriptionArr.push({displayField: 'Research Organization', display: searchData.getValue("research_organization"), field: 'research_organization'});
    }
    if (searchData.getValue("sponsoring_organization")) {
      searchDescriptionArr.push({displayField: 'Sponsoring Organization', display: searchData.getValue("sponsoring_organization"), field: 'sponsoring_organization'});
    }
    if (searchData.getValue("orcid")) {
      searchDescriptionArr.push({displayField: 'ORCID is', display: searchData.getValue("orcid"), field: 'orcid'});
    }
    return (
      <div>
        <div>All Records</div>
        {searchDescriptionArr.map((row, index) => <div key={index}>
          <span className='search-for-filter-text search-for-filter-header'>{row.displayField}:&nbsp;</span>
          <br/>
          <span className='search-for-filter-text'>{row.display}</span>&nbsp;
          <span className='search-for-filter-x clickable' onClick={() => this.removeFilter(row.field, row.value)}>[ &times; ]</span>
        </div>)}
      </div>
    );
  }
}
