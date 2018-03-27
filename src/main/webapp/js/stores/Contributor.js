function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Contributor = function (_BaseData) {
    _inherits(Contributor, _BaseData);

    function Contributor() {
        _classCallCheck(this, Contributor);

        var defaultContributor = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            orcid: '',
            affiliations: [],
            contributor_type: '',
            id: ''
        };

        var defaultContributorInfoSchema = {

            "first_name": { required: true, completed: false, ever_completed: false, validations: [""], error: '' },
            "middle_name": { required: false, completed: false, ever_completed: false, validations: [], error: '' },
            "last_name": { required: true, completed: false, ever_completed: false, validations: [], error: '' },
            "email": { required: false, completed: false, ever_completed: false, validations: ["email"], error: '' },
            "orcid": { required: false, completed: false, ever_completed: false, validations: ["orcid"], error: '' },
            "affiliations": { required: false, completed: false, ever_completed: false, validations: [], error: '' },
            "contributor_type": { required: true, completed: false, ever_completed: false, validations: [], error: '' }

        };
        var props = { fieldMap: MetadataStore.contributor, infoSchema: MetadataStore.contributorInfoSchema, fieldMapSnapshot: defaultContributor, infoSchemaSnapshot: defaultContributorInfoSchema };
        return _possibleConstructorReturn(this, (Contributor.__proto__ || Object.getPrototypeOf(Contributor)).call(this, props));
    }

    return Contributor;
}(BaseData);