import React from 'react';
import {doAjax} from '../utils/utils';
import moment from 'moment';

export default class SigninStatus extends React.Component {
  constructor(props) {
    super(props);
    this.parseErrorResponse = this.parseErrorResponse.bind(this);
    this.logout = this.logout.bind(this);
    this.is_logged_in = (localStorage.user_email !== undefined && localStorage.user_email !== null && localStorage.user_email !== "");
    console.log("current"+moment().format("YYYY-MM-DD HH:mm"));
    console.log("Is expired "+moment(localStorage.token_expiration).format("YYYY-MM-DD HH:mm"));
    console.log(moment().isBefore(moment(localStorage.token_expiration)));
  }

  logout() {
    doAjax('GET', '/doecode/api/user/logout', this.parseLogout, this.parseErrorResponse);
  }

  parseLogout(data) {
    localStorage.xsrfToken = "";
    localStorage.user_email = "";
    localStorage.firstName = "";
    localStorage.lastName = "";
    localStorage.token_expiration = "";
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
                <span className='fa fa-code'></span>
                My Projects</a>
            </li>
            <li>
              <a href="/doecode/account">
                <span className='fa fa-user-circle'></span>
                Account</a>
            </li>
            <li role="separator" className="divider"></li>
            <li className="clickable">
              <a onClick={this.logout}>
                <span className='fa fa-sign-out'></span>
                Logout</a>
            </li>
          </ul>
        </div>}
        {!this.is_logged_in && <a className="nav-menu-item signin-btn" href="/doecode/login">
          <span className="fa fa-sign-in"></span>
          Sign In</a>}
      </div>
    );
  }
}
