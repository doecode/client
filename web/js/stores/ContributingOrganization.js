function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ContributingOrganization = function (_BaseData) {
  _inherits(ContributingOrganization, _BaseData);

  function ContributingOrganization() {
    _classCallCheck(this, ContributingOrganization);

    var defaultContributingOrganization = {
      DOE: true,
      organization_name: '',
      contributor_type: '',
      id: ''
    };

    var defaultContributingOrganizationSchema = {
      "organization_name": { required: true, completed: false, ever_completed: false, validations: [""], error: '' },
      "contributor_type": { required: true, completed: false, ever_completed: false, validations: [], error: '' }
    };

    var props = { fieldMap: MetadataStore.contributingOrganization, infoSchema: MetadataStore.contributingOrganizationInfoSchema, fieldMapSnapshot: defaultContributingOrganization, infoSchemaSnapshot: defaultContributingOrganizationSchema };
    return _possibleConstructorReturn(this, (ContributingOrganization.__proto__ || Object.getPrototypeOf(ContributingOrganization)).call(this, props));
  }

  return ContributingOrganization;
}(BaseData);