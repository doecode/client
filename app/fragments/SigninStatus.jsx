import React from 'react';
import {doAjax, clearLoginLocalstorage} from '../utils/utils';
import moment from 'moment';

export default class SigninStatus extends React.Component {
  constructor(props) {
    super(props);
    this.parseErrorResponse = this.parseErrorResponse.bind(this);
    this.logout = this.logout.bind(this);

    this.is_logged_in = (localStorage.user_email !== undefined && localStorage.user_email !== null && localStorage.user_email !== "");

    if (localStorage.roles) {
      var rolesArray = JSON.parse(localStorage.roles);
      this.has_osti_role = rolesArray.indexOf("OSTI")>-1;
    }
  }

  logout() {
    doAjax('GET', '/doecode/api/user/logout', this.parseLogout, this.parseErrorResponse);
  }

  parseLogout(data) {
    clearLoginLocalstorage();
    window.location.href = '/doecode/logout';
  }

  parseErrorResponse() {
    console.log("Error....");
  }

  render() {
    return (
      <div>
        {this.is_logged_in && <div className="dropdown">
          <button className="btn btn-link dropdown-toggle login-dropdown-btn" type="button" id="accountSigninDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
            {localStorage.first_name + " " + localStorage.last_name}&nbsp;
            <span className="caret"></span>
          </button>
          <ul className="dropdown-menu dropdown-menu-right login-dropdown-text" aria-labelledby="accountSigninDropdown">
            <li>
              <a href="/doecode/projects">
                <span className='fa fa-code'></span>&nbsp; My Projects</a>
            </li>
            <li>
              <a href="/doecode/account">
                <span className='fa fa-user-circle'></span>&nbsp; Account</a>
            </li>
            {this.has_osti_role && <li>
              <a href="/doecode/pending">
                <span className='fa fa-clock-o'></span>&nbsp; Pending Approval</a>
            </li>
}
            <li role="separator" className="divider"></li>
            <li className="clickable">
              <a onClick={this.logout}>
                <span className='fa fa-sign-out'></span>&nbsp; Logout</a>
            </li>
          </ul>
        </div>}
        {!this.is_logged_in && <span>
          <span className="signin-btn-container">
            <a className="signin-btn" href="/doecode/login">
              <span className="fa fa-user"></span>&nbsp;Sign In
            </a>
            &nbsp;</span>|<span className="signin-btn-container">&nbsp;
            <a className="signin-btn" href="/doecode/register">
              Create Account
            </a>
          </span>
        </span>}
      </div>
    );
  }
}
