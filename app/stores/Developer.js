import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class Developer extends BaseData {
    constructor() {

    	const defaultDeveloper = {
                first_name: '',
                middle_name: '',
                last_name: '',
                email: '',
                orcid: '',
                affiliations: [],
                id: ''
            }


    	const defaultDeveloperInfoSchema = {

    		   	"first_name": {required:true, completed:false, ever_completed:false, validations: [""], error: ''},
    	        "middle_name": {required:false, completed:false, ever_completed:false, validations: [], error: ''},
    	        "last_name": {required:true, completed:false, ever_completed:false, validations: [], error: ''},
    	        "email": {required:false, completed:false, ever_completed:false, validations: ["email"], error: ''},
    	        "orcid": {required:false, completed:false, ever_completed:false, validations: ["Orcid"], error: ''},
    	        "affiliations" : {required:false, completed:false, ever_completed:false, validations: [], error: ''},

       }
    	const props = {fieldMap: MetadataStore.developer, infoSchema: MetadataStore.developerInfoSchema, fieldMapSnapshot: defaultDeveloper, infoSchemaSnapshot: defaultDeveloperInfoSchema};
      super(props);

    }
}
