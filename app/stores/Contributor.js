import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class Contributor extends BaseData {
    constructor() {

    	const  defaultContributor = {
                first_name: '',
                middle_name: '',
                last_name: '',
                email: '',
                orcid: '',
                affiliations: '',
                contributor_type: '',
                id: ''
        }



    	const defaultContributorInfoSchema = {

    		   	"first_name": {required:true, completed:false, validations: [""], error: ''},
    	        "middle_name": {required:false, completed:false, validations: [], error: ''},
    	        "last_name": {required:true, completed:false, validations: [], error: ''},
    	        "email": {required:false, completed:false, validations: ["Email"], error: ''},
    	        "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
    	        "affiliations" : {required:false, completed:false, validations: [], error: ''},
    	        "contributor_type" : {required:true, completed:false, validations: [], error: ''}


       }
    	const props = {fieldMap: MetadataStore.contributor, infoSchema: MetadataStore.contributorInfoSchema, fieldMapSnapshot: defaultContributor, infoSchemaSnapshot: defaultContributorInfoSchema};
        super(props);

    }
}
