import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class SponsoringOrganization extends BaseData {
    constructor() {

      const defaultSponsoringOrganization = {
		   DOE : true,
           organization_name: '',
           primary_award: '',
           award_numbers: [],
           fwp_numbers: [],
           br_codes: [],
           id: ''
   }

      const defaultSponsoringOrganizationSchema = {
              "organization_name": {required:true, completed:false, ever_completed:false, validations: [], error: ''},
              "primary_award" : {required:true, completed:false, ever_completed:false, validations: ["awardnumber"], error: ''},
              "award_numbers" : {required:false, completed:false, ever_completed:false, validations: [], error: ''},
              "br_codes" : {required:false, completed:false, ever_completed:false, validations: ["BR"], error: ''},
              "fwp_numbers" : {required:false, completed:false, ever_completed:false, validations: [], error: ''},
         }

     /*if (!MetadataStore.sponsoringOrganization.DOE) {
       MetadataStore.sponsoringOrganizationInfoSchema.primary_award.validations = [];
       MetadataStore.sponsoringOrganizationInfoSchema.primary_award.required = false;

     }*/

    	const props = {fieldMap: MetadataStore.sponsoringOrganization, infoSchema: MetadataStore.sponsoringOrganizationInfoSchema, fieldMapSnapshot: defaultSponsoringOrganization, infoSchemaSnapshot: defaultSponsoringOrganizationSchema};
      super(props);

    }

    static loadValues() {
      super.loadValues();

      if (!this.getValue("DOE")) {
        this.fieldInfo["primary_award"].required = false;
        this.fieldInfo["primary_award"].validations = [];
      }
    }
}
