import React from 'react';
import {doAjax, clearLoginLocalstorage, checkIsAuthenticated} from '../utils/utils';
import moment from 'moment';

export default class SigninStatus extends React.Component {
  constructor(props) {
    super(props);
    this.parseErrorResponse = this.parseErrorResponse.bind(this);
    this.logout = this.logout.bind(this);

    //Make sure that the token still hasn't expired
    this.is_logged_in = (localStorage.token_expiration != "" && moment(localStorage.token_expiration, "YYYY-MM-DD HH:mm").isAfter(moment()));

    if (localStorage.roles) {
      var rolesArray = JSON.parse(localStorage.roles);
      this.has_osti_role = rolesArray.indexOf("OSTI") > -1;
      this.has_admin_role = rolesArray.indexOf("OSTI") > -1;
    }
  }

  componentDidMount() {
    if (this.is_logged_in) {
      var duration = moment.duration(moment(localStorage.token_expiration, "YYYY-MM-DD HH:mm").diff(moment()));
      if (duration < 2) {
        checkIsAuthenticated();
      }
    } else if (!this.is_logged_in && localStorage.token_expiration != '') {
      clearLoginLocalstorage();
      window.location.href = '/doecode/logout';
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
            </li>}
            {this.has_admin_role && <li>
              <a href='/doecode/user-admin'><span className='fa fa-user-plus'></span>&nbsp; User Admin</a>
            </li>}
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
