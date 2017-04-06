import {observable} from 'mobx';
import Validation from '../utils/Validation';

const validation = new Validation();
export default class Metadata {
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



    }
    
   @observable files = [];
    
    /*	        "licenses": {required:true, completed:false, hasError:false, validations: [], Panel: 3, errorMessage: ''},
	        "access_limitations": {required:false, completed:false, hasError:false, validations: [], Panel: 3, errorMessage: ''},
	*/
   @observable validateMetadata = {
		    "files": {required:false, completed:false, hasError:false, validations: [], Panel: 1, errorMessage: ''},
		   	"repository_link": {required:true, completed:false, hasError:false, validations: ["URL"], Panel: 1, errorMessage: ''},
	        "software_title": {required:true, completed:false, hasError:false, validations: [], Panel: 2, errorMessage: ''},
	        "acronym": {required:false, completed:false, hasError:false, validations: [], Panel: 2, errorMessage: ''},
	        "doi": {required:false, completed:false, hasError:false, validations: ["DOI"], Panel: 2, errorMessage: ''},
	        "description": {required:true, completed:false, hasError:false, validations: [], Panel: 2, errorMessage: ''},
	        "country_of_origin": {required:true, completed:false, hasError:false, validations: [], Panel: 2, errorMessage: ''},
	        "date_of_issuance" : {required:true, completed:false, hasError:false, validations: [], Panel: 2, errorMessage: ''},
	        "keywords": {required:false, completed:false, hasError:false, validations: [], Panel: 2, errorMessage: ''},
	        "site_accession_number": {required:false, completed:false, hasError:false, validations: [], Panel: 2, errorMessage: ''},
	        "other_special_requirements": {required:false, completed:false, hasError:false, validations: [], Panel: 2, errorMessage: ''},
	        "related_software": {required:false, completed:false, hasError:false, validations: [], Panel: 2, errorMessage: ''},
	        "developers": {required:true, completed:false, hasError:false, validations: [], Panel: 4, errorMessage: ''},
	        "contributors": {required:true, completed:false, hasError:false, validations: [], Panel: 4, errorMessage: ''},
	        "sponsoring_organizations" : {required:true, completed:false, hasError:false, validations: [], Panel: 5, errorMessage: ''},
	        "contributing_organizations" : {required:false, completed:false, hasError:false, validations: [], Panel: 5, errorMessage: ''},
	        "research_organizations" : {required:true, completed:false, hasError:false, validations: [], Panel: 5, errorMessage: ''},
	        "related_identifiers" : {required:false, completed:false, hasError:false, validations: [], Panel: 6, errorMessage: ''},
	        "recipient_name": {required:true, completed:false, hasError:false, validations: [], Panel: 7, errorMessage: ''},
	        "recipient_email": {required:true, completed:false, hasError:false, validations: ["Email"], Panel: 7, errorMessage: ''},
	        "recipient_phone": {required:true, completed:false, hasError:false, validations: ["Phone"], Panel: 7, errorMessage: ''},
	        "recipient_org": {required:true, completed:false, hasError:false, validations: [], Panel: 7, errorMessage: ''},   
   }
   

    

    updateMetadata(data) {
    	const oldRepo = new String(this.metadata.repository_link);
    	data.repository_link = oldRepo;
    	this.metadata = data;

    }
   
   validateOnBlur(field, value) {
	   console.log("howdy");
	   const validationObj = this.validateMetadata[field];
	   validation.validate(value,validationObj); 	   
   }
    
    updateField(field,data) {
    	this.metadata[field] = data;
    }
    
    
    getValue(field) {
    	return this.metadata[field];
    }
    
    getValidationStatus(field) {
    	let retVal = "";
    	const validationObj = this.validateMetadata[field];
    	
    	if (validationObj)
    		retVal = validationObj.errorMessage;
    	return retVal;
    }

    addToArray(arrName, data) {
        data.place = this.metadata[arrName].length + 1;
        this.metadata[arrName].push(data);
    }

    removeFromArray(arrName,data) {
        const deletedPlace = data.place;
        const index = this.metadata[arrName].findIndex(item => item.place === data.place);
        this.metadata[arrName].splice(index, 1);

        for (var i = 0; i < this.metadata[arrName].length; i++) {

            if (this.metadata[arrName][i].place > deletedPlace)
                this.metadata[arrName][i].place--;
            }
        }

    modifyArrayElement(arrName,data, previousPlace) {
        var index;
        if (data.place != previousPlace) {
            index = this.updateElementPlaceAndReturnIndex(arrName, data, previousPlace);
        } else {
            index = this.metadata[arrName].findIndex(item => item.place === data.place);
        }

        if (index > -1)
            this.metadata[arrName][index] = data;
        }

    updateElementPlaceAndReturnIndex(arrName, data, previousPlace) {
        var index = -1;
        const newPlace = data.place;
        const check = newPlace > previousPlace;

        for (var i = 0; i < this.metadata[arrName].length; i++) {
            if (check && this.metadata[arrName][i].place <= newPlace && this.metadata[arrName][i].place > previousPlace) {
                this.metadata[arrName][i].place--;
            } else if (!check && this.metadata[arrName][i].place >= newPlace && this.metadata[arrName][i].place < previousPlace) {
                this.metadata[arrName][i].place++;
            } else if (this.metadata[arrName][i].place == previousPlace) {
                this.metadata[arrName][i].place = newPlace;
                index = i;
            }
        }

        return index;

    }

}
