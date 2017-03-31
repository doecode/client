import React from 'react';
import ReactDOM from 'react-dom';
import {doAjax, appendQueryString} from '../utils/utils';
import {observer} from "mobx-react";
import Metadata from '../stores/Metadata';
import EntryStep from './EntryStep';
import AgentsStep from './AgentsStep';
import OrgsStep from './OrgsStep';
import MetadataStep from './MetadataStep';
import AccessStep from './AccessStep';
import ConfirmStep from './ConfirmStep';
import RIsStep from './RIsStep';
import StepZilla from 'react-stepzilla';
import {PanelGroup, Panel, ButtonGroup, Button, ButtonToolbar} from 'react-bootstrap';

import css from '../css/main.css';

const metadataStore = new Metadata();
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
        		{name: 'Product Description', component: <MetadataStep metadataStore={metadataStore}/>},
        		{name: 'Licenses & Access Limitations', component: <AccessStep metadataStore={metadataStore}/>},
        		{name: 'Developers & Contributors', component: <AgentsStep metadataStore={metadataStore} />},
        		{name: 'Organizations', component: <OrgsStep metadataStore={metadataStore}/>},
        		{name: 'Identifiers', component: <RIsStep metadataStore={metadataStore}/>},
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
                    metadataStore.finished = true;
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
        return <Panel header={obj.name} eventKey={obj.key} key={obj.key}> {obj.component} </Panel>
        })
        }
        </PanelGroup>
        return (


      <div>

      	<div container="fluid">
      	<div className="row">
        
        <div className="col-sm-4">
		<Button bsStyle="info" bsSize="large" >
		Save Your Progress
		</Button>
		</div>
		
        <div className="col-sm-offset-4 col-sm-4">
        <ButtonToolbar>
		<Button bsSize="large" >
		Publish 
		</Button>
		<Button bsStyle="primary" bsSize="large" >
		Publish and Submit 
		</Button>
		</ButtonToolbar>
		</div>
		
		</div>
		</div>


            {content}


            

    </div>
            
        );
    }
}
