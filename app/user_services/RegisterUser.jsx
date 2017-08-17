import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import SignupBadRequest from '../fragments/SignupBadRequest';
import SuccessfulSignup from '../fragments/SuccessfulSignup';
import UserEditFields from '../fragments/UserEditFields';
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
    doAjax('POST', "/doecode/api/user/register", this.parseRegister, userData.getData(), this.parseError)
  }

  parseRegister(data) {
    console.log("Success");
    this.setState({"signupSuccess": true});
  }

  parseError(data) {
    console.log("Error"+JSON.stringify(data));
    var errorMessages = [];
    var keyIndex = 0;
    data.responseJSON.errors.forEach(function(row) {
      errorMessages.push({
        error: row,
        key: (keyIndex + "-badRequest")
      });
      keyIndex++
    });
    this.setState({"badRequest": true, "badRequestErrors": errorMessages});
  }

  render() {

    const emailSmalltext = <span>If you are an employee at a DOE National Laboratory, please register using your official .gov email address.</span>;
    let content = null;

    if (this.state.signupSuccess) {
      content = <SuccessfulSignup/>;
    } else {
      content = <div className='row not-so-wide-row'>
        <div className='col-xs-12'>
          <div className="center-text">
            <h2 className="static-content-title">Registration</h2>
          </div>
          {/*Error messages*/}
          {this.state.badRequest && <div className='row'>
            <div className="col-md-3"></div>
            <div className="col-md-3 col-xs-12">
              <br/>
              <SignupBadRequest errors={this.state.badRequestErrors}/>
              <br/>
            </div>
            <div className='col-md-6'></div>
          </div>}
          {/*The actual email, password, etc things*/}
          <div className='row'>
            <div className='col-md-3'></div>
            <div className='col-md-6 col-xs-12'>
              <UserEditFields button_text='Register' button_action={this.register} text_below_email={emailSmalltext} show_email={true} show_nonPass_fields={true} show_password={true} doContractCheck/>
            </div>
            <div className='col-md-3'></div>
          </div>
        </div>
      </div>}

    return (
      <div className="container-fluid form-horizontal">
        {content}
      </div>
    );

  }
}
