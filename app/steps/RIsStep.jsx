import React from 'react';
import AgentsModal from './AgentsModal';
import TableStore from '../stores/TableStore';
import {observer} from 'mobx-react';
import EditableDataTable from './EditableDataTable';
import HelpTooltip from '../help/HelpTooltip';
import Metadata from '../stores/Metadata';

const tableStore = new TableStore();
const metadata = new Metadata();

@observer
export default class RIsStep extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {

    const tableConfig = [
      {
        "columnName": "place",
        "order": 1,
        "locked": false,
        "visible": true,
        "displayName": "#"

      }, {
        "columnName": "identifier_type",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Identifier Type"
      }, {
        "columnName": "relation_type",
        "order": 3,
        "locked": false,
        "visible": true,
        "displayName": "Relation Type"

      }, {
        "columnName": "identifier_value",
        "order": 4,
        "locked": false,
        "visible": true,
        "displayName": "Identifier"
      }
    ];

    const parentName = "related_identifiers";
    const contentType = "RIs";
    let columns = ["identifier_type", "relation_type", "identifier_value"];

    const panelStatus = metadata.getPanelStatus("Identifiers");
    const isRequired = panelStatus.hasRequired;

    const devArray = metadata.getValue(parentName);
    const devArrayCount = (devArray ? devArray.length : 0);

    const divStyle = (devArrayCount > 0 ? "has-success " : "");
    const labelStyle = "control-label" + (isRequired ? " req" : "");

    return (
      <div className="container-fluid form-horizontal">
        <div className="row">
          <div className={divStyle}>
            <div className="form-horizontal">
              <label className={labelStyle}>Related Identifiers</label>&nbsp;<HelpTooltip item="RelatedIdentifier"/>
              <br/>
              <EditableDataTable columns={columns} contentType={contentType} config={tableConfig} parentName={parentName}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
