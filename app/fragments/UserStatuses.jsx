import React from 'react';
import UserFields from '../fragments/UserFields';
import PasswordFields from '../fragments/PasswordFields';
import UserData from '../stores/UserData';

const userData = new UserData();
export default class UserStatuses extends React.Component {
  constructor(props) {
    super(props);
    this.handleActiveToggle = this.handleActiveToggle.bind(this);
    this.setRolesData = this.setRolesData.bind(this);
    this.state = {
      activeChecked: userData.getValue("active"),
      chosenRole: this.props.passedInData.role
    }
  }

  handleActiveToggle(event) {
    userData.setValue("active", event.target.checked);
    this.setState({activeChecked: event.target.checked});
  }

  /*At the moment only one role is allowed at a time. IF this changes, change this code*/
  setRolesData(event) {
    this.setState({chosenRole: event.target.value});
    userData.setValue("roles", [event.target.value]);
  }

  render() {

    return (
      <div>

        <div className='form-group'>
          <div className='row'>
            <div className='col-xs-3 right-text'>
              <label className='control-label input-label-adjusted' htmlFor='roles-box'>Roles:</label>
            </div>
            <div className='col-xs-9'>
              <select className='form-control' value={this.state.chosenRole} id='roles-box' onChange={this.setRolesData}>
                <option value=''></option>
                {this.props.rolesList.map((row, index) => <option key={'roles-' + index} value={row.value}>{row.label}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className='form-group'>
          <div className='row'>
            <div className='col-xs-1'></div>
            <div className='col-xs-11'>
              <div className="checkbox">
                <label htmlFor='active-state'><input type="checkbox" checked={this.state.activeChecked} onChange={this.handleActiveToggle} id='active-state'/>Is Active?</label>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
