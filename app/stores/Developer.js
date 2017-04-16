import BaseData from './BaseData';
import {observable} from 'mobx';

export default class Developer extends BaseData {
    constructor() {
    	const developerStore = new DeveloperStore();
    	const props = {fieldMap: developerStore.developer, infoSchema: developerStore.developerInfoSchema};
      super(props);

    }
}

class DeveloperStore {
    @observable developer = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            orcid: '',
            affiliations: '',
            place: -1,
            id: ''
        }

    @observable developerInfoSchema = {

		   	"first_name": {required:true, completed:false, validations: [""], error: ''},
	        "middle_name": {required:false, completed:false, validations: [], error: ''},
	        "last_name": {required:true, completed:false, validations: [], error: ''},
	        "email": {required:false, completed:false, validations: ["Email"], error: ''},
	        "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
	        "affiliations" : {required:false, completed:false, validations: [], error: ''},

   }
}
