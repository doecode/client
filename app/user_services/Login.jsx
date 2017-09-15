import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam, setLoggedInAttributes} from '../utils/utils';
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

    setLoggedInAttributes(data);
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
    window.location.href = '/doecode/forgot-password'
  }

  render() {

    return (
      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12 ">
          <div>
            <br/>
            <h2 className="static-content-title">Sign In</h2>
            <br/> {this.state.hasError && <span className="error-color">
              <label>{this.state.errorMsg}</label>
            </span>}
          </div>
          <br/>
          <div className='row signin-page-container'>
            <div className='col-md-1'></div>
            <div className='col-md-6 col-xs-12'>
              <UserField noval={true} field="email" label="Email Address" elementType="input" inputStyle=" " keypressMethod={this.triggerLogin} placeholderText='Email Address'/>
              <UserField noval={true} field="password" label="Password" elementType="password" inputStyle=" " keypressMethod={this.triggerLogin} placeholderText='Password'/>
              <br/>
            </div>
            <div className='col-md-5'></div>
          </div>
          <br/>
          <div className='row'>
            <div className='col-md-1 col-xs-12  signin-buttons-container'>
              <button type='button' className='pure-button signin-buttons'>Forgot Password?</button>
            </div>
            <div className='col-md-8'></div>
            <div className='col-md-2 col-xs-12  signin-buttons-container'>
              <button type='button' className='pure-button signin-buttons'>Create Account</button>
            </div>
            <div className='col-md-1 col-xs-12  signin-buttons-container'>
              <button type='button' className='pure-button button-success signin-buttons'>Sign In</button>
            </div>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    );

  }
}
