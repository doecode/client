import validator from 'validator';
export default class Validation {
	




validate(value,validationObj) {
	   let errors = "";
	   
	   if (!validationObj)
		   return;
	   
	   if (value.length === 0) {
		   validationObj.completed = false;
		   validationObj.hasError = false;
		   validationObj.errorMessage = "";
	   } else {
		   errors = this.validateByTypes(value,validationObj.validations);
		   
		   console.log(errors);
		   
		   if (errors) {
			   validationObj.errorMessage = errors;
			   validationObj.hasError = true;
			   validationObj.completed = false;
		   } else {
			   validationObj.errorMessage = "";
			   validationObj.hasError = false;
			   validationObj.completed = true;
		   }
		   
	   }
  }
  
  validateByTypes(value, validations) {
	    if (validations.length === 0)
	    	return "";
	    else {	    	
	    	let errors = this.validateInClient(value, validations);
	    	return this.validateOnServer(value,validations, errors);	    	 
	    }
  }
  
  validateInClient(value,validations) {
	  let errors = ""

	  for (var i = 0; i < validations.length; i++) {
		  const validation = validations[i];
		  if (validation === "Phone") {
			  errors += this.validatePhone(value)
		  } else if (validation === "Email") {
			  errors += this.validateEmail(value);
		  } else if (validation === "URL") {
			  errors += this.validateURL(value);
		  }
	  }
	  
	  return errors;
  }
  
  validatePhone(value) {
	  let errors = "";
	  if (!validator.isMobilePhone(value, 'en-US'))
		  errors += value + " is not a valid phone number.";
	  return errors;
  }
  
  validateEmail(value) {
	  let errors = "";
	  if (!validator.isEmail(value))
		  errors += value + " is not a valid phone email.";
	  return errors;
  }
  
  validateURL(value) {
	  let errors = "";
	  if (!validator.isURL(value))
		  errors += value + " is not a valid URL.";
	  return errors;
  }
  
  validateOnServer(value, validations,errors) {
	  const filtered = validations.filter(this.inAsync);
	  
	  if (filtered.length == 0)
		  return errors;
	  
	  return new Promise((resolve,reject) => {
		    resolve(errors);

		});
	  
	 /* return new Promise((resolve,reject) => {
		    $.ajax({
		        url: "/api/validate",
		        cache: false,
		        method: 'POST',
		        dataType: 'json',
		        data: JSON.stringify(obj),
		        contentType: "application/json; charset=utf-8",
		        success: function(data) {
		        	console.log(data);
		        	resolve(errors + data.errors);
		        },
		        error: function(x,y,z) {
		        	reject("Internal Server Error");
		        }
		      });

		});*/
	  
  }
  
  inAsync(value) {
	  const asyncValidations = ["Award", "DOI"];

	  return asyncValidations.indexOf(value) > -1;
  }
  
  
}