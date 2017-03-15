import {observable} from 'mobx';

export default class TableStore {

    @observable developer = {
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        affiliations: '',
        place: 0
    }
    
    @observable contributor = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            affiliations: '',
            contributor_type: '',
            place: 0	
    }

    @observable current = {
    	arrName : '',
    	type : '',
    	label : ''
    }

    @observable showModal = false;

    @observable isEdit = false;

    @observable previousPlace = -1;
    

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


}
