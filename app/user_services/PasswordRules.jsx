import React from 'react';

export default class PasswordRules extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="col-xs-12 text-muted password-rules">
        <br/>
        <p>
          <strong>All fields are required.</strong>
        </p>
        <br/>
        <p>Passwords must:</p>
        <ul>
          <li>Be at least 8 characters long. {this.props.longEnough && <span className="fa fa-check green"></span>}</li>
          <li>Contain at least one special character. {this.props.hasSpecial && <span className="fa fa-check green"></span>}
          </li>
          <li>Contain at least one number character. {this.props.hasNumber && <span className="fa fa-check green"></span>}
          </li>
          <li>Not contain the login name. {!this.props.containsName && <span className="fa fa-check green"></span>}</li>
          <li>Contain a mixture of upper and lowercase letters. {this.props.upperAndLower && <span className="fa fa-check green"></span>}
          </li>
          <li>Password must match Confirm Password. {this.props.matches && <span className="fa fa-check green"></span>}
          </li>
        </ul>
      </div>
    );
  }
}
