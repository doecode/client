import BaseData from './BaseData';
import {observable} from 'mobx';
import MetadataStore from './MetadataStore';

export default class Developer extends BaseData {
    constructor() {
    	
    	const defaultDeveloper = {
                first_name: '',
                middle_name: '',
                last_name: '',
                email: '',
                orcid: '',
                affiliations: '',
                place: -1,
                id: ''
            }
        

    	const defaultDeveloperInfoSchema = {

    		   	"first_name": {required:true, completed:false, validations: [""], error: ''},
    	        "middle_name": {required:false, completed:false, validations: [], error: ''},
    	        "last_name": {required:true, completed:false, validations: [], error: ''},
    	        "email": {required:false, completed:false, validations: ["Email"], error: ''},
    	        "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
    	        "affiliations" : {required:false, completed:false, validations: [], error: ''},

       }
    	const props = {fieldMap: MetadataStore.developer, infoSchema: MetadataStore.developerInfoSchema, fieldMapSnapshot: defaultDeveloper, infoSchemaSnapshot: defaultDeveloperInfoSchema};
      super(props);

    }
}

