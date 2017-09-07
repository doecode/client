import {observable} from 'mobx';

class SearchStore {

  constructor() {
    this.defaultSearchData = {
      all_fields: '',
      software_title: '',
      developers_contributors: '',
      biblio_data: '',
      identifiers: '',
      date_earliest: '',
      date_latest: '',
      accessibility: [],
      licenses: [],
      research_organization: '',
      sponsoring_organization: '',
      start: 0,
      rows: 10,
      sort: 'score desc',
      orcid: ''
    }

    this.searchData = observable(this.defaultSearchData);

  }

}

const singleton = new SearchStore();
export default singleton;
