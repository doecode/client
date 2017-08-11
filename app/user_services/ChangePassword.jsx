import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class EditUser extends React.Component {
	constructor(props) {
		super(props);
    this.changePassword = this.changePassword.bind(this);
    this.parseChangePassword = this.parseChangePassword.bind(this);
		this.parseLoad = this.parseLoad.bind(this);
		this.checkPassword = this.checkPassword.bind(this);
		this.updatePasswordAndCheckPassword = this.updatePasswordAndCheckPassword.bind(this);
		this.updateConfirmAndCheckPassword = this.updateConfirmAndCheckPassword.bind(this);

		this.state = {longEnough : false, hasSpecial : false, hasNumber: false,  upperAndLower: false, containsName: false, matches: false, success: false}

	}


  parseLoad(data) {
     userData.setValue("email", data.email);
  }

	updatePasswordAndCheckPassword(event) {
		userData.setValue("password", event.target.value);
		this.checkPassword();
	}

	updateConfirmAndCheckPassword(event) {
		userData.setValue("confirm_password", event.target.value);
		this.checkPassword();
	}

	checkPassword() {
		const password = userData.getValue("password")
		const email = userData.getValue("email");
		const confirm = userData.getValue("confirm_password");
		const minLength = 8;
		const specialCharacterRegex = /[^a-zA-Z\d\s]/g;
		const lowerRegex = /[a-z]/g;
		const upperRegex = /[A-Z]/g;
		const numberRegex = /[\d]/g;
		let newState = Object.assign({},this.state);

		newState.longEnough = password.length >= minLength;
		newState.hasSpecial = specialCharacterRegex.test(password);
		newState.hasNumber = numberRegex.test(password);
		newState.upperAndLower = upperRegex.test(password) && lowerRegex.test(password);
		newState.containsName = password.indexOf(email) > -1;
		newState.matches = password !== '' && (password === confirm);
		this.setState(newState);
    console.log(newState);

	}


  changePassword() {
      doAuthenticatedAjax('POST',"/doecode/api/user/changepassword", this.parseRegister, userData.getData())
  }

  parseChangePassword(data) {
        console.log(data);
  }

	render() {

		const validPassword = this.state.longEnough && this.state.hasSpecial && this.state.hasNumber && this.state.upperAndLower && this.state.matches &&
		!this.state.containsName;

		const content =
                <div className="row not-so-wide-row">
                    <div className="col-md-3"> </div>

                    <div className="col-md-3 col-xs-12">
                        <UserField noExtraLabelText noval field="password" label="New Password" elementType="password" handleChange={this.updatePasswordAndCheckPassword} />
                        <UserField noExtraLabelText noval field="confirm_password" label="Confirm New Password" elementType="password" handleChange={this.updateConfirmAndCheckPassword}/>
                        <button type="button" className="btn btn-lg btn-success" disabled={!validPassword} onClick={this.changePassword}>
                            Change Password
                        </button>
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <p>All fields are required.</p>
                        <p>Passwords must:</p>
                        <ul>
                            <li>Be at least 8 characters long. {this.state.longEnough &&<span className="glyphicon glyphicon-ok green"></span> }</li>
                            <li>Contain at least one special character. {this.state.hasSpecial &&<span className="glyphicon glyphicon-ok green"></span> }  </li>
                            <li>Contain at least one number character. {this.state.hasNumber &&<span className="glyphicon glyphicon-ok green"></span> } </li>
                            <li>Not contain the login name. {!this.state.containsName &&<span className="glyphicon glyphicon-ok green"></span> }</li>
                            <li>Contain a mixture of upper and lowercase letters. {this.state.upperAndLower &&<span className="glyphicon glyphicon-ok green"></span> } </li>
                            <li>Password must match Confirm Password. {this.state.matches &&<span className="glyphicon glyphicon-ok green"></span> } </li>
                        </ul>
                    </div>
                    <div className="col-md-3"> </div>
                </div>;
                
                return(
                <div className="container-fluid form-horizontal">

                    {content}

                </div>);

	}
}
