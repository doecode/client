import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, appendQueryString} from '../utils/utils';
import {observer} from "mobx-react";
import Metadata from '../stores/Metadata';
import EntryStep from './EntryStep';
import AgentsStep from './AgentsStep';
import OrgsStep from './OrgsStep';
import MetadataPanel from './MetadataPanel';
import AccessStep from './AccessStep';
import RecipientStep from './RecipientStep';
import ConfirmStep from './ConfirmStep';
import RIsStep from './RIsStep';
import {PanelGroup, Panel} from 'react-bootstrap';

import css from '../css/main.css';

const metadata = new Metadata();

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
        		{name: 'Repository Information', component: <EntryStep metadata={metadata} autopopulate={this.autopopulate}/> },
        		{name: 'Product Description', component: <MetadataPanel metadata={metadata}/>},
        		{name: 'Licenses & Access Limitations', component: <AccessStep metadata={metadata} />},
        		{name: 'Developers & Contributors', component: <AgentsStep metadata={metadata} />},
        		];

        /*
         *         		{name: 'Developers & Contributors', component: <AgentsStep metadata={metadata} />},
        		{name: 'Organizations', component: <OrgsStep metadata={metadata}/>},
        		{name: 'Identifiers', component: <RIsStep metadata={metadata}/>},
        		{name: 'Recipient Information', component: <RecipientStep metadata={metadata}/>},
        		{name: 'Summary', component: <ConfirmStep metadata={metadata}/> }
         */
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

      const info = metadata.infoSchema;

        let content = <PanelGroup defaultActiveKey="1" accordion>
        {steps.map(function(obj) {

        let heading = obj.name;
        let panelStyle = "default";


        const panelStatus = metadata.getPanelStatus(info,obj.key);
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
