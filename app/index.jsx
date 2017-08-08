import DOECodeWizard from './components/DOECodeWizard';
import DOECodeSubmissionInterface from './components/DOECodeSubmissionInterface';
import Confirmation from './confirmation/Confirmation';
import WorkflowManagement from './user_services/WorkflowManagement';
import Login from './user_services/Login';
import RegisterUser from './user_services/RegisterUser';
import EditUser from './user_services/EditUser';
import ApproveRoles from './user_services/ApproveRoles';
import ChangePassword from './user_services/ChangePassword';
import ConfirmUser from './user_services/ConfirmUser';
import Splash from './splash/Splash';
import AdvancedSearch from './dissemination/AdvancedSearch';
import ResultsPage from './dissemination/ResultsPage';
import BiblioPage from './dissemination/BiblioPage';
import AboutPage from './static_content/AboutPage';
import CommunicationsPage from './static_content/CommunicationsPage';
import PolicyPage from './static_content/PolicyPage';
import FAQPage from './static_content/FAQPage';
import ContactPage from './static_content/ContactPage';
import Disclaimer from './static_content/Disclaimer';
import Header from './wrapper/Header';
import Footer from './wrapper/Footer';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router, Route, browserHistory,IndexRoute} from 'react-router-dom';

import css from './css/main.css';
class DOECodeRouter extends React.Component {

	constructor(props) {
		super(props);
	}

	render() {
		return (

                <Router basename="/doecode" history={browserHistory}>
                    <div>
                        <div className="wrapper">
                            <Header/>
                            <div>
                                <Route exact path="/" component={Splash}/>
                                <Route path="/publish" component={DOECodeWizard}/>
                                <Route path="/publish2" component={DOECodeSubmissionInterface}/>
                                <Route path="/submit" component={DOECodeWizard}/>
                                <Route path="/confirm" component={Confirmation}/>
                                <Route path="/projects" component={WorkflowManagement}/>
                                <Route path="/register" component={RegisterUser}/>
                                <Route path="/account" component={EditUser}/>
                                <Route path="/admin" component={ApproveRoles}/>
                                <Route path="/changepassword" component={ChangePassword}/>
                                <Route path="/login" component={Login}/>
                                <Route path="/confirmuser" component={ConfirmUser}/>
                                <Route path="/search" component={AdvancedSearch}/>
                                <Route path="/results" component={ResultsPage}/>
                                <Route path="/biblio" component={BiblioPage}/>
                                <Route path="/about" component={AboutPage}/>
                                <Route path="/communications" component={CommunicationsPage}/>
                                <Route path="/policy" component={PolicyPage}/>
                                <Route path="/faq" component={FAQPage}/>
                                <Route path="/contact" component={ContactPage}/>
                                <Route path="/disclaimer" component={Disclaimer}/>
                            </div>
                        </div>
                        <Footer/>
                    </div>
                </Router>
		);
	}
}

ReactDOM.render(
    <DOECodeRouter/>, document.getElementById('root'));
