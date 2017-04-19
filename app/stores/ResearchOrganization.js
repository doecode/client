import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class ResearchOrganization extends BaseData {
    constructor() {

      const defaultResearchOrganization = {
              organization_name: '',
              email: '',
              orcid: '',
              id: ''
      }

      const defaultResearchOrganizationSchema = {

            "organization_name" : {required:true, completed:false, validations: [""], error: ''},
             "email": {required:false, completed:false, validations: ["Email"], error: ''},
             "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
        }

    	const props = {fieldMap: MetadataStore.researchOrganization, infoSchema: MetadataStore.researchOrganizationInfoSchema, fieldMapSnapshot: defaultResearchOrganization, infoSchemaSnapshot: defaultResearchOrganizationSchema};
      super(props);

    }
}
