import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import UserFields from '../fragments/UserFields';
import PasswordFields from '../fragments/PasswordFields';
import PageMessageBox from '../fragments/PageMessageBox';

import {
  doAjax,
  doAuthenticatedAjax,
  checkIsAuthenticated,
  appendQueryString,
  getQueryParam,
  setLoggedInAttributes,
  resetLoggedInAttributesUserData
} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class Account extends React.Component {
  constructor(props) {
    super(props);
    this.updateUser = this.updateUser.bind(this);
    this.parseUpdateUser = this.parseUpdateUser.bind(this);
    this.parseUpdateUserError = this.parseUpdateUserError.bind(this);
    this.parseRequestAdmin = this.parseRequestAdmin.bind(this);
    this.parseRequestAdminError = this.parseRequestAdminError.bind(this);
    this.getAPIKey = this.getAPIKey.bind(this);
    this.parseAPI = this.parseAPI.bind(this);
    this.requestAdmin = this.requestAdmin.bind(this);
    this.parseLoginResponse = this.parseLoginResponse.bind(this);
    this.parseLoginError = this.parseLoginError.bind(this);
    this.sendChangePasswordRequest = this.sendChangePasswordRequest.bind(this);
    this.parseChangePasswordRequest = this.parseChangePasswordRequest.bind(this);
    this.parseChangePasswordRequestError = this.parseChangePasswordRequestError.bind(this);
    this.parseAPIError = this.parseAPIError.bind(this);

    this.state = {
      showUpdateUserMessage: false,
      updateUserMsg: [],
      updateUserClass: "",
      showUpdatePasswordMessage: false,
      updatePasswordMsg: [],
      updatePasswordClass: "",
      showRequestRoleMessage: false,
      requestRoleMsg: [],
      requestRoleClass: "",
      showAPIKeyMessage: false,
      apiKeyMsg: [],
      apiKeyClass: '',
      showLoading: false,
      requestAdminStatus: false,
      requestAdminMessage: "",
      showPasswordChangeMessage: false
    }

  }

  componentDidMount() {
    var passcode = getQueryParam("passcode");
    if (passcode) {
      //add things for logging in and stuff
      doAjax("POST", "/doecode/api/user/login", this.parseLoginResponse, {
        "confirmation_code": passcode
      }, this.parseLoginError);
    } else {
      checkIsAuthenticated();
      userData.setValue("first_name", localStorage.first_name);
      userData.setValue("last_name", localStorage.last_name);
    }
  }

  parseLoginResponse(data) {
    setLoggedInAttributes(data);
    this.setState({showPasswordChangeMessage: true});
  }

  parseLoginError(data) {
    var errorMessage = "";
    data.responseJSON.errors.forEach(function(item) {
      errorMessage += (item + "\n");
    });
    window.location.href = "/doecode/error?message=" + errorMessage;
  }

  sendChangePasswordRequest() {
    var passwordMsg = [];
    if (!userData.getValue("password")) {
      passwordMsg.push('You must enter a password');
    }
    if (!userData.getValue("confirm_password")) {
      passwordMsg.push('You must confirm your password');
    }

    if (passwordMsg.length < 1) {
      doAuthenticatedAjax('POST', '/doecode/api/user/changepassword', this.parseChangePasswordRequest, {
        password: userData.getValue("password"),
        confirm_password: userData.getValue("confirm_password")
      }, this.parseChangePasswordRequestError);
    } else {
      this.setState({showUpdatePasswordMessage: true, updatePasswordMsg: passwordMsg, updatePasswordClass: 'has-error center-text'});
    }
  }

  parseChangePasswordRequest(data) {
    this.setState({
      showUpdatePasswordMessage: true,
      updatePasswordMsg: [
        'Update successful', 'Page will refresh in 3 seconds'
      ],
      updatePasswordClass: 'has-success center-text'
    });
    setTimeout(function() {
      window.location.href = '/doecode/account';
    }, 2000);

  }

  parseChangePasswordRequestError(data) {
    var passwordErrors = data.responseJSON.errors;
    passwordErrors.unshift('Error in updating password:');
    this.setState({showUpdatePasswordMessage: true, updatePasswordMsg: passwordErrors, updatePasswordClass: 'has-error center-text'});
  }

  /*Updating user*/
  updateUser() {
    var usrMsg = [];
    if (!userData.getValue("first_name")) {
      usrMsg.push("You must enter a first name");
    }
    if (!userData.getValue("last_name")) {
      usrMsg.push("You must enter a last name");
    }

    if (usrMsg.length < 1) {
      doAuthenticatedAjax('POST', '/doecode/api/user/update', this.parseUpdateUser, {
        first_name: userData.getValue("first_name"),
        last_name: userData.getValue("last_name")
      }, this.parseUpdateUserError);
    } else {
      this.setState({showUpdateUserMessage: true, updateUserMsg: usrMsg, updateUserClass: 'center-text has-error'});
    }
  }

  parseUpdateUser(data) {
    resetLoggedInAttributesUserData({first_name: userData.getValue("first_name"), last_name: userData.getValue("last_name")});
    this.setState({
      showUpdateUserMessage: true,
      updateUserMsg: [
        'Update successful', 'Page will refresh in 3 seconds'
      ],
      updateUserClass: 'center-text has-success'
    });
    setTimeout(function() {
      window.location.href = '/doecode/account';
    }, 3000);
  }

  parseUpdateUserError(data) {
    var errMessages = data.responseJSON.errors;
    errMessages.unshift('An error has occurred in updating your user data');
    this.setState({showUpdateUserMessage: true, updateUserMsg: usrMsg, updateUserClass: 'center-text has-error'});
  }

  /*Request admin Privilege*/
  requestAdmin() {
    doAuthenticatedAjax('GET', "/doecode/api/user/requestadmin", this.parseRequestAdmin, null, this.parseRequestAdminError);
  }

  parseRequestAdmin(data) {
    this.setState({showRequestRoleMessage: true, requestRoleMsg: ['Admin request success'], requestRoleClass: 'center-text has-success'});
  }

  parseRequestAdminError(data) {
    this.setState({showRequestRoleMessage: true, requestRoleMsg: ['An error has occurred in requesting an administrative role'], requestRoleClass: 'center-text has-error'});
  }

  /*Getting API Key*/
  getAPIKey() {
    doAuthenticatedAjax('GET', "/doecode/api/user/newapikey", this.parseAPI, null, this.parseAPIError);
  }

  parseAPI(data) {
    var apiKeyMessage = ['New API Key', data.apiKey];
    this.setState({showAPIKeyMessage: true, apiKeyMsg: apiKeyMessage, apiKeyClass: 'center-text has-success'});
  }

  parseAPIError(data) {
    this.setState({showAPIKeyMessage: true, apiKeyMsg: ['An error has occurred in generating your new api key'], apiKeyClass: 'center-text has-error'});
  }

  render() {
    const accountSavePass = <span>
      <span className="fa fa-floppy-o"></span>&nbsp; Save Password</span>;

    const accountSaveUser = <span>
      <span className="fa fa-floppy-o"></span>&nbsp; Save User</span>;

    const user_site = localStorage.user_site;
    const roles = localStorage.roles;

    var showAdminRole = (user_site && localStorage.user_site != 'CONTR' && roles.indexOf(user_site) < 0);

    return (
      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12">
          <br/>
          <div className='row'>
            <div className='col-xs-12'>
              <div className='row'>
                <div className='col-md-3'></div>
                <div className='col-md-6 col-xs-12'>
                  <PageMessageBox classValue='has-error center-text' showMessage={this.state.showPasswordChangeMessage} items={['Please Change Your Password']} keyPrefix='psswd'/>
                </div>
                <div className='col-md-3'></div>
              </div>
              <div className="panel panel-default">
                <div className="panel-heading account-panel-header center-text">Password</div>
                <div className="panel-body account-panel-body">
                  <div className='row'>
                    <div className='col-md-1'></div>
                    <div className='col-md-11'>
                      <div>
                        <PageMessageBox classValue={this.state.updatePasswordClass} showMessage={this.state.showUpdatePasswordMessage} items={this.state.updatePasswordMsg} keyPrefix='password'/>
                        <PasswordFields/>
                      </div>
                    </div>
                  </div>
                  <br/>
                  <div className='row center-text'>
                    <div className='col-xs-12'>
                      <button type='button' className='btn btn-success btn-lg' onClick={this.sendChangePasswordRequest}>Change Password</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='row'>
            <div className='col-xs-12'>
              <div className="panel panel-default">
                <div className="panel-heading account-panel-header center-text">User Information</div>
                <div className="panel-body account-panel-body center-text">
                  <div className='row'>
                    <div className='col-md-2'></div>
                    <div className='col-md-8'>
                      <div>
                        <PageMessageBox classValue={this.state.updateUserClass} showMessage={this.state.showUpdateUserMessage} items={this.state.updateUserMsg} keyPrefix='user'/>
                        <UserFields show_email={false}/>
                      </div>
                    </div>
                    <div className='col-md-2'></div>
                  </div>
                  <br/>
                  <div className='row'>
                    <div className='col-xs-12'>
                      <button type='button' className='btn btn-success btn-lg' onClick={this.updateUser}>Update User</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            {showAdminRole && <div className="col-md-6 col-xs-12">
              <div className="panel panel-default">
                <div className="panel-heading account-panel-header center-text">Administrative Role</div>
                <div className="panel-body account-panel-body center-text">
                  <div>
                    <PageMessageBox classValue={this.state.requestRoleClass} showMessage={this.state.showRequestRoleMessage} items={this.state.requestRoleMsg} keyPrefix='admin'/>
                  </div>
                  <button type="button" className="btn btn-lg btn-success" onClick={this.requestAdmin}>
                    <span className="fa fa-unlock-alt"></span>
                    Request Role
                  </button>
                </div>
              </div>
            </div>}

            <div className='col-md-6 col-xs-12'>
              <div className="panel panel-default">
                <div className="panel-heading account-panel-header center-text">Generate New API Key</div>
                <div className="panel-body center-text">
                  <div>
                    <PageMessageBox classValue={this.state.apiKeyClass} showMessage={this.state.showAPIKeyMessage} items={this.state.apiKeyMsg} keyPrefix='apikey'/>
                  </div>
                  <button type="button" className='btn btn-lg btn-success' onClick={this.getAPIKey}>
                    <span className='fa fa-key'></span>&nbsp;Generate</button>
                  <br/>
                  <br/>
                  <PageMessageBox classValue="center-text has-error" showMessage={true} items={['You will need to log out after generating a new API key']} keyPrefix='password'/>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='col-md-3'></div>
      </div>

    );

  }
}
