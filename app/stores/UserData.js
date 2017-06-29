import BaseData from './BaseData';
import MetadataStore from './MetadataStore';

export default class UserData extends BaseData {
    constructor() {

      const defaultUser = {
   		   	  email : '',
   		   	  password: '',
   		   	  confirm_password: ''
      }

      const defaultUserSchema = {

            "email": {required:true, completed:false, validations: ["Email"], error: ''},
             "password" : {required:true, completed:false, validations: [], error: ''},
             "confirm_password" : {required:true, completed:false, validations: [""], error: ''}
        }

    	const props = {fieldMap: MetadataStore.user, infoSchema: MetadataStore.userSchema, fieldMapSnapshot: defaultUser, infoSchemaSnapshot: defaultUserSchema};
      super(props);

    }
}