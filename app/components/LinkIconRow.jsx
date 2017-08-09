import React from 'react';

let icon_row = [];
export default class LinkIconRow extends React.Component{
    constructor(props) {
        super(props);
        icon_row = this.props.icon_row_data;
    }
    
    render(){
        const IconList = icon_row.map((row)=>
           {return row;}
        );
        
        return(
        <div className="row icon-row center-text">
            {IconList}
        </div>
        );
    }
}