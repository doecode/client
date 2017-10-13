import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';
import SigninStatus from '../fragments/SigninStatus';
import LinkIconRow from '../fragments/LinkIconRow';
import IconRowIcon from '../fragments/IconRowIcon';
import SearchBar from '../fragments/SearchBar';

import SearchData from '../stores/SearchData';
const searchData = new SearchData();

export default class Homepage extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {

    const icon_row1 = [(<IconRowIcon container_classes='col-sm-4 col-xs-6' destination='/doecode/projects' text='Submit Software/Code' icon_classes='fa fa-sign-in' key="publish"/>), (<IconRowIcon container_classes='col-sm-4 col-xs-12' destination='/doecode/repository-services' text='Repository Services' icon_classes='fa fa-home clickable' key="repoServices"/>), (<IconRowIcon container_classes='col-sm-4 col-xs-6' destination='/doecode/about' text='About' icon_classes='fa fa-info' key="about"/>)];

    const icon_row2 = [(<IconRowIcon container_classes='col-sm-4 col-xs-6' destination='/doecode/policy' text='Software Policy' icon_classes='fa fa-folder-open-o' key="policy"/>), (<IconRowIcon container_classes='col-sm-4 col-xs-6' destination='/doecode/communications' text='News/Resources' icon_classes='fa fa-newspaper-o' key="comms"/>), (<IconRowIcon container_classes='col-sm-4 col-xs-12' destination='/doecode/faq' text='FAQs' icon_classes='fa fa-question' key="faq"/>)];
    return (
      <div className='container-fluid'>
        <div className="row">
          <div className="col-xs-12">
            {/*Signin Stuff*/}
            <div className="row">
              <div className="col-xs-12 hidden-xs visible-sm visible-md visible-lg right-text no-col-padding-right">
                <SigninStatus/>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-12">
                {/*Header Logo*/}
                <div className='container no-col-padding-left'>
                  <div className='row'>
                    <div className='col-xs-12'>
                      {/*Logo*/}
                      <div className="row center-text">
                        <div className="col-xs-12">
                          <span className='hide-md hide-sm hide-lg'>
                            <br/>
                            <br/>
                          </span>
                          <img src='https://www.osti.gov/includes/doecode/images/DOEcodeTitle_395-min.png' alt="DOE CODE" title='DOE CODE' className='header-logo-img-homepage'/>
                        </div>
                      </div>
                      <br/>
                      {/*Mobile Only*/}
                      <div className='hide-md hide-sm hide-lg'>
                        <br/>
                        <br/>
                        <SearchBar containerClasses='row not-so-wide-row' barType='homepage'/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                      </div>
                      <div className='row center-text'>
                        <div className='col-xs-12 homepage-subtext'>
                          U.S. Department of Energy
                          <br/>
                          Office of Scientific and Technical Information
                        </div>
                      </div>
                      <div className='hidden-xs visible-sm visible-md visible-lg'>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                      </div>
                    </div>
                  </div>
                </div>
                {/*Search Bar*/}
                <div className='container hidden-xs visible-sm visible-md visible-lg no-col-padding-left'>
                  <SearchBar containerClasses='row' barType='homepage'/>
                </div>
                {/*Icons*/}
                <div className='container hidden-xs visible-sm visible-md visible-lg'>
                  <div className='row'>
                    <div className='col-xs-12'>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <LinkIconRow icon_row_data={icon_row1}/>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <br/>
                      <LinkIconRow icon_row_data={icon_row2}/>
                      <br/>
                      <br/>
                      <br/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
