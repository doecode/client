import React from 'react';
import AgentsModal from './AgentsModal';
import AgentsTable from './AgentsTable';
import TableStore from '../stores/TableStore';
import EditableDataTable from './EditableDataTable';
import {observer} from 'mobx-react';
import {Tabs, Tab} from 'react-bootstrap';
import Promise from 'promise';
import HelpTooltip from '../help/HelpTooltip';

const tableStore = new TableStore();

@observer
export default class OrgsStep extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      "key": 0
    };

    this.onTabSelect = this.onTabSelect.bind(this);
  }

  onTabSelect(key) {
    this.setState({"key": key});
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
        "columnName": "organization_name",
        "order": 2,
        "locked": false,
        "visible": true,
        "displayName": "Name"
      }, {
        "columnName": "primary_award",
        "order": 3,
        "locked": false,
        "visible": true,
        "displayName": "Primary Award Number"
      }, {
        "columnName": "award_numbers",
        "order": 4,
        "locked": false,
        "visible": true,
        "displayName": "Additional Awards"
      }, {
        "columnName": "br_codes",
        "order": 5,
        "locked": false,
        "visible": true,
        "displayName": "B&R Codes"
      }, {
        "columnName": "fwp_numbers",
        "order": 6,
        "locked": false,
        "visible": true,
        "displayName": "FWP Numbers"
      }
    ];

    const opts = ["sponsoring_organizations", "research_organizations"];
    const parentName = opts[this.state.key];
    const contentType = "Orgs";
    let columns = ["organization_name"];
    if (parentName === 'sponsoring_organizations') {
      columns.push("primary_award");
    }

    const contentSO = parentName === 'sponsoring_organizations' && <EditableDataTable contentType={contentType} columns={columns} config={tableConfig} parentName={parentName}/>
    const contentRO = parentName === 'research_organizations' && <EditableDataTable contentType={contentType} columns={columns} config={tableConfig} parentName={parentName}/>

    return (
      <div className="container-fluid form-horizontal">
        <div className="row">
          <div className="col-xs-12">
            <div className="form-horizontal">
              <Tabs activeKey={this.state.key} onSelect={this.onTabSelect} id="orgsStepTabs">
                <Tab eventKey={0} title="Sponsoring Organizations">
									<span className='fake-h2'>Sponsoring Organizations</span> &nbsp;<HelpTooltip item='SponsoringOrg'/>
                  {contentSO}
                </Tab>
                <Tab eventKey={1} title="Research Organizations">
									<span className='fake-h2'>Research Organizations</span> &nbsp;<HelpTooltip item='ResearchOrg'/>
                  {contentRO}
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
