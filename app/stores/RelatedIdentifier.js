import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class RelatedIdentifier extends BaseData {
    constructor() {

    	const defaultRelatedIdentifier = {
  		      identifier_type : '',
  		      relation_type : '',
  		      identifier_value : '',
  		      id: ''
      };


    	const defaultRelatedIdentifierInfoSchema = {

   	         "identifier_type": {required:true, completed:false, ever_completed:false, validations: [], error: ''},
   	          "relation_type": {required:true, completed:false, ever_completed:false, validations: [], error: ''},
   	          "identifier_value": {required:true, completed:false, ever_completed:false, validations: [], error: ''}
   	     };

    	const props = {fieldMap: MetadataStore.relatedIdentifier, infoSchema: MetadataStore.relatedIdentifierInfoSchema, fieldMapSnapshot: defaultRelatedIdentifier, infoSchemaSnapshot: defaultRelatedIdentifierInfoSchema};
        super(props);

    }
}
