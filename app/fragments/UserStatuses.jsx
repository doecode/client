import React from 'react';
import UserFields from '../fragments/UserFields';
import PasswordFields from '../fragments/PasswordFields';
import UserData from '../stores/UserData';

const userData = new UserData();
export default class UserStatuses extends React.Component {
  constructor(props) {
    super(props);
    this.handleActiveToggle = this.handleActiveToggle.bind(this);
    this.state = {
      activeChecked: userData.getValue("active")
    }
  }

  handleActiveToggle(event) {
    userData.setValue("active", event.target.checked);
    this.setState({activeChecked: event.target.checked});
  }

  /*At the moment only one role is allowed at a time. IF this changes, change this code*/
  setRolesData(event) {
    userData.setValue("roles", [event.target.value]);
  }

  render() {
    var usrData = (this.props.passedInData != undefined)
      ? this.props.passedInData
      : {
        adminPrivRequest: false,
        role: ''
      };
    return (
      <div>
        <div className="checkbox">
          <label htmlFor='active-state'><input type="checkbox" checked={this.state.activeChecked} onChange={this.handleActiveToggle} id='active-state'/>Is Active?</label>
        </div>
        <div className='form-group'>
          <div className='row'>
            <label className='control-label' htmlFor='user-admin-box'>Roles:</label>
            <br/>
            <select className='form-control' value={usrData.role} id='roles-box' onChange={this.setRolesData}>
              <option value=''></option>
              {this.props.rolesList.map((row, index) => <option key={'roles-' + index}>{row}</option>)}
            </select>
          </div>
        </div>
      </div>
    )
  }
}
