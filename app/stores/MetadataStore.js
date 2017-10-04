import {observable} from 'mobx';

class MetadataStore {


	@observable metadata = {
            "code_id": 0,
            "open_source": '',
            "repository_link": '',
            "landing_page": '',
            "software_title": '',
            "acronym": '',
            "doi": '',
            "doi_infix": '',
            "doi_status": "",
            "accessibility": "OS",
            "description": '',
            "country_of_origin": 'United States',
            "release_date" : '',
            "keywords": '',
            "site_accession_number": '',
            "other_special_requirements": '',
            "licenses": [],
						"proprietary_url" : [],
            "access_limitations": ["UNL"],
            "developers": [],
            "contributors": [],
            "sponsoring_organizations" : [],
            "contributing_organizations" : [],
            "research_organizations" : [],
            "related_identifiers" : [],
            "recipient_name": '',
            "recipient_email": '',
            "recipient_phone": '',
            "recipient_org": '',
						"file_name": '',
            "files": []
        };



    /*
    "files": {required:false, completed:false, hasError:false, validations: [], Panel: 1, errorMessage: ''},
	        "country_of_origin": {required:true, completed:true, hasError:false, validations: [], Panel: 2, errorMessage: ''},

*/
	@observable metadataInfoSchema = {
		   	"repository_link": {required:"sub", label: "Repository Link", completed:false, ever_completed:false, validations: ["repositorylink"], Panel: "Repository Information", error: ''},
		   	"landing_page": {required:"", label: "Landing Page", completed:false, ever_completed:false, validations: ["url"], Panel: "", error: ''},
				"file_name" : {required:"", label: "Upload Source Code", completed: false, ever_completed:false, validations: [], Panel: "", error: ''},
					"software_title": {required:"sub", label: "Software Title", completed:false, ever_completed:false, validations: [], Panel: "Product Description", error: ''},
	        "description": {required:"sub", label: "Description/Abstract", completed:false, ever_completed:false, validations: [], Panel: "Product Description", error: ''},
	        "licenses": {required:"sub", label: "Licenses", completed:false, hasError:false, ever_completed:false, validations: [], Panel: "Product Description", error: ''},
					"proprietary_url": {required: "", label: "License URL", completed:false, hasError:false, ever_completed:false, validations: ["url"], Panel: "", error: ''},
	        "developers": {required:"sub", label: "Developers", completed:false, hasError:false, ever_completed:false, validations: [], Panel: "Developers", error: ''},
	        "doi": {required:"", completed:false, ever_completed:false, validations: ["doi"], Panel: "DOI and Release Date", error: ''},
	        "doi_infix" : {required:"", completed:false, ever_completed:false, validations: [""], Panel: "", error: ''},
            "release_date" : {required:"announ", label: "Release Date", completed:false, ever_completed:false, validations: [], Panel: "DOI and Release Date", error: ''},
            "sponsoring_organizations" : {required:"announ", label: "Sponsoring Organizations", completed:false, hasError:false, ever_completed:false, validations: [], Panel: "Organizations", error: ''},
            "research_organizations" : {required:"announ", label: "Research Organizations", completed:false, hasError:false, ever_completed:false, validations: [], Panel: "Organizations", error: ''},
  	        "contributors": {required:"", completed:false, hasError:false, ever_completed:false, validations: [], Panel: "Contributors and Contributing Organizations", error: ''},
            "contributing_organizations" : {required:"", completed:false, hasError:false, ever_completed:false, validations: [], Panel: "Contributors and Contributing Organizations", error: ''},
	        "acronym": {required:"", completed:false, ever_completed:false, validations: [], Panel: "Supplemental Product Information", error: ''},
	        "country_of_origin": {required:"announ", label: "Country of Origin", completed:true, ever_completed:false, validations: [], Panel: "Supplemental Product Information", error: ''},
            "keywords": {required:"", completed:false, ever_completed:false, validations: [], Panel: "Supplemental Product Information", error: ''},
            "site_accession_number": {required:"", completed:false, ever_completed:false, validations: [], Panel: "Supplemental Product Information", error: ''},
            "other_special_requirements": {required:"", completed:false, ever_completed:false, validations: [], Panel: "Supplemental Product Information", error: ''},
  	        "related_identifiers" : {required:"", completed:false, hasError:false, ever_completed:false, validations: [], Panel: "Identifiers", error: ''},
  	        "recipient_name": {required:"announ", label: "Name", completed:false, ever_completed:false, validations: [], Panel: "Contact Information", error: ''},
  	        "recipient_email": {required:"announ", label: "Email", completed:false, ever_completed:false, validations: ["email"], Panel: "Contact Information", error: ''},
  	        "recipient_phone": {required:"announ", label: "Phone", completed:false, ever_completed:false, validations: ["phonenumber"], Panel: "Contact Information", error: ''},
  	        "recipient_org": {required:"announ", label: "Organization", completed:false, ever_completed:false, validations: [], Panel: "Contact Information", error: ''},
   }


