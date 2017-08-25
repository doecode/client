import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import SignupBadRequest from '../fragments/SignupBadRequest';
import SuccessfulSignup from '../fragments/SuccessfulSignup';
import UserFields from '../fragments/UserFields';
import PasswordFields from '../fragments/PasswordFields';

import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class RegisterUser extends React.Component {
  constructor(props) {
    super(props);
    this.register = this.register.bind(this);
    this.parseRegister = this.parseRegister.bind(this);
    this.parseError = this.parseError.bind(this);
    this.state = {
      signupSuccess: false,
      badRequest: false,
      badRequestErrors: []
    }
  }

  register() {
    doAjax('POST', "/doecode/api/user/register", this.parseRegister, userData.getData(), this.parseError);
  }

  parseRegister(data) {
    this.setState({"signupSuccess": true});
  }

  parseError(data) {
    var responseText = JSON.parse(data.responseText);
    var errorMessages = [];
    var keyIndex = 0;
    //Now, we determine what's going on
    if (data.status == 400) {
      responseText.errors.forEach(function(item) {
        errorMessages.push({
          error: item,
          key: (keyIndex + "-badRequest")
        });
        keyIndex++;
      });
    } else {
      errorMessages.push({error: "A server error has occurred that is preventing registration from functioning properly.", key: "0-badRequest"});
    }
    this.setState({"badRequest": true, "badRequestErrors": errorMessages});
  }

  render() {
    return (
      <div className="row not-so-wide-row">
        <div className='col-md-1'></div>
        <div className='col-md-10 col-xs-12'>
          {/*SUCCESSFUL SIGNUP*/}
          {this.state.signupSuccess && <div>
            <SuccessfulSignup/>
          </div>}
          {/*SHOW THE REGISTRATION STUFF*/}
          {!this.state.signupSuccess && <div>
            <div className="center-text">
              <h2 className="static-content-title">Registration</h2>
            </div>
            {/*ERROR MESSAGE*/}
            {this.state.badRequest && <div className='row'>
              <div className="col-md-3"></div>
              <div className="col-md-3 col-xs-12">
                <br/>
                <SignupBadRequest errors={this.state.badRequestErrors}/>
                <br/>
              </div>
              <div className='col-md-6'></div>
            </div>}
            <div className='row'>
              <div className='col-md-3'></div>
              <div className='col-md-3 col-xs-12'>
                <UserFields show_email={true}/>
              </div>
              <div className='col-md-6'></div>
            </div>
            <div className='row'>
              <div className='col-md-3'></div>
              <div className='col-md-6 col-xs-12'>
                <PasswordFields />
              </div>
              <div className='col-md-3'></div>
            </div>
            <br/>
            <div className='row'>
              <div className='col-md-3'></div>
              <div className='col-md-6 col-xs-12'>
                <button type='button' className='btn btn-success btn-lg' onClick={this.register}>
                  <span className='fa fa-paper-plane'></span>&nbsp;Submit
                </button>
              </div>
              <div className='col-md-3'></div>
            </div>
          </div>}
        </div>
        <div className='col-md-1'></div>
      </div>
    );

  }
}
