import React from 'react';
import SearchData from '../stores/SearchData';
import moment from 'moment';

const searchData = new SearchData();
export default class SearchResultsDescription extends React.Component {
  constructor(props) {
    super(props);

    var searchDescriptionArr = [];
    if (searchData.getValue("all_fields")) {
      searchDescriptionArr.push("Bibliographic Data: " + searchData.getValue("all_fields"));
    }
    if (searchData.getValue("software_title")) {
      searchDescriptionArr.push("Software Title: " + searchData.getValue("software_title"));
    }
    if (searchData.getValue("developers_contributors")) {
      searchDescriptionArr.push("Developers/Contributors " + searchData.getValue("developers_contributors"));
    }
    if (searchData.getValue("biblio_data")) {
      searchDescriptionArr.push("Biblio Data: " + searchData.getValue("biblio_data"));
    }
    if (searchData.getValue("identifiers")) {
      searchDescriptionArr.push("Identifiers: " + searchData.getValue("identifiers"));
    }
    if (searchData.getValue("date_earliest")) {
      var date_earliest = searchData.getValue("date_earliest");
      var date_earliest_date = moment(date_earliest.substr(0, date_earliest.indexOf('T')), "YYYY-MM-DD");
      searchDescriptionArr.push("Earliest Release Date: " + date_earliest_date.format("MM-DD-YYYY"));
    }
    if (searchData.getValue("date_latest")) {
      var date_latest = searchData.getValue("date_latest");
      var date_latest_date = moment(date_latest.substr(0, date_latest.indexOf('T')), "YYYY-MM-DD");
      searchDescriptionArr.push("Latest Release Date: " + date_latest_date.format("MM-DD-YYYY"));
    }
    if (searchData.getValue("accessibility") && searchData.getValue("accessibility").length > 0) {
      searchDescriptionArr.push("Accessibility: " + searchData.getValue("accessibility")[0]);
    }
    if (searchData.getValue("licenses") && searchData.getValue("licenses").length > 0) {
      searchDescriptionArr.push("Licenses: " + searchData.getValue("licenses")[0]);
    }
    if (searchData.getValue("research_organization")) {
      searchDescriptionArr.push("Research Organization: " + searchData.getValue("research_organization"));
    }
    if (searchData.getValue("sponsoring_organization")) {
      searchDescriptionArr.push("Sponsoring Organization: " + searchData.getValue("sponsoring_organization"));
    }
    if (searchData.getValue("orcid")) {
      searchDescriptionArr.push("ORCID is: " + searchData.getValue("orcid"));
    }

    if (searchDescriptionArr.length < 1) {
      searchDescriptionArr.push("All Records");
    }
    this.searchDescriptionArr = searchDescriptionArr;
  }

  render() {
    return (
      <div>
        {this.searchDescriptionArr.map((row, index) => <div key={index}>
          {row}
        </div>)}
      </div>
    );
  }
}
