import React from 'react';
import UserFields from '../fragments/UserFields';
import PasswordFields from '../fragments/PasswordFields';
import UserData from '../stores/UserData';

const userData = new UserData();
export default class UserStatuses extends React.Component {
  constructor(props) {
    super(props);
    this.handleActiveToggle = this.handleActiveToggle.bind(this);
  }

  handleActiveToggle(event) {
    userData.setValue("active_state", event.target.checked);
  }

  /*At the moment only one role is allowed at a time. IF this changes, change this code*/
  setRolesData(event) {
    userData.setValue("roles_list", [event.target.value]);
  }

  render() {
    return (
      <span>
        <div className="checkbox">
          <label htmlFor='active-state'><input type="checkbox" checked={this.props.isActive} onChange={this.handleActiveToggle} id='active-state' value="activeState"/>Is Active?</label>
        </div>
        {this.props.requestedAdmin && <div className="alert alert-info alert-dismissable">
          <a href="#" className="close" data-dismiss="alert" aria-label="close">&times;</a>
          This user has requested administrative privileges
        </div>}
        <div className='form-group'>
          <div className='row'>
            <label className='control-label col-xs-1' htmlFor='user-admin-box'>Users:</label>
            <div className='col-xs-11'>
              <select className='form-control' id='roles-box' onChange={this.setRolesData}>
                <option></option>
                {this.props.rolesList.map((row, index) => <option key={'roles-' + index}></option>)}
              </select>
            </div>
          </div>
        </div>
      </span>
    )
  }
}
