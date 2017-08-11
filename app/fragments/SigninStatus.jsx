import React from 'react';
import {doAjax} from '../utils/utils';

let is_logged_in = false;
export default class SigninStatus extends React.Component{
    constructor(props){
        super(props);
        this.parseErrorResponse = this.parseErrorResponse.bind(this);
        this.logout = this.logout.bind(this);
        this.is_logged_in = (sessionStorage.xsrfToken !== undefined && sessionStorage.xsrfToken !== null && sessionStorage.xsrfToken !== "");
    }
    
    logout(){
      doAjax('GET','/doecode/api/user/logout', this.parseLogout, this.parseErrorResponse);
    }
    
    parseLogout(data) {
        sessionStorage.xsrfToken = "";
        window.location.href='/doecode/logout';
    }
    
      parseErrorResponse() {
    console.log("Error....");
  }
  
    render(){
    return(
    <div>
        {this.is_logged_in &&
        <span className='signin-btn nav-menu-item'><button type='button' className="btn btn-link" onClick={this.logout}><span className='fa fa-sign-out'></span> Logout</button></span>
        }
        {!this.is_logged_in &&
        <a className="nav-menu-item signin-btn" href="/doecode/login"><span className="fa fa-sign-in"></span> Sign In</a>
        }
    </div>);
    }
}