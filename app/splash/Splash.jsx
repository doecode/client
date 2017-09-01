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
    this.state = {
      showModal: false
    };
    this.deposit = this.deposit.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);

    /*Search stuff. TODO modularize once we decide on a look for the search data*/
    this.state = {
      all_fields: searchData.getValue("all_fields")
    };
    this.onAllFieldsChange = this.onAllFieldsChange.bind(this);
    this.search = this.search.bind(this);
    /*Search stuff. TODO modularize once we decide on a look for the search data*/
  }

  deposit() {
    window.location.href = '/doecode/publish';
  }

  open() {
    this.setState({showModal: true});
  }

  close() {
    this.setState({showModal: false});
  }

  /*Search stuff. TODO modularize once we decide on a look for the search data*/
  onAllFieldsChange(event) {
    this.setState({"all_fields": event.target.value});
  }

  search() {
    searchData.clearValues();
    searchData.setValue("start", 0);
    searchData.setValue("all_fields", this.state.all_fields);
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    window.location.href = "/doecode/results";
  }

  doAdvancedSearch() {
    window.location.href = "/doecode/search";
  }
  /*Search stuff. TODO modularize once we decide on a look for the search data*/

  render() {

    const icon_row1 = [ < IconRowIcon container_classes = 'col-md-4 col-xs-6' destination = '/doecode/projects' text = 'Submit Software/Code' icon_classes = 'fa fa-sign-in' key = "publish" />, < IconRowIcon container_classes = 'col-md-4 col-xs-12' destination = '/doecode/repository-services' text = 'Repository Services' icon_classes = 'fa fa-home clickable' key = "repoServices" />, < IconRowIcon container_classes = 'col-md-4 col-xs-6' destination = '/doecode/about' text = 'About' icon_classes = 'fa fa-info' key = "about" />
    ];

    const icon_row2 = [ < IconRowIcon container_classes = 'col-md-4 col-xs-6' destination = '/doecode/policy' text = 'Software Policy' icon_classes = 'fa fa-folder-open-o' key = "policy" />, < IconRowIcon container_classes = 'col-md-4 col-xs-6' destination = '/doecode/communications' text = 'News/Resources' icon_classes = 'fa fa-newspaper-o' key = "comms" />, < IconRowIcon container_classes = 'col-md-4 col-xs-12' destination = '/doecode/faq' text = 'FAQs' icon_classes = 'fa fa-question' key = "faq" />
    ];
    return (

      <div className="row not-so-wide-row">
        <div className="col-xs-12">
          {/*Signin Stuff*/}
          <div className="row">
            <div className="col-xs-12">
              <div className="pull-right">
                <br/>
                <SigninStatus/>
              </div>
            </div>
          </div>
          <br/>
          <br/> {/*The rest of the content*/}
          <div className="row">
            <div className="col-md-3"></div>
            <div className="col-xs-12 static-content">

              <div className='row'>
                <div className='col-md-3'></div>
                <div className='col-md-6 col-xs-12'>
                  {/*Logo*/}
                  <div className="row center-text">
                    <div className="col-xs-12">
                      <img src="https://www.osti.gov/doecode/images/DOEcode300px_white.png" alt="DOECode" width="300"/>
                    </div>
                  </div>
                  <br/>
                  <br/>
                  <br/> {/*Search Bar*/}
                  <div className="row center-text">
                    <div className='col-xs-1'></div>
                    {/*Search Bar*/}
                    <SearchBar searchbarSize='col-xs-9  no-col-padding-right' largerBar/>
                  </div>
                </div>
                <div className='col-md-3'></div>
              </div>

              <div className='row'>
                <div className='col-md-2'></div>
                <div className='col-md-8 col-xs-12'>
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
                </div>
                <div className='col-md-2'></div>
              </div>

            </div>
            <div className="col-md-3"></div>
          </div>
        </div>
      </div>
    );
  }
}
