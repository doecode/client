function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AwardDOI = function (_BaseData) {
    _inherits(AwardDOI, _BaseData);

    function AwardDOI() {
        _classCallCheck(this, AwardDOI);

        var defaultAwardDOI = {
            award_doi: '',
            funder_name: '',
            id: ''
        };

        var defaultAwardDOIInfoSchema = {

            "award_doi": { required: true, completed: false, ever_completed: false, validations: ['doi'], error: '' },
            "funder_name": { required: true, completed: false, ever_completed: false, validations: [], error: '' }
        };

        var props = { fieldMap: MetadataStore.awardDOI, infoSchema: MetadataStore.awardDOIInfoSchema, fieldMapSnapshot: defaultAwardDOI, infoSchemaSnapshot: defaultAwardDOIInfoSchema };
        return _possibleConstructorReturn(this, (AwardDOI.__proto__ || Object.getPrototypeOf(AwardDOI)).call(this, props));
    }

    return AwardDOI;
}(BaseData);