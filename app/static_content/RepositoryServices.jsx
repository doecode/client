import React from 'react';
import ReactDOM from 'react-dom';
import {Modal, Button} from 'react-bootstrap';
import ImageLink from '../fragments/ImageLink';

export default class RepositoryServices extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="row not-so-wide-row">
        <div className="col-lg-3 col-md-1"></div>
        <div className="col-lg-6 col-md-10 col-xs-12 static-content">
          <h2 className="static-content-title">Repository Services</h2>
          <br/>
          <br/>
        </div>
        <div className="col-lg-3 col-md-1"></div>
        <div className='no-col-padding-left col-xs-12'>
          <div className="static-content repository-services-container center-text">
            <div className='repository-services-container'>
              <div className='center-text' id='github-repository-container'>
                <strong>Create a new project on
                  <br/>
                  our open source
                  <br/>GitHub community:</strong>
                <br/>
                <br/>
                <ImageLink title='Github' imgID='repository-github-img' linkTarget='_blank' linkURL='https://github.com/doecode/' imageURL='https://www.osti.gov/includes/doecode/images/github314X150.png'/>
              </div>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <div id='or-repository-container'>
                <span className='hide-xs'>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <br/>
                  <h2 style={{marginRight:'10px'}}>OR</h2>
                </span>
                <span className='hide-sm hide-md hide-lg'>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span className='fake-h2'>OR</span>
                </span>
              </div>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <div className='center-text' id='gitlab-repository-container'>
                <strong>Create a new project on our internal&nbsp;<br/>
                  <a target='_blank' title='DOE CODE Repository' href="http://gitlab.osti.gov/">DOE CODE repository</a>&nbsp;where you can<br/>control access to the project.
                </strong>
                <br/>
                <br/>
                <ImageLink title='Gitlab' imgID='repository-gitlab-img' linkTarget='_blank' linkURL='http://gitlab.osti.gov/' imageURL='https://www.osti.gov/includes/doecode/images/gitlab.png'/>
              </div>
            </div>
          </div>
        </div>
        <div className='col-xs-12 center-text'>
          <br/>
          <br/>
          To join the GitHub community or to use the internal DOE CODE GitLab repository, please email&nbsp;<a title='Send email to doecoderepositories@osti.gov' href='mailto:doecoderepositories@osti.gov'>doecoderepositories@osti.gov</a>.
        </div>
      </div>
    );
  }
}
