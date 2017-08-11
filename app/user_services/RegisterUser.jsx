import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import SignupBadRequest from '../fragments/SignupBadRequest';
import SuccessfulSignup from '../fragments/SuccessfulSignup';
import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

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


		this.state = {longEnough : false,
                              hasSpecial : false,
                              hasNumber: false,  
                              upperAndLower: false, 
                              containsName: false, 
                              matches: false, 
                              validEmail: false, 
                              signupSuccess: false,
                              badRequest : false,
                              badRequestErrors:[]
                              }

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
		newState.containsName = password.indexOf(email) > -1;
		newState.matches = password !== '' && (password === confirm);
		newState.validEmail = validation.validateEmail(email) === "";
		this.setState(newState);

	}


	register() {
            doAjax('POST',"/doecode/api/user/register", this.parseRegister, userData.getData(), this.parseError)
	}

	parseRegister(data) {
		this.setState({"signupSuccess" : true});
	}

	parseError(data) {
            var errorMessages = [];
            var keyIndex =0;
            console.log(data);
            data.responseJSON.errors.forEach(function(row){
                errorMessages.push({
                    error:row,
                    key:(keyIndex+"-badRequest")
                });
                keyIndex++
            });
		this.setState({"badRequest":true,"badRequestErrors":errorMessages});
	}


	render() {

		const validPassword = this.state.longEnough && this.state.hasSpecial && this.state.hasNumber && this.state.upperAndLower && this.state.matches &&
		!this.state.containsName && this.state.validEmail;
                const emailSmalltext =<span>If you are an employee at a DOE National Laboratory, please register using your official .gov email address.</span>;
                
		let content = null;

		if (this.state.signupSuccess) {
	       	  content =<SuccessfulSignup />;
		} else {
                content =         
                <div className="row not-so-wide-row">
                    <div className="col-md-3"> </div>
                    <div className="col-md-3 col-xs-12">
                        {this.state.badRequest &&
                        <div>    
                            <SignupBadRequest errors={this.state.badRequestErrors}/>
                            <br/>
                        </div>
                         }
                        
                        <UserField field="email" label="Email Address" elementType="input" handleChange={this.updateEmailAndCheckPassword} noExtraLabelText messageNode={emailSmalltext}/>
                        <UserField noval={true} field="password" label="Password" elementType="password" handleChange={this.updatePasswordAndCheckPassword} noExtraLabelText/>
                        <UserField noval={true} field="confirm_password" label="Confirm Password" elementType="password" handleChange={this.updateConfirmAndCheckPassword} noExtraLabelText/>
                        <button type="button" className="btn btn-lg btn-success" disabled={!validPassword} onClick={this.register}>
                            Register
                        </button>
                        <br/>
                        
                    </div>
                    <div className="col-md-3 col-xs-12">
                        <p><strong>All fields are required.</strong></p>
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
                }
                
		return(
		<div className="container-fluid form-horizontal">
                    {content}
		</div>);

	}
}
