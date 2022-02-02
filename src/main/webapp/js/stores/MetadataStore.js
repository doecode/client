var MetadataStore = function MetadataStore() {};

var repo_fields = ["project_type", "repository_link", "landing_page", "landing_contact"];
var product_fields = ["software_title", "description", "programming_languages", "version_number", "documentation_url", "license_closedsource_available", "license_closedsource_contactinfo", "licenses", "access_limitations", "phase", "previous_contract_number", "contract_start_date", "sb_release_date", "bo_name", "bo_email", "bo_phone", "bo_org", "pi_name", "pi_email", "pi_phone", "pi_org", "exemption_number", "ouo_release_date", "protection", "protection_other", "program_office", "protection_reason", "proprietary_url","license_contact_email"];
var developers_fields = ["developers"];
var doi_fields = ["doi", "doi_infix", "release_date"];
var supplemental_fields = ["acronym", "country_of_origin", "keywords", "project_keywords", "site_accession_number", "other_special_requirements", "is_migration", "file_name", "is_file_certified", "container_name"];
var organizations_fields = ["sponsoring_organizations", "research_organizations"];
var contribs_fields = ["contributors", "contributing_organizations"];
var identifiers_fields = ["related_identifiers"];
var awards_fields = ["award_dois"];
var contact_fields = ["recipient_name", "recipient_email", "recipient_phone", "recipient_org"];

var _metadata = mobx.observable({
    "code_id": 0,
    "software_type": "",
    "open_source": false,
    "repository_link": '',
    "landing_page": '',
    "landing_contact": '',
    "software_title": '',
    "acronym": '',
    "doi": '',
    "doi_infix": '',
    "doi_status": "",
    "project_type": null,
    "project_type_opensource": null,
    "project_type_public": null,
    "project_type_landing": null,
    "description": '',
    "programming_languages": [],
    "version_number": '',
    "documentation_url": '',
    "country_of_origin": 'United States',
    "release_date": '',
    "keywords": '',
    "project_keywords": [],
    "site_accession_number": '',
    "other_special_requirements": '',
    "license_closedsource_available": null,
    "license_closedsource_contactinfo": null,
    "licenses": [],
    "proprietary_url": [],
    "license_contact_email": '',
    "access_limitations": [],
    "phase": '',
    "previous_contract_number": '',
    "contract_start_date": '',
    "sb_release_date": '',
    "bo_name": '',
    "bo_email": '',
    "bo_phone": '',
    "bo_org": '',
    "pi_name": '',
    "pi_email": '',
    "pi_phone": '',
    "pi_org": '',
    "exemption_number": '',
    "ouo_release_date": '',
    "protection": '',
    "protection_other": '',
    "program_office": '',
    "protection_reason": '',
    "developers": [],
    "contributors": [],
    "sponsoring_organizations": [],
    "contributing_organizations": [],
    "research_organizations": [],
    "related_identifiers": [],
    "award_dois": [],
    "recipient_name": '',
    "recipient_email": '',
    "recipient_phone": '',
    "recipient_org": '',
    "is_migration": false,
    "file_name": '',
    "is_file_certified": false,
    "files": [],
    "container_name": '',
    "containers": []
});

