import React from 'react';
import AgentsModal from './AgentsModal';
import AgentsTable from './AgentsTable';
import TableStore from '../stores/TableStore';
import {observer} from 'mobx-react';
import EditableDataTable from './EditableDataTable';
import HelpTooltip from '../help/HelpTooltip';

const tableStore = new TableStore();

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

    return (
      <div className="container-fluid form-horizontal">
        <div className="row">
          <div className="col-md-9 col-xs-12">
            <div className="form-horizontal">
              <span className='fake-h2'>Related Identifiers</span>&nbsp;<HelpTooltip item="RelatedIdentifier"/>
              <EditableDataTable columns={columns} contentType={contentType} config={tableConfig} parentName={parentName}/>
            </div>
          </div>
          <div className="col-md-3"></div>
        </div>
      </div>
    );
  }
}