	@observable developer = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            orcid: '',
            affiliations: [],
            id: ''
        }


	@observable developerInfoSchema = {

		   	"first_name": {required:true, completed:false, validations: [], error: ''},
	        "middle_name": {required:false, completed:false, validations: [], error: ''},
	        "last_name": {required:true, completed:false, validations: [], error: ''},
	        "email": {required:false, completed:false, validations: ["email"], error: ''},
	        "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
	        "affiliations" : {required:false, completed:false, validations: [], error: ''},

   }


	@observable contributor = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            orcid: '',
            affiliations: [],
            contributor_type: '',
            id: ''
    }



	@observable contributorInfoSchema = {

		   	"first_name": {required:true, completed:false, validations: [], error: ''},
	        "middle_name": {required:false, completed:false, validations: [], error: ''},
	        "last_name": {required:true, completed:false, validations: [], error: ''},
	        "email": {required:false, completed:false, validations: ["email"], error: ''},
	        "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
	        "affiliations" : {required:false, completed:false, validations: [], error: ''},
	        "contributor_type" : {required:true, completed:false, validations: [], error: ''}


   }


   @observable sponsoringOrganization = {
		   DOE : true,
           organization_name: '',
           primary_award: '',
           award_numbers: [],
           fwp_numbers: [],
           br_codes: [],
           id: ''
   }

   @observable sponsoringOrganizationInfoSchema = {
          "organization_name": {required:true, completed:false, validations: [], error: ''},
          "primary_award" : {required:true, completed:false, validations: ["awardnumber"], error: ''},
          "award_numbers" : {required:false, completed:false, validations: [], error: ''},
          "br_codes" : {required:false, completed:false, validations: ["BR"], error: ''},
          "fwp_numbers" : {required:false, completed:false, validations: [], error: ''},
     }

   @observable researchOrganization = {
 		   DOE : true,
           organization_name: '',
           id: ''
   }

   @observable researchOrganizationInfoSchema = {

         "organization_name": {required:true, completed:false, validations: [], error: ''},
     }

   @observable contributingOrganization = {
 		   DOE : true,
           organization_name: '',
           contributor_type: '',
           id: ''
   }

   @observable contributingOrganizationInfoSchema = {

         "organization_name": {required:true, completed:false, validations: [], error: ''},
          "contributor_type" : {required:true, completed:false, validations: [], error: ''}
     }

    @observable relatedIdentifier = {
		      identifier_type : '',
		      relation_type : '',
		      identifier_value : '',
		      id: ''
    }

	@observable relatedIdentifierInfoSchema = {

	         "identifier_type": {required:true, completed:false, validations: [], error: ''},
	          "relation_type": {required:true, completed:false, validations: [], error: ''},
	          "identifier_value": {required:true, completed:false, validations: [], error: ''}
	     }

    @observable user = {
 		   	  email : '',
 		   	  password: '',
 		   	  confirm_password: ''
    }

    @observable userSchema = {

          "email": {required:true, completed:false, validations: ["email"], error: ''},
          "password" : {required:true, completed:false, validations: [], error: ''},
          "confirm_password" : {required:true, completed:false, validations: ["PWMatch"], error: ''}
      }


}

const singleton = new MetadataStore();
export default singleton;