var _metadataInfoSchema = mobx.observable({
    "project_type": {
        required: "sub",
        label: "Project Type",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Repository Information",
        error: ''
    },
    "project_type_opensource": {
        required: "sub",
        label: "Is this software project Open Source or Closed Source?",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Repository Information",
        error: ''
    },
    "project_type_public": {
        required: "sub",
        label: "Is this software project available in a Publicly Accessible Repository?",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Repository Information",
        error: ''
    },
    "project_type_landing": {
        required: "sub",
        label: "Does this project have a landing page?",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Repository Information",
        error: ''
    },
    "repository_link": {
        required: "sub",
        label: "Repository URL",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Repository Information",
        error: '',
        extra_info: ''
    },
    "landing_page": {
        required: "",
        label: "Landing Page",
        completed: false,
        ever_completed: false,
        validations: ["url"],
        panel: "",
        error: ''
    },
    "landing_contact": {
        required: "",
        label: "Contact Email",
        completed: false,
        ever_completed: false,
        validations: ["email"],
        panel: "",
        error: ''
    },
    "is_migration": {
        required: "",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Supplemental Product Information",
        error: ''
    },
    "file_name": {
        required: "",
        label: "Upload Source Code",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "",
        error: ''
    },
    "is_file_certified": {
        required: "",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Supplemental Product Information",
        error: ''
    },
    "container_name": {
        required: "",
        label: "Upload Container Image",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "",
        error: ''
    },
    "software_title": {
        required: "sub",
        label: "Software Title",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: ''
    },
    "description": {
        required: "sub",
        label: "Description/Abstract",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: ''
    },
    "programming_languages": {
        required: "",
        label: "Programming Languages",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: ''
    },
    "version_number": {
        required: "",
        label: "Version Number",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: ''
    },
    "documentation_url": {
        required: "",
        label: "Documentation URL",
        completed: false,
        ever_completed: false,
        validations: ["url"],
        panel: "Product Description",
        error: ''
    },
    "license_closedsource_available": {
        required: "",
        label: "Does this software project have a license?",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: ''
    },
    "license_closedsource_contactinfo": {
        required: "",
        label: "Does this license have up-to-date contact information?",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: ''
    },
    "licenses": {
        required: "sub",
        label: "Licenses",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: ''
    },
    "access_limitations": {
        required: "sub",
        label: "Access Limitations",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: ''
    },
    "phase": {
        required: "",
        label: "Phase",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "previous_contract_number": {
        required: "",
        label: "Previous Contract Number",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "contract_start_date": {
        required: "",
        label: "Contract Start Date",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "sb_release_date": {
        required: "",
        label: "Release Date",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "bo_name": {
        required: "",
        label: "Business Official Name",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "bo_email": {
        required: "",
        label: "Business Official Email",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: ["email"],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "bo_phone": {
        required: "",
        label: "Business Official Phone",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: ["phonenumber"],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "bo_org": {
        required: "",
        label: "Business Official Organization",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "pi_name": {
        required: "",
        label: "Principal Investigator Name",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "pi_email": {
        required: "",
        label: "Principal Investigator Email",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: ["email"],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "pi_phone": {
        required: "",
        label: "Principal Investigator Phone",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: ["phonenumber"],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "pi_org": {
        required: "",
        label: "Principal Investigator Organization",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "small_business"
    },
    "exemption_number": {
        required: "",
        label: "Exemption Number",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "official_use_only"
    },
    "ouo_release_date": {
        required: "",
        label: "OUO Release Date",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "official_use_only"
    },
    "protection": {
        required: "",
        label: "Protection",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "official_use_only"
    },
    "protection_other": {
        required: "",
        label: "Specify Other Protection",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "official_use_only"
    },
    "program_office": {
        required: "",
        label: "DOE Headquarters Program Office",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "official_use_only"
    },
    "protection_reason": {
        required: "",
        label: "Protection Reason",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Product Description",
        error: '',
        group: "official_use_only"
    },
    "proprietary_url": {
        required: "",
        label: "License URL",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: ["url"],
        panel: "",
        error: ''
    },
    "license_contact_email": {
        required: "",
        label: "License Contact Email",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: ["email"],
        panel: "",
        error: ''
    },
    "developers": {
        required: "sub",
        label: "Developers",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: ["developers"],
        panel: "Developers",
        error: ''
    },
    "doi": {
        required: "",
        completed: false,
        ever_completed: false,
        validations: ["doi"],
        panel: "DOI and Release Date",
        error: ''
    },
    "doi_infix": {
        required: "",
        completed: false,
        ever_completed: false,
        validations: [""],
        panel: "",
        error: ''
    },
    "release_date": {
        required: "announ",
        label: "Release Date",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "DOI and Release Date",
        error: ''
    },
    "sponsoring_organizations": {
        required: "announ",
        label: "Sponsoring Organizations",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Organizations",
        error: ''
    },
    "research_organizations": {
        required: "announ",
        label: "Research Organizations",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Organizations",
        error: ''
    },
    "contributors": {
        required: "",
        label: "Contributors",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Contributors and Contributing Organizations",
        error: ''
    },
    "contributing_organizations": {
        required: "",
        label: "Contributing Organizations",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Contributors and Contributing Organizations",
        error: ''
    },
    "acronym": {
        required: "",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Supplemental Product Information",
        error: ''
    },
    "country_of_origin": {
        required: "announ",
        label: "Country of Origin",
        completed: true,
        ever_completed: false,
        validations: [],
        panel: "Supplemental Product Information",
        error: ''
    },
    "keywords": {
        required: "",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Supplemental Product Information",
        error: ''
    },
    "project_keywords": {
        required: "",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Supplemental Product Information",
        error: ''
    },
    "site_accession_number": {
        required: "",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Supplemental Product Information",
        error: ''
    },
    "other_special_requirements": {
        required: "",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Supplemental Product Information",
        error: ''
    },
    "related_identifiers": {
        required: "",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Identifiers",
        error: ''
    },
    "award_dois": {
        required: "",
        completed: false,
        hasError: false,
        ever_completed: false,
        validations: [],
        panel: "Award DOIs",
        error: ''
    },
    "recipient_name": {
        required: "announ",
        label: "Name",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Contact Information",
        error: ''
    },
    "recipient_email": {
        required: "announ",
        label: "Email",
        completed: false,
        ever_completed: false,
        validations: ["email"],
        panel: "Contact Information",
        error: ''
    },
    "recipient_phone": {
        required: "announ",
        label: "Phone",
        completed: false,
        ever_completed: false,
        validations: ["phonenumber"],
        panel: "Contact Information",
        error: ''
    },
    "recipient_org": {
        required: "announ",
        label: "Organization",
        completed: false,
        ever_completed: false,
        validations: [],
        panel: "Contact Information",
        error: ''
    }
});

var _panelStatus = mobx.observable({
    "repository": {
        get remainingRequired() {
            var remainingRequired = 0;

            for (var i = 0, len = repo_fields.length; i < len; i++) {
                var field = repo_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required && !obj.completed) {
                    remainingRequired++;
                }
            }

            return remainingRequired;
        },
        get completedOptional() {
            var completedOptional = 0;

            for (var i = 0, len = repo_fields.length; i < len; i++) {
                var field = repo_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && !obj.required && obj.completed) {
                    completedOptional++;
                }
            }

            return completedOptional;
        },
        get hasRequired() {
            var hasRequired = false;

            for (var i = 0, len = repo_fields.length; i < len; i++) {
                var field = repo_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required) {
                    hasRequired = true;
                    break;
                }
            }

            return hasRequired;
        },
        get errors() {
            var errors = "";

            for (var i = 0, len = repo_fields.length; i < len; i++) {
                var field = repo_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.error) {
                    errors += (errors ? "; " : "") + obj.error;
                }
            }

            return errors;
        }
    },
    "product": {
        get remainingRequired() {
            var remainingRequired = 0;

            for (var i = 0, len = product_fields.length; i < len; i++) {
                var field = product_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required && !obj.completed) {
                    remainingRequired++;
                }
            }

            return remainingRequired;
        },
        get completedOptional() {
            var completedOptional = 0;

            for (var i = 0, len = product_fields.length; i < len; i++) {
                var field = product_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && !obj.required && obj.completed) {
                    completedOptional++;
                }
            }

            return completedOptional;
        },
        get hasRequired() {
            var hasRequired = false;

            for (var i = 0, len = product_fields.length; i < len; i++) {
                var field = product_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required) {
                    hasRequired = true;
                    break;
                }
            }

            return hasRequired;
        },
        get errors() {
            var errors = "";

            for (var i = 0, len = product_fields.length; i < len; i++) {
                var field = product_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.error) {
                    errors += (errors ? "; " : "") + obj.error;
                }
            }

            return errors;
        }
    },
    "developers": {
        get remainingRequired() {
            var remainingRequired = 0;

            for (var i = 0, len = developers_fields.length; i < len; i++) {
                var field = developers_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required && !obj.completed) {
                    remainingRequired++;
                }
            }

            return remainingRequired;
        },
        get completedOptional() {
            var completedOptional = 0;

            for (var i = 0, len = developers_fields.length; i < len; i++) {
                var field = developers_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && !obj.required && obj.completed) {
                    completedOptional++;
                }
            }

            return completedOptional;
        },
        get hasRequired() {
            var hasRequired = false;

            for (var i = 0, len = developers_fields.length; i < len; i++) {
                var field = developers_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required) {
                    hasRequired = true;
                    break;
                }
            }

            return hasRequired;
        },
        get errors() {
            var errors = "";

            for (var i = 0, len = developers_fields.length; i < len; i++) {
                var field = developers_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.error) {
                    errors += (errors ? "; " : "") + obj.error;
                }
            }

            return errors;
        }
    },
    "doi": {
        get remainingRequired() {
            var remainingRequired = 0;

            for (var i = 0, len = doi_fields.length; i < len; i++) {
                var field = doi_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required && !obj.completed) {
                    remainingRequired++;
                }
            }

            return remainingRequired;
        },
        get completedOptional() {
            var completedOptional = 0;

            for (var i = 0, len = doi_fields.length; i < len; i++) {
                var field = doi_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && !obj.required && obj.completed) {
                    completedOptional++;
                }
            }

            return completedOptional;
        },
        get hasRequired() {
            var hasRequired = false;

            for (var i = 0, len = doi_fields.length; i < len; i++) {
                var field = doi_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required) {
                    hasRequired = true;
                    break;
                }
            }

            return hasRequired;
        },
        get errors() {
            var errors = "";

            for (var i = 0, len = doi_fields.length; i < len; i++) {
                var field = doi_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.error) {
                    errors += (errors ? "; " : "") + obj.error;
                }
            }

            return errors;
        }
    },
    "supplemental": {
        get remainingRequired() {
            var remainingRequired = 0;

            for (var i = 0, len = supplemental_fields.length; i < len; i++) {
                var field = supplemental_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required && !obj.completed) {
                    remainingRequired++;
                }
            }

            return remainingRequired;
        },
        get completedOptional() {
            var completedOptional = 0;

            for (var i = 0, len = supplemental_fields.length; i < len; i++) {
                var field = supplemental_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && !obj.required && obj.completed) {
                    completedOptional++;
                }
            }

            return completedOptional;
        },
        get hasRequired() {
            var hasRequired = false;

            for (var i = 0, len = supplemental_fields.length; i < len; i++) {
                var field = supplemental_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required) {
                    hasRequired = true;
                    break;
                }
            }

            return hasRequired;
        },
        get errors() {
            var errors = "";

            for (var i = 0, len = supplemental_fields.length; i < len; i++) {
                var field = supplemental_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.error) {
                    errors += (errors ? "; " : "") + obj.error;
                }
            }

            return errors;
        }
    },
    "organizations": {
        get remainingRequired() {
            var remainingRequired = 0;

            for (var i = 0, len = organizations_fields.length; i < len; i++) {
                var field = organizations_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required && !obj.completed) {
                    remainingRequired++;
                }
            }

            return remainingRequired;
        },
        get completedOptional() {
            var completedOptional = 0;

            for (var i = 0, len = organizations_fields.length; i < len; i++) {
                var field = organizations_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && !obj.required && obj.completed) {
                    completedOptional++;
                }
            }

            return completedOptional;
        },
        get hasRequired() {
            var hasRequired = false;

            for (var i = 0, len = organizations_fields.length; i < len; i++) {
                var field = organizations_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required) {
                    hasRequired = true;
                    break;
                }
            }

            return hasRequired;
        },
        get errors() {
            var errors = "";

            for (var i = 0, len = organizations_fields.length; i < len; i++) {
                var field = organizations_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.error) {
                    errors += (errors ? "; " : "") + obj.error;
                }
            }

            return errors;
        }
    },
    "contribs": {
        get remainingRequired() {
            var remainingRequired = 0;

            for (var i = 0, len = contribs_fields.length; i < len; i++) {
                var field = contribs_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required && !obj.completed) {
                    remainingRequired++;
                }
            }

            return remainingRequired;
        },
        get completedOptional() {
            var completedOptional = 0;

            for (var i = 0, len = contribs_fields.length; i < len; i++) {
                var field = contribs_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && !obj.required && obj.completed) {
                    completedOptional++;
                }
            }

            return completedOptional;
        },
        get hasRequired() {
            var hasRequired = false;

            for (var i = 0, len = contribs_fields.length; i < len; i++) {
                var field = contribs_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required) {
                    hasRequired = true;
                    break;
                }
            }

            return hasRequired;
        },
        get errors() {
            var errors = "";

            for (var i = 0, len = contribs_fields.length; i < len; i++) {
                var field = contribs_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.error) {
                    errors += (errors ? "; " : "") + obj.error;
                }
            }

            return errors;
        }
    },
    "identifiers": {
        get remainingRequired() {
            var remainingRequired = 0;

            for (var i = 0, len = identifiers_fields.length; i < len; i++) {
                var field = identifiers_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required && !obj.completed) {
                    remainingRequired++;
                }
            }

            return remainingRequired;
        },
        get completedOptional() {
            var completedOptional = 0;

            for (var i = 0, len = identifiers_fields.length; i < len; i++) {
                var field = identifiers_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && !obj.required && obj.completed) {
                    completedOptional++;
                }
            }

            return completedOptional;
        },
        get hasRequired() {
            var hasRequired = false;

            for (var i = 0, len = identifiers_fields.length; i < len; i++) {
                var field = identifiers_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required) {
                    hasRequired = true;
                    break;
                }
            }

            return hasRequired;
        },
        get errors() {
            var errors = "";

            for (var i = 0, len = identifiers_fields.length; i < len; i++) {
                var field = identifiers_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.error) {
                    errors += (errors ? "; " : "") + obj.error;
                }
            }

            return errors;
        }
    },
    "awards": {
        get remainingRequired() {
            var remainingRequired = 0;

            for (var i = 0, len = awards_fields.length; i < len; i++) {
                var field = awards_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required && !obj.completed) {
                    remainingRequired++;
                }
            }

            return remainingRequired;
        },
        get completedOptional() {
            var completedOptional = 0;

            for (var i = 0, len = awards_fields.length; i < len; i++) {
                var field = awards_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && !obj.required && obj.completed) {
                    completedOptional++;
                }
            }

            return completedOptional;
        },
        get hasRequired() {
            var hasRequired = false;

            for (var i = 0, len = awards_fields.length; i < len; i++) {
                var field = awards_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required) {
                    hasRequired = true;
                    break;
                }
            }

            return hasRequired;
        },
        get errors() {
            var errors = "";

            for (var i = 0, len = awards_fields.length; i < len; i++) {
                var field = awards_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.error) {
                    errors += (errors ? "; " : "") + obj.error;
                }
            }

            return errors;
        }
    },
    "contact": {
        get remainingRequired() {
            var remainingRequired = 0;

            for (var i = 0, len = contact_fields.length; i < len; i++) {
                var field = contact_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required && !obj.completed) {
                    remainingRequired++;
                }
            }

            return remainingRequired;
        },
        get completedOptional() {
            var completedOptional = 0;

            for (var i = 0, len = contact_fields.length; i < len; i++) {
                var field = contact_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && !obj.required && obj.completed) {
                    completedOptional++;
                }
            }

            return completedOptional;
        },
        get hasRequired() {
            var hasRequired = false;

            for (var i = 0, len = contact_fields.length; i < len; i++) {
                var field = contact_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.required) {
                    hasRequired = true;
                    break;
                }
            }

            return hasRequired;
        },
        get errors() {
            var errors = "";

            for (var i = 0, len = contact_fields.length; i < len; i++) {
                var field = contact_fields[i];
                var obj = _metadataInfoSchema[field];

                if (obj.panel && obj.error) {
                    errors += (errors ? "; " : "") + obj.error;
                }
            }

            return errors;
        }
    }
});

