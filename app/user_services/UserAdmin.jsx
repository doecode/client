import React from 'react';

import {doAjax, doAuthenticatedAjax, checkIsAuthenticated, checkHasRole} from '../utils/utils';
export default class SigninStatus extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    checkHasRole('ADMIN');
  }

  render() {
    return (
      <div className="row not-so-wide-row">
        <div className='col-xs-12'>
          
        </div>
      </div>
    );
  }
}
