import React from 'react';
import UserFields from '../fragments/UserFields';
import PasswordFields from '../fragments/PasswordFields';
import UserStatuses from '../fragments/UserStatuses'
import UserData from '../stores/UserData';
import {doAjax, doAuthenticatedAjax, checkIsAuthenticated, checkHasRole} from '../utils/utils';

const userData = new UserData();
export default class SigninStatus extends React.Component {
  constructor(props) {
    super(props);
    this.loadUserData = this.loadUserData.bind(this);

    this.state = {
      showUserFields: false,
      userList: [
        {
          label: '',
          value: ''
        }, {
          label: 'yo',
          value: 'dawg'
        }, {
          label: 'hi',
          value: 'sup'
        }
      ]
    }
  }

  componentDidMount() {
    //checkHasRole('OSTI');
  }

  loadUserData(event) {
    console.log(event.target.value);
    if (event.target.value != '') {
      this.setState({showUserFields: true});
    } else {
      this.setState({showUserFields: false});
    }
  }

  render() {
    return (
      <div className="row not-so-wide-row">
        <div className='col-xs-12'>
          {/*Title*/}
          <div className='row'>
            <div className='col-xs-12 center-text'>
              <h2 className="static-content-title">User Administration</h2>
            </div>
          </div>
          {/*User Select Box*/}
          <div className='row'>
            <div className='col-md-4'></div>
            <div className='col-md-4'>
              <div className='form-group'>
                <div className='row'>
                  <label className='control-label col-xs-1' htmlFor='user-admin-box'>Users:</label>
                  <div className='col-xs-11'>
                    <select className='form-control' id='user-admin-box' onChange={this.loadUserData}>
                      {this.state.userList.map((row, index) => <option key={'userlist-' + index} value={row.value}>
                        {row.label}
                      </option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div className='col-md-4'></div>
          </div>
          <br/>
          <br/>
          <div>
            {this.state.showUserFields && <div>
              {/*First Name, last name, contract number*/}
              <div className='row'>
                <div className='col-md-4'></div>
                <div className='col-md-4'>
                  <UserFields showContractNumAlways show_email={false}/>
                </div>
                <div className='col-md-4'></div>
              </div>
              {/*Password*/}
              <div className='row'>
                <div className='col-md-4'></div>
                <div className='col-md-6 col-xs-12'>
                  <div>
                    <PasswordFields/>
                  </div>
                </div>
                <div className='col-md-2'></div>
              </div>
              <div className='row'>
                <div className='col-md-4'></div>
                <div className='col-md-4'>
                  <div>
                    <UserStatuses requestedAdmin={true} rolesList={[]}/>
                  </div>
                </div>
                <div className='col-md-4'></div>
              </div>
            </div>}
          </div>
        </div>
      </div>
    )
  }
}
