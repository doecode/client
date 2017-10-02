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
          <div className='row'>
            <div className='col-md-5 col-xs-12 center-text'>
              <strong>Create a new project on our open source
                <br/>GitHub community:</strong>
              <br/>
              <br/>
              <br/>
              <ImageLink title='Github' imgID='repository-github-img' linkTarget='_blank' linkURL='https://github.com/doecode/' imageURL='https://www.osti.gov/includes/doecode/images/github.7433692cabbfa132f34adb034e7909fa.png'/>
              <br/>
              To join the community, please email&nbsp;<a title='Send email to doecoderepositories@osti.gov' href='mailto:doecoderepositories@osti.gov'>doecoderepositories@osti.gov</a>
            </div>
            <div className='col-md-2 col-xs-12 center-text'>
              <h2>OR</h2>
            </div>
            <div className='col-md-5 col-xs-12 center-text'>
              <strong>Create a new project on our internal&nbsp;
                <a title='DOE CODE Repository' href="http://gitlab.osti.gov/">DOE CODE repository</a>&nbsp; where you can control access to the project.
              </strong>
              <br/>
              <br/>
              <ImageLink title='Gitlab' imgID='repository-gitlab-img' linkTarget='_blank' linkURL='http://gitlab.osti.gov/' imageURL='https://www.osti.gov/includes/doecode/images/gitlab.png'/>
            </div>
          </div>
        </div>
        <div className="col-lg-3 col-md-1"></div>
      </div>
    );
  }
}
