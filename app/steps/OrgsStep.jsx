import React from 'react';
import AgentsModal from './AgentsModal';
import TableStore from '../stores/TableStore';
import EditableDataTable from './EditableDataTable';
import {observer} from 'mobx-react';
import {Tabs, Tab} from 'react-bootstrap';
import Promise from 'promise';
import HelpTooltip from '../help/HelpTooltip';
import Metadata from '../stores/Metadata';

const tableStore = new TableStore();
const metadata = new Metadata();

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

    const panelStatus = metadata.getPanelStatus("Organizations");
    const isRequired = panelStatus.hasRequired;

    const devArray = metadata.getValue(parentName);
    const devArrayCount = (devArray ? devArray.length : 0);

    const divStyle = (devArrayCount > 0 ? "has-success " : "");
    const labelStyle = "control-label" + (isRequired ? " req" : "");

    const contentSO = parentName === 'sponsoring_organizations' && <EditableDataTable contentType={contentType} columns={columns} config={tableConfig} parentName={parentName}/>
    const contentRO = parentName === 'research_organizations' && <EditableDataTable contentType={contentType} columns={columns} config={tableConfig} parentName={parentName}/>

    return (
      <div className="container-fluid form-horizontal">
        <div className="row">
          <div>
            <div className="form-horizontal">
              <Tabs activeKey={this.state.key} onSelect={this.onTabSelect} id="orgsStepTabs">
                <Tab eventKey={0} title="Sponsoring Organizations">
                  <div className={divStyle}>
                    <br />
  									<label className={labelStyle}>Sponsoring Organizations</label> &nbsp;<HelpTooltip item='SponsoringOrg'/>
                    {contentSO}
                  </div>
                </Tab>
                <Tab eventKey={1} title="Research Organizations">
                  <div className={divStyle}>
                    <br />
  									<label className={labelStyle}>Research Organizations</label> &nbsp;<HelpTooltip item='ResearchOrg'/>
                    {contentRO}
                  </div>
                </Tab>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
