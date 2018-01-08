var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var validation = new Validation();

var BaseData = function () {
  function BaseData(props) {
    _classCallCheck(this, BaseData);

    this.fieldMap = props.fieldMap;
    this.infoSchema = props.infoSchema;
    this.panelStatus = props.panelStatus;
    if (!props.infoSchema) this.infoSchema = {};
    this.fieldMapSnapshot = props.fieldMapSnapshot;
    this.infoSchemaSnapshot = props.infoSchemaSnapshot;
    this.validationCallback = this.validationCallback.bind(this);
  }

  _createClass(BaseData, [{
    key: 'getValue',
    value: function getValue(field) {
      return this.fieldMap[field];
    }
  }, {
    key: 'setValue',
    value: mobx.action("Set Value", function setValue(field, data) {
      this.fieldMap[field] = data;
      
      if (field === 'accessibility') {
	      var schemaRepo = this.infoSchema["repository_link"]; 
	      var schemaLanding = this.infoSchema["landing_page"]; 
	      var schemaFile = this.infoSchema["file_name"]; 
	      
	      this.setValue("open_source", (data !== 'CS'));
	      
	      if (data == 'OS') {
	        schemaRepo.required = "sub";
	        schemaRepo.panel = "Repository Information";
	        schemaLanding.required = "";
	        schemaLanding.panel = "";
	        schemaLanding.error = "";
	        schemaLanding.completed = false;
	        schemaFile.required = "";
	        schemaFile.panel = "";
	        schemaFile.completed = false;
	        
            this.setValue("repository_link", this.getValue("repository_link") || this.getValue("landing_page"));
            this.setValue("landing_page", "");
            
            this.setValue("file_name", "");
            this.setValue("files", []);
	      }
	      else {
	        schemaRepo.required = "";
	        schemaRepo.panel = "";
	        schemaRepo.error = "";
	        schemaRepo.completed = false;
	        schemaLanding.required = "sub";
	        schemaLanding.panel = 'Repository Information';
	        schemaFile.required = this.page == 'announce' ? "announ" : "";
	        schemaFile.panel = 'Supplemental Product Information';
	        
            this.setValue("landing_page", this.getValue("landing_page") || this.getValue("repository_link"));
            this.setValue("repository_link", "");
	      }
      }
      
      if (field === 'software_type' && data == 'B') {  
	      var schema = this.infoSchema["sponsoring_organizations"];  
	      schema.required = "sub";
      }
      
      if (field === 'doi_status') {  
	      var schema = this.infoSchema["doi_infix"];    
	      if (data == 'RES') {      
	        schema.panel = "DOI and Release Date";
	        schema.error = "";
	        schema.completed = false;
	      }
	      else
	        schema.panel = "";
      }      

      if (field === "licenses") {
	      var schema = this.infoSchema["proprietary_url"];
	      if (data && data.indexOf('Other') > -1) {
	        schema.required = "sub";
	        schema.panel = "Product Description";
	      }
	      else {
	        schema.required = "";
	        schema.panel = "";
	        schema.error = "";
	        schema.completed = false;
	      	this.setValue("proprietary_url", "");
	      }
      }      
      
      this.validateField(field);
    })
  }, {
    key: 'getAsArray',
    value: function getAsArray(field) {
      return this.fieldMap[field].slice();
    }
  }, {
    key: 'getFieldInfo',
    value: function getFieldInfo(field) {
      return this.infoSchema[field];
    }
  }, {
    key: 'isCompleted',
    value: function isCompleted(field) {
      if (this.infoSchema[field]) return this.infoSchema[field].completed;
      return true;
    }
  }, {
    key: 'isRequired',
    value: function isRequired(field) {
      if (this.infoSchema[field]) return this.infoSchema[field].required;
      return true;
    }
  }, {
    key: 'getLabel',
    value: function getLabel(field, default_value) {
      if (this.infoSchema[field]) return (default_value ? (this.infoSchema[field].label || default_value) : (this.infoSchema[field].label || "Undefined Label"));
      return (default_value || "Undefined Label");
    }
  }, {
    key: 'getError',
    value: function getError(field) {
      if (this.infoSchema[field]) return this.infoSchema[field].error;
      return "";
    }
  }, {
    key: 'loadValues',
    value: function loadValues(data) {
      for (var field in data) {
        this.setValue(field, data[field]);
      }
    }
  }, {
    key: 'validateField',
    value: mobx.action("Validate Field", function validateField(field) {
      var info = this.getFieldInfo(field);

      if (!info) return;

      var value = this.getValue(field);

      if (value === null || value.length === 0) {
        info.completed = false;
        info.error = '';
      } else {
        validation.validate(value, info, this.validationCallback);
      }
    })
  }, {
    key: 'validationCallback',
    value: mobx.action("Validation Callback", function validationCallback(information, errors) {
      information.error = errors;
      if (errors)
      	information.completed = false;
      else {
        information.completed = true;
        information.ever_completed = true;
      }
    })
  }, {
    key: 'validateSchema',
    value: function validateSchema() {
      var isValid = true;

      for (var field in this.infoSchema) {
        var information = this.infoSchema[field];

        if ((information.error) || (information.required && !information.completed)) {
          isValid = false;
          break;
        }
      }

      return isValid;
    }
  }, {
    key: 'checkForSchemaErrors',
    value: function checkForSchemaErrors() {
      var errors = [];

      for (var field in this.infoSchema) {
        var information = this.infoSchema[field];
        if (information.error) errors.push(field);
      }

      return errors;
    }
  }, {
    key: 'clearValues',
    value: mobx.action("Clear Values", function clearValues() {
      for (var field in this.fieldMap) {
        this.fieldMap[field] = this.fieldMapSnapshot[field];
      }
    })
  }, {
    key: 'clearInfoSchema',
    value: mobx.action("Clear InfoSchema", function clearInfoSchema() {
      for (var field in this.infoSchema) {
        this.infoSchema[field] = this.infoSchemaSnapshot[field];
      }
    })
  }, {
    key: 'clear',
    value: mobx.action("Clear", function clear() {
      this.clearValues();
      this.clearInfoSchema();
    })
  }, {
    key: 'getInfoSchema',
    value: function getInfoSchema() {
      return this.infoSchema;
    }
  }, {
    key: 'getFieldMap',
    value: function getFieldMap() {
      return this.fieldMap;
    }
  }, {
    key: 'getData',
    value: function getData() {
      return (0, mobx.toJS)(this.fieldMap);
    }
  }, {
    key: 'getCompletedData',
    value: function getCompletedData() {
      var completedData = {};

      for (var field in this.fieldMap) {
        if (this.infoSchema[field] !== undefined) {
          if (this.infoSchema[field].completed || this.infoSchema[field].ever_completed && this.fieldMap[field] == "") {
            completedData[field] = this.fieldMap[field];
          }
        } else {
          completedData[field] = this.fieldMap[field];
        }
      }
      return completedData;
    }
  }]);

  return BaseData;
}();
