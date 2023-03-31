var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var SponsoringOrganization = function (_BaseData) {
  _inherits(SponsoringOrganization, _BaseData);

  function SponsoringOrganization() {
    _classCallCheck(this, SponsoringOrganization);

    var defaultSponsoringOrganization = {
      DOE: true,
      organization_name: '',
      primary_award: '',
      award_numbers: [],
      fwp_numbers: [],
      br_codes: [],
      id: ''
    };

    var defaultSponsoringOrganizationSchema = {
      "organization_name": { required: true, completed: false, ever_completed: false, validations: [], error: '' },
      "primary_award": { required: true, completed: false, ever_completed: false, validations: ["awardnumber"], error: '' },
      "award_numbers": { required: false, completed: false, ever_completed: false, validations: [], error: '' },
      "br_codes": { required: false, completed: false, ever_completed: false, validations: ["BR"], error: '' },
      "fwp_numbers": { required: false, completed: false, ever_completed: false, validations: [], error: '' }
    };

    var props = { fieldMap: MetadataStore.sponsoringOrganization, infoSchema: MetadataStore.sponsoringOrganizationInfoSchema, fieldMapSnapshot: defaultSponsoringOrganization, infoSchemaSnapshot: defaultSponsoringOrganizationSchema };
    return _possibleConstructorReturn(this, (SponsoringOrganization.__proto__ || Object.getPrototypeOf(SponsoringOrganization)).call(this, props));
  }

  _createClass(SponsoringOrganization, [{
    key: 'loadValues',
    value: function loadValues(data) {
      if (data.DOE) {
        this.infoSchema["primary_award"].required = true;
        this.infoSchema["primary_award"].validations = ["awardnumber"];
      }
      else {
        this.infoSchema["primary_award"].required = false;
        this.infoSchema["primary_award"].validations = [];
      }
      _get(SponsoringOrganization.prototype.__proto__ || Object.getPrototypeOf(SponsoringOrganization.prototype), 'loadValues', this).call(this, data);
    }
  },{
    key: 'setValue',
    value: function setValue(field, data) {
    	if (field == "DOE") {
	      if (data) {
	        this.infoSchema["primary_award"].required = metadata.getValue("is_migration") ? false : true;
	        this.infoSchema["primary_award"].validations = ["awardnumber"];
	      }
	      else {
	        this.infoSchema["primary_award"].required = false;
	        this.infoSchema["primary_award"].validations = [];
	      }
	      this.validateField("primary_award");
    	}
      _get(SponsoringOrganization.prototype.__proto__ || Object.getPrototypeOf(SponsoringOrganization.prototype), 'setValue', this).call(this, field, data);
    }
  }]);

  return SponsoringOrganization;
}(BaseData);