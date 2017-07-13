import {observable} from 'mobx';


class SearchStore {
	
	constructor() {
		this.defaultSearchData = {
				all_fields : '',
				software_title: '',
				developers_contributors: '',
				bib_data: '',
				identifiers: '',
				date_earliest: '',
				date_latest: '',
				availability: '',
				research_organization: '',
				sponsoring_organization: '',
				sort: 'relevance'
				
			}
			
		this.searchData = observable(this.defaultSearchData);
			
	}
	

}

const singleton = new SearchStore();
export default singleton;