var _developer = mobx.observable({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    orcid: '',
    affiliations: [],
    id: ''
});

var _developerInfoSchema = mobx.observable({
    "first_name": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    },
    "middle_name": {
        required: false,
        completed: false,
        validations: [],
        error: ''
    },
    "last_name": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    },
    "email": {
        required: false,
        completed: false,
        validations: ["email"],
        error: ''
    },
    "orcid": {
        required: false,
        completed: false,
        validations: ["orcid"],
        error: ''
    },
    "affiliations": {
        required: false,
        completed: false,
        validations: [],
        error: ''
    }

});

var _contributor = mobx.observable({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    orcid: '',
    affiliations: [],
    contributor_type: '',
    id: ''
});

var _contributorInfoSchema = mobx.observable({
    "first_name": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    },
    "middle_name": {
        required: false,
        completed: false,
        validations: [],
        error: ''
    },
    "last_name": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    },
    "email": {
        required: false,
        completed: false,
        validations: ["email"],
        error: ''
    },
    "orcid": {
        required: false,
        completed: false,
        validations: ["orcid"],
        error: ''
    },
    "affiliations": {
        required: false,
        completed: false,
        validations: [],
        error: ''
    },
    "contributor_type": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    }

});

var _sponsoringOrganization = mobx.observable({
    DOE: true,
    organization_name: '',
    primary_award: '',
    award_numbers: [],
    fwp_numbers: [],
    br_codes: [],
    id: ''
});

