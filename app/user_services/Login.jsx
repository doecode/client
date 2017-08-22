import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import moment from 'moment';
const userData = new UserData();

export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.parseLoginResponse = this.parseLoginResponse.bind(this);
    this.parseError = this.parseError.bind(this);
    this.triggerLogin = this.triggerLogin.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.state = {
      "email": "",
      "password": "",
      "hasError": false,
      "errorMsg": ""
    }
  }

  login() {
    doAjax("POST", "/doecode/api/user/login", this.parseLoginResponse, userData.getData(), this.parseError);
  }

  register() {
    window.location.href = '/doecode/register';
  }

  parseLoginResponse(data) {
    localStorage.xsrfToken = data.xsrfToken;
    localStorage.user_email = data.email;
    localStorage.first_name = data.first_name;
    localStorage.last_name = data.last_name;
    localStorage.token_expiration = moment().add(30, 'minutes').format("YYYY-MM-DD HH:mm");

    if (window.sessionStorage.lastLocation) {
      let url = window.sessionStorage.lastLocation;
      window.sessionStorage.lastLocation = "";
      window.location.href = url;
    } else {
      window.location.href = "/doecode/projects";
    }
  }

  triggerLogin(event) {
    if (event.key === 'Enter') {
      this.login();
    }
  }

  parseError(data) {
    this.setState({"hasError": true, "errorMsg": "Incorrect Username/Password"});
  }

  forgotPassword() {
    window.location.href='/doecode/forgot-password'
  }

  render() {

    return (
      <div className="row not-so-wide-row">
        <div className="col-md-4"></div>
        <div className="col-md-4 col-xs-12 ">
          <div className='center-text'>
            <br/>
            <h2 className="static-content-title">Login</h2>
            <br/> {this.state.hasError && <span className="error-color">
              <label>{this.state.errorMsg}</label>
            </span>}
          </div>
          <br/>
          <div className='form-horizontal large-control-label center-text'>
            <UserField noval={true} field="email" label="Email Address" elementType="input" inputStyle=" input-lg " keypressMethod={this.triggerLogin}/>
            <UserField noval={true} field="password" label="Password" elementType="password" inputStyle=" input-lg " keypressMethod={this.triggerLogin}/>
            <br/>
            <button type="button" className="btn btn-primary btn-lg" onClick={this.login}>Sign In</button>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <button type="button" className="btn btn-info btn-lg" onClick={this.forgotPassword}>Forgot Password?</button>
          </div>
          <br/>
          <br/>
          <div className="form-horizontal large-control-label">
            <p>Don't have an account?</p>
            <button type="button" className="btn btn-success btn-lg" onClick={this.register}>Register</button>
          </div>

        </div>
        <div className="col-md-4"></div>
      </div>
    );

  }
}
