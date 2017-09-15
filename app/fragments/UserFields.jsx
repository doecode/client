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
      showContractNumber: this.props.showContractNumAlways !== undefined
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
      doAjax('GET', '/doecode/api/user/getsitecode/' + event.target.value, this.handleContractNeedCheck, null, this.handleContractNeedCheckError);
    }
    else
      // don't show this if email is not valid
      this.setState({showContractNumber: false});
  }

  handleContractNeedCheck(data) {
    var needingDatContractNumber = data.site_code === 'CONTR';
    var new_state = {
      showContractNumber: needingDatContractNumber
    };
    this.setState(new_state);
  }

  handleContractNeedCheckError(data) {
    console.log("Contract check error: " + JSON.stringify(data));
    this.setState({showContractNumber: false});
  }

  handleContractCheck(event) {
    userData.setValue("contract_number", event.target.value);
  }

  render() {
    const emailSmalltext = <span>If you are an employee at a DOE National Laboratory, please register using your official .gov email address.</span>;
    return (
      <div className='row'>
        <div className='col-xs-12'>
          {/*First Name*/}
          <div className='row'>
            <div className="col-xs-12">
              <UserField field='first_name' label='First Name' elementType='input' handleChange={this.updateFirstNameAndCheckPassword} noExtraLabelText placeholderText=''/>
            </div>
          </div>
          {/*Last Name*/}
          <div className="row">
            <div className="col-xs-12">
              <UserField field='last_name' label='Last Name' elementType='input' handleChange={this.updateLastNameAndCheckPassword} noExtraLabelText placeholderText=''/>
            </div>
          </div>
          {/*Email Address*/}
          {this.props.show_email && <div className='row'>
            <div className="col-xs-12">
              <UserField field="email" label="Email Address" elementType="input" handleChange={this.updateEmailAndCheckPassword} noExtraLabelText messageNode={emailSmalltext} placeholderText=''/>
            </div>
          </div>}
          {/*Contract Number*/}
          {this.state.showContractNumber && <div className="row">
            <div className="col-xs-12">
              <UserField field='contract_number' label='Award/Contract Number' helpTooltip='ContractNumber' elementType='input' handleChange={this.handleContractCheck} noExtraLabelText/>
            </div>
          </div>}
        </div>
      </div>
    );
  }
}
