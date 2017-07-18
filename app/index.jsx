import DOECodeWizard from './components/DOECodeWizard';
import Confirmation from './confirmation/Confirmation';
import WorkflowManagement from './user_services/WorkflowManagement';
import Login from './user_services/Login';
import RegisterUser from './user_services/RegisterUser';
import ConfirmUser from './user_services/ConfirmUser';
import Splash from './splash/Splash';
import AdvancedSearch from './dissemination/AdvancedSearch';
import BiblioPage from './dissemination/BiblioPage';
import Wrapper from './wrapper/Wrapper';
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
			<Route path="/" component={Wrapper}>
				<IndexRoute component={Splash}/>
				<Route path="/wizard" component={DOECodeWizard}/>
				<Route path="/confirm" component={Confirmation}/>
				<Route path="/projects" component={WorkflowManagement}/>
				<Route path="/register" component={RegisterUser}/>
				<Route path="/login" component={Login}/>
				<Route path = "/confirmuser" component={ConfirmUser}/>
				<Route path="/search" component={AdvancedSearch}/>
				<Route path="/biblio" component={BiblioPage}/>
		 </Route>


		</Router>
		);
	}
}

ReactDOM.render(
    <DOECodeRouter/>, document.getElementById('root'));
