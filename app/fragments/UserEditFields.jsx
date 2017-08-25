import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import {doAjax} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class UserEditFields extends React.Component {
  constructor(props) {
    super(props);

    this.checkPassword = this.checkPassword.bind(this);





  }



  render() {
    const validPassword = this.state.longEnough && this.state.hasSpecial && this.state.hasNumber && this.state.upperAndLower && this.state.matches
    && !this.state.containsName && (this.state.validEmail) && this.state.containsFirstName && this.state.containsLastName
    && ((this.state.registerNeedsContractNumber && userData.getValue("contract_number")!=='') || !this.state.registerNeedsContractNumber);


    return (
      <div className="row">
        <div className='col-xs-12'>

          {/*Email*/}
          {this.props.show_email && <div className='row'>
            <div className="col-md-6 col-xs-12">
              <UserField field="email" label="Email Address" elementType="input" handleChange={this.updateEmailAndCheckPassword} noExtraLabelText messageNode={this.props.text_below_email}/>
            </div>
            <div className="col-md-6"></div>
          </div>}
          {/*Passwords*/}
          {this.props.show_password &&
          <div className='row'>
            <div className="col-md-6 col-xs-12">
              <UserField noval={true} field="password" label="Password" elementType="password" handleChange={this.updatePasswordAndCheckPassword} noExtraLabelText/>
              <UserField noval={true} field="confirm_password" label="Confirm Password" elementType="password" handleChange={this.updateConfirmAndCheckPassword} noExtraLabelText/>
              <br/>
            </div>
            <div className="col-md-6 col-xs-12">
              <br/>
              <p>
                <strong>All fields are required.</strong>
              </p>
              <p>Passwords must:</p>
              <ul>
                <li>Be at least 8 characters long. {this.state.longEnough && <span className = "fa fa-check green" > </span>}</li>
                <li>Contain at least one special character. {this.state.hasSpecial && <span className = "fa fa-check green" > </span>}
                </li>
                <li>Contain at least one number character. {this.state.hasNumber && <span className = "fa fa-check green" > </span>}
                </li>
                <li>Not contain the login name. {!this.state.containsName && <span className = "fa fa-check green" > </span>}</li>
                <li>Contain a mixture of upper and lowercase letters. {this.state.upperAndLower && <span className = "fa fa-check green" > </span>}
                </li>
                <li>Password must match Confirm Password. {this.state.matches && <span className = "fa fa-check green" > </span>}
                </li>
              </ul>
            </div>
          </div>}
          {/*The button that actually does the things*/}
          <div className="row">
            <div className="col-xs-12">
            <button type="button" className="btn btn-lg btn-success" disabled={!validPassword && this.props.customValidation==undefined} onClick={this.props.button_action}>
              {this.props.button_text}
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  }
}
