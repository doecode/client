import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, appendQueryString} from '../utils/utils';
import {observer} from "mobx-react";
import Metadata from '../stores/Metadata';
import VMetadata from '../stores/VMetadata';
import EntryStep from './EntryStep';
import AgentsStep from './AgentsStep';
import OrgsStep from './OrgsStep';
import MetadataStep from './VMetadataStep';
import AccessStep from './AccessStep';
import RecipientStep from './RecipientStep';
import ConfirmStep from './ConfirmStep';
import RIsStep from './RIsStep';
import {PanelGroup, Panel} from 'react-bootstrap';

import css from '../css/main.css';

const metadataStore = new Metadata();
const vMetadata = new VMetadata();
let steps = [];

@observer
export default class DOECodeWizard extends React.Component {
    constructor(props) {
        super(props);

        this.getSubmitPromise = this.getSubmitPromise.bind(this);
        this.parseLoadResponse = this.parseLoadResponse.bind(this);
        this.autopopulate = this.autopopulate.bind(this);
        steps =
        	[
        		{name: 'Repository Information', component: <EntryStep metadataStore={metadataStore}  autopopulate={this.autopopulate}/> },
        		{name: 'Product Description', component: <MetadataStep metadataStore={vMetadata}/>},
        		{name: 'Licenses & Access Limitations', component: <AccessStep metadataStore={metadataStore}/>},
        		{name: 'Developers & Contributors', component: <AgentsStep metadataStore={metadataStore} />},
        		{name: 'Organizations', component: <OrgsStep metadataStore={metadataStore}/>},
        		{name: 'Identifiers', component: <RIsStep metadataStore={metadataStore}/>},
        		{name: 'Recipient Information', component: <RecipientStep metadataStore={metadataStore}/>},
        		{name: 'Summary', component: <ConfirmStep metadataStore={metadataStore}/> }
        		];
        for (var i = 0; i < steps.length; i++)
        	steps[i].key = "" + (i+1);
    }

    autopopulate(event) {
    	doAjax('GET', "/api/metadata/autopopulate?repo=" + metadataStore.metadata.repository_link,this.parseLoadResponse);
    	event.preventDefault();
    }


    parseLoadResponse(responseData) {
        metadataStore.updateMetadata(responseData.metadata);
    }

    getSubmitPromise() {
      var self = this;
		return new Promise((resolve,reject) => {
		    $.ajax({
		        url: "/api/metadata",
		        cache: false,
		        method: 'POST',
		        dataType: 'json',
		        data: JSON.stringify(metadataStore.metadata),
		        contentType: "application/json; charset=utf-8",
		        success: function(data) {
		        	console.log(data);
                    metadataStore.metadata.code_id = data.metadata.code_id;
		        	resolve();

		        },
		        error: function(x,y,z) {
		        	console.log("got an error");
		        	reject();
		        }
		      });

		});
    }

    render() {

        let content = <PanelGroup defaultActiveKey="1" accordion>
        {steps.map(function(obj) {

        let heading = obj.name;
        let panelStyle = "default";

        const panelStatus = metadataStore.getPanelStatus(obj.key);
        if (panelStatus.hasRequired) {
             if (panelStatus.remainingRequired > 0)
                  heading += " (" + panelStatus.remainingRequired + " Required Field(s) Remaining)";
             else {
                 heading += " (All Required Fields Completed) ";
                 panelStyle = "success";
             }
        }


        if (panelStatus.hasOptional) {
             if (panelStatus.remainingOptional > 0)
                  heading += " (" + panelStatus.remainingOptional + " Optional Field(s) Remaining)";
             else
                 heading += " (All Optional Fields Completed) ";
        }
        
        if (panelStatus.errors) {
        	
        	heading += " This section contains errors. "
        	panelStyle = "danger";
        }
        return <Panel header={heading} bsStyle={panelStyle} eventKey={obj.key} key={obj.key}>

      	<div>
      	<div className="row">

        <div className="col-sm-12">
		<button type="button" className="btn btn-info btn-lg pull-right">
		Save Your Progress
		</button>
		</div>


		</div>

		</div>
		
        {panelStatus.errors &&
        <div className="error-color">
        <h3> <b> {panelStatus.errors} </b> </h3>
        </div>
        }

        {obj.component}

        </Panel>
        })
        }
        </PanelGroup>
        return (


      <div>




        <div className="form-group form-group-sm row">
        <div className="col-sm-offset-4">
        <h1> Create a new software record </h1>
        </div>
        </div>



            {content}
       <div className="row">

		<div className="col-sm-10">
		<button type="button" className="btn btn-lg btn-default pull-right">
		Publish
		</button>
		</div>

       <div className="col-sm-2">
		<button type="button" className="btn btn-primary btn-lg pull-right">
		Publish and Submit
		</button>
		</div>


	  </div>



    </div>

        );
    }
}
