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

	 loadValues(data) {
		 for (var field in data)
		 		this.fieldMap[field] = data[field];
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

    checkForSchemaErrors() {
    	let errors = [];

    	for (var field in this.infoSchema) {
    		const information = this.infoSchema[field];

    		if (information.error)
    			errors.push(field);
    		else if (information.required && !information.completed) {
    			errors.push(field);
    			information.error = field + " is required.";
    		}

    	}


    	return errors;
    }

	clearValues() {
		console.log(this.fieldMapSnapShot);
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


}
