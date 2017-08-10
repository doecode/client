import React from 'react';

let is_logged_in = false;
export default class SigninStatus extends React.Component{
    constructor(props){
        super(props);
        this.is_logged_in = (sessionStorage.xsrfToken !== undefined && sessionStorage.xsrfToken !== null && sessionStorage.xsrfToken !== "");
    }
    
    render(){
    return(
    <div>
        {this.is_logged_in &&
        <span className='signin-btn nav-menu-item'>Signed In</span>
        }
        {!this.is_logged_in &&
        <a className="nav-menu-item signin-btn" href="/doecode/login"><span className="fa fa-user"></span> Sign In</a>
        }
    </div>);
    }
}