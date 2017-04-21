import DOECodeWizard from './components/DOECodeWizard';
import Confirmation from './confirmation/Confirmation';
import Splash from './splash/Splash';
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
		</Router>
		);
	}
}

ReactDOM.render(
    <DOECodeRouter/>, document.getElementById('root'));
