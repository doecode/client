import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';

const userData = new UserData();
const validation = new Validation();

export default class UserEditFields extends React.Component {
  constructor(props) {
    super(props);

    this.checkPassword = this.checkPassword.bind(this);
    this.updateFirstNameAndCheckPassword = this.updateFirstNameAndCheckPassword.bind(this);
    this.updateLastNameAndCheckPassword = this.updateLastNameAndCheckPassword.bind(this);
    this.updateEmailAndCheckPassword = this.updateEmailAndCheckPassword.bind(this);
    this.updatePasswordAndCheckPassword = this.updatePasswordAndCheckPassword.bind(this);
    this.updateConfirmAndCheckPassword = this.updateConfirmAndCheckPassword.bind(this);
    this.handleContractNeedCheck = this.handleContractNeedCheck.bind(this);
    this.handleContractNeedCheckError = this.handleContractNeedCheckError.bind(this);
    this.handleContractCheck = this.handleContractCheck.bind(this);

    this.state = {
      longEnough: false,
      hasSpecial: false,
      hasNumber: false,
      upperAndLower: false,
      containsName: false,
      containsFirstName: false,
      containsLastName: false,
      matches: false,
      validEmail: false,
      showContractNumber: false,
      registerNeedsContractNumber: false,
      hasDoneContractNumberCheck: false,
      contractNumberFilledOut: false
    }

  }

  updateFirstNameAndCheckPassword(event) {
    userData.setValue("firstName", event.target.value);
    this.checkPassword();
  }

  updateLastNameAndCheckPassword(event) {
    userData.setValue("lastName", event.target.value);
    this.checkPassword();
  }

  updateEmailAndCheckPassword(event) {
    userData.setValue("email", event.target.value);
    this.checkPassword();

    if (!this.state.hasDoneContractNumberCheck && event.target.value.trim() != '') {
      let post_obj = {
        "email": event.target.value
      };
      doAjax('POST', '/doecode/api/user/getsitecode', this.handleContractNeedCheck, post_obj, this.handleContractNeedCheckError);
    }
  }

  handleContractNeedCheck(data) {
    let new_state = {
      registerNeedsContractNumber: data.site_code === 'CONTR',
      hasDoneContractNumberCheck: true
    };
    this.setState(new_state);
  }

  handleContractNeedCheckError(data) {
    console.log(JSON.stringify(data));
  }

  handleContractCheck(event) {
    if (event.target.value.trim() !== '') {
      this.setState({contractNumberFilledOut: true});
    }
  }

  updatePasswordAndCheckPassword(event) {
    userData.setValue("password", event.target.value);
    this.checkPassword();
  }

  updateConfirmAndCheckPassword(event) {
    userData.setValue("confirm_password", event.target.value);
    this.checkPassword();
  }

  checkPassword() {
    const password = userData.getValue("password");
    const email = userData.getValue("email");
    const confirm = userData.getValue("confirm_password");
    const minLength = 8;
    const specialCharacterRegex = /[^a-zA-Z\d\s]/g;
    const lowerRegex = /[a-z]/g;
    const upperRegex = /[A-Z]/g;
    const numberRegex = /[\d]/g;
    let newState = Object.assign({}, this.state);

    newState.longEnough = password.length >= minLength;
    newState.hasSpecial = specialCharacterRegex.test(password);
    newState.hasNumber = numberRegex.test(password);
    newState.upperAndLower = upperRegex.test(password) && lowerRegex.test(password);
    newState.containsName = password.indexOf(email) > -1;
    newState.matches = password !== '' && (password === confirm);
    newState.validEmail = validation.validateEmail(email) === "";
    newState.containsFirstName = userData.getValue("firstName").trim() != '';
    newState.containsLastName = userData.getValue("lastName").trim() != '';
    this.setState(newState);

  }

  render() {
    const validPassword = this.state.longEnough && this.state.hasSpecial && this.state.hasNumber && this.state.upperAndLower && this.state.matches && !this.state.containsName && this.state.validEmail && this.state.containsFirstName && this.state.containsLastName && ((this.state.registerNeedsContractNumber && this.state.contractNumberFilledOut) || !this.state.registerNeedsContractNumber);
    return (
      <div className="row">
        <div className='col-xs-12'>
          {this.props.show_nonPass_fields && <span>
            <div className='row'>
              <div className='col-md-6 col-xs-12'>
                <UserField field='firstName' label='First Name' elementType='input' handleChange={this.updateFirstNameAndCheckPassword} noExtraLabelText/>
              </div>
              <div className="col-md-6"></div>
            </div>
            <div className="row">
              <div className='col-md-6 col-xs-12'>
                <UserField field='lastName' label='Last Name' elementType='input' handleChange={this.updateLastNameAndCheckPassword} noExtraLabelText/>
              </div>
              <div className="col-md-6"></div>
            </div>
            {this.state.showContractNumber && <div className="row">
              <div className="col-md-6 col-xs-12">
                <UserField field='contractNumber' label='Contract Number' elementType='input' handleChange={this.handleContractCheck} noExtraLabelText/>
              </div>
              <div className='col-md-6'></div>
            </div>
}
          </span>
}
          {this.props.show_email && <div className='row'>
            <div className="col-md-6 col-xs-12">
              <UserField field="email" label="Email Address" elementType="input" handleChange={this.updateEmailAndCheckPassword} noExtraLabelText messageNode={this.props.text_below_email}/>
            </div>
            <div className="col-md-6"></div>
          </div>
}

          <div className='row'>
            <div className="col-md-6 col-xs-12">
              <UserField noval={true} field="password" label="Password" elementType="password" handleChange={this.updatePasswordAndCheckPassword} noExtraLabelText/>
              <UserField noval={true} field="confirm_password" label="Confirm Password" elementType="password" handleChange={this.updateConfirmAndCheckPassword} noExtraLabelText/>
              <button type="button" className="btn btn-lg btn-success" disabled={!validPassword} onClick={this.props.button_action}>
                {this.props.button_text}
              </button>
              <br/>

            </div>
            <div className="col-md-6 col-xs-12">
              <br/>
              <p>
                <strong>All fields are required.</strong>
              </p>
              <p>Passwords must:</p>
              <ul>
                <li>Be at least 8 characters long. {this.state.longEnough &&< span className = "glyphicon glyphicon-ok green" > </span>}</li>
                <li>Contain at least one special character. {this.state.hasSpecial &&< span className = "glyphicon glyphicon-ok green" > </span>}
                </li>
                <li>Contain at least one number character. {this.state.hasNumber &&< span className = "glyphicon glyphicon-ok green" > </span>}
                </li>
                <li>Not contain the login name. {!this.state.containsName &&< span className = "glyphicon glyphicon-ok green" > </span>}</li>
                <li>Contain a mixture of upper and lowercase letters. {this.state.upperAndLower &&< span className = "glyphicon glyphicon-ok green" > </span>}
                </li>
                <li>Password must match Confirm Password. {this.state.matches &&< span className = "glyphicon glyphicon-ok green" > </span>}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
