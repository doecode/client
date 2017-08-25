import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import {doAjax} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class UserFields extends React.Component {
  constructor(props) {
    super(props);
    this.updateFirstName = this.updateFirstName.bind(this);
    this.updateLastName = this.updateLastName.bind(this);
    this.updateEmailAndCheckPassword = this.updateEmailAndCheckPassword.bind(this);
    this.handleContractNeedCheck = this.handleContractNeedCheck.bind(this);
    this.handleContractNeedCheckError = this.handleContractNeedCheckError.bind(this);
    this.handleContractCheck = this.handleContractCheck.bind(this);

    this.state = {
      showContractNumber: false,
      registerNeedsContractNumber: false
    }
  }

  updateFirstName(event) {
    userData.setValue("first_name", event.target.value);
  }

  updateLastName(event) {
    userData.setValue("last_name", event.target.value);
  }

  updateEmailAndCheckPassword(event) {
    userData.setValue("email", event.target.value);

    if ((validation.validateEmail(event.target.value) === "") && event.target.value.trim()) {
      var post_obj = {
        "email": event.target.value
      };
      doAjax('POST', '/doecode/api/user/getsitecode', this.handleContractNeedCheck, post_obj, this.handleContractNeedCheckError);
    }
  }

  handleContractNeedCheck(data) {
    var needingDatContractNumber = data.site_code === 'CONTR';
    var new_state = {
      registerNeedsContractNumber: needingDatContractNumber,
      showContractNumber: needingDatContractNumber
    };
    this.setState(new_state);
  }

  handleContractNeedCheckError(data) {
    console.log("Contract check error: " + JSON.stringify(data));
  }

  handleContractCheck(event) {
    if (event.target.value.trim() !== '') {
      userData.setValue("contract_number", event.target.value);
    }
  }

  render() {
    return (
      <div className='row'>
        <div className='col-xs-12'>
          <div className='row'>
            <div className="col-xs-12">
              <UserField field='first_name' label='First Name' elementType='input' handleChange={this.updateFirstNameAndCheckPassword} noExtraLabelText/>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <UserField field='last_name' label='Last Name' elementType='input' handleChange={this.updateLastNameAndCheckPassword} noExtraLabelText/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
