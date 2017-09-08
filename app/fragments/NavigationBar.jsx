import React from 'react';
import NavBarItem from './NavigationBarItem';
import {getIsLoggedIn} from '../utils/utils';
import SigninStatus from '../fragments/SigninStatus';
import SearchBar from '../fragments/SearchBar';

export default class NavgationBar extends React.Component {
  constructor(props) {
    super(props);
    this.current_page = ("/doecode/" + location.href.match(/([^\/]*)\/*$/)[1]);
  }

  render() {
    var img_class = (this.props.isHomepage)
      ? 'navbar-logo-img hide'
      : 'navbar-logo-img';
    return (
      <div className=' no-col-padding-left container'>
        <div className='row'>
          <div className='col-xs-12'>
            <div className="navbar-header">
              <button type="button" className="navbar-toggle hamburger-menu-btn no-col-padding-left no-col-padding-right" data-toggle="collapse" data-target="#header-nav-collapse">
                <span className="icon-bar icon-bar-extra"></span>
                <span className="icon-bar icon-bar-extra"></span>
                <span className="icon-bar icon-bar-extra"></span>
              </button>
              <img src="https://www.osti.gov/doecode/images/DOEcode300px_white.png" alt="DOECode" className={img_class}/>
              <span className='hide-md hide-lg pull-right'><SigninStatus/></span>
            </div>
            <div className="collapse navbar-collapse" id='header-nav-collapse'>
              {this.props.isHomepage && <div>
                <br/>
                <SearchBar searchbarSize='col-md-9 col-xs-9  no-col-padding-right' />
              </div>}
              <ul className='nav navbar-nav nav-menu'>
                <NavBarItem current_page={this.current_page} destination="/doecode/" special="true" fa_icon="fa fa-home nav-menu-item-fa" display_name="Home"/>
                <NavBarItem current_page={this.current_page} destination="/doecode/projects" special="true" fa_icon="fa fa-sign-in nav-menu-item-fa" display_name="Submit Software/Code"/>
                <NavBarItem current_page={this.current_page} destination='/doecode/repository-services' special='true' fa_icon='fa fa-home nav-menu-item-fa' display_name='Repository Services'/>
                <NavBarItem current_page={this.current_page} destination="/doecode/about" special="true" fa_icon="fa fa-info nav-menu-item-fa" display_name="About"/>
                <NavBarItem current_page={this.current_page} destination="/doecode/policy" special="true" fa_icon="fa fa-folder-open-o nav-menu-item-fa" display_name="Software Policy"/>
                <NavBarItem current_page={this.current_page} destination="/doecode/communications" special="true" fa_icon="fa fa-newspaper-o nav-menu-item-fa" display_name="News/Resources"/>
                <NavBarItem current_page={this.current_page} destination="/doecode/faq" special="true" fa_icon="fa fa-question nav-menu-item-fa" display_name="FAQs"/> {/*<SearchBar searchbarSize='col-xs-6 no-col-padding-right'/>*/}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
