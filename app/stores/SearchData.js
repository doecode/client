import BaseData from './BaseData';
import SearchStore from './SearchStore';

export default class SearchData extends BaseData {
    constructor() {
    	const props = {fieldMap: SearchStore.searchData, fieldMapSnapshot: SearchStore.defaultSearchData};
        super(props);

    }
}
