import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class SponsoringOrganization extends BaseData {
    constructor() {

      const defaultSponsoringOrganization = {
   		   	  DOE : true,    		  
              organization_name: '',
              email: '',
              orcid: '',
              primary_award: '',
              award_numbers: [],
              id: ''
      }

      const defaultSponsoringOrganizationSchema = {

            "organization_name": {required:true, completed:false, validations: [""], error: ''},
             "email": {required:false, completed:false, validations: ["Email"], error: ''},
             "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
             "primary_award" : {required:true, completed:false, validations: [], error: ''},
             "award_numbers" : {required:false, completed:false, validations: [], error: ''}
        }

    	const props = {fieldMap: MetadataStore.sponsoringOrganization, infoSchema: MetadataStore.sponsoringOrganizationInfoSchema, fieldMapSnapshot: defaultSponsoringOrganization, infoSchemaSnapshot: defaultSponsoringOrganizationSchema};
      super(props);

    }
}
