import {observable} from 'mobx';
import uniqid from 'uniqid';
import Validation from '../utils/Validation';

const validation = new Validation();
export default class Metadata {
	
	constructor(schema) {
		this.schema = schema;
		this.id = uniqid();
		
	}
   
   getValue(field) {
    	return this.schema[field].value;
   }
    
    
   setValue(field,data) {
    	this.schema[field].value = data;
    }
   
   getFieldInfo(field) {
   	return this.schema[field];
   }
   

    
   validateOnBlur(field) {
	   validation.validate(this.getValue(field),this.schema[field]); 	   
   }
    

    
    



    addToArray(arrName, data) {
        data.place = this.metadata[arrName].length + 1;
        this.metadata[arrName].push(data);
    }

    removeFromArray(arrName,data) {
        const deletedPlace = data.place;
        const index = this.metadata[arrName].findIndex(item => item.id === data.id);
        this.metadata[arrName].splice(index, 1);

        if (data.place) {
            const deletedPlace = data.place;
            for (var i = 0; i < this.metadata[arrName].length; i++) {

            	if (this.metadata[arrName][i].place > deletedPlace)
            		this.metadata[arrName][i].place--;
            
            }
        
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