import uniqid from 'uniqid';
import Validation from '../utils/VValidation';

const validation = new Validation();
export default class BaseData {
	
	constructor(props) {
		this.fieldMap = props.fieldMap;
		this.infoSchema = props.infoSchema;
		if (props.parent) {
			this.id = uniqid();
			this.hasParent = true;
			this.parentInfo = props.parentInfo
			this.parentLabel = this.parentInfo.label;
			this.parentArray = props.parentArray;
			
		}
		
		if (this.fieldMap.place !== undefined)
			this.previousPlace = this.fieldMap.place
			
	    this.validationCallback = this.validationCallback.bind(this);
		
	}
   
   getValue(field) {
    	return this.fieldMap[field];
   }
    
    
   setValue(field,data) {
    	this.fieldMap[field] = data;
    }
   
   getFieldInfo(field) {
   	return this.infoSchema[field];
   }
    

    addToArray(data) {
    	if (data.place !== undefined)
    		data.place = this.parentArray.length + 1;
    	
        this.parentArray.push(data);
    }

    removeFromArray(data) {
        const index = this.parentArray.findIndex(item => item.id === data.id);
        this.parentArray.splice(index, 1);

        if (data.place !== undefined) {
            const deletedPlace = data.place;
            const end = parentArray.length;
            for (var i = 0; i < end; i++) {

            	if (this.parentArray[i].place > deletedPlace)
            		this.parentArray[i].place--;
            
            }
        
        }
    }

    modifyArrayElement(data) {
        
    	if (data.place !== undefined && data.place !== this.previousPlace) {
            this.updateElementPlaceAndReturnIndex(data);
        }
        
        const index = this.parentArray.findIndex(item => item.id === data.id);
        

        if (index > -1)
            this.parentArray[index] = data;
        }

    updateElementPlaceAndReturnIndex(data) {
        const newPlace = data.place;
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


    }
    
    
    validateField(field) {
       const info = this.getFieldInfo(field);
       
       if (!info)
    	   return;
       
       const value = this.getValue(field);
       
       if (value.length === 0) {
		   info.completed = false;
		   info.error = '';
	   } else {
	 	   validation.validate(value, info, this.validationCallback);
	   }
    
 	   
    }
    
    validationCallback(information, errors) {
 	   information.error = errors;
 	   
 	   if (errors)
 		   information.completed = false;
 	   else {
 		   information.completed = true;
 		   if (this.hasParent) {
 			   if (this.parentInfo.invalids.length  > 0) {
 			   const index = this.parentInfo.invalids.findIndex(item => item.id === this.id);
 			   this.parentInfo.invalids.splice(index,1);
 			   
 			   if (this.parentInfo.invalids.length == 0)
 				   this.parentInfo.error = '';
 			   }
 		   }
 			   
 	   }
 		   
    }
    
    getSchemaErrors() {
    	let errors = [];
    	
    	for (var field in this.schema) {
    		const information = this.getFieldInfo(field);
    		
    		if (information.error)
    			errors.push(field);
    		else if (information.required && !information.completed) {
    			errors.push(field);
    			information.error = field + " is required.";
    		}
    		
    	}
    	
    	   	
    	return errors;
    }
    
    getInfoSchema() {
    	return this.infoSchema
    }
    
    getData() {
    	return this.fieldMap;
    }
    

}