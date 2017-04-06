import {observable} from 'mobx';
import Validation from '../utils/Validation';

const validation = new Validation();
export default class Metadata {
	
	constructor(data,validation) {
		this.data = data;
		this.validation = validation;
	}
   
   getValue(field) {
    	return this.data[field];
   }
    
    
   updateField(field,data) {
    	this.data[field] = data;
    }
   
   getValidationStatus(field) {
   	let retVal = "";
   	const validationObj = this.validateMetadata[field];
   	
   	if (validationObj)
   		return
   	
   	return false;
   }
    
   validateOnBlur(field, value) {
	   const validationObj = this.validation[field];
	   validation.validate(value,validationObj); 	   
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