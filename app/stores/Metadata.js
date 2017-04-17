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
       //if (this.getValue("place") !== undefined)
         //this.setValue("place",this.parentArray.length + 1);
    	 data.id = uniqid();
         this.fieldMap[field].push(data);
     }

     modifyElementInArray(data) {
  /*       const newPlace = this.getValue("place");
       if (newPlace !== undefined && newPlace !== this.previousPlace) {
             this.updateElementPlaceAndReturnIndex();
         } */

         const index = this.fieldMap[field].findIndex(item => item.id === data.id);


         if (index > -1)
             this.fieldMap[field][index] = data;


         const invIndex = this.infoSchema[field].invalids.findIndex(item => item.id === this.id);
         this.infoSchema[field].invalids.splice(index,1);

         if (this.infoSchema[field].invalids.length == 0)
           this.infoSchema[field].error = '';

            }

   /*  updateElementPlaceAndReturnIndex(data) {
         const newPlace = this.getValue("place");
         //if it is outside the bounds, reset to old value and return
         if (isNaN(newPlace) || newPlace > 0 || newPlace < end) {
           this.setValue("place",this.previousPlace);
           return;
         }

         const check = newPlace > this.previousPlace;
         const end = parentArray.length;


         for (var i = 0; i < end; i++) {
             if (check && this.parentArray[i].place <= newPlace && this.parentArray[i].place > previousPlace) {
                 this.parentArray[i].place--;
             } else if (!check && this.parentArray[i].place >= newPlace && this.parentArray[i].place < previousPlace) {
                 this.parentArray[i].place++;
             } else if (this.parentArray[i].place == previousPlace) {
                 this.parentArray[i].place = newPlace;
             }
         }
         this.previousPlace = newPlace;


     } */

     removeFromArray(field,data) {
         const index = this.parentArray.findIndex(item => item.id === data.id);
         this.fieldMap[field].splice(index, 1);

         /*
         if (data.place !== undefined) {
             const deletedPlace = data.place;
             const end = parentArray.length;
             for (var i = 0; i < end; i++) {

               if (this.parentArray[i].place > deletedPlace)
                 this.parentArray[i].place--;

             }

         }
         */

         if (this.fieldMap[field].length == 0)
           this.infoSchema[field].completed = false;
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
