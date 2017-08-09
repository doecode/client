import {observable} from 'mobx';


class UserStore {

	constructor() {

    this.defaultUser = {
          email : '',
          password: '',
          confirm_password: ''
    }

    this.defaultUserSchema = {

          "email": {required:true, completed:false, validations: ["Email"], error: ''},
          "password" : {required:true, completed:false, validations: [], error: ''},
          "confirm_password" : {required:true, completed:false, validations: ["PWMatch"], error: ''}
      }

		this.user = observable(this.defaultUser);
    this.userSchema = observable(this.defaultUserSchema);

	}


}

const singleton = new UserStore();
export default singleton;
