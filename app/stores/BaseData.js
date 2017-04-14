import uniqid from 'uniqid';
import Validation from '../utils/Validation';

const validation = new Validation();
export default class BaseData {

	constructor(props) {
		this.fieldMap = props.fieldMap;
		this.infoSchema = props.infoSchema;

		this.emptyInfoSchema = Object.assign({}, this.infoSchema);
		this.emptyFieldMap = Object.assign({}, this.fieldMap);

		if (props.isChild) {

			this.parentInfo = props.parentInfo
			//this.parentLabel = this.parentInfo.label;
			this.parentArray = props.parentArray;

			if (!props.id) {
				this.fieldMap.id = uniqid()

			}
			else {
				const index = props.parentArray.find(item => item.id === props.id);
				loadValues(props.parentArray[index]);
				this.edit = true;

			}


			//if (this.fieldMap.place !== undefined)
				//this.previousPlace = this.fieldMap.place
		}



	    this.validationCallback = this.validationCallback.bind(this);

	}

   getValue(field) {
    	return this.fieldMap[field];
   }

   setValue(field,data) {
   	this.fieldMap[field] = data;
   }

   getValues() {
	   return this.fieldMap;
   }

   getAsArray(field) {
	   return this.fieldMap[field].slice();

   }

   getFieldInfo(field) {
   	return this.infoSchema[field];
   }

	 loadValues(data) {
		 for (var field in data)
		 		this.fieldMap[field] = data[field];
	 }

	 clearValues() {
		 for (var field in this.emptyFieldMap)
		     this.fieldMap[field] = this.emptyFieldMap[field];
	 }

	 clearInfoSchema() {
		 for (var field in this.emptyInfoSchema)
				 this.fieldMap[field] = this.emptyInfoSchema[field];
	 }


   saveToParentArray() {
	   if (this.edit)
		   this.addToParentArray();
	   else
		   this.modifyElementInParentArray()

		 clearValues();
		 clearInfoSchema();
	   this.parentInfo.completed = true;
   }
    addToParentArray() {
    	//if (this.getValue("place") !== undefined)
    		//this.setValue("place",this.parentArray.length + 1);

        this.parentArray.push(Object.assign({}, this.fieldMap));
    }

    modifyElementInParentArray() {
 /*       const newPlace = this.getValue("place");
    	if (newPlace !== undefined && newPlace !== this.previousPlace) {
            this.updateElementPlaceAndReturnIndex();
        } */

        const index = this.parentArray.findIndex(item => item.id === data.id);


        if (index > -1)
            this.parentArray[index] = Object.assign({}, this.fieldMap);
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

    removeFromParentArray(data) {
        const index = this.parentArray.findIndex(item => item.id === data.id);
        this.parentArray.splice(index, 1);

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

        if (this.parentArray.length == 0)
        	this.parentInfo.completed = false;
    }


    validateField(field) {
       const info = this.getFieldInfo(field);
       let parentSize = 0;

       if (this.hasParent)
    	   parentSize = this.parentArray.length;

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

    checkForSchemaErrors() {
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
