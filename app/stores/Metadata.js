import {observable} from 'mobx';
export default class Metadata {
    @observable metadata = {
        "code_id": 0,
        "site_ownership_code": '',
        "open_source": '',
        "repository_link": '',
        "originating_research_organizations": '',
        "software_title": '',
        "acronym": '',
        "doi": '',
        "description": '',
        "country_of_origin": '',
        "developers": [],
        "contributors": [],
        "sponsoring_organizations" : [],
        "contributing_organizations" : [],
        "research_organizations" : [],
        "related_identifiers" : [],
        "date_of_issuance" : '',
        "keywords": '',
        "disclaimers": '',
        "licenses": [],
        "recipient_name": '',
        "recipient_email": '',
        "recipient_phone": '',
        "recipient_org": '',
        "site_accession_number": '',
        "other_special_requirements": '',
        "related_software": '',
        "access_limitations": []

    }
    

    @observable finished = false;

    updateMetadata(data) {
    	const oldRepo = new String(this.metadata.repository_link);
    	data.repository_link = oldRepo;
    	this.metadata = data;

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
