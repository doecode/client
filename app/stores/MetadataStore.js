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
            "access_limitations": [],
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
	        "country_of_origin": {required:true, completed:false, hasError:false, validations: [], Panel: 2, errorMessage: ''},


  	        "related_identifiers" : {required:false, completed:false, hasError:false, validations: [], Panel: 6, errorMessage: ''},
  	        	        "recipient_name": {required:true, completed:false, validations: [], Panel: 7, errorMessage: ''},
	        "recipient_email": {required:true, completed:false, validations: ["Email"], Panel: 7, errorMessage: ''},
	        "recipient_phone": {required:true, completed:false, validations: ["Phone"], Panel: 7, errorMessage: ''},
	        "recipient_org": {required:true, completed:false, validations: [], Panel: 7, errorMessage: ''},
*/
	@observable metadataInfoSchema = {

		   	"repository_link": {required:true, completed:false, validations: ["URL"], Panel: 1, error: ''},
	        "software_title": {required:true, completed:false, validations: [], Panel: 2, error: ''},
	        "acronym": {required:false, completed:false, validations: [], Panel: 2, error: ''},
	        "doi": {required:false, completed:false, validations: ["DOI"], Panel: 2, error: ''},
	        "description": {required:true, completed:false, validations: [], Panel: 2, error: ''},
          "date_of_issuance" : {required:true, completed:false, validations: [], Panel: 2, error: ''},
          "keywords": {required:false, completed:false, validations: [], Panel: 2, error: ''},
          "site_accession_number": {required:false, completed:false, validations: [], Panel: 2, error: ''},
          "other_special_requirements": {required:false, completed:false, validations: [], Panel: 2, error: ''},
          "related_software": {required:false, completed:false, validations: [], Panel: 2, error: ''},
	        "licenses": {required:true, completed:false, hasError:false, validations: [], Panel: 3, errorMessage: ''},
	        "access_limitations": {required:false, completed:false, hasError:false, validations: [], Panel: 3, errorMessage: ''},
	        "developers": {required:true, completed:false, hasError:false, validations: [], Panel: 4, errorMessage: ''},
  	        "contributors": {required:false, completed:false, hasError:false, validations: [], Panel: 4, errorMessage: ''},
            "sponsoring_organizations" : {required:true, completed:false, hasError:false, validations: [], Panel: 5, errorMessage: ''},
            "contributing_organizations" : {required:false, completed:false, hasError:false, validations: [], Panel: 5, errorMessage: ''},
            "research_organizations" : {required:false, completed:false, hasError:false, validations: [], Panel: 5, errorMessage: ''},
  	        "related_identifiers" : {required:false, completed:false, hasError:false, validations: [], Panel: 6, errorMessage: ''},



   }


	@observable developer = {
            first_name: '',
            middle_name: '',
            last_name: '',
            email: '',
            orcid: '',
            affiliations: '',
            place: -1,
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
            place: -1,
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
           organization_name: '',
           email: '',
           orcid: '',
           primary_award: '',
           award_numbers: [],
           id: ''
   }

   @observable sponsoringOrganizationInfoSchema = {

         "organization_name": {required:true, completed:false, validations: [], error: ''},
          "email": {required:false, completed:false, validations: ["Email"], error: ''},
          "orcid": {required:false, completed:false, validations: ["Orcid"], error: ''},
          "primary_award" : {required:true, completed:false, validations: [], error: ''},
          "award_numbers" : {required:false, completed:false, validations: [], error: ''}
     }

   @observable researchOrganization = {
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
		      identifier : '',
		      id: ''
    }
	
	@observable relatedIdentifierInfoSchema = {

	         "identifier_type": {required:true, completed:false, validations: [], error: ''},
	          "relation_type": {required:true, completed:false, validations: [], error: ''},
	          "identifier": {required:false, completed:false, validations: [], error: ''}
	     }


}

const singleton = new MetadataStore();
export default singleton;
