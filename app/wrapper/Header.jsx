import React from 'react';
import ReactDOM from 'react-dom';
import SearchData from '../stores/SearchData';
import NavigationBar from '../fragments/NavigationBar';
import SigninStatus from '../fragments/SigninStatus';
import SearchField from '../field/SearchField';
import AdvancedSearchButton from '../dissemination/AdvancedSearchButton';
import {addMetaTags} from '../utils/utils';
import SearchBar from '../fragments/SearchBar';

const searchData = new SearchData();
export default class Header extends React.Component {
  constructor(props) {
    super(props);
    addMetaTags([
      {
        name: 'title',
        content: 'DOE CODE: Your open source platform to easily publish, submit, and search for software code funded by the U.S. Department of Energy'
      }
    ]);
  }

  render() {
    var navStyle = (this.props.isHomepage)
      ? 'navbar navbar-default main-header visible-xs hidden-sm hidden-md hidden-lg'
      : 'navbar navbar-default main-header';
    return (
      <nav className={navStyle}>
        <div className="container-fluid header-container-fluid">
          <div className="pull-right hidden-xs visible-sm visible-md visible-lg header-signin-links">
            <SigninStatus/>
          </div>
          <div className='container hidden-xs visible-sm visible-md visible-lg header-search-container'>
            <br/>
            <br/>
            <div className='row not-so-wide-row'>
              <div className='col-md-2 col-sm-12 hide-lg'></div>
              <div className='col-lg-7 col-md-10 col-sm-12'>
                <h1 className='logo-header'>
                  <a href="/doecode">
                    <img className='header-logo-img' src="https://www.osti.gov/doecode/images/DOEcode300px_white.png" alt="DOECode"/>
                  </a>
                  <span className='header-side-text'>U.S. Department of Energy<br/>
                    Office of Scientific and Technical Information</span>
                </h1>
              </div>
              <div className='col-md-2 col-sm-12 hide-lg'></div>
              <div className='col-lg-5 col-md-10 col-sm-12'>
                <SearchBar searchbarSize='col-lg-11 col-md-9 col-sm-10 col-xs-6 no-col-padding-right'/>
              </div>
            </div>
            <br/>
          </div>
          {/*Actual Navbar*/}
          <NavigationBar isHomepage={this.props.isHomepage}/>
        </div>
      </nav>

    );

  }
}