var _sponsoringOrganizationInfoSchema = mobx.observable({
    "organization_name": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    },
    "primary_award": {
        required: true,
        completed: false,
        validations: ["awardnumber"],
        error: ''
    },
    "award_numbers": {
        required: false,
        completed: false,
        validations: [],
        error: ''
    },
    "br_codes": {
        required: false,
        completed: false,
        validations: ["BR"],
        error: ''
    },
    "fwp_numbers": {
        required: false,
        completed: false,
        validations: [],
        error: ''
    }
});

var _researchOrganization = mobx.observable({
    DOE: true,
    organization_name: '',
    id: ''
});

var _researchOrganizationInfoSchema = mobx.observable({
    "organization_name": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    }
});

var _contributingOrganization = mobx.observable({
    DOE: true,
    organization_name: '',
    contributor_type: '',
    id: ''
});

var _contributingOrganizationInfoSchema = mobx.observable({
    "organization_name": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    },
    "contributor_type": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    }
});

var _relatedIdentifier = mobx.observable({
    identifier_type: '',
    relation_type: '',
    identifier_value: '',
    id: ''
});

var _relatedIdentifierInfoSchema = mobx.observable({
    "identifier_type": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    },
    "relation_type": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    },
    "identifier_value": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    }
});

var _awardDOI = mobx.observable({
    award_doi: '',
    funder_name: '',
    id: ''
});

