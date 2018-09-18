var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var parents = ["developers", "contributors", "sponsoring_organizations", "research_organizations", "contributing_organizations", "related_identifiers"];

var Metadata = function (_BaseData) {
  _inherits(Metadata, _BaseData);

  function Metadata() {
    _classCallCheck(this, Metadata);

    var props = {
      fieldMap: MetadataStore.metadata,
      infoSchema: MetadataStore.metadataInfoSchema,
      panelStatus: MetadataStore.panelStatus
    };
    
    return _possibleConstructorReturn(this, (Metadata.__proto__ || Object.getPrototypeOf(Metadata)).call(this, props));
  }

  _createClass(Metadata, [{
    key: "saveToArray",
    value: mobx.action("Save to Array", function saveToArray(field, data) {
      if (isNaN(parseInt(data.id))) this.addToArray(field, data);else this.modifyElementInArray(field, data);

      this.validateField(field);
    })
  }, {
    key: "addToArray",
    value: mobx.action("Add to Array", function addToArray(field, data) {
      data.id = this.fieldMap[field].length;
      this.fieldMap[field].push(data);
    })
  }, {
    key: "modifyElementInArray",
    value: mobx.action("Modify Element Array", function modifyElementInArray(field, data) {
      var index = data.id;

      if (index > -1) this.fieldMap[field][index] = data;
    })
  }, {
    key: "removeFromArray",
    value: mobx.action("Remove from Array", function removeFromArray(field, index) {
      this.fieldMap[field].splice(index, 1);

      // renumber ids as needed
      var end = this.fieldMap[field].length;
      for (var i = index; i < end; i++) {
        this.fieldMap[field][i].id = i;
      }

      this.validateField(field);
    })
  }, {
    key: "loadRecordFromServer",
    value: mobx.action("Load Record from Server", function loadRecordFromServer(data, page) {
      //deserializeData
      this.page = page;
      this.deserializeData(data);
    })
  }, {
    key: "loadRecordFromSessionStorage",
    value: mobx.action("Load Record from Session Storage", function loadRecordFromSessionStorage(data, page) {
      this.page = page;
      this.loadValues(data);
    })
  }, {
    key: "deserializeData",
    value: mobx.action("Deserialize Data", function deserializeData(data) {
      for (var field in data) {

        if (this.fieldMap[field] !== undefined && data[field] !== undefined && !(Array.isArray(data[field]) && data[field].length === 0)) {

          // preserve an ordering ID based on how data was received from server
          if (parents.indexOf(field) > -1) {
            var end = data[field].length;
            for (var i = 0; i < end; i++) {
              data[field][i].id = i;
            }
          }

          if (field === 'release_date' && data[field]) data[field] = moment(data[field], BACK_END_DATE_FORMAT).format(BACK_END_DATE_FORMAT);

          if (field === 'sponsoring_organizations') this.deserializeSponsoringOrganization(data);

          this.setValue(field, data[field]);
        }
      }
    })
  }, {
    key: "deserializeSponsoringOrganization",
    value: mobx.action("Deserialize Sponsoring Data", function deserializeSponsoringOrganization(data) {
      var sponsoringOrganizations = data.sponsoring_organizations;
      var end = sponsoringOrganizations.length;
      for (var i = 0; i < end; i++) {

        var fundingIDs = sponsoringOrganizations[i].funding_identifiers;
        var awardNumbers = [];
        var brCodes = [];
        var fwpNumbers = [];

        if (fundingIDs !== undefined) {

          var fundingLength = fundingIDs.length;
          for (var x = 0; x < fundingLength; x++) {
            var val = new String(fundingIDs[x].identifier_value);
            if (fundingIDs[x].identifier_type === 'AwardNumber') {
              awardNumbers.push(val.toString());
            } else if (fundingIDs[x].identifier_type === 'BRCode') {
              brCodes.push(val.toString());
            } else if (fundingIDs[x].identifier_type === 'FWPNumber') {
              fwpNumbers.push(val.toString());
            }
          }
        }

        data.sponsoring_organizations[i].award_numbers = awardNumbers;
        data.sponsoring_organizations[i].br_codes = brCodes;
        data.sponsoring_organizations[i].fwp_numbers = fwpNumbers;

        delete data.sponsoring_organizations[i].funding_identifiers;
      }
    })
  }, {
    key: "updateMetadata",
    value: mobx.action("Update Metadata", function updateMetadata(data) {
      var oldRepo = new String(this.fieldMap.repository_link);
      this.deserializeData(data);
      this.fieldMap.repository_link = oldRepo.toString();
    })
  }, {
    key: "serializeData",
    value: function serializeData() {
      var data = this.getCompletedData();

      var end = 0;
      if (data.sponsoring_organizations) end = data.sponsoring_organizations.length;

      for (var i = 0; i < end; i++) {
        var sponsor = data.sponsoring_organizations[i];
        var fundingIdentifiers = [];

        var awardNumbers = sponsor.award_numbers;
        var brCodes = sponsor.br_codes;
        var fwpNumbers = sponsor.fwp_numbers;

        for (var x = 0; x < awardNumbers.length; x++) {
          fundingIdentifiers.push({ identifier_type: "AwardNumber", identifier_value: awardNumbers[x] });
        }

        for (var x = 0; x < brCodes.length; x++) {
          fundingIdentifiers.push({ identifier_type: "BRCode", identifier_value: brCodes[x] });
        }

        for (var x = 0; x < fwpNumbers.length; x++) {
          fundingIdentifiers.push({ identifier_type: "FWPNumber", identifier_value: fwpNumbers[x] });
        }

        data.sponsoring_organizations[i].funding_identifiers = fundingIdentifiers;
      }

      return data;
    }
  }, {
    key: "requireOnlySubmitFields",
    value: mobx.action("Require Only Submit", function requireOnlySubmitFields() {
      for (var field in this.infoSchema) {
        var information = this.infoSchema[field];
        if (information.required == "announ") {
          information.required = "";
        }
      }
    })
  }]);



  return Metadata;
}(BaseData);
