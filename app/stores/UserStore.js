import {observable} from 'mobx';


class UserStore {

	constructor() {

    this.defaultUser = {
          first_name:'',
          last_name:'',
          email : '',
          password: '',
          confirm_password: '',
          contract_number:'',
					active_state:false,
					roles_list:[]
    }

    this.defaultUserSchema = {
          "first_name":{required:true, completed:false, validations: [], error: ''},
          "last_name":{required:true, completed:false, validations: [], error: ''},
          "email": {required:true, completed:false, validations: ["email"], error: ''},
          "password" : {required:true, completed:false, validations: [], error: ''},
          "confirm_password" : {required:true, completed:false, validations: ["PWMatch"], error: ''},
          "contract_number":{required:false, completed:false, validations: [], error: ''},
					"active_state":{required:true, completed:false, validations:[], error:''},
					"roles_list":{required:false, completed:false, validations:[], error:''}
      }

		this.user = observable(this.defaultUser);
    this.userSchema = observable(this.defaultUserSchema);

	}
}

const singleton = new UserStore();
export default singleton;
