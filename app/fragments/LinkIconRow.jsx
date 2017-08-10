import React from 'react';

export default class LinkIconRow extends React.Component{
    constructor(props) {
        super(props);
    }

    render(){
        const IconList = this.props.icon_row_data.map((row)=>
           {return row;}
        );

        return(
        <div className="row icon-row center-text">
            {IconList}
        </div>
        );
    }
}
