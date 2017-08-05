import validator from 'validator';
export default class Validation {





validate(value,validationObj, validationCallback, parentArraySizel) {

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
		  } else if (validations[i] === "BR") {
			  console.log(value);
			  errors += this.validateBR(value);
		  }

	  }

	  const filtered = validations.filter(this.needsServer);

	  if (filtered.length == 0) {
		  validationCallback(validationObj, errors);
		  return;
	  }
	  let obj = {};
	  let values = [];
	  values.push(value);

	  obj.values = values;
	  obj.validations = validations;

	  console.log(obj);
		    $.ajax({
		        url: "/doecode/api/validation",
		        cache: false,
		        method: 'POST',
		        dataType: 'json',
		        data: JSON.stringify(obj),
		        contentType: "application/json; charset=utf-8",
		        success: function(data) {
		        	console.log(data);

		        	for (var i = 0; i < data.errors.length; i++)
		        		errors += data.errors[i];
		        	validationCallback(validationObj, errors);
		        },
		        error: function(x,y,z) {
		        	console.log("howdy");
		        	validationCallback(validationObj, "Field encountered Network issue");
		        }
		      });


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



  validateBR(value) {
	  const brRegex = /[A-Za-z]{2}\d{7}/g;
	  let badCodes = [];
	  const allCodes = value.slice();
	  let errors = "";

	  for (let i = 0; i < allCodes.length; i++) {
	  if (allCodes[i].length != 9 || allCodes[i].match(brRegex).length !== 1) {
		  badCodes.push(allCodes[i]);
	  }
	  }

	  if (badCodes.length > 0) {
		  errors = "The following B&R Codes are invalid: " + badCodes.join(", ");
	  }
	  return errors;
  }





}
