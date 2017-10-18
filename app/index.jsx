import SubmitForm from './form/SubmitForm';
import AnnounceForm from './form/AnnounceForm';
import AnnouncementInterface from './form/AnnouncementInterface';
import SubmissionInterface from './form/SubmissionInterface';
import Confirmation from './form/Confirmation';
import WorkflowManagement from './user_services/WorkflowManagement';
import ApprovalManagement from './user_services/ApprovalManagement';
import ApprovalForm from './form/ApprovalForm';
import Login from './user_services/Login';
import RegisterUser from './user_services/RegisterUser';
import Account from './user_services/Account';
import ConfirmUser from './user_services/ConfirmUser';
import ForgotPassword from './user_services/ForgotPassword';
import UserAdmin from './user_services/UserAdmin';
import Homepage from './dissemination/Homepage';
import AdvancedSearch from './dissemination/AdvancedSearch';
import ResultsPage from './dissemination/ResultsPage';
import BiblioPage from './dissemination/BiblioPage';
import AboutPage from './static_content/AboutPage';
import CommunicationsPage from './static_content/CommunicationsPage';
import PolicyPage from './static_content/PolicyPage';
import FAQPage from './static_content/FAQPage';
import ContactPage from './static_content/ContactPage';
import Disclaimer from './static_content/Disclaimer';
import ForbiddenPage from './static_content/ForbiddenPage';
import LogoutPage from './static_content/LogoutPage';
import Header from './wrapper/Header';
import Footer from './wrapper/Footer';
import HelpPage from './help/HelpPage';
import ErrorPage from './error/ErrorPage';
import React from 'react';
import ReactDOM from 'react-dom';
import RepositoryServices from './static_content/RepositoryServices';
import SecurityHostingPage from './static_content/SecurityHostingPage';
import {BrowserRouter as Router, Route, browserHistory, IndexRoute} from 'react-router-dom';

import purecss from './css/pure-min.css';
import bootstrapcss from './css/bootstrap.min.css';
import bootstrapthemecss from './css/bootstrap-theme.min.css';
import css from './css/main.css';

class DOECodeRouter extends React.Component {

  constructor(props) {
    super(props);
    /*If we're on the homepage, we have some different work to do*/
    const current_page = location.href.match(/([^\/]*)\/*$/)[1];
    this.outtermost_class_name = "";
    this.is_homepage = false;
    this.wrapper_class = " wrapper ";

    if (current_page === '' || current_page === '/' || current_page === 'doecode') {
      this.outtermost_class_name = 'homepage-outtermost-style';
      this.is_homepage = true;
      this.wrapper_class = " homepage-wrapper ";
    }
  }

  render() {
    return (

      <Router basename="/doecode" history={browserHistory}>
        <div className={this.outtermost_class_name}>
          <div className={this.wrapper_class}>
            <Header isHomepage={this.is_homepage}/>
            <div>
              <Route exact path="/" component={Homepage}/>
              <Route path="/submit" component={SubmitForm}/>
              <Route path="/submit2" component={AnnouncementInterface}/>
              <Route path="/announce" component={AnnounceForm}/>
              <Route path="/announce2" component={AnnouncementInterface}/>
              <Route path="/confirm" component={Confirmation}/>
              <Route path="/projects" component={WorkflowManagement}/>
              <Route path="/projects2" render={() => <WorkflowManagement wizardVersion="2"/>}/>
              <Route path="/pending" component={ApprovalManagement}/>
              <Route path="/approve" render={() => <ApprovalForm disabled="true"/>}/>
              <Route path="/register" component={RegisterUser}/>
              <Route path="/account" component={Account}/>
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
              <Route path="/forbidden" component={ForbiddenPage}/>
              <Route path="/logout" component={LogoutPage}/>
              <Route path="/help" component={HelpPage}/>
              <Route path="/forgot-password" component={ForgotPassword}/>
              <Route path="/error" component={ErrorPage}/>
              <Route path="/user-admin" component={UserAdmin}/>
              <Route path='/repository-services' component={RepositoryServices}/>
              <Route path='/security-hosting' component={SecurityHostingPage}/>
            </div>
          </div>
          <Footer is_homepage={this.is_homepage}/>
        </div>
      </Router>
    );
  }
}

ReactDOM.render(
  <DOECodeRouter/>, document.getElementById('root'));
