import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class ContributingOrganization extends BaseData {
    constructor() {

      const defaultContributingOrganization = {
   		   	  DOE : true,
              organization_name: '',
              contributor_type: '',
              id: ''
      }

      const defaultContributingOrganizationSchema = {
        "organization_name": {required:true, completed:false, ever_completed:false, validations: [""], error: ''},
        "contributor_type" : {required:true, completed:false, ever_completed:false, validations: [], error: ''}
      }

    	const props = {fieldMap: MetadataStore.contributingOrganization, infoSchema: MetadataStore.contributingOrganizationInfoSchema, fieldMapSnapshot: defaultContributingOrganization, infoSchemaSnapshot: defaultContributingOrganizationSchema};
      super(props);

    }
}
