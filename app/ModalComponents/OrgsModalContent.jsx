import React from 'react';
import staticLists from '../staticJson/staticLists';
import {observer} from "mobx-react";
import SponsoringOrganization from '../stores/SponsoringOrganization';

const sponsoringOrganization = new SponsoringOrganization();


@observer
export default class OrgsModalContent extends React.Component {

	constructor(props) {
		super(props);
	}

	toggleCallback() {
		  const awardInfo = sponsoringOrganization.getFieldInfo("primary_award");
			if (sponsoringOrganization.getValue("DOE")) {
				 awardInfo.validations = ["awardnumber"];
				 awardInfo.required = true;
			} else {
				awardInfo.validations = [];
				awardInfo.required = false;
			}
			sponsoringOrganization.validateField("primary_award");
	}

	render() {

		let orgNames = [];

				const SpecificField = this.props.SpecificField;
				const data = this.props.data;



				if (this.props.type == 'sponsoring_organizations') {
					orgNames = staticLists.sponsorOrgs;
				} else if (this.props.type == 'research_organizations') {
					orgNames = staticLists.researchOrgs;
				}



		return(

            <div className="container-fluid form-horizontal">

                    <SpecificField field="DOE" label="DOE Organization?" helpTooltip='SponsorOrgDOEOrg' elementType="checkbox" toggleCallback={this.toggleCallback}  />
                    <SpecificField  field="organization_name" label="Name" helpTooltip='SponsorOrgName' elementType="select" allowCreate={true} placeholder="Enter or select from the list your organization" options={orgNames}   />
                    {data.getValue("primary_award") !== undefined &&
                    <SpecificField  field="primary_award" label="Primary Award" helpTooltip='SponsorOrgContractNumber' elementType="input"  />
                    }

                    {this.props.data.getValue("award_numbers") !== undefined &&
                    <SpecificField field="award_numbers" label="Additional Awards" helpTooltip='SponsorOrgAdditionalRewards' elementType="select" allowCreate={true} isArray={true} multi={true} placeholder="Enter any additional awards"   />
                    }

                    {this.props.data.getValue("br_codes") !== undefined &&
                    <SpecificField field="br_codes" label="B&R Codes" elementType="select" helpTooltip='SponsorOrgBRClassification' allowCreate={true} isArray={true} multi={true} placeholder="Enter B&R Codes"   />
                    }

                    {this.props.data.getValue("fwp_numbers") !== undefined &&
                    <SpecificField field="fwp_numbers" label="FWP Numbers" elementType="select" helpTooltip='SponsorOrgFWPNum' allowCreate={true} isArray={true} multi={true} placeholder="Enter FWP Numbers"   />
                    }

            </div>
		);
	}

}
