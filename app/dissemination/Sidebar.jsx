import React from 'react';
import ReactDOM from 'react-dom';
import SearchCheckbox from './SearchCheckbox';
import SearchData from '../stores/SearchData';
import {doAjax, getQueryParam} from '../utils/utils';

const searchData = new SearchData();


export default class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.accessibilityCallback = this.accessibilityCallback.bind(this);
      }
     
      
     accessibilityCallback(checked, value) {
           searchData.loadValues(JSON.parse(window.sessionStorage.latestSearch));
           let accessibility = searchData.getValue("accessibility");
           
           if (checked) {
           console.log(value);
           accessibility.push(value)
           } else {
           let index = accessibility.indexOf(value);
           
           if (index > -1) {
           accessibility.splice(index, 1);
           }
                
           
           }
           
           searchData.setValue("accessibility", accessibility);
           searchData.setValue("start",0);
           
           window.sessionStorage.latestSearch = JSON.stringify(searchData.getData());
           console.log(searchData.getData());
           doAjax('POST', '/doecode/api/search/',this.props.parseSearchResponse, searchData.getData(), this.props.parseErrorResponse);
     
     }
      


      render() {

       

        return (

            <div className="">
            <SearchCheckbox name="CS" value="CS" toggleCallback={this.accessibilityCallback}/>

            </div>

        );
      }

    }

