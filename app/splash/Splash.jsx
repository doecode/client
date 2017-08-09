import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';
import SigninStatus from '../components/SigninStatus';
import LinkIconRow from '../components/LinkIconRow';
import IconRowIcon from '../components/IconRowIcon';

/*Search stuff. TODO modularize once we decide on a look for the search data*/
import SearchData from '../stores/SearchData';
const searchData = new SearchData();
/*Search stuff. TODO modularize once we decide on a look for the search data*/

export default class Splash extends React.Component {
    constructor(props) {
        super(props);
        this.state = {showModal: false};
        this.deposit = this.deposit.bind(this);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        
        /*Search stuff. TODO modularize once we decide on a look for the search data*/
               this.state = {all_fields : searchData.getValue("all_fields")};
        this.onAllFieldsChange = this.onAllFieldsChange.bind(this);
        this.search = this.search.bind(this);
        /*Search stuff. TODO modularize once we decide on a look for the search data*/
    }

    deposit() {
        window.location.href = '/doecode/publish';
    }

    open() {
      this.setState({showModal:true});
    }

    close() {
        this.setState({showModal:false});
    }
    
    /*Search stuff. TODO modularize once we decide on a look for the search data*/
    onAllFieldsChange(event) {
      this.setState({"all_fields" : event.target.value});
    }

    search() {
    searchData.clearValues();
    searchData.setValue("start", 0);
    searchData.setValue("all_fields", this.state.all_fields);
    window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
    window.location.href = "/doecode/results";
    }

    doAdvancedSearch(){
        window.location.href="/doecode/search";
    }
    /*Search stuff. TODO modularize once we decide on a look for the search data*/

    
    render() {
    
const icon_row1 = [
    <IconRowIcon container_classes='col-md-4 col-xs-6'  destination='/doecode/policy' text='Software Policy' icon_classes='fa fa-folder-open-o' key="policy"/>,
    <IconRowIcon container_classes='col-md-4 col-xs-6' destination='/doecode/publish' text='Submit Software/Code' icon_classes='fa fa-sign-in' key="publish"/>,
    <IconRowIcon container_classes='col-md-4 col-xs-12'  text='Repository Services' icon_classes='fa fa-home clickable' key="repoServices"/>
];
const icon_row2 = [
    <IconRowIcon container_classes='col-md-4 col-xs-6' destination='/doecode/about' text='About' icon_classes='fa fa-building-o' key="about"/>,
    <IconRowIcon container_classes='col-md-4 col-xs-6' destination='/doecode/communications' text='News/Resources' icon_classes='fa fa-newspaper-o' key="comms"/>,
    <IconRowIcon container_classes='col-md-4 col-xs-12' destination='/doecode/faq' text='FAQs' icon_classes='fa fa-question' key="faq"/>
];
const is_logged_in = (localStorage.xsrfToken !== undefined && localStorage.xsrfToken !== null && localStorage.xsrfToken !== "");
        return (
        
        <div className="row not-so-wide-row">
            <div className="col-xs-12">
                {/*Signin Stuff*/}
                <div className="row">
                    <div className="col-xs-12 homepage-signin-bar">
                        <SigninStatus is_logged_in={is_logged_in} />
                    </div>
                </div>
                <br/>
                <br/>
                {/*The rest of the content*/}
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6 col-xs-12 static-content">
                        {/*Logo*/}
                        <div className="row center-text">
                            <div className="col-xs-12">
                                <img src="https://www.osti.gov/doecode/images/DOEcode300px_white.png" alt="DOECode" width="300"/>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        {/*Subtext*/}
                        <div className="row center-text">
                            <div className="col-xs-12">
                                <h4 className='header-subtext'>The U.S. Department of Energy's Code Repository</h4>
                            </div>
                        </div>
                        <br/>
                        <br/>
                        {/*Search Bar*/}
                        <div className="row center-text">
                            <div className='col-md-1'></div>
                            <div className="col-md-8 col-xs-12">
                                <div className='input-group'>
                                    <label htmlFor="allSearch" className="sr-only">Search DOE Code for Published Software Entries</label>
                                    <input onChange={this.onAllFieldsChange} type="text" value={this.state.allFields} className="form-control search-box input-lg"  placeholder="Search DOE Code for Published Software Entries"/>
                                    <span className='input-group-btn'>
                                        <button onClick={this.doAdvancedSearch} className='btn btn-default btn-lg adv-search-button' type='button'><span className="fa fa-cog"></span></button>
                                    </span>
                                </div>
                            </div>
                            <div className="col-md-2 col-xs-12">
                                <button type="button" className="btn btn-success btn-lg" onClick={this.search}>
                                    <span className="glyphicon glyphicon-search"></span>  Search
                                </button>
                            </div>
                            <div className='col-md-1'></div>
                        </div>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        <br/>
                        {/*Icons*/}
                        <LinkIconRow icon_row_data={icon_row1} />
                        <br/>
                        <br/>
                        <LinkIconRow icon_row_data={icon_row2} />
                        <br/>
                        
                        {/*Modal to do a thing*/}
                        <Modal show={this.state.showModal} onHide={this.close} bsSize="large">
                            <Modal.Header closeButton>
                                <Modal.Title>Create a New Repository</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className="row">
                                    <div className="col-sm-5">
                                        Create a new project as part of one of our open source communities below:
                                        <ul>
                                            <li><a href="https://github.com/doecode/">GitHub</a> </li>
                                        </ul>
                                    </div>
                                    <div className="col-sm-2">
                                        <h1> OR </h1>
                                    </div>
                                    <div className="col-sm-5">
                                        Create a new project on our internal <a href="http://lxdevrepo.osti.gov/">DOE Code repository</a> where you can
                                        control access to the project.
                                    </div>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button onClick={this.close}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div className="col-md-3"></div>
                </div>
            </div>
        </div>
        );
    }
}
