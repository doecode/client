import React from 'react';
import MetadataField from '../field//MetadataField';
import {observer, Provider} from "mobx-react";
import HelpTooltip from '../help/HelpTooltip';

@observer
export default class RecipientStep extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="container-fluid form-horizontal">
        <span className='fake-h2 input-form-push-left'>Contact</span>&nbsp;<HelpTooltip item='ContactInformation'/>
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