var _awardDOIInfoSchema = mobx.observable({
    "award_doi": {
        required: true,
        completed: false,
        validations: ['doi'],
        error: ''
    },
    "funder_name": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    }
});

var _user = mobx.observable({
    email: '',
    password: '',
    confirm_password: ''
});

var _userSchema = mobx.observable({
    "email": {
        required: true,
        completed: false,
        validations: ["email"],
        error: ''
    },
    "password": {
        required: true,
        completed: false,
        validations: [],
        error: ''
    },
    "confirm_password": {
        required: true,
        completed: false,
        validations: ["PWMatch"],
        error: ''
    }
});

Object.defineProperty(MetadataStore, "metadata", {
    get: function () {
        return _metadata;
    }
});
Object.defineProperty(MetadataStore, "metadataInfoSchema", {
    get: function () {
        return _metadataInfoSchema;
    }
});
Object.defineProperty(MetadataStore, "developer", {
    get: function () {
        return _developer;
    }
});
Object.defineProperty(MetadataStore, "developerInfoSchema", {
    get: function () {
        return _developerInfoSchema;
    }
});
Object.defineProperty(MetadataStore, "contributor", {
    get: function () {
        return _contributor;
    }
});
Object.defineProperty(MetadataStore, "contributorInfoSchema", {
    get: function () {
        return _contributorInfoSchema;
    }
});
Object.defineProperty(MetadataStore, "sponsoringOrganization", {
    get: function () {
        return _sponsoringOrganization;
    }
});
Object.defineProperty(MetadataStore, "sponsoringOrganizationInfoSchema", {
    get: function () {
        return _sponsoringOrganizationInfoSchema;
    }
});
Object.defineProperty(MetadataStore, "researchOrganization", {
    get: function () {
        return _researchOrganization;
    }
});
Object.defineProperty(MetadataStore, "researchOrganizationInfoSchema", {
    get: function () {
        return _researchOrganizationInfoSchema;
    }
});
Object.defineProperty(MetadataStore, "contributingOrganization", {
    get: function () {
        return _contributingOrganization;
    }
});
Object.defineProperty(MetadataStore, "contributingOrganizationInfoSchema", {
    get: function () {
        return _contributingOrganizationInfoSchema;
    }
});
Object.defineProperty(MetadataStore, "relatedIdentifier", {
    get: function () {
        return _relatedIdentifier;
    }
});
Object.defineProperty(MetadataStore, "relatedIdentifierInfoSchema", {
    get: function () {
        return _relatedIdentifierInfoSchema;
    }
});
Object.defineProperty(MetadataStore, "awardDOI", {
    get: function () {
        return _awardDOI;
    }
});
Object.defineProperty(MetadataStore, "awardDOIInfoSchema", {
    get: function () {
        return _awardDOIInfoSchema;
    }
});
Object.defineProperty(MetadataStore, "user", {
    get: function () {
        return _user;
    }
});
Object.defineProperty(MetadataStore, "userSchema", {
    get: function () {
        return _userSchema;
    }
});
Object.defineProperty(MetadataStore, "panelStatus", {
    get: function () {
        return _panelStatus;
    }
});