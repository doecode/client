import React from 'react';

let is_active = false;
let li_class = "";
let anchor_class = "";
let fa_icon = "";
export default class NavgationBarItem extends React.Component{
    constructor(props) {
        super(props);
        
            is_active = (this.props.destination===this.props.current_page);
    li_class = (is_active)?" active-menu-item ":"";
    
    {/*If it's furthest to the left, we need to add a left side bar*/}
    if(this.props.special !== undefined){
        li_class+=" nav-menu-item-special ";
    }
    
    anchor_class = (is_active)? " nav-menu-item active-menu-item-text " : "nav-menu-item nav-menu-item-text";
    fa_icon = this.props.fa_icon;
    }
    
    render(){
        return(
        <li className={li_class}>
            <a className={anchor_class} href={this.props.destination}><span className={fa_icon}></span> {this.props.display_name}</a>
        </li>
        );
    }
}
