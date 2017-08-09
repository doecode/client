import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import {doAjax, doAuthenticatedAjax, appendQueryString, getQueryParam} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class EditUser extends React.Component {
	constructor(props) {
		super(props);
		this.updateUser = this.updateUser.bind(this);
		this.parseUpdateUser = this.parseUpdateUser.bind(this);
		this.parseLoad = this.parseLoad.bind(this);

		this.state = {success: false}

	}

  componentDidMount() {
      doAuthenticatedAjax('GET',"/doecode/api/user/load", this.parseLoad);
  }

  parseLoad(data) {
		 console.log(data);
     userData.setValue("email", data.email);
  }

	updateUser() {
      console.log(userData.getData());
    	doAuthenticatedAjax('POST',"/doecode/api/user/update", this.parseRegister, userData.getData())
	}

	parseUpdateUser(data) {
		console.log(data);
	}



	render() {

    const opts = [
      {label: 'Oak Ridge National Lab', value: 'ORNL'},
      {label: 'Office of Scientific and Technical Information', value: 'OSTI'}
      ];

		const content =
                <div className="row not-so-wide-row">
                    <div className="col-md-3"> </div>
                    <div className="col-md-3 col-xs-12">
                        <UserField noExtraLabelText field="email" label="Email Address" elementType="input"/>
                        <UserField noExtraLabelText noval field="pending_role" label="Request Administrative Role" options={opts} elementType="select" />
                        <button type="button" className="btn btn-lg btn-success" onClick={this.updateUser}>
                            Update User
                        </button>
                        <br/>
                    </div>
                    <div className="col-md-3"> </div>
                </div>;
		return(
		<div className="container-fluid form-horizontal">

		{content}

  </div>);

	}
}
