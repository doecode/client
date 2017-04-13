import validator from 'validator';
export default class Validation {
	




validate(value,validationObj, validationCallback, parentArraySize) {
	   
	 let errors = "";
	  const validations = validationObj.validations;
	  const valLength = validations.length;
	  for (var i = 0; i < valLength; i++) {

		  if (validations[i] === "Phone") {
			  errors += this.validatePhone(value)
		  } else if (validations[i] === "Email") {
			  errors += this.validateEmail(value);
		  } else if (validations[i] === "URL") {
			  errors += this.validateURL(value);
		  }    	 
	    
	  }
	  
	  const filtered = validations.filter(this.needsServer);
	  
	  //if (filtered.length == 0)
		  validationCallback(validationObj, errors);
		  
			 /* 
			doAjax("POST","/api/validate" , successCallback, validations)
		    $.ajax({
		        url: "/api/validate",
		        cache: false,
		        method: 'POST',
		        dataType: 'json',
		        data: JSON.stringify(obj),
		        contentType: "application/json; charset=utf-8",
		        success: function(data) {
		        	console.log(data);
		        	validateCallback(validationObj, errors);
		        },
		        error: function(x,y,z) {
		        }
		      });

		 */
  }

  needsServer(value) {
	  const asyncValidations = ["Award", "DOI"];

	  return asyncValidations.indexOf(value) > -1;
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
		  errors += value + " is not a valid email.";
	  return errors;
  }
  
  validateURL(value) {
	  let errors = "";
	  if (!validator.isURL(value))
		  errors += value + " is not a valid URL.";
	  return errors;
  }
  
  

  
  
}