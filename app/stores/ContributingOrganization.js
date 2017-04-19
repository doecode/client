import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class ContributingOrganization extends BaseData {
    constructor() {

      const defaultContributingOrganization = {
              organization_name: '',
              email: '',
              orcid: '',
              contributor_type: '',
              id: ''
      }

      const defaultContributingOrganizationSchema = {

            "organization_name:": {required:true, completed:false, validations: [""], error: ''},
             "email": {required:false, completed:false, validations: ["Email"], error: ''},
             "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
             "contributor_type" : {required:true, completed:false, validations: [], error: ''}
        }

    	const props = {fieldMap: MetadataStore.contributingOrganization, infoSchema: MetadataStore.contributingOrganizationInfoSchema, fieldMapSnapshot: defaultContributingOrganization, infoSchemaSnapshot: defaultContributingOrganizationSchema};
      super(props);

    }
}
