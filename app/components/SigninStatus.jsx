import React from 'react';

let is_logged_in = false;
export default class SigninStatus extends React.Component{
    constructor(props){
        super(props);
        is_logged_in = this.props.is_logged_in;
    }
    
    render(){
    return(
    <div>
        {is_logged_in &&
        <span className='signin-btn nav-menu-item'>Signed In</span>
        }
        {!is_logged_in &&
        <a className="nav-menu-item signin-btn" href="/doecode/login"><span className="fa fa-user"></span> Sign In</a>
        }
    </div>);
    }
}