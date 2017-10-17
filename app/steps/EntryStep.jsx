import React from 'react';
import MetadataField from '../field/MetadataField';
import {observer, Provider} from 'mobx-react';
import {Button} from 'react-bootstrap';
import Metadata from '../stores/Metadata';
import HelpTooltip from '../help/HelpTooltip';
import EntryStepStore from '../stores/EntryStepStore';

const metadata = new Metadata();

const entryStore = new EntryStepStore();

@observer
export default class EntryStep extends React.Component {

  constructor(props) {
    super(props);
    this.onRadioChange = this.onRadioChange.bind(this);

  }

  onRadioChange(field, value) {
    let stateObj = this.state;
    metadata.setValue("accessibility", value);
    const landingPageInfo = metadata.getFieldInfo("landing_page");
    const repoLinkInfo = metadata.getFieldInfo("repository_link");
    const fileInfo = metadata.getFieldInfo("file_name");
    if (value === 'OS') {
      metadata.setValue("open_source", true);
      metadata.setValue("files", []);
      metadata.setValue("landing_page", "");
      repoLinkInfo.required = "sub";
      repoLinkInfo.Panel = "Repository Information";
      landingPageInfo.required = "";
      landingPageInfo.error = "";
      landingPageInfo.Panel = "";
      landingPageInfo.completed = false;
      fileInfo.required = "";
      fileInfo.Panel = "";
      fileInfo.completed = false;

    } else {
      metadata.setValue("repository_link", "");
      repoLinkInfo.required = "";
      repoLinkInfo.error = "";
      repoLinkInfo.completed = false;
      repoLinkInfo.Panel = "";
      landingPageInfo.required = "sub";
      landingPageInfo.Panel = "Repository Information";
      fileInfo.required = this.props.page == 'announce' ? "announ" : "";
      fileInfo.Panel = "Supplemental Product Information";
    }

    if (value === 'CS') {
      metadata.setValue("open_source", false);
    } else {
      metadata.setValue("open_source", true);
    }

  }

  render() {
    const accessibility = metadata.getValue("accessibility");

    const divStyle = (accessibility ? "has-success " : "") + "col-xs-12";

    return (

      <div className="container-fluid form-horizontal">

        <div className="form-group form-group-sm row">
          <div className="col-xs-12 input-form-push-left">
            <h3>Please describe the availability of your software:</h3>
          </div>
        </div>
        <div className="row">
          <div className={divStyle}>
            <fieldset className="entry-group radiogroup">
            <legend className="entry-legend"><label className="control-label req">Project Type</label></legend>
            <MetadataField checked={accessibility === 'OS'} elementType="radio" label="Open Source, Publicly Available Repository" field="availability" value="OS" onChange={this.onRadioChange} helpTooltip='OpenSourcePublic' tooltipShort/>
            <MetadataField checked={accessibility === 'ON'} elementType="radio" label="Open Source, No Publicly Available Repository" field="availability" value="ON" onChange={this.onRadioChange} helpTooltip='OpenSourceNotPublic'/>
            <MetadataField checked={accessibility === 'CS'} elementType="radio" label="Closed Source" field="availability" value="CS" onChange={this.onRadioChange} helpTooltip='ClosedSource'/>
            </fieldset>
          </div>
        </div>
        {accessibility === 'OS' && <div className="row">
          <div className="col-md-8 col-xs-12">
            <MetadataField field="repository_link" label="Repository Link" elementType="input" messageNode="Git Repositories Only" helpTooltip='RepositoryLink'/>
          </div>
          <div className="col-md-4"></div>
        </div>}

        {accessibility === 'OS' && <div className="form-group form-group-sm row">
          <div className="col-xs-12">
            <button title='Autopopulate from Repository' className='Autopopulate from Repository' className="pure-button pure-button-primary btn-sm" onClick={this.props.autopopulate}>
              Autopopulate from Repository</button>&nbsp;<HelpTooltip shortVersion item='Autopopulate'/>
          </div>
        </div>}

        {(accessibility === 'ON' || accessibility === 'CS') && <div className="row">
          <div className="col-md-8 col-xs-12">
            <MetadataField field="landing_page" label="Landing Page" elementType="input" helpTooltip='LandingPage'/>
          </div>
          <div className="col-md-4"></div>
        </div>}

      </div>
    );
  }

}
