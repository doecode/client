import BaseData from './BaseData';
import {observable} from 'mobx';

export default class Contributor extends BaseData {
    constructor(props) {
    	const contributorStore = new ContributorStore();
    	const mProps = {fieldMap: contributorStore.contributor, infoSchema: contributorStore.contributorInfoSchema, parentInfo: props.parentInfo, parentArray: props.parentArray, isChild: true, id: props.id};
        super(mProps);
    	
    }
}

class ContributorStore {
    @observable contributor = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            orcid: '',
            affiliations: '',
            contributor_type: '',
            place: -1,
            id: ''
    }
    
    @observable contributorInfoSchema = {

		   	"first_name": {required:true, completed:false, validations: [""], error: ''},
	        "middle_name": {required:false, completed:false, validations: [], error: ''},
	        "last_name": {required:true, completed:false, validations: [], error: ''},
	        "email": {required:false, completed:false, validations: ["Email"], error: ''},
	        "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
	        "affiliations" : {required:false, completed:false, validations: [], error: ''},
	        "contributor_type" : {required:false, completed:false, validations: [], error: ''}
	        

   }
}