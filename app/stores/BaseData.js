import Validation from '../utils/Validation';

const validation = new Validation();
export default class BaseData {

	constructor(props) {
		this.fieldMap = props.fieldMap;
		this.infoSchema = props.infoSchema;

		this.fieldMapSnapshot = props.fieldMapSnapshot;
		this.infoSchemaSnapshot = props.infoSchemaSnapshot;
	  this.validationCallback = this.validationCallback.bind(this);

	}

   getValue(field) {
    	return this.fieldMap[field];
   }

   setValue(field,data) {
   	this.fieldMap[field] = data;
   }


   getAsArray(field) {
	   return this.fieldMap[field].slice();

   }

   getFieldInfo(field) {
   	return this.infoSchema[field];
   }

	 isCompleted(field) {
		 if (this.infoSchema[field])
		 	   return this.infoSchema[field].completed;
		 return true;
	 }

   loadValues(data) {
		 for (var field in data) {
		 		this.fieldMap[field] = data[field];
		 		if (data[field].length > 0 && this.infoSchema[field])
		 			this.infoSchema[field].completed = true;
		 }
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

 	   }

    }

    validateSchema(update) {
    	let isValid = true;

    	for (var field in this.infoSchema) {
    		const information = this.infoSchema[field];

    		if (information.error) {
    			isValid = false;
    		}
    		else if (information.required && !information.completed) {
    			if (update)
    				information.error = field + " is required.";

    			isValid = false;
    		}

    	}


    	return isValid;
    }

    checkForSchemaErrors() {
    	let errors = [];

    	for (var field in this.infoSchema) {
    		const information = this.infoSchema[field];
    		if (information.error)
    			errors.push(field);
    	}


    	return errors;
    }

	clearValues() {
		for (var field in this.fieldMap)
				this.fieldMap[field] = this.fieldMapSnapshot[field];
	}

	clearInfoSchema() {
		for (var field in this.infoSchema)
				this.infoSchema[field] = this.infoSchemaSnapshot[field];
	}
		clear() {
			this.clearValues();
			this.clearInfoSchema();
		}




    getInfoSchema() {
    	return this.infoSchema
    }

		getFieldMap() {
		 return this.fieldMap;
		}

    getData() {
			return Object.assign({}, this.fieldMap);
    }

getCompletedData() {
    const completedData = {};

    for (var field in this.fieldMap) {
        if (this.infoSchema[field] !== undefined) {
            if (this.infoSchema[field].completed) {
                completedData[field] = this.fieldMap[field];
            }
        } else {
            completedData[field] = this.fieldMap[field];
        }

    }
		return completedData;
}


}
