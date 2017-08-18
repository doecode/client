import validator from 'validator';
import googlei8 from 'google-libphonenumber';
export default class Validation {




validate(value,validationObj, validationCallback, parentArraySizel) {

	 let errors = "";
	  const validations = validationObj.validations;
	  const valLength = validations.length;
	  for (var i = 0; i < valLength; i++) {

		  if (validations[i] === "phonenumber") {
			  errors += this.validatePhone(value)
		  } else if (validations[i] === "email") {
			  errors += this.validateEmail(value);
		  } else if (validations[i] === "url") {
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


	  let json = [];

		const filteredLength = filtered.length;
		for (var i = 0; i < filteredLength; i++) {
			let obj = {};

			obj.value = value;
			obj.type = validations[i];

			json.push(obj);
	  }

		console.log(json);
		    $.ajax({
		        url: "/doecode/api/validation",
		        cache: false,
		        method: 'POST',
		        dataType: 'json',
		        data: JSON.stringify(json),
		        contentType: "application/json; charset=utf-8",
		        success: function(data) {
		        	console.log(data);

		        	for (var i = 0; i < data.length; i++) {
								console.log(data[i]);
								let error = data[i].error;

								if (error != "")
		        			errors += error;
							}
		        	validationCallback(validationObj, errors);
		        },
		        error: function(x,y,z) {
		        	console.log("howdy");
		        	validationCallback(validationObj, "Field encountered Network issue");
		        }
		      });


  }

  needsServer(value) {
	  const asyncValidations = ["awardnumber", "doi", "repositorylink"];

	  return asyncValidations.indexOf(value) > -1;
  }


  validatePhone(value) {
		var PNF = googlei8.PhoneNumberFormat;
		var phoneUtil = googlei8.PhoneNumberUtil.getInstance();

		let isValid = false;

		try {
		  var numberObj = phoneUtil.parse(value, "US");
			//console.log("Number: " + JSON.stringify(numberObj));
			isValid = phoneUtil.isValidNumber(numberObj, 'US');
		} catch (e) {
		  console.log("Unable to parse and validate number: " + e.toString());
		}


	  let errors = "";
	  if (!isValid)
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
