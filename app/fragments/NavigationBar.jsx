import React from 'react';
import NavBarItem from './NavigationBarItem';
import {getIsLoggedIn} from '../utils/utils';

export default class NavgationBar extends React.Component{
    constructor(props) {
        super(props);
        this.current_page = ("/doecode/"+location.href.match(/([^\/]*)\/*$/)[1]);
    }

    render(){
        return(
        <div className='container'>
            <div className='row'>
                <div className='col-xs-12'>
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#header-nav-collapse">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                    </div>
                    <div className="collapse navbar-collapse" id='header-nav-collapse'>
                        <ul className='nav navbar-nav nav-menu'>
                            <NavBarItem current_page={this.current_page} destination="/doecode/" special="true" fa_icon="fa fa-home" display_name="Home"/>
                            <NavBarItem current_page={this.current_page} destination="/doecode/policy" special="true" fa_icon="fa fa-folder-open-o" display_name="Software Policy"/>
                            <NavBarItem current_page={this.current_page} destination="/doecode/projects" special="true" fa_icon="fa fa-sign-in" display_name="Submit Software/Code"/>
                            <NavBarItem current_page={this.current_page} destination="/doecode/about" special="true" fa_icon="fa fa-info" display_name="About"/>
                            <NavBarItem current_page={this.current_page} destination="/doecode/communications" special="true" fa_icon="fa fa-newspaper-o" display_name="News/Resources"/>
                            <NavBarItem current_page={this.current_page} destination="/doecode/faq" special="true" fa_icon="fa fa-question" display_name="FAQs"/>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        );
    }
}
