import BaseData from './BaseData';
import uniqid from 'uniqid';
import MetadataStore from './MetadataStore';


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

   getPanelStatus(infoSchema,panelNumber) {

     let panelStatus = {"remainingRequired" : 0, "remainingOptional": 0, "errors" : "", "hasRequired" : false, "hasOptional" : false}
     for (var field in infoSchema) {
     const obj = this.getFieldInfo(field);

     if (obj.Panel == panelNumber) {

     if (obj.errorMessage)
    	 panelStatus.errors += obj.errorMessage + " ";


     if (obj.required) {
       panelStatus.hasRequired = true;
       if (!obj.completed)
           panelStatus.remainingRequired++;

     } else {
       panelStatus.hasOptional = true;
       if (!obj.completed)
           panelStatus.remainingOptional++;

     }


     }


     }

     return panelStatus;
   }




deserializeData(data) {

    for (var field in data) {

        if (data[field].length > 0) {

            if (parents.indexOf(field) > -1) {
                const end = data[field].length;
                for (var i = 0; i < end; i++) {
                    data[field][i].id = uniqid();
                }
            }

            if (field === 'sponsoring_organizations') {
                if (data.sponsoring_organizations !== undefined) {
                    deserializeSponsoringOrganization(data);
                }
            }

            this.fieldMap[field] = data[field];
            this.infoSchema[field].completed = true;
        }
    }
}

deserializeSponsoringOrganization(data) {
    const sponsoringOrganizations = data.sponsoringOrganizations;
    const end = sponsoringOrganizations.length;
    for (var i = 0; i < end; i++) {

        const fundingIDs = sponsoringOrganizations.funding_identifiers;
        //delete data.sponsoring_organizations[i].funding_identifiers;
        if (fundingIDs !== undefined) {
            const awardNumbers = [];
            const brCodes = [];
            const fwpNumbers = [];
            const fundingLength = fundingIDs.length;
            for (var x = 0; x < fundingLength; x++) {
                if (fundingIDs[x].identifier_type === 'AwardNumber') {
                    awardNumbers.push(fundingIDs[x].identifier_value)
                } else if (fundingIDs[x].identifier_type === 'BRCode') {
                    brCodes.push(fundingIDs[x].identifier_value);
                } else if (fundingIDs[x].identifier_type === 'FWPNumber') {
                    fwpNumbers.push(fundingIDs[x].identifier_value);
                }

            }

        }

        data.sponsoringOrganizations[i].award_numbers = awardNumbers.join(',');
        data.sponsoringOrganizations[i].br_codes = brCodes.join(',');
        data.sponsoringOrganizations[i].fwp_numbers = fwpNumbers.join(',');
    }
}
    updateMetadata(data) {
    	const oldRepo = new String(this.fieldMap.repository_link);
      this.deserializeData(data);
      this.fieldMap.repository_link = oldRepo;

    }

    serializeData() {
      const data = this.getCompletedData();

      const end = data.sponsoring_organizations.length;

      for (var i = 0; i < end; i++) {
          const fundingIdentiiers = [];
          const helper = {awardNumbers : [], brCodes: [], fwpNumbers: []};
          const awardNumbers = data.sponsoring_organizations[i].award_numbers.split(',');
          const brCodes = data.sponsoring_organizations[i].br_codes.split(',');
          const fwpNumbers = data.sponsoring_organizations[i].fwp_numbers.split(',');

          for (var x = 0; x < awardNumbers.length; x++) {
            fundingIdentifiers.add({identifier_type: "AwardNumber", identifier_value: awardNumbers[x] })
          }

          for (var x = 0; x < brCodes.length; x++) {
            fundingIdentifiers.add({identifier_type: "BRCode", identifier_value: brCodes[x] })
          }

          for (var x = 0; x < fwpNumbers.length; x++) {
            fundingIdentifiers.add({identifier_type: "FWPNumber", identifier_value: fwpNumbers[x] })
          }

          data.sponsoring_organizations[i].funding_identifiers = fundingIdentifiers;

      }

    }




}
