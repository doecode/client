import BaseData from './BaseData';
import UserStore from './UserStore';

export default class UserData extends BaseData {
    constructor() {

      const defaultUser = {
          first_name:'',
          last_name:'',
   		   	  email : '',
   		   	  password: '',
   		   	  confirm_password: '',
            pending_role: '',
            contractNumber:''
      }

      const defaultUserSchema = {
            "first_name":{required:true, completed:false, validations: [], error: ''},
            "last_name":{required:true, completed:false, validations: [], error: ''},
            "email": {required:true, completed:false, validations: ["Email"], error: ''},
             "password" : {required:true, completed:false, validations: [], error: ''},
             "confirm_password" : {required:true, completed:false, validations: [""], error: ''},
             "contractNumber":{required:false, completed:false, validations: [], error: ''},
        }

    	const props = {fieldMap: UserStore.user, infoSchema: UserStore.userSchema, fieldMapSnapshot: UserStore.defaultUser, infoSchemaSnapshot: UserStore.defaultUserSchema};
      super(props);

    }
}
