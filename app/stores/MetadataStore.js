import {observable} from 'mobx';

class MetadataStore {


	@observable metadata = {
            "code_id": 0,
            "open_source": '',
            "repository_link": '',
            "software_title": '',
            "acronym": '',
            "doi": '',
            "description": '',
            "country_of_origin": '',
            "date_of_issuance" : '',
            "keywords": '',
            "site_accession_number": '',
            "other_special_requirements": '',
            "related_software": '',
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

		   	"repository_link": {required:true, completed:false, validations: ["URL"], Panel: 1, error: ''},
	        "software_title": {required:true, completed:false, validations: [], Panel: 2, error: ''},
	        "acronym": {required:false, completed:false, validations: [], Panel: 2, error: ''},
	        "doi": {required:false, completed:false, validations: ["DOI"], Panel: 2, error: ''},
	        "description": {required:true, completed:false, validations: [], Panel: 2, error: ''},
            "date_of_issuance" : {required:true, completed:false, validations: [], Panel: 2, error: ''},
	        "country_of_origin": {required:true, completed:false, validations: [], Panel: 2, error: ''},
            "keywords": {required:false, completed:false, validations: [], Panel: 2, error: ''},
            "site_accession_number": {required:false, completed:false, validations: [], Panel: 2, error: ''},
            "other_special_requirements": {required:false, completed:false, validations: [], Panel: 2, error: ''},
            "related_software": {required:false, completed:false, validations: [], Panel: 2, error: ''},
	        "licenses": {required:true, completed:false, hasError:false, validations: [], Panel: 2, error: ''},
	        "developers": {required:true, completed:false, hasError:false, validations: [], Panel: 3, error: ''},
  	        "contributors": {required:false, completed:false, hasError:false, validations: [], Panel: 3, error: ''},
            "sponsoring_organizations" : {required:true, completed:false, hasError:false, validations: [], Panel: 4, error: ''},
            "contributing_organizations" : {required:false, completed:false, hasError:false, validations: [], Panel: 4, error: ''},
            "research_organizations" : {required:true, completed:false, hasError:false, validations: [], Panel: 4, error: ''},
  	        "related_identifiers" : {required:false, completed:false, hasError:false, validations: [], Panel: 5, error: ''},
  	        "recipient_name": {required:true, completed:false, validations: [], Panel: 6, error: ''},
  	        "recipient_email": {required:true, completed:false, validations: ["Email"], Panel: 6, error: ''},
  	        "recipient_phone": {required:true, completed:false, validations: ["Phone"], Panel: 6, error: ''},
  	        "recipient_org": {required:true, completed:false, validations: [], Panel: 6, error: ''},



   }


	@observable developer = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            orcid: '',
            affiliations: '',
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
            affiliations: '',
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
           email: '',
           orcid: '',
           primary_award: '',
           award_numbers: '',
           fwp_numbers: '',
           br_codes: '',
           id: ''
   }

   @observable sponsoringOrganizationInfoSchema = {


          "organization_name": {required:true, completed:false, validations: [], error: ''},
          "email": {required:false, completed:false, validations: ["Email"], error: ''},
          "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
          "primary_award" : {required:true, completed:false, validations: ["Award"], error: ''},
          "award_numbers" : {required:false, completed:false, validations: [""], error: ''},
          "br_codes" : {required:false, completed:false, validations: [], error: ''},
          "fwp_numbers" : {required:false, completed:false, validations: [], error: ''},
     }

   @observable researchOrganization = {
 		   DOE : true,
           organization_name: '',
           email: '',
           orcid: '',
           id: ''
   }

   @observable researchOrganizationInfoSchema = {

         "organization_name": {required:true, completed:false, validations: [], error: ''},
          "email": {required:false, completed:false, validations: ["Email"], error: ''},
          "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
     }

   @observable contributingOrganization = {
 		   DOE : true,
           organization_name: '',
           email: '',
           orcid: '',
           contributor_type: '',
           id: ''
   }

   @observable contributingOrganizationInfoSchema = {

         "organization_name": {required:true, completed:false, validations: [], error: ''},
          "email": {required:false, completed:false, validations: ["Email"], error: ''},
          "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
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


}

const singleton = new MetadataStore();
export default singleton;
