import React from 'react';
import Dropzone from 'react-dropzone';
import {Button} from 'react-bootstrap';
import MetadataField from '../field/MetadataField';
import {observer,Provider} from "mobx-react";
import Metadata from '../stores/Metadata';

const metadata = new Metadata();

@observer
export default class SupplementalInfoStep extends React.Component {

	constructor(props) {
		super(props);
		this.onDrop = this.onDrop.bind(this);
		this.deleteFile = this.deleteFile.bind(this);
	}

	onDrop(files) {
		console.log('Received files: ', files);
		metadata.setValue("files", files);
	}

	deleteFile() {
		metadata.setValue("files", []);
	}


	render() {

		const files = metadata.getValue("files");
		const accessibility = metadata.getValue("accessibility");

		const countries = [
			{label: 'United States', value: 'United States'},
			{label: 'Canada', value: 'Canada'},
			{label: 'France', value: 'France'},
			{label: 'Switzerland', value: 'Switzerland'},
			{label: 'United Kingdom', value: 'United Kingdom'}
			];



		return (

	            <div className="container-fluid form-horizontal">
	            	<MetadataField field="acronym" label="Short Title or Acronym" elementType="input"  />
	            	<MetadataField  field="country_of_origin" label="Country of Origin" options={countries} elementType="select"  />
	            	<MetadataField field="keywords" label="Keywords" elementType="input" />
	            	<MetadataField field="other_special_requirements" label="Other Special Requirements" elementType="input" />
	              <MetadataField field="site_accession_number" label="Site Accession Number" elementType="input"  />

								{(accessibility === 'ON' || accessibility === 'CS') &&
							<div className="form-group form-group-sm row">
							<div className="col-xs-8">
								<label className="form-label">
								File Upload
									</label>
								<div >
										<Dropzone onDrop={this.onDrop}>
										<h2> Drag files here or click to browse. </h2>
										</Dropzone>
								</div>

							</div>
							</div>


								}

								{files.length > 0 &&
							 <div className="form-group form-group-sm row">
							 <label className="col-sm-2">
							 Uploaded File
							 </label>
							 <div className="col-sm-4">

							 {files[0].name}
							 </div>
							 <div className="col-sm-4">
							 <Button bsStyle="danger" active onClick={this.deleteFile}> Delete File </Button>
							 </div>

							 </div>

								}
                </div>
		);
	}




}
