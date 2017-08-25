import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';

export default class ConfirmUser extends React.Component {
  constructor(props) {
    super(props);
    this.parseConfirm = this.parseConfirm.bind(this);
    this.parseError = this.parseError.bind(this);
    this.state = {
      "showSuccess": false,
      "showError": false,
      "apiKey": ""
    };

  }

  componentDidMount() {
    doAjax('GET', appendQueryString("/doecode/api/user/confirm"), this.parseConfirm, undefined, this.parseError);
  }

  parseConfirm(data) {
    this.setState({"showSuccess": true, "apiKey": data.apiKey});
  }

  parseError() {
    this.setState({"showError": true});
  }

  render() {
    return (
      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12 center-text">
          {this.state.showSuccess && <div>
            <h2>Thank you for registering with DOE CODE. Your account has been confirmed.
            </h2>
            <br/>
            <div>
              This is your API Key. Keep this stored in your records for future use.
              <br/>
              <br/>
              API Key:
              <strong>{this.state.apiKey}</strong>
            </div>
          </div>}

          {this.state.showError && <h2>The confirmation code provided does not exist or has expired. To register a new account click&nbsp;
            <a href="/register">
              here</a>.
          </h2>}
        </div>
        <div className="col-md-3"></div>
      </div>
    )
  }
}
