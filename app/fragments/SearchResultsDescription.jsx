import React from 'react';
import SearchData from '../stores/SearchData';
import moment from 'moment';
import {getAvailabilityDisplay} from '../utils/utils';

const searchData = new SearchData();
export default class SearchResultsDescription extends React.Component {
  constructor(props) {
    super(props);
    this.removeFilter = this.removeFilter.bind(this);
    this.modifySearchAction = this.modifySearchAction.bind(this);
  }

  modifySearchAction() {
    window.location.href = '/doecode/search';
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
    let targetedSearch = false;
    var searchDescriptionArr = [];
    if (searchData.getValue("all_fields")) {
      targetedSearch = true;
      searchDescriptionArr.push({displayField: 'Keywords', display: searchData.getValue("all_fields"), field: 'all_fields'});
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
      searchDescriptionArr.push({displayField: 'Accessibility', field: 'accessibility', value: searchData.getValue("accessibility")});
    }
    if (searchData.getValue("licenses") && searchData.getValue("licenses").length > 0) {
      searchDescriptionArr.push({displayField: 'Licenses', field: 'licenses', value: searchData.getValue("licenses")});
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

    let self = this;

    return (
      <div>
        {!targetedSearch && <div>All Records</div>}
        {searchDescriptionArr.map(function(row, index) {

          if (row.value instanceof Array) {
            return (
              <div key={index}>
                <span className='search-for-filter-text search-for-filter-header'>{row.displayField}:&nbsp;</span>
                <br/> {row.value.map(function(data, idx) {
                  let display = (row.field == "accessibility"
                    ? getAvailabilityDisplay(data)
                    : data);
                  return (
                    <span key={index + "-" + idx}>
                      {idx != 0 && <span>,
                      </span>}
                      <span className='search-for-filter-text'>{display}</span>&nbsp;
                      <span className='search-for-filter-x clickable' onClick={() => self.removeFilter(row.field, data)}>[&nbsp;&times;&nbsp;]</span>
                    </span>
                  )
                })}
              </div>
            )
          } else {
            return (
              <div key={index}>
                <span className='search-for-filter-text search-for-filter-header'>{row.displayField}:&nbsp;</span>
                <br/>
                <span className='search-for-filter-text'>{row.display}</span>&nbsp;
                <span className='search-for-filter-x clickable' onClick={() => self.removeFilter(row.field, row.value)}>[ &times; ]</span>
              </div>
            )
          }
        })}
        {searchDescriptionArr.length > 0 && <div className='center-text'>
          <br/>
          <span className='clickable search-for-modify-search' title='Modify this search' onClick={this.modifySearchAction}>[&nbsp;<span className='fa fa-search modify-search-glass'></span>&nbsp;modify this search&nbsp;]</span>
        </div>}

      </div>
    );
  }
}
