import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
const userData = new UserData();

export default class Login extends React.Component {
	constructor(props) {
		super(props);
		this.login = this.login.bind(this);
		this.parseLoginResponse = this.parseLoginResponse.bind(this);
		this.parseError = this.parseError.bind(this);
		this.changeEmail = this.changeEmail.bind(this);
		this.changePassword = this.changePassword.bind(this);

		this.state = {"email" : "", "password" : ""}

	}

	login() {
		console.log(userData.getData());
		doAjax("POST", "/doecode/api/user/login", this.parseLoginResponse, userData.getData());


	}

parseLoginResponse(data) {
    localStorage.xsrfToken = data.xsrfToken;
    if (window.sessionStorage.lastLocation) {
        let url = window.sessionStorage.lastLocation;
        window.sessionStorage.lastLocation = "";
        window.location.href = url;
    } else {
        window.location.href = "/doecode/projects";
    }

}

	parseError() {
		console.log("I'm being called");
	}

	changeEmail(event) {
		this.setState({"email" : event.target.value});
	}

	changePassword(event) {
		this.setState({"password": event.target.value});
	}

	render() {

		return(
		<div className="container-fluid form-horizontal">

			<UserField noval={true} field="email" label="Email Address" elementType="input"/>
    	<UserField noval={true} field="password" label="Password" elementType="password"/>


		<button type="button" className="btn btn-primary btn-lg" onClick={this.login}>
		Login
		</button>


		</div>);

	}
}
