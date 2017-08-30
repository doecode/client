import React from 'react';
import UserFields from '../fragments/UserFields';
import PasswordFields from '../fragments/PasswordFields';
import UserStatuses from '../fragments/UserStatuses'
import UserData from '../stores/UserData';
import PageMessageBox from '../fragments/PageMessageBox';
import BootstrapAlertMsg from '../fragments/BootstrapAlertMsg';
import {doAjax, doAuthenticatedAjax, checkIsAuthenticated, checkHasRole, doArraysContainSame} from '../utils/utils';

const userData = new UserData();
export default class SigninStatus extends React.Component {
  constructor(props) {
    super(props);
    this.loadUserData = this.loadUserData.bind(this);
    this.saveUserData = this.saveUserData.bind(this);
    this.parseSaveUserData = this.parseSaveUserData.bind(this);
    this.parseSaveUserDataError = this.parseSaveUserDataError.bind(this);
    this.parseUserListData = this.parseUserListData.bind(this);
    this.parseUserListDataError = this.parseUserListDataError.bind(this);
    this.parseLoadUserData = this.parseLoadUserData.bind(this);
    this.parseLoadUserDataError = this.parseLoadUserDataError.bind(this);
    this.refreshPageUI = this.refreshPageUI.bind(this);

    this.roles_list = ['OSTI'];
    this.roles_list = [
      {
        label: 'OSTI',
        value: 'OSTI'
      }, {
        label: 'Administrator',
        value: 'ADMIN'
      }, {
        label: 'Contractor',
        value: 'CONTR'
      }
    ];
    this.state = {
      showUserFields: false,
      showUserListLoadError: false,
      userListLoadError: [],
      userList: [],
      showUserSaveError: false,
      userSaveError: [],
      showUserLoadError: false,
      userLoadError: [],
      original_user_data: {},
      showUserSaveSuccess: false,
      userSaveMessage: []
    }
  }

  componentDidMount() {
    checkHasRole('OSTI');
    //Populate the users list
    doAuthenticatedAjax("GET", '/doecode/api/user/users', this.parseUserListData, null, this.parseUserListDataError);
  }

  parseUserListData(data) {
    var user_list = [];
    data.forEach(function(item) {
      user_list.push({
        label: item.first_name + " " + item.last_name + " (" + item.email + ")",
        value: item.email
      });
    });
    user_list.unshift({value: '', label: ''});
    this.setState({userList: user_list});
  }

  parseUserListDataError() {
    this.setState({showUserListLoadError: true, userListLoadError: ['An error has occurred in loading the user list']});
  }

  loadUserData(event) {
    this.refreshPageUI();
    if (event.target.value != '') {
      //Go to API and look user data up
      doAuthenticatedAjax('GET', '/doecode/api/user/' + event.target.value, this.parseLoadUserData, null, this.parseLoadUserDataError);
    }
  }

  refreshPageUI() {
    this.setState({showUserFields: false, original_user_data: {}, showUserSaveError: false, showUserListLoadError: false, showUserSaveError: false});
  }

  parseLoadUserData(data) {
    userData.loadValues(data);
    this.setState({showUserFields: true, original_user_data: data});
  }

  parseLoadUserDataError(data) {
    this.setState({showUserFields: false, showUserLoadError: true, userLoadError: ['Error in loading user data']});
  }

  saveUserData() {
    var post_data = {};
    var changes_made = false;

    //Let's go through and see if any changes were made
    for (var key in this.state.original_user_data) {
      //Get old and new values
      var original_val = this.state.original_user_data[key];
      var new_val = userData.getValue(key);

      //See if there's a discrpency in the values
      if (!Array.isArray(original_val) && original_val !== new_val) {
        post_data[key] = new_val;
        changes_made = true;

      } else if (Array.isArray(original_val) && !doArraysContainSame(original_val, new_val)) {
        post_data[key] = new_val;
        changes_made = true;
      }

    }

    //Now we check password stuff
    if (userData.getValue("password") || userData.getValue("confirm_password")) {
      post_data.new_password = userData.getValue("password");
      post_data.confirm_password = userData.getValue("confirm_password");
      changes_made = true;
    }

    if (changes_made) {
      doAuthenticatedAjax('POST', '/doecode/api/user/update/' + this.state.original_user_data.email, this.parseSaveUserData, post_data, this.parseSaveUserDataError);
    } else {
      this.setState({showUserSaveError: true, userSaveError: ['No changes were made']});
      window.scrollTo(0, 0);
    }
  }

