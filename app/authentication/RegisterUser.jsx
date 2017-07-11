import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';

const userData = new UserData();

export default class RegisterUser extends React.Component {
	constructor(props) {
		super(props);
		this.register = this.register.bind(this);
		this.parseRegister = this.parseRegister.bind(this);
		this.parseError = this.parseError.bind(this);
		this.checkPassword = this.checkPassword.bind(this);
		this.updateEmailAndCheckPassword = this.updateEmailAndCheckPassword.bind(this);
		this.updatePasswordAndCheckPassword = this.updatePasswordAndCheckPassword.bind(this);
		this.updateConfirmAndCheckPassword = this.updateConfirmAndCheckPassword.bind(this);
		
		this.state = {longEnough : false, hasSpecial : false, hasNumber: false,  upperAndLower: false, containsName: false, matches: false}

	}
	
	updateEmailAndCheckPassword(event) {
		userData.setValue("email", event.target.value);
		this.checkPassword();
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
		newState.containsName = password !== '' && password.indexOf(email) > -1;
		newState.matches = password !== '' && (password === confirm);
		this.setState(newState);
		
		
		
		
		
	}


	register() {
    	doAjax('POST',"/api/user/register", this.parseRegister, userData.getData(), this.parseError)    	
	}
	
	parseRegister(data) {
		console.log("Api Key is: " + data.apiKey);
	}

	parseError() {
		console.log("I'm being called");
	}
	

	render() {
		let status = 
        <div>
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
    </div>;          
		return(
		<div className="container-fluid form-horizontal">
		
		<div className="col-md-8">
    	<UserField field="email" label="Email Address" elementType="input" handleChange={this.updateEmailAndCheckPassword}/>
    	<UserField noval={true} field="password" label="Password" elementType="password" handleChange={this.updatePasswordAndCheckPassword} />
    	<UserField noval={true} field="confirm_password" label="Confirm Password" elementType="password" handleChange={this.updateConfirmAndCheckPassword}/>	
    		<button type="button" className="btn btn-lg btn-success" onClick={this.register}>
    		Register
    		</button>
    	</div>
    	
    	<div className="col-md-4">
        {status}
          
        
        </div>
    	
		


		</div>);

	}
}
