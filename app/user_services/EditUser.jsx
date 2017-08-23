import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import UserEditFields from '../fragments/UserEditFields';
import {
  doAjax,
  doAuthenticatedAjax,
  checkIsAuthenticated,
  appendQueryString,
  getQueryParam,
  setLoggedInAttributes
} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class EditUser extends React.Component {
  constructor(props) {
    super(props);
    this.updateUser = this.updateUser.bind(this);
    this.parseUpdateUser = this.parseUpdateUser.bind(this);
    this.parseRequestAdmin = this.parseRequestAdmin.bind(this);
    this.parseRequestAdminError = this.parseRequestAdminError.bind(this);
    this.getAPIKey = this.getAPIKey.bind(this);
    this.parseAPI = this.parseAPI.bind(this);
    this.requestAdmin = this.requestAdmin.bind(this);
    this.parseLoginResponse = this.parseLoginResponse.bind(this);
    this.parseLoginError = this.parseLoginError.bind(this);

    this.state = {
      updateUserSuccess: false,
      apiKeySuccess: false,
      apiKeyValue: "",
      showLoading: false,
      requestAdminStatus: false,
      requestAdminMessage: ""
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
    }
  }

  parseLoginResponse(data) {
    setLoggedInAttributes(data);
    window.location.href = "/doecode/account";
  }

  parseLoginError(data) {
    var errorMessage = "";
    data.responseJSON.errors.forEach(function(item) {
      errorMessage += (item + "\n");
    });
    window.location.href = "/doecode/error?message=" + errorMessage;
  }

  /*Updating user*/
  updateUser() {
    console.log("Updating User");
    //doAuthenticatedAjax('POST', "/doecode/api/user/update", this.parseRegister, userData.getData());
  }

  parseUpdateUser(data) {
    console.log(data);
  }

  /*Request admin Privilege*/
  requestAdmin() {
    doAuthenticatedAjax('GET', "/doecode/api/user/requestadmin", this.parseRequestAdmin, null, this.parseRequestAdminError);
  }

  parseRequestAdmin(data) {
    console.log("REquest success: " + data);
  }

  parseRequestAdminError(data) {
    console.log("Request error: " + data);
  }

  /*Getting API Key*/
  getAPIKey() {
    doAuthenticatedAjax('POST', "/doecode/api/user/newapikey", this.parseAPI, userData.getData());
    this.setState({"showLoading": true});
  }

  parseAPI(data) {
    this.setState({"showLoading": false});
  }

  render() {
    const accountSavePass = <span>
      <span className="fa fa-floppy-o"></span>
      Save</span>;

    return (
      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12">
          <br/> {/*Change Password*/}
          <div className="row">
            <div className='col-xs-12'>
              <div className="panel panel-default">
                <div className="panel-heading account-panel-header center-text">Change Password</div>
                <div className="panel-body">
                  <div className="row">
                    <div className="col-md-1"></div>
                    <div className="col-md-10 col-xs-12">
                      <UserEditFields button_text={accountSavePass} button_action={this.updateUser} show_email={false} show_nonPass_fields={true} show_password={true}/>
                    </div>
                    <div className="col-md-1"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/*Request Administrative Role*/}
          <div className="row">
            <div className="col-md-6 col-xs-12">
              <div className="panel panel-default">
                <div className="panel-heading account-panel-header center-text">Administrative Role</div>
                <div className="panel-body account-panel-body center-text">
                  <button type="button" className="btn btn-lg btn-success" onClick={this.requestAdmin}>
                    <span className="fa fa-unlock-alt"></span>
                    Request Role
                  </button>
                </div>
              </div>
            </div>
            <div className='col-md-6 col-xs-12'>
              <div className="panel panel-default">
                <div className="panel-heading account-panel-header center-text">API Key</div>
                <div className="panel-body center-text">
                  {this.state.apiKeySuccess && <label>{this.state.apiKeyValue}</label>
}
                  {this.state.showLoading && <img className='account-loading-image' src="https://m.popkey.co/163fce/Llgbv_s-200x150.gif"/>
}
                  <button type="button" className='btn btn-lg btn-success' onClick={this.getAPIKey}>
                    <span className='fa fa-key'></span>
                    Generate Key</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    );

  }
}
