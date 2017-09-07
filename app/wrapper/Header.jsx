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
    return (

      <nav className="navbar navbar-default main-header">
        <div className="container-fluid">
          <div className="pull-right hidden-xs hidden-sm visible-md visible-lg header-signin-links">
            <SigninStatus/>
          </div>
          <div className='container hidden-xs hidden-sm visible-md visible-lg'>
            <br/>
            <br/>
            <br/>
            <div className='row'>
              <div className="col-xs-4 right-text">
                <a href="/doecode">
                  <img src="https://www.osti.gov/doecode/images/DOEcode300px_white.png" alt="DOECode" width="300"/>
                </a>
              </div>
              {/*Search Bar*/}
              <SearchBar searchbarSize='col-xs-6 no-col-padding-right'/>
            </div>
            <br/>
            <br/>
          </div>
          {/*Actual Navbar*/}
          <NavigationBar/>
        </div>
      </nav>

    );

  }
}
