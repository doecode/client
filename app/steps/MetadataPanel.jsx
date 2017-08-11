import React from 'react';
import MetadataField from '../field/MetadataField';
import {observer,Provider} from "mobx-react";
import Metadata from '../stores/Metadata';
import staticContstants from '../staticJson/constantLists';

const metadata = new Metadata();

@observer
export default class MetadataPanel extends React.Component {

	constructor(props) {
		super(props);
		this.checkForProp = this.checkForProp.bind(this);
	}

	checkForProp() {

		const licenses = metadata.getValue("licenses");
    const hasProp = licenses.indexOf('Other') > -1;

		const propInfo = metadata.getFieldInfo("proprietary_url");
		if (hasProp) {
				propInfo.required = "pub";
				propInfo.Panel = "Product Description";
		} else {
			metadata.setValue("proprietary_url", "");
			propInfo.completed = false;
			propInfo.required = "";
			propInfo.Panel = "";
			propInfo.error = "";
		}
	}

	render() {

		  const propInfo = metadata.getFieldInfo("proprietary_url");


		return (
                <div className="container-fluid form-horizontal">
                    <div className="row">
                        <div className="col-md-8 col-xs-12">
                            <div className="form-horizontal">
                                {metadata.getValue("repository_link") &&
                                <MetadataField field="repository_link" label="Repository Link: " elementType="display" />
                                }

                                <MetadataField field="software_title" label="Software Title" elementType="input" />
                                <MetadataField field="description" label="Description/Abstract" elementType="textarea" />
                                <MetadataField field="licenses" label="Licenses" elementType="select" changeCallback={this.checkForProp} options={staticContstants.licenseOptions} isArray={true} multi={true} placeholder="Select your license(s)" />
                                {propInfo.required &&
                                <MetadataField field="proprietary_url" label="Proprietary URL" elementType="input" />
                                }
                            </div>
                        </div>
                        <div className="col-md-4"></div>
                    </div>
                </div>
		);
	}




}
