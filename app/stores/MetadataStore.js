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
            "files": []
        };



    /*
    "files": {required:false, completed:false, hasError:false, validations: [], Panel: 1, errorMessage: ''},
	        "country_of_origin": {required:true, completed:true, hasError:false, validations: [], Panel: 2, errorMessage: ''},

*/
	@observable metadataInfoSchema = {

		   	"repository_link": {required:"pub", label: "Repository Link", completed:false, validations: ["URL"], Panel: "Repository Information", error: ''},
		   	"landing_page": {required:"", label: "Landing Page", completed:false, validations: ["URL"], Panel: "", error: ''},
				"files" : {required:"", label: "File Upload", completed: false, Panel: "", error: ''},
					"software_title": {required:"pub", label: "Software Title", completed:false, validations: [], Panel: "Product Description", error: ''},
	        "description": {required:"pub", label: "Description/Abstract", completed:false, validations: [], Panel: "Product Description", error: ''},
	        "licenses": {required:"pub", label: "Licenses", completed:false, hasError:false, validations: [], Panel: "Product Description", error: ''},
	        "developers": {required:"pub", label: "Developers", completed:false, hasError:false, validations: [], Panel: "Developers", error: ''},
	        "doi": {required:"", completed:false, validations: ["DOI"], Panel: "DOI and Release Date", error: ''},
	        "doi_infix" : {required:"", completed:false, validations: [""], Panel: "", error: ''},
            "release_date" : {required:"sub", label: "Release Date", completed:false, validations: [], Panel: "DOI and Release Date", error: ''},
            "sponsoring_organizations" : {required:"sub", label: "Sponsoring Organizations", completed:false, hasError:false, validations: [], Panel: "Organizations", error: ''},
            "research_organizations" : {required:"sub", label: "Research Organizations", completed:false, hasError:false, validations: [], Panel: "Organizations", error: ''},
  	        "contributors": {required:"", completed:false, hasError:false, validations: [], Panel: "Contributors and Contributing Organizations", error: ''},
            "contributing_organizations" : {required:"", completed:false, hasError:false, validations: [], Panel: "Contributors and Contributing Organizations", error: ''},
	        "acronym": {required:"", completed:false, validations: [], Panel: "Supplemental Product Information", error: ''},
	        "country_of_origin": {required:"sub", label: "Country of Origin", completed:true, validations: [], Panel: "Supplemental Product Information", error: ''},
            "keywords": {required:"", completed:false, validations: [], Panel: "Supplemental Product Information", error: ''},
            "site_accession_number": {required:"", completed:false, validations: [], Panel: "Supplemental Product Information", error: ''},
            "other_special_requirements": {required:"", completed:false, validations: [], Panel: "Supplemental Product Information", error: ''},
  	        "related_identifiers" : {required:"", completed:false, hasError:false, validations: [], Panel: "Identifiers", error: ''},
  	        "recipient_name": {required:"sub", label: "Name", completed:false, validations: [], Panel: "Contact Information", error: ''},
  	        "recipient_email": {required:"sub", label: "Email", completed:false, validations: ["Email"], Panel: "Contact Information", error: ''},
  	        "recipient_phone": {required:"sub", label: "Phone", completed:false, validations: ["Phone"], Panel: "Contact Information", error: ''},
  	        "recipient_org": {required:"sub", label: "Organization", completed:false, validations: [], Panel: "Contact Information", error: ''},



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
	        "email": {required:false, completed:false, validations: ["Email"], error: ''},
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
	        "email": {required:false, completed:false, validations: ["Email"], error: ''},
	        "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
	        "affiliations" : {required:false, completed:false, validations: [], error: ''},
	        "contributor_type" : {required:true, completed:false, validations: [], error: ''}


   }


   @observable sponsoringOrganization = {
		   DOE : true,
           organization_name: '',
           primary_award: '',
           award_numbers: '',
           fwp_numbers: '',
           br_codes: '',
           id: ''
   }

   @observable sponsoringOrganizationInfoSchema = {


          "organization_name": {required:true, completed:false, validations: [], error: ''},
          "primary_award" : {required:true, completed:false, validations: ["Award"], error: ''},
          "award_numbers" : {required:false, completed:false, validations: [""], error: ''},
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

          "email": {required:true, completed:false, validations: ["Email"], error: ''},
          "password" : {required:true, completed:false, validations: [], error: ''},
          "confirm_password" : {required:true, completed:false, validations: ["PWMatch"], error: ''}
      }


}

const singleton = new MetadataStore();
export default singleton;
