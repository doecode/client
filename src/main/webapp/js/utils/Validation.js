var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Validation = function () {
  function Validation() {
    _classCallCheck(this, Validation);
  }

  _createClass(Validation, [{
    key: "validate",
    value: mobx.action("Validate", function validate(field, value, validationObj, validationCallback) {
      var errors = "";
      var validations = validationObj.validations;
      // regex to capture substring within "()" and separate the text before it. 
      // "valueLength(50)" -> found = ["valueLength(50)", "valueLength", "50"]
      // "valueLength" -> null
      // fails to match on "valuelength"
      const regex = /^(\w+)\((.+)\)$/;

      var valLength = validations.length;
      for (var i = 0; i < valLength; i++) {
        const parsedValidations = validations[i].match(regex);
        const validation = parsedValidations == null ? validations[i] : parsedValidations[1];
        if (validation === "phonenumber") {
          errors += this.validatePhone(value);
        } else if (validation === "email") {
          errors += this.validateEmail(value);
        } else if (validation === "BR") {
          errors += this.validateBR(value);
        } else if (validation === "developers") {
          errors += this.validateDevs(value);
        } else if (validation === "affiliations") {
          errors += this.validateAffiliations(value);
        } else if (validation === "validateLength") {
          errors += this.validateLength(value, Number(parsedValidations[2]));
        }
      }

      var filtered = validations.filter(this.needsServer);

      if (filtered.length == 0) {
        validationCallback(field, validationObj, errors);
        return;
      }

      var json = [];

      var filteredLength = filtered.length;
      for (var i = 0; i < filteredLength; i++) {
        var obj = {};

        obj.value = value;
        obj.type = validations[i];

        json.push(obj);
      }

	doAjax('POST', API_BASE + "validation", function success(data) {

          for (var i = 0; i < data.length; i++) {
            var error = data[i].error;
            var extraInfo = data[i].extraInfo;

            if (error != "") errors += error;
            if (extraInfo != "") validationObj.extra_info = extraInfo;
          }
          validationCallback(field, validationObj, errors);
        }, json, function error(x, y, z) {
          validationCallback(field, validationObj, "Field encountered Network issue");
        });
    })
  }, {
    key: "needsServer",
    value: function needsServer(value) {
      var asyncValidations = ["awardnumber", "doi", "repositorylink", "url", "orcid"];

      return asyncValidations.indexOf(value) > -1;
    }
  }, {
    key: "validatePhone",
    value: function validatePhone(value) {
      //var PNF = googlei8.PhoneNumberFormat;
      //var phoneUtil = googlei8.PhoneNumberUtil.getInstance();

      var isValid = false;

      try {
        //var numberObj = phoneUtil.parse(value, "US");
        //isValid = phoneUtil.isValidNumber(numberObj, 'US');
        
        var numberObj = libphonenumber.parse(value, "US");
        isValid = libphonenumber.isValidNumber(numberObj);
      } catch (e) {
        // silent error
      }

      var errors = "";
      if (!isValid) errors += value + " is not a valid phone number.";
      return errors;
    }
  }, {
    key: "validateEmail",
    value: function validateEmail(value) {
      var errors = "";
      if (!validator.isEmail(value)) errors += value + " is not a valid email.";
      return errors;
    }
  }, {
    key: "validateBR",
    value: function validateBR(value) {
      var brRegex = /^[A-Za-z]{2}\d{7}$/g;
      var badCodes = [];
      var allCodes = value.slice();
      var errors = "";

      for (var i = 0; i < allCodes.length; i++) {
        var m = allCodes[i].match(brRegex);
        if (m === null || m.length !== 1) {
          badCodes.push(allCodes[i]);
        }
      }

      if (badCodes.length > 0) {
        errors = "The following B&R Codes are invalid: " + badCodes.join(", ");
      }
      return errors;
    }
  }, {
    key: "validateDevs",
    value: function validateDevs(value) {
      var badDevs = [];
      var allDevs = value.slice();
      var errors = "";

      for (var i = 0; i < allDevs.length; i++) {
        var dev = allDevs[i];
        if (!dev.first_name || !dev.last_name) {
          badDevs.push("<br> First Name: [" + (dev.first_name ? dev.first_name : "{missing}") + "]  Last Name: [" + (dev.last_name ? dev.last_name : "{missing}") + "]  Affiliations: [" + (dev.affiliations ? dev.affiliations.join(", ") : "") + "]");
        }
      }

      if (badDevs.length > 0) {
        errors = "The following Developers are incomplete (first & last name required) : " + badDevs.join("; ");
      }
      return errors;
    }
  }, {
    key: "validateAffiliations",
    value: function validateAffiliations(value) {
      var affiliations = value;
      var errors = "";
      var affiliationCharCount = 0;

      for (var i = 0; i < affiliations.length; i++) {
        affiliationCharCount += affiliations[i].length;
      }

      if (affiliationCharCount > 900) {
        errors = "Affiliations must be 900 characters or less in total length.";
      }
      return errors;
    }
  }, {
    key: "validateLength",
    value: function validateLength(str, maxLength) {
      var errors = "";
      if (str.length > maxLength) {
        errors += "Must be " + maxLength + " characters or less.";
      }
      return errors;
    }
  }]);

  return Validation;
}();