  parseSaveUserData(data) {
    this.setState({
      showUserSaveSuccess: true,
      userSaveMessage: [
        'Save successful', 'Page will refresh in 3 seconds'
      ],
      showUserSaveError: false,
      userSaveError: []
    });
    window.scrollTo(0, 0);
    setTimeout(function() {
      window.location.href = '/doecode/user-admin';
    }, 3000);
  }

  parseSaveUserDataError() {
    this.setState({userSaveError: true, userSaveError: ['Error in saving user data'], original_user_data: {}});
  }

  render() {
    //Data we'll pass in to the UserStatuses component
    var passedInUserData = {};
    var requestedAdmin = (userData.getValue("pending_roles").indexOf('OSTI') > -1);
    passedInUserData.adminPrivRequest = requestedAdmin;
    //If they had any roles, grab those too
    if (userData.getValue("roles").length > 0) {
      passedInUserData.role = userData.getValue("roles")[0];
    } else {
      passedInUserData.role = '';
    }

    //  console.log("Passed in role: "+passedInUserData.role);
    return (
      <div className="row not-so-wide-row">
        <div className='col-xs-12'>
          {/*Title*/}
          <div className='row'>
            <div className='col-xs-12 center-text'>
              <br/>
              <PageMessageBox classValue='has-success center-text' showMessage={this.state.showUserSaveSuccess} items={this.state.userSaveMessage} keyprefix='successfulsave-'/>
              <PageMessageBox classValue='has-error center-text' showMessage={this.state.showUserLoadError} items={this.state.userLoadError} keyprefix='userDataLoaderr'/>
              <PageMessageBox classValue='has-error center-text' showMessage={this.state.showUserListLoadError} items={this.state.userListLoadError} keyPrefix='userlisterr'/>
              <PageMessageBox classValue='has-error center-text' showMessage ={this.state.showUserSaveError} items={this.state.userSaveError} keyPrefix='usrSavErr'/>
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
          <div className='row'>
            <div className='col-md-2'></div>
            <div className='col-md-8 col-xs-12'>
              <hr/>
            </div>
            <div className='col-md-2'></div>
          </div>
          <br/>
          <div>
            {this.state.showUserFields && <div>
              <div className='row'>
                <div className='col-md-4'></div>
                <div className='col-md-4 col-xs-12'>
                  <BootstrapAlertMsg showMsg={userData.getValue("pending_roles").indexOf('OSTI') > -1} alertClasses='alert alert-info alert-dismissable' message='This user has requested administrative privileges'/>
                  <BootstrapAlertMsg showMsg={userData.getValue("password_expired")} alertClasses='alert alert-warning alert-dismissable' message="This user's password has expired"/>
                </div>
                <div className='col-md-4'></div>
              </div>
              <br/> {/*First Name, last name, contract number*/}
              <div className='row'>
                <div className='col-md-4'></div>
                <div className='col-md-4 col-xs-12'>
                  <UserFields showContractNumAlways show_email={false}/>
                </div>
                <div className='col-md-4'></div>
              </div>
              {/*Active state and stuff*/}
              <div className='row'>
                <div className='col-md-4'></div>
                <div className='col-md-4 col-xs-12'>
                  <UserStatuses adminPrivRequest={requestedAdmin} passedInData={passedInUserData} rolesList={this.roles_list}/>
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
              {/*Save Button*/}
              <br/>
              <div className='row'>
                <div className='col-md-4'></div>
                <div className='col-md-4 col-xs-12'>
                  <button type='button' className='btn btn-success btn-lg' onClick={this.saveUserData}>
                    <span className='fa fa-floppy-o'></span>&nbsp;Save</button>
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
