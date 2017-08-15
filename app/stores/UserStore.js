import {observable} from 'mobx';


class UserStore {

	constructor() {

    this.defaultUser = {
          firstName:'',
          lastName:'',
          email : '',
          password: '',
          confirm_password: '',
          contractNumber:''
    }

    this.defaultUserSchema = {
         "firstName":{required:true, completed:false, validations: [], error: ''},
            "lastName":{required:true, completed:false, validations: [], error: ''},
          "email": {required:true, completed:false, validations: ["Email"], error: ''},
          "password" : {required:true, completed:false, validations: [], error: ''},
          "confirm_password" : {required:true, completed:false, validations: ["PWMatch"], error: ''},
          "contractNumber":{required:false, completed:false, validations: [], error: ''}
      }

		this.user = observable(this.defaultUser);
    this.userSchema = observable(this.defaultUserSchema);

	}


}

const singleton = new UserStore();
export default singleton;
