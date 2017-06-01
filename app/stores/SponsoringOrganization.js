import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class SponsoringOrganization extends BaseData {
    constructor() {

      const defaultSponsoringOrganization = {
		   DOE : true,
           organization_name: '',
           primary_award: '',
           award_numbers: '',
           fwp_numbers: '',
           br_codes: '',
           id: ''
   }

      const defaultSponsoringOrganizationSchema = {


              "organization_name": {required:true, completed:false, validations: [], error: ''},
              "primary_award" : {required:true, completed:false, validations: ["Award"], error: ''},
              "award_numbers" : {required:false, completed:false, validations: [], error: ''},
              "br_codes" : {required:false, completed:false, validations: [], error: ''},
              "fwp_numbers" : {required:false, completed:false, validations: [], error: ''},
         }

    	const props = {fieldMap: MetadataStore.sponsoringOrganization, infoSchema: MetadataStore.sponsoringOrganizationInfoSchema, fieldMapSnapshot: defaultSponsoringOrganization, infoSchemaSnapshot: defaultSponsoringOrganizationSchema};
      super(props);

    }
}
