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
      <div className='  container'>
        <div className='row'>
          <div className='col-xs-12 no-col-padding-left no-col-padding-right'>
            <div className="navbar-header">
              <button type="button" title='Toggle Menu' className="navbar-toggle hamburger-menu-btn no-col-padding-left no-col-padding-right" data-toggle="collapse" data-target="#header-nav-collapse">
                <span className="icon-bar icon-bar-extra"></span>
                <span className="icon-bar icon-bar-extra"></span>
                <span className="icon-bar icon-bar-extra"></span>
              </button>
              <a href='/doecode/'><img title='DOE CODE Homepage ' src='https://www.osti.gov/includes/doecode/images/DOEcodeTitle_185-min.png' alt="DOE CODE" className={img_class}/></a>
              <span className='hide-md hide-lg hide-sm pull-right'><SigninStatus/></span>
            </div>
            <div className="collapse navbar-collapse no-col-padding-right no-col-padding-left" id='header-nav-collapse'>
              <div className='hide-md hide-lg hide-sm'>
                <br/>
                <SearchBar containerClasses='row not-so-wide-row' barType='dropdown'/>
                <a className='whiteAnchor' title='Go to Advanced Search' href='/doecode/search'>Advanced Search</a>
              </div>
              <ul className='nav navbar-nav nav-menu'>
                <NavBarItem current_page={this.current_page} destination="/doecode/projects" navTitle='Submit Software/Code' special="true" fa_icon="fa fa-sign-in nav-menu-item-fa" display_name="Submit Software/Code"/>
                <NavBarItem current_page={this.current_page} destination='/doecode/repository-services' navTitle='Repository Services' special='true' fa_icon='fa fa-home nav-menu-item-fa' display_name='Repository Services'/>
                <NavBarItem current_page={this.current_page} destination="/doecode/about" navTitle='About' special="true" fa_icon="fa fa-info nav-menu-item-fa" display_name="About"/>
                <NavBarItem current_page={this.current_page} destination="/doecode/policy" navTitle='Software Policy' special="true" fa_icon="fa fa-folder-open-o nav-menu-item-fa" display_name="Software Policy"/>
                <NavBarItem current_page={this.current_page} destination="/doecode/communications" navTitle='News/Resources' special="true" fa_icon="fa fa-newspaper-o nav-menu-item-fa" display_name="News/Resources"/>
                <NavBarItem current_page={this.current_page} destination="/doecode/faq" navTitle='FAQs' special="true" fa_icon="fa fa-question nav-menu-item-fa" display_name="FAQs"/>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
