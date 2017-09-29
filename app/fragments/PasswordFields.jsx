import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import {doAjax, checkPassword} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class PasswordFields extends React.Component {
  constructor(props) {
    super(props);
    this.updatePasswordAndCheckPassword = this.updatePasswordAndCheckPassword.bind(this);
    this.updateConfirmAndCheckPassword = this.updateConfirmAndCheckPassword.bind(this);
  }

  updatePasswordAndCheckPassword(event) {
    userData.setValue("password", event.target.value);
    this.props.checkPasswordCallback();
  }

  updateConfirmAndCheckPassword(event) {
    userData.setValue("confirm_password", event.target.value);
    this.props.checkPasswordCallback();
  }

  render() {

    return (
      <div className='row'>
        <div className="col-xs-12">
          {/*Password*/}
          <div className='row login-email-container'>
            <div className='col-md-4 col-xs-12 right-text-md right-text-lg no-col-padding-right no-col-padding-left '>
              <label className='control-label input-label-adjusted' htmlFor='password'>Password:</label>
            </div>
            <div className='col-md-6 col-xs-12'>
              <div className='form-group'>
                <input title='Password' type='password' placeholder='Password' id='password' className='pure-input-1-3 form-control' onChange={this.updatePasswordAndCheckPassword} onBlur={this.updatePasswordAndCheckPassword}/>
              </div>
            </div>
          </div>
          {/*Confirm Password*/}
          <div className='row login-email-container'>
            <div className='col-md-4 col-xs-12 right-text-md right-text-lg no-col-padding-right no-col-padding-left '>
              <label className='control-label input-label-adjusted' htmlFor='confirm-password'>Confirm Password:</label>
            </div>
            <div className='col-md-6 col-xs-12'>
              <div className='form-group'>
                <input title='Confirm Password' type='password' placeholder='Confirm Password' id='confirm-password' className='pure-input-1-3 form-control' onChange={this.updateConfirmAndCheckPassword} onBlur={this.updateConfirmAndCheckPassword}/>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
