function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Developer = function (_BaseData) {
    _inherits(Developer, _BaseData);

    function Developer() {
        _classCallCheck(this, Developer);

        var defaultDeveloper = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            orcid: '',
            affiliations: []
        };

        var defaultDeveloperInfoSchema = {
            "first_name": { required: true, completed: false, ever_completed: false, validations: [""], error: '' },
            "middle_name": { required: false, completed: false, ever_completed: false, validations: [], error: '' },
            "last_name": { required: true, completed: false, ever_completed: false, validations: [], error: '' },
            "email": { required: false, completed: false, ever_completed: false, validations: ["email"], error: '' },
            "orcid": { required: false, completed: false, ever_completed: false, validations: ["Orcid"], error: '' },
            "affiliations": { required: false, completed: false, ever_completed: false, validations: [], error: '' }
        };
        var props = { fieldMap: MetadataStore.developer, infoSchema: MetadataStore.developerInfoSchema, fieldMapSnapshot: defaultDeveloper, infoSchemaSnapshot: defaultDeveloperInfoSchema };
        return _possibleConstructorReturn(this, (Developer.__proto__ || Object.getPrototypeOf(Developer)).call(this, props));
    }

    return Developer;
}(BaseData);