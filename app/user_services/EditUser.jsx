import React from 'react';
import ReactDOM from 'react-dom';
import UserData from '../stores/UserData';
import UserField from '../field/UserField';
import Validation from '../utils/Validation';
import Password from '../fragments/Password';
import {doAjax, doAuthenticatedAjax, checkIsAuthenticated, appendQueryString, getQueryParam} from '../utils/utils';

const userData = new UserData();
const validation = new Validation();

export default class EditUser extends React.Component {
	constructor(props) {
	    super(props);
	    this.updateUser = this.updateUser.bind(this);
	    this.parseUpdateUser = this.parseUpdateUser.bind(this);
	    this.parseLoad = this.parseLoad.bind(this);
            this.updatePassword = this.updatePassword.bind(this);
            this.getAPIKey = this.getAPIKey.bind(this);
            this.parseAPI = this.parseAPI.bind(this);

	    this.state = {
	        updateUserSuccess: false,
                apiKeySuccess : false,
                apiKeyValue : "",
                showLoading : false
	    }

	}

	componentDidMount() {
	    checkIsAuthenticated();
	    userData.setValue("email", sessionStorage.user_email);
	}

	parseLoad(data) {
	    console.log(data);
	    userData.setValue("email", data.email);
	}

	updateUser() {
	    doAuthenticatedAjax('POST', "/doecode/api/user/update", this.parseRegister, userData.getData());
	}
        
        updatePassword(){
            
        }

	parseUpdateUser(data) {
	    console.log(data);
	}
        
        getAPIKey(){
        doAuthenticatedAjax('POST', "/doecode/api/user/newapikey", this.parseAPI, userData.getData());
                this.setState({
	        "showLoading": true,
	    });
        }
        
        parseAPI(data){
        this.setState({
	        "showLoading": false,
	    });
            console.log(JSON.stringify(data));
        }

	render() {

    const opts = [
      {label: 'Oak Ridge National Lab', value: 'ORNL'},
      {label: 'Office of Scientific and Technical Information', value: 'OSTI'}
      ];

                return(
                <div className="row not-so-wide-row">
                    <div className="col-md-3"> </div>
                    <div className="col-md-6 col-xs-12">
                        {/*Change Password*/}
                        <div className="row">
                            <div className='col-xs-12'>
                                <div className="panel panel-default">
                                    <div className="panel-heading account-panel-header">Change Password</div>
                                    <div className="panel-body">
                                        <Password button_text='Save Changes' button_action={this.updatePassword} show_email={false} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*Request Administrative Role*/}
                        <div className="row">
                            <div className="col-xs-12">
                                <div className="panel panel-default">
                                    <div className="panel-heading account-panel-header">User Role</div>
                                    <div className="panel-body account-panel-body">
                                        <UserField noExtraLabelText noval field="pending_role" label="Request Administrative Role" options={opts} elementType="select" />
                                        <br/>
                                        <button type="button" className="btn btn-lg btn-success" onClick={this.updateUser}>
                                            Update User
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/*Request API Key*/}
                        <div className="row">
                            <div className='col-xs-12'>
                                <div className="panel panel-default">
                                    <div className="panel-heading account-panel-header">API Key</div>
                                    <div className="panel-body">
                                        {this.state.apiKeySuccess &&
                                        <label>{this.state.apiKeyValue}</label>
                                        }
                                        {this.state.showLoading &&
                                            <img className='account-loading-image' src="https://m.popkey.co/163fce/Llgbv_s-200x150.gif"/>
                                        }
                                        <button type="button" className='btn btn-lg btn-success' onClick={this.getAPIKey}><span className='fa fa-key'></span> Generate Key</button>
                                    </div>
                                </div>
                            </div> 
                        </div>
                    </div>
                    <div className="col-md-3"> </div>
                </div>);

	}
}
