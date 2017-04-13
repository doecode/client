import React from 'react';
import Select from 'react-select';
import {observer} from "mobx-react";
import 'react-select/dist/react-select.css';

@observer
export default class AccessStep extends React.Component{
	constructor(props) {
		super(props);
		this.onLicensesChange = this.onLicensesChange.bind(this);
		this.onAccessLimitationsChange = this.onAccessLimitationsChange.bind(this);
		this.hasSubLimitations = this.hasSubLimitations.bind(this);
	    this.isValidated = this._isValidated.bind(this);
	    this.generateAccessLimitationOptions = this.generateAccessLimitationOptions.bind(this);
	}

	_isValidated() {

	}


	generateAccessLimitationOptions(accessLimitations) {
		let options = [];
		const firstOptions = [
			{label: '1. Unlimited Announcement (Available to US and Non-US public)', value: 'UNL'},
			{label: '2. Opennet', value: 'OPN'}
		];

		const secondOptions = [
			{label: '3. Copyrighted Material', value: 'CPY'},
			{label: '4. Small Business Innovation Research (SBIR) Data', value: 'SBIR'},
			{label: '5. Small Business Technology Transfer Research (STTR) Data', value: 'STTR'},
			{label: '6. Official Use Only', value: 'OUO'},
			{label: '6a. Export Controlled Information (e.g. under ITAR/EAR) (FOIA Exemption 3) - OUO', value: 'ECI'},
			{label: '6b. Security Sensitive Information (FOIA Exemption 7) - OUO', value: 'SSI'},
			{label: '6c. Protected Data - CRADA or OTHER (specify below) - OUO', value: 'PROT'},
			{label: '6d. Patent Pending (FOIA Exemption 3) - OUO', value: 'PAT'},
			{label: '6e. Limited Rights Data (Proprietary/Trade Secret) (FOIA Exemption 3) - OUO', value: 'PROP'},
			{label: '6f. Applied Technology (FOIA Exemption 5) - OUO', value: 'AT'},
			{label: '6g. Program-Determined Use Only (enter exemption number below) - OUO', value: 'PDOUO'},
			{label: '7. Naval Nuclear Propulsion Info (NNPI) - Limitations/Unclassified Control Info', value: 'NNPI'},
		];

		if (accessLimitations.length == 0) {
			options = firstOptions.concat(secondOptions);
		} else if (accessLimitations.indexOf('UNL') > -1 || accessLimitations.indexOf('OPN') > -1) {
			options = firstOptions;
		} else {
			options = secondOptions;

		}


		return options;
	}

	hasSubLimitations(accessLimitations) {
	    const subLimitations = ["ECI", "SSI", "PROT", "PAT", "PROP","AT","PDOUO"];
	    for (var i = 0; i < subLimitations.length; i++) {
	    	if (accessLimitations.indexOf(subLimitations[i]) > -1)
	    		return true;
	    }

	    return false;
	}

	onAccessLimitationsChange(value) {

		let access_limitations = this.props.metadata.getValue("access_limitations")
		if (value.trim())
			access_limitations = value.split(',');
		else
			access_limitations = [];

		const accessArray = access_limitations.slice();


	    if (this.hasSubLimitations(accessArray) && accessArray.indexOf('OUO') == -1)
	    	access_limitations.push('OUO');

	    this.props.metadata.setValue("access_limitations", access_limitations)
	}

	onLicensesChange(value) {

		if (value.trim())
			this.props.metadata.setValue("licenses",value.split(','));
		else
			this.props.metadata.setValue("licenses",[])
	}



	render() {

		const licenseOptions = [
			{label: 'None', value: 'None'},
			{label: 'Apache License 2.0', value: 'Apache License 2.0'},
			{label: 'GNU General Public License v3.0', value: 'GNU General Public License v3.0'},
			{label: 'MIT License', value: 'MIT License'},
			{label: 'BSD 2-clause "Simplified" License', value: 'BSD 2-clause "Simplified" License'},
			{label: 'BSD 3-clause "New" or "Revised" License', value: 'BSD 3-clause "New" or "Revised" License'},
			{label: 'Eclipse Public License 1.0', value: 'Eclipse Public License 1.0'},
			{label: 'GNU Affero General Public License v3.0', value: 'GNU Affero General Public License v3.0'},
			{label: 'GNU General Public License v2.0', value: 'GNU General Public License v2.0'},
			{label: 'GNU General Public License v2.1', value: 'GNU General Public License v2.1'},
			{label: 'GNU Lesser General Public License v2.1', value: 'GNU Lesser General Public License v2.1'},
			{label: 'GNU Lesser General Public License v3.0', value: 'GNU Lesser General Public License v3.0'},
			{label: 'Mozilla Public License 2.0', value: 'Mozilla Public License 2.0'},
			{label: 'The Unlicense', value: 'The Unlicense'}
			];

		const metadata = this.props.metadata;
		const access_limitations = metadata.getValue("access_limitations");
		const licenses = metadata.getValue("licenses");
		let accessLimitationOptions = this.generateAccessLimitationOptions(access_limitations);

		
		return(
		<div className="form-group">
			<div className="col-sm-offset-2 col-sm-8">
				<h2 className="section-heading">Licenses</h2>
				<Select multi simpleValue placeholder="Select your license(s)" options={licenseOptions} value={licenses.slice()} onChange={this.onLicensesChange}/>
			</div>
			<div className="col-sm-offset-2 col-sm-8">
				<h2 className="section-heading">Intellectual Property/Distribution Limitations</h2>
				<Select multi simpleValue placeholder="Select all that apply" options={accessLimitationOptions} value={access_limitations.slice()} onChange={this.onAccessLimitationsChange}/>
			</div>
		</div>
		);
	}


}
