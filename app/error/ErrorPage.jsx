import React from 'react';
import {getQueryParam} from '../utils/utils';

export default class ErrorPage extends React.Component {
  constructor(props) {
    super(props);
    var error = decodeURI(getQueryParam("message"));

    if (error=='false') {
      error = "An error has occurred";
    }
    this.errorMessage = error;
  }

  render() {
    return (
      <div className="row not-so-wide-row">
        <div className="col-md-3"></div>
        <div className="col-md-6 col-xs-12 static-content center-text">
          <h2 className="static-content-title">Error Page</h2>
          <br/>
          <div className='has-error'>
            <label className='control-label'>{this.errorMessage}</label>
          </div>
        </div>
        <div className="col-md-3"></div>
      </div>
    );
  }
}
