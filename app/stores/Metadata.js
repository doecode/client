import BaseData from './BaseData';
import uniqid from 'uniqid';
import MetadataStore from './MetadataStore';
import {toJS} from 'mobx';
import moment from 'moment';


const parents = ["developers", "contributors", "sponsoring_organizations", "research_organizations", "contributing_organizations", "related_identifiers"];
export default class Metadata extends BaseData {

    constructor() {
    	const props = {fieldMap: MetadataStore.metadata, infoSchema: MetadataStore.metadataInfoSchema};
        super(props);

    }


    saveToArray(field, data) {
      if (!data.id)
        this.addToArray(field,data);
      else
        this.modifyElementInArray(field,data)

      this.infoSchema[field].completed = true;
      this.infoSchema[field].error = '';
    }

    addToArray(field,data) {
    	 data.id = uniqid();
         this.fieldMap[field].push(data);
     }

    modifyElementInArray(field,data) {

         const index = this.fieldMap[field].findIndex(item => item.id === data.id);


         if (index > -1)
             this.fieldMap[field][index] = data;

         if (this.infoSchema[field].invalids !== undefined)
        	 this.removeFromInvalids(field,data.id);



    }


    removeFromArray(field,data) {
         const index = this.fieldMap[field].findIndex(item => item.id === data.id);
         this.fieldMap[field].splice(index, 1);

         if (this.fieldMap[field].length == 0)
           this.infoSchema[field].completed = false;

         if (this.infoSchema[field].invalids !== undefined)
        	 this.removeFromInvalids(field,data.id);


     }

    removeFromInvalids(field, id) {

    	if (this.infoSchema[field].invalids.length > 0) {
    	const invIndex = this.infoSchema[field].invalids.findIndex(item => item.id === id);
        this.infoSchema[field].invalids.splice(invIndex,1);

        if (this.infoSchema[field].invalids.length == 0)
          this.infoSchema[field].error = '';

    	}
    }

   getPanelStatus(panelName) {

     let panelStatus = {"remainingRequired" : 0, "remainingString" : "", "remainingOptional": 0, "errors" : "", "hasRequired" : false, "hasOptional" : false}
     let incompleteRequiredFields = [];
     for (var field in this.infoSchema) {
     const obj = this.getFieldInfo(field);


     if (obj.Panel == panelName) {

     if (obj.error)
    	 panelStatus.errors += obj.error + " ";


     if (obj.required) {
       panelStatus.hasRequired = true;
       if (!obj.completed) {
           panelStatus.remainingRequired++;
           incompleteRequiredFields.push(obj.label);
       }

     } else {
       panelStatus.hasOptional = true;
       if (!obj.completed)
           panelStatus.remainingOptional++;

     }


     }


     }

     if (incompleteRequiredFields.length > 0)
    	 panelStatus.remainingString = incompleteRequiredFields.join(", ");

     return panelStatus;
   }

