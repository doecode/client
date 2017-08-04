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
		doAjax("POST", "/doecode/api/user/login", this.parseLoginResponse, userData.getData());
	}
        
        register(){
            window.location.href='/doecode/register';
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
               
                <div className="row not-so-wide-row">
                    <div className="col-md-4"></div>
                    <div className="col-md-4 col-xs-12 center-text">
                        <br/>
                        <br/>
                        <h2 className="static-content-title">Login</h2>
                        <br/>
                        <br/>
                        <div className='form-horizontal large-control-label'>
                            <UserField noval={true} field="email" label="Email Address" elementType="input" inputStyle=" input-lg "/>
                            <UserField noval={true} field="password" label="Password" elementType="password" inputStyle=" input-lg "/>
                            <br/>
                            <br/>
                            <button type="button" className="btn btn-primary btn-lg" onClick={this.login}>
                                Login
                            </button>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <button type="button" className="btn btn-success btn-lg" onClick={this.register}>Register</button>
                        </div>
                        
                    </div>
                    <div className="col-md-4"></div>
                </div>
                );

	}
}
