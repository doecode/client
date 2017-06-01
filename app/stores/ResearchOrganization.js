import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class ResearchOrganization extends BaseData {
    constructor() {

      const defaultResearchOrganization = {
   		   	  DOE : true,    	
              organization_name: '',
              id: ''
      }

      const defaultResearchOrganizationSchema = {

            "organization_name" : {required:true, completed:false, validations: [""], error: ''},
        }

    	const props = {fieldMap: MetadataStore.researchOrganization, infoSchema: MetadataStore.researchOrganizationInfoSchema, fieldMapSnapshot: defaultResearchOrganization, infoSchemaSnapshot: defaultResearchOrganizationSchema};
      super(props);

    }
}
