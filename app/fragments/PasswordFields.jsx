import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import {doAjax, checkPassword} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class PasswordFields extends React.Component {
  constructor(props) {
    super(props);
    this.updatePasswordAndCheckPassword = this.updatePasswordAndCheckPassword.bind(this);
    this.updateConfirmAndCheckPassword = this.updateConfirmAndCheckPassword.bind(this);
    this.userDataToJSON = this.userDataToJSON.bind(this);

    this.state = {
      longEnough: false,
      hasSpecial: false,
      hasNumber: false,
      upperAndLower: false,
      containsName: false,
      matches: false,
      validEmail: false
    }
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

  updatePasswordAndCheckPassword(event) {
    userData.setValue("password", event.target.value);
    var newState = checkPassword(this.userDataToJSON());
    newState.validEmail = validation.validateEmail((localStorage.user_email)
      ? localStorage.user_email
      : userData.getValue("email")) === "";
    this.setState(newState);
  }

  updateConfirmAndCheckPassword(event) {
    userData.setValue("confirm_password", event.target.value);
    var newState = checkPassword(this.userDataToJSON());
    newState.validEmail = validation.validateEmail((localStorage.user_email)
      ? localStorage.user_email
      : userData.getValue("email")) === "";
    this.setState(newState);
  }

  render() {
    const validPassword = this.state.longEnough && this.state.hasSpecial && this.state.hasNumber && this.state.upperAndLower && this.state.matches && !this.state.containsName && this.state.validEmail;
    return (
      <div className='row'>
        <div className="col-md-6 col-xs-12">
          <UserField noval={true} field="password" label="Password" elementType="password" handleChange={this.updatePasswordAndCheckPassword} noExtraLabelText/>
          <UserField noval={true} field="confirm_password" label="Confirm Password" elementType="password" handleChange={this.updateConfirmAndCheckPassword} noExtraLabelText/>
          <br/>
        </div>
        <div className="col-md-6 col-xs-12">
          <br/>
          <p>
            <strong>All fields are required.</strong>
          </p>
          <p>Passwords must:</p>
          <ul>
            <li>Be at least 8 characters long. {this.state.longEnough &&< span className = "fa fa-check green" > </span>}</li>
            <li>Contain at least one special character. {this.state.hasSpecial &&< span className = "fa fa-check green" > </span>}
            </li>
            <li>Contain at least one number character. {this.state.hasNumber &&< span className = "fa fa-check green" > </span>}
            </li>
            <li>Not contain the login name. {!this.state.containsName &&< span className = "fa fa-check green" > </span>}</li>
            <li>Contain a mixture of upper and lowercase letters. {this.state.upperAndLower &&< span className = "fa fa-check green" > </span>}
            </li>
            <li>Password must match Confirm Password. {this.state.matches &&< span className = "fa fa-check green" > </span>}
            </li>
          </ul>
        </div>
      </div>
    );
  }
}
