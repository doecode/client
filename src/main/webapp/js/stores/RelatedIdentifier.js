function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var RelatedIdentifier = function (_BaseData) {
    _inherits(RelatedIdentifier, _BaseData);

    function RelatedIdentifier() {
        _classCallCheck(this, RelatedIdentifier);

        var defaultRelatedIdentifier = {
            identifier_type: '',
            relation_type: '',
            identifier_value: '',
            id: ''
        };

        var defaultRelatedIdentifierInfoSchema = {

            "identifier_type": { required: true, completed: false, ever_completed: false, validations: [], error: '' },
            "relation_type": { required: true, completed: false, ever_completed: false, validations: [], error: '' },
            "identifier_value": { required: true, completed: false, ever_completed: false, validations: [], error: '' }
        };

        var props = { fieldMap: MetadataStore.relatedIdentifier, infoSchema: MetadataStore.relatedIdentifierInfoSchema, fieldMapSnapshot: defaultRelatedIdentifier, infoSchemaSnapshot: defaultRelatedIdentifierInfoSchema };
        return _possibleConstructorReturn(this, (RelatedIdentifier.__proto__ || Object.getPrototypeOf(RelatedIdentifier)).call(this, props));
    }

    return RelatedIdentifier;
}(BaseData);