import BaseData from './BaseData';
export default class VMetadata extends BaseData {

    constructor(props) {
        super(props);
    	
    }


   getPanelStatus(panelNumber) {

     let panelStatus = {"remainingRequired" : 0, "remainingOptional": 0, "errors" : "", "hasRequired" : false, "hasOptional" : false}
     const infoSchema = this.getInfoSchema();
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