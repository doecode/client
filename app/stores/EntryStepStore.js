import {observable} from 'mobx';

export default class EntryStepStore {
	@observable availabilitySelected = 'OS';
	@observable showFile = false;
}