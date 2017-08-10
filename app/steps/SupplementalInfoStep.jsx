import React from 'react';
import Dropzone from 'react-dropzone';
import {Button} from 'react-bootstrap';
import MetadataField from '../field/MetadataField';
import {observer,Provider} from "mobx-react";
import Metadata from '../stores/Metadata';
import staticLists from '../staticJson/staticLists';

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
	  const fileInfo = metadata.getFieldInfo("files");
		fileInfo.completed = true;
	}

	deleteFile() {
		metadata.setValue("files", []);
		const fileInfo = metadata.getFieldInfo("files");
		fileInfo.completed = false;
	}


	render() {

		const files = metadata.getValue("files");
		const filesInfo = metadata.getFieldInfo("files");

		let fileName = files;
		if (Array.isArray(files.slice()) && files.length > 0) {
		fileName = files[0].name;
		}
		const accessibility = metadata.getValue("accessibility");

			const acceptedFileTypes = ".zip,.tar,.tar.gz,.tar.bz2,.jar,.war"
			let fileLabelText = "File Upload (Optional Field)";

			if (window.location.pathname == '/doecode/submit') {
					 fileLabelText = "File Upload (Required Field)";
			}




		return (

                <div className="container-fluid form-horizontal">
                    <div className="row">
                        <div className="col-md-8 col-xs-12">
                            <MetadataField field="acronym" label="Short Title or Acronym" elementType="input"  />
                            <MetadataField field="country_of_origin" label="Country of Origin" options={staticLists.countries} elementType="select" />
                            <MetadataField field="keywords" label="Keywords" elementType="input" />
                            <MetadataField field="other_special_requirements" label="Other Special Requirements" elementType="input" />
                            <MetadataField field="site_accession_number" label="Site Accession Number" elementType="input"  />

                            {(accessibility === 'ON' || accessibility === 'CS') &&
                            <div className="form-group form-group-sm row">
                                <div className="col-xs-8">
                                    <label htmlFor="file_upload" className={filesInfo.error ? "has-error error-color field-error form-label" : "form-label"}>
                                        File Upload
                                    </label>
                                    <div >
                                        <Dropzone name="file_upload" accept={acceptedFileTypes} onDrop={this.onDrop}>
                                            <h2> Drag files here or click to browse. </h2>
                                        </Dropzone>
                                    </div>
																		{filesInfo.error &&
														        <span className="error-color">
														        <strong>{filesInfo.error} </strong>
														        </span>
														        }
                                </div>
                            </div>


                            }

                            {files.length > 0 &&
                            <div className="form-group form-group-sm row">
                                <label className="col-sm-2">
                                    Uploaded File
                                </label>
                                <div className="col-sm-4">

                                    {fileName}
                                </div>
                                <div className="col-sm-4">
                                    <Button bsStyle="danger" active onClick={this.deleteFile}> Delete File </Button>
                                </div>

                            </div>

                            }
                        </div>
                    </div>
                </div>
		);
	}




}
