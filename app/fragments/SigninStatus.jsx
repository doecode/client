import React from 'react';
import {doAjax} from '../utils/utils';

export default class SigninStatus extends React.Component{
    constructor(props){
        super(props);
        this.parseErrorResponse = this.parseErrorResponse.bind(this);
        this.logout = this.logout.bind(this);
        this.is_logged_in = (sessionStorage.user_email !== undefined && sessionStorage.user_email !== null && sessionStorage.user_email !== "");
    }
    
    logout(){
      doAjax('GET','/doecode/api/user/logout', this.parseLogout, this.parseErrorResponse);
    }
    
    parseLogout(data) {
        sessionStorage.xsrfToken = "";
        sessionStorage.user_email = "";
        window.location.href='/doecode/logout';
    }
    
      parseErrorResponse() {
    console.log("Error....");
  }
  
    render(){
    return(
    <div>
        {this.is_logged_in &&
        <div className="dropdown">
            <button className="btn btn-link dropdown-toggle login-dropdown-btn" type="button" id="accountSigninDropdown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                {sessionStorage.user_email}&nbsp;
                <span className="caret"></span>
            </button>
            <ul className="dropdown-menu dropdown-menu-right login-dropdown-text" aria-labelledby="accountSigninDropdown">
                <li><a href="/doecode/projects"><span className='fa fa-code'></span> My Projects</a></li>
                <li><a href="/doecode/account"><span className='fa fa-user-circle'></span> Account</a></li>
                <li role="separator" className="divider"></li>
                <li className="clickable"><a onClick={this.logout}><span className='fa fa-sign-out'></span> Logout</a></li>
            </ul>
        </div>
        }
        {!this.is_logged_in &&
        <a className="nav-menu-item signin-btn" href="/doecode/login"><span className="fa fa-sign-in"></span> Sign In</a>
        }
    </div>);
    }
}