import {observable} from 'mobx';

export default class TableStore {

    @observable developer = {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        orcid: '',
        affiliations: '',
        place: 0
    }

    @observable contributor = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            orcid: '',
            affiliations: '',
            contributor_type: '',
            place: 0
    }
    
    @observable sponsoring_organization = {
            organization_name: '',
            email: '',
            orcid: '',
            primary_award: '',
            award_numbers: [],
            place: 0
    }
    
    @observable research_organization = {
            organization_name: '',
            email: '',
            orcid: '',
            place: 0
    }
    
    @observable contributing_organization = {
            organization_name: '',
            email: '',
            orcid: '',
            contributor_type: '',
            place: 0
    }

    @observable relatedIdentifier = {
      place: 0,
      identifier_type : '',
      relation_type : '',
      identifier : ''
    }

    @observable current = {
    	arrName : '',
    	type : '',
    	label : ''
    }

    @observable showModal = false;

    @observable isEdit = false;

    @observable previousPlace = -1;
    
    @observable currentId = "";


    clear() {
      for (var field in this[this.current.type])
          this[this.current.type][field] = "";
    }

    makeCurrentCopy() {
    	return Object.assign({}, this[this.current.type]);
    }

    currentData() {
    	return this[this.current.type];
    }

    copyIntoCurrent(data) {
    	this[this.current.type] = data;
    }

    setCurrentField(field, value) {
    	this[this.current.type][field] = value;
    }
    
    updateField(field,value) {
    	setCurrentField(field,value);
    }
    
    getValue(field,value) {
    	return this[this.current.type][field];
    }
    
    getValidationStatus(field) {
    	return "";
    }


}
