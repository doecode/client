import BaseData from './BaseData';
import uniqid from 'uniqid';
import MetadataStore from './MetadataStore';



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

    modifyElementInArray(data) {

         const index = this.fieldMap[field].findIndex(item => item.id === data.id);


         if (index > -1)
             this.fieldMap[field][index] = data;

         removeFromInvalids(field,data.id);

         

    }


    removeFromArray(field,data) {
    	 const id = data.id;
         const index = this.parentArray.findIndex(item => item.id === data.id);
         this.fieldMap[field].splice(index, 1);

         if (this.fieldMap[field].length == 0)
           this.infoSchema[field].completed = false;
         
         removeFromInvalids(field,id)
         
         
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




    /*updateMetadata(data) {
    	const oldRepo = new String(this.metadata.repository_link);
    	data.repository_link = oldRepo;
    	this.metadata = data;

    } */




}
