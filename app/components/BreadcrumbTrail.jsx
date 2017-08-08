import React from 'react';

export default class BreadcrumbTrail extends React.component{
    constructor(props){
        super(props);
    }
    
    render(){
        return(
        <div>
            <a href={this.props.homepage}>{this.props.homepage_title}</a> / <a href={this.props.searchpage}>{this.props.searchpage_title}</a> 
           
        </div>
        );
    }
}