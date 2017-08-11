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
        <span className='signin-btn nav-menu-item'><button type='button' className="btn btn-link signin-btn" onClick={this.logout}><span className='fa fa-sign-out signin-btn'></span> Logout</button></span>
        }
        {!this.is_logged_in &&
        <a className="nav-menu-item signin-btn" href="/doecode/login"><span className="fa fa-sign-in"></span> Sign In</a>
        }
    </div>);
    }
}