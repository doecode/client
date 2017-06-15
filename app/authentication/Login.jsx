import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.check = this.check.bind(this);
		this.parseCheck = this.parseCheck.bind(this);
		this.register = this.register.bind(this);
		this.parseRegister = this.parseRegister.bind(this);
		this.login = this.login.bind(this);
		this.parseLoginResponse = this.parseLoginResponse.bind(this);
		this.parseError = this.parseError.bind(this);

	}


	check() {
		doAuthenticatedAjax('GET', "/api/authentication/check", this.parseCheck, undefined, this.parseError);
	}

	parseCheck() {
		console.log("Checked")
	}

	login() {
		const obj = {"email" : "doecodedev3@mailinator.com", "password" : "password"};
    	
		doAjax("POST", "/api/user/login", this.parseLoginResponse, obj, this.parseError);
	    /*$.ajax({
	        url: "/api/user/login",
	        cache: false,
	        method: "POST",
            dataType: 'json',
            data: JSON.stringify(obj),
	        contentType: "application/json; charset=utf-8",
	        success: this.parseLoginResponse,
	        error: this.parseError
	      });*/
    	
	}

	parseLoginResponse(data) {
		localStorage.xsrfToken = data.xsrfToken;
		console.log("Logged in");
	}
	
	register() {
		const obj = {"email" : "doecodedev3@mailinator.com", "password" : "password", "confirm_password": "password"};
    	
	    $.ajax({
	        url: "/api/user/register",
	        cache: false,
	        method: "POST",
            dataType: 'json',
            data: JSON.stringify(obj),
	        contentType: "application/json; charset=utf-8",
	        success: this.parseRegister,
	        error: this.parseError
	      });
    	
	}
	
	parseRegister(data) {
		console.log("Api Key is: " + data.apiKey);
	}

	parseError() {
		console.log("I'm being called");
	}

	render() {

		return(
		<div className="container">

		<input type="hidden" name="rememberMe" value="false"/>

	    <div className="form-group form-group-sm row">
	    <input type="text" name="username"/>
	    </div>

	    <div className="form-group form-group-sm row">
	    <input type="password" name="password"/>
	    </div>


		<button type="button" className="btn btn-primary btn-lg" onClick={this.login}>
		Login
		</button>

		<button type="button" className="btn btn-lg" onClick={this.check}>
		Check
		</button>
		
		<button type="button" className="btn btn-lg btn-success" onClick={this.register}>
		Register
		</button>

		</div>);

	}
}