  markPanelRequired(panelName) {
    for (var field in this.infoSchema) {
    const obj = this.getFieldInfo(field);


    if (obj.Panel == panelName) {

      if (obj.required && !obj.completed) {
      obj.error = "Valid input is required.";
      }



      }
    }
}




deserializeData(data) {

    for (var field in data) {

        if (this.fieldMap[field] !== undefined && data[field] !== undefined && !(Array.isArray(data[field]) && data[field].length === 0)) {

            if (parents.indexOf(field) > -1) {
                const end = data[field].length;
                for (var i = 0; i < end; i++) {
                    data[field][i].id = uniqid();
                }
            }


            if (field === 'release_date')
            		data.release_date = moment(data.release_date, "YYYY-MM-DD");

            if (field === 'sponsoring_organizations')
                    this.deserializeSponsoringOrganization(data);

            if (field === 'accessibility') {

              if (data[field] != 'OS') {
                this.infoSchema['file_name'].required = 'sub';
                  this.infoSchema['file_name'].Panel = 'Supplemental Product Information';
              }
            }

            if (field === 'landing_page') {
              if (data[field] != 'OS') {
                  this.infoSchema['landing_page'].required = 'pub';
                  this.infoSchema['landing_page'].Panel = 'Repository Information';
              }
            }



            this.fieldMap[field] = data[field];
            if (this.infoSchema[field])
            	this.infoSchema[field].completed = true;
        }
    }
}

deserializeSponsoringOrganization(data) {
    const sponsoringOrganizations = data.sponsoring_organizations;
    const end = sponsoringOrganizations.length;
    for (var i = 0; i < end; i++) {

        const fundingIDs = sponsoringOrganizations[i].funding_identifiers;
        const awardNumbers = [];
        const brCodes = [];
        const fwpNumbers = [];
        //delete data.sponsoring_organizations[i].funding_identifiers;
        if (fundingIDs !== undefined) {

            const fundingLength = fundingIDs.length;
            for (var x = 0; x < fundingLength; x++) {
            	let val = new String(fundingIDs[x].identifier_value);
                if (fundingIDs[x].identifier_type === 'AwardNumber') {
                    awardNumbers.push(val)
                } else if (fundingIDs[x].identifier_type === 'BRCode') {
                    brCodes.push(val);
                } else if (fundingIDs[x].identifier_type === 'FWPNumber') {
                    fwpNumbers.push(val);
                }

            }

        }


        data.sponsoring_organizations[i].award_numbers = awardNumbers.join(',');
        data.sponsoring_organizations[i].br_codes = brCodes.join(',');
        data.sponsoring_organizations[i].fwp_numbers = fwpNumbers.join(',');
        data.sponsoring_organizations[i].funding_identifiers = [];

    }
}
    updateMetadata(data) {
    	const oldRepo = new String(this.fieldMap.repository_link);
      this.deserializeData(data);
      this.fieldMap.repository_link = oldRepo;

    }

    serializeData() {
      const data = this.getCompletedData();

      let end = 0;
      if (data.sponsoring_organizations)
          end = data.sponsoring_organizations.length;

      for (var i = 0; i < end; i++) {
    	  const sponsor = data.sponsoring_organizations[i];
          let fundingIdentifiers = [];
          let awardNumbers = [];
          let brCodes = [];
          let fwpNumbers = [];

          const awardString = sponsor.award_numbers;
          const brString = sponsor.br_codes;
          const fwpString = sponsor.fwp_numbers;


          if (awardString)
        	  awardNumbers = data.sponsoring_organizations[i].award_numbers.split(',');

          //if (awardNumbers.indexOf(data.sponsoring_organizations[i].primary_award) < 0)
        	  //awardNumbers.push(data.sponsoring_organizations[i].primary_award);
          if (brString)
        	  brCodes = data.sponsoring_organizations[i].br_codes.split(',');

          if (fwpString)
        	  fwpNumbers = data.sponsoring_organizations[i].fwp_numbers.split(',');

          for (var x = 0; x < awardNumbers.length; x++) {
            fundingIdentifiers.push({identifier_type: "AwardNumber", identifier_value: awardNumbers[x] })
          }

          for (var x = 0; x < brCodes.length; x++) {
            fundingIdentifiers.push({identifier_type: "BRCode", identifier_value: brCodes[x] })
          }

          for (var x = 0; x < fwpNumbers.length; x++) {
            fundingIdentifiers.push({identifier_type: "FWPNumber", identifier_value: fwpNumbers[x] })
          }

          data.sponsoring_organizations[i].funding_identifiers = fundingIdentifiers;

      }

      return data;

    }

    validatePublishedFields() {
    	let isValid = true;

    	for (var field in this.infoSchema) {
    		const information = this.infoSchema[field];

    		if (information.error) {
    			isValid = false;
    		}
    		else if (information.required === "pub" && !information.completed) {

    			isValid = false;
    		}

    	}


    	return isValid;
    }

    requireOnlyPublishedFields() {
      for (var field in this.infoSchema) {
        const information = this.infoSchema[field];

        if (information.required == "sub") {
            information.required = "";
        }



      }
    }




}
