import React from 'react';
import MetadataField from '../field/MetadataField';
import {observer,Provider} from 'mobx-react';
import {Button} from 'react-bootstrap';
import Metadata from '../stores/Metadata';
import EntryStepStore from '../stores/EntryStepStore';

const metadata = new Metadata();

const entryStore = new EntryStepStore();

@observer
export default class InterfaceStep extends React.Component {

	constructor(props) {
		super(props);

		this.isValidated = this.isValidated.bind(this);
	}

	isValidated() {
		const panelStatus = metadata.getPanelStatus(this.props.name);
		const validated = !(panelStatus.errors || panelStatus.remainingRequired > 0);

		if (!validated)
			metadata.markPanelRequired(this.props.name);

	  return validated;
  }

	render() {
		 const panelStatus = metadata.getPanelStatus(this.props.name);

		return (
		<div className="step">
			<div className="row">

					<div className="interface-group">
						<label className="col-md-12 control-label interface-step">
							<h1>{this.props.name}</h1>
						</label>
						<hr />
						<div className="row">
							<div className="col-md-12">
									{this.props.panel}
							</div>
						</div>
					</div>

			</div>
		</div>
		);
	}

}
