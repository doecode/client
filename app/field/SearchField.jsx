import Field from './Field';
import React from 'react';
import SearchData from '../stores/SearchData';

const searchData = new SearchData();
export default class MetadataField extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Field linkedData={searchData} properties={this.props}/>
            </div>
        );
    }
}
