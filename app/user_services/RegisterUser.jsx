import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import SignupBadRequest from '../fragments/SignupBadRequest';
import SuccessfulSignup from '../fragments/SuccessfulSignup';
import UserFields from '../fragments/UserFields';
import PasswordFields from '../fragments/PasswordFields';
import PasswordRules from './PasswordRules';

import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam, checkPassword} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class RegisterUser extends React.Component {
  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
    this.parseRegister = this.parseRegister.bind(this);
    this.parseError = this.parseError.bind(this);
    this.confirmAndCheckPassword = this.confirmAndCheckPassword.bind(this);
    this.userDataToJSON = this.userDataToJSON.bind(this);
    this.state = {
      signupSuccess: false,
      badRequest: false,
      badRequestErrors: [],
      longEnough: false,
      hasSpecial: false,
      hasNumber: false,
      upperAndLower: false,
      containsName: false,
      matches: false
    }
  }

  register() {
    doAjax('POST', "/doecode/api/user/register", this.parseRegister, userData.getData(), this.parseError);
  }

  parseRegister(data) {
    this.setState({"signupSuccess": true});
  }

  parseError(data) {
    var responseText = JSON.parse(data.responseText);
    var errorMessages = [];
    var keyIndex = 0;
    //Now, we determine what's going on
    if (data.status == 400) {
      responseText.errors.forEach(function(item) {
        errorMessages.push({
          error: item,
          key: (keyIndex + "-badRequest")
        });
        keyIndex++;
        //Custom messages to go after ones we may or may not get
        if (item == 'An account with this email address already exists.') {
          errorMessages.push({
            customError: true,
            error: (
              <label className='control-label'>If this is your account, you can&nbsp;
                <a href='/doecode/login'>log into it</a>&nbsp;or if you have&nbsp;
                <a href='/doecode/forgot-password'>forgotten your password</a>, you can request a password reset link</label>
            ),
            key: (keyIndex + "-badRequest")
          });
          keyIndex++;
        }

      });
    } else {
      errorMessages.push({error: "A server error has occurred that is preventing registration from functioning properly.", key: "0-badRequest"});
    }
    this.setState({"badRequest": true, "badRequestErrors": errorMessages});
  }

  userDataToJSON() {
    return {
      password: userData.getValue("password"),
      email: (localStorage.user_email)
        ? localStorage.user_email
        : userData.getValue("email"),
      confirm_password: userData.getValue("confirm_password")
    };
  }

  confirmAndCheckPassword() {
    var newState = checkPassword(this.userDataToJSON());
    newState.validEmail = validation.validateEmail((localStorage.user_email)
      ? localStorage.user_email
      : userData.getValue("email")) === "";
    this.setState(newState);
  }

  render() {
    return (
      <div className="row not-so-wide-row">
        <div className='col-md-1'></div>
        <div className='col-md-10 col-xs-12'>
          {/*SUCCESSFUL SIGNUP*/}
          {this.state.signupSuccess && <div>
            <SuccessfulSignup/>
          </div>}
          {/*SHOW THE REGISTRATION STUFF*/}
          {!this.state.signupSuccess && <div>
            <div className='row'>
              <div className='col-md-2'></div>
              <div className="left-text col-md-8 col-xs-12 no-col-padding-left">
                <h2 className="static-content-title">Create New Account</h2>
                <br/>
              </div>
              <div className='col-md-2'></div>
            </div>
            {/*ERROR MESSAGE*/}
            {this.state.badRequest && <div className='row'>
              <div className="col-md-2"></div>
              <div className="col-md-3 col-xs-12 no-col-padding-left">
                <br/>
                <SignupBadRequest errors={this.state.badRequestErrors}/>
                <br/>
              </div>
              <div className='col-md-7'></div>
            </div>}
            <div className='row'>
              <div className='col-md-2'></div>
              <div className='no-col-padding-left no-col-padding-right col-md-8 col-xs-12 register-text'>
                To create an account, enter your first and last name, email address and password below. If you are an employee at a DOE National Laboratory, please register using your official .gov email address. For all other users, you will be asked to enter your current DOE award/contract number, which can be found in your DOE award package. DOE CODE will validate the number automatically.
              </div>
              <div className='col-md-2'></div>
            </div>
            <br/>
            <div className='row signin-page-container'>
              <div className='col-md-1'></div>
              <div className='col-md-10 col-xs-12'>
                <div className='row'>
                  {/*User Fields*/}
                  <div className='col-md-7 col-xs-12'>
                    <div className='row'>
                      <div className='col-xs-12'>
                        <UserFields show_email={true} checkPasswordCallback={this.confirmAndCheckPassword}/>
                      </div>
                    </div>
                    <div className='row'>
                      <div className='col-xs-12'>
                        <PasswordFields checkPasswordCallback={this.confirmAndCheckPassword}/>
                      </div>
                    </div>
                  </div>
                  {/*Password Rules*/}
                  <div className='col-md-5 col-xs-12'>
                    <PasswordRules longEnough={this.state.longEnough} hasSpecial={this.state.hasSpecial} hasNumber={this.state.hasNumber} containsName={this.state.containsName} upperAndLower={this.state.upperAndLower} matches={this.state.matches}/>
                  </div>
                </div>
              </div>
              <div className='col-md-1'></div>
            </div>
            <br/>
            <div className='row'>
              <div className='col-md-2'></div>
              <div className='col-md-8 col-xs-12 right-text'>
                <button type='button' className='pure-button button-success signin-buttons' onClick={this.register}>
                  Create Account
                </button>
              </div>
              <div className='col-md-2'></div>
            </div>
          </div>}
        </div>
        <div className='col-md-1'></div>
      </div>
    );

  }
}
