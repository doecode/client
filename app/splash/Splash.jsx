import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';
import SigninStatus from '../fragments/SigninStatus';
import LinkIconRow from '../fragments/LinkIconRow';
import IconRowIcon from '../fragments/IconRowIcon';
import SearchBar from '../fragments/SearchBar';

/*Search stuff. TODO modularize once we decide on a look for the search data*/
import SearchData from '../stores/SearchData';
const searchData = new SearchData();
/*Search stuff. TODO modularize once we decide on a look for the search data*/

export default class Splash extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    const icon_row1 = [(<IconRowIcon container_classes='col-sm-4 col-xs-6' destination='/doecode/projects' text='Submit Software/Code' icon_classes='fa fa-sign-in' key="publish"/>), (<IconRowIcon container_classes='col-sm-4 col-xs-12' destination='/doecode/repository-services' text='Repository Services' icon_classes='fa fa-home clickable' key="repoServices"/>), (<IconRowIcon container_classes='col-sm-4 col-xs-6' destination='/doecode/about' text='About' icon_classes='fa fa-info' key="about"/>)];

    const icon_row2 = [(<IconRowIcon container_classes='col-sm-4 col-xs-6' destination='/doecode/policy' text='Software Policy' icon_classes='fa fa-folder-open-o' key="policy"/>), (<IconRowIcon container_classes='col-sm-4 col-xs-6' destination='/doecode/communications' text='News/Resources' icon_classes='fa fa-newspaper-o' key="comms"/>), (<IconRowIcon container_classes='col-sm-4 col-xs-12' destination='/doecode/faq' text='FAQs' icon_classes='fa fa-question' key="faq"/>)];
    return (

      <div className="row not-so-wide-row">
        <div className="col-xs-12">
          {/*Signin Stuff*/}
          <div className="row">
            <div className="col-xs-12 hidden-xs visible-sm visible-md visible-lg right-text">
              <SigninStatus/>
            </div>
          </div>
          <br/> {/*The rest of the content*/}
          <div className="row">
            <div className="col-xs-12 static-content">
              <div className='row not-so-wide-row'>
                <div className='col-lg-1'></div>
                <div className='col-lg-10 col-md-12 col-xs-12'>
                  {/*Logo*/}
                  <div className="row center-text">
                    <div className="col-xs-12">
                      <img src='https://www.osti.gov/includes/doecode/images/DOEcode300px_white.png' alt="DOECode" title='DOE CODE' className='header-logo-img'/>
                    </div>
                  </div>
                  <br/>
                  <br/>
                  <div className='row center-text'>
                    <div className='col-xs-12 homepage-subtext'>
                      U.S. Department of Energy
                      <br/>
                      Office of Scientific and Technical Information
                    </div>
                  </div>
                  <br/>
                  <br/>
                  <br/> {/*Search Bar*/}
                  <div className="row center-text hide-xs">
                    <div className='col-lg-3 col-md-2 col-sm-2'></div>
                    <div className='col-lg-9 col-md-10 col-sm-10 no-col-padding-left'>
                      {/*Search Bar*/}
                      <SearchBar isHomepage searchbarSize='col-lg-8 col-md-8 col-sm-8 col-xs-9 no-col-padding-right'/>
                    </div>
                  </div>
                </div>
                <div className='col-lg-1'></div>
              </div>
              <div className='row'>
                <div className='col-lg-2'></div>
                <div className='col-lg-8 col-xs-12hidden-xs visible-sm visible-md visible-lg'>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/> {/*Icons*/}
                  <LinkIconRow icon_row_data={icon_row1}/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <LinkIconRow icon_row_data={icon_row2}/>
                  <br/>
                  <br/>
                  <br/>
                </div>
                <div className='col-lg-2'></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
