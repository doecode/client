import DOECodeWizard from './components/DOECodeWizard';
import Confirmation from './confirmation/Confirmation';
import WorkflowManagement from './user/WorkflowManagement';
import Login from './authentication/Login';
import RegisterUser from './authentication/RegisterUser';
import ConfirmUser from './authentication/ConfirmUser';
import Splash from './splash/Splash';
<<<<<<< HEAD
import AdvancedSearch from './dissemination/AdvancedSearch';
=======
import BiblioPage from './dissemination/BiblioPage';
>>>>>>> Beginning biblio work
import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, browserHistory,IndexRoute} from 'react-router';

class DOECodeRouter extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (
		<Router history={browserHistory}>
			<Route path="/" component={Splash}/>
			<Route path="/wizard" component={DOECodeWizard}/>
			<Route path="/confirm" component={Confirmation}/>
			<Route path="/projects" component={WorkflowManagement}/>
<<<<<<< HEAD
			<Route path="/register" component={RegisterUser}/>
			<Route path="/login" component={Login}/>
			<Route path = "/confirmuser" component={ConfirmUser}/>
			<Route path="/search" component={AdvancedSearch}/>
=======
			<Route path="/biblio" component={BiblioPage}/>
>>>>>>> Beginning biblio work
		</Router>
		);
	}
}

ReactDOM.render(
    <DOECodeRouter/>, document.getElementById('root'));
