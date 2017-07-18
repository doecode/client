import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';

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
		doAjax("POST", "/api/user/login", this.parseLoginResponse, this.state, this.parseError);
    	
	}

	parseLoginResponse(data) {
		localStorage.xsrfToken = data.xsrfToken;
		window.location.href = "/projects";
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
		
	    <div className="form-group-xs row">
	    <div className="col-xs-4">
		<label className="control-label">
        Email
        </label>
        <div>
	    <input className="form-control" type="text" name="email" value={this.state.email} onChange={this.changeEmail}/>
	    </div>
	    </div>
	    </div>

	    <div className="form-group-xs row">
	    <div className="col-xs-4">
		<label className="control-label">
        Password
        </label>
	    
	    <div>
	    <input className="form-control" type="password" name="password" value={this.state.password} onChange={this.changePassword}/>
	    </div>
	    </div>
	    </div>


		<button type="button" className="btn btn-primary btn-lg" onClick={this.login}>
		Login
		</button>


		</div>);

	}
}
