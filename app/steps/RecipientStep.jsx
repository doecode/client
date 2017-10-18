import React from 'react';
import MetadataField from '../field//MetadataField';
import {observer, Provider} from "mobx-react";
import HelpTooltip from '../help/HelpTooltip';
import Metadata from '../stores/Metadata';

const metadata = new Metadata();

@observer
export default class RecipientStep extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

  const panelStatus = metadata.getPanelStatus("Contact Information");
  const isRequired = panelStatus.hasRequired;

  const dataCount = panelStatus.completedOptional;

  const divStyle = (dataCount ? "has-success " : "");
  const labelStyle = "control-label input-form-push-left" + (isRequired ? " req" : "");

    return (
      <div className="container-fluid form-horizontal">
        <div className={divStyle}>
            <label className={labelStyle}>Contact</label>&nbsp;<HelpTooltip item='ContactInformation'/>
        </div>
        <p><br /></p>
        <div className="row">
          <div className="col-md-8 col-xs-12">
            <div className="form-horizontal">
              <MetadataField field="recipient_name" label="Name" elementType="input"/>
              <MetadataField field="recipient_email" label="Email" elementType="input"/>
              <MetadataField field="recipient_phone" label="Phone" elementType="input"/>
              <MetadataField field="recipient_org" label="Organization" elementType="input"/>
            </div>
          </div>
          <div className="col-md-4"></div>
        </div>
      </div>
    );
  }

}
