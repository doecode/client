import React from 'react';

export default class NavgationBarItem extends React.Component {
  constructor(props) {
    super(props);
    this.is_active = false;
    this.li_class = "";
    this.anchor_class = "";
    this.fa_icon = "";

    this.is_active = (this.props.destination === this.props.current_page);
    this.li_class = (this.is_active)
      ? " active-menu-item "
      : "";

    {/*If it's furthest to the left, we need to add a left side bar*/
    }
    if (this.props.special !== undefined) {
      this.li_class += " nav-menu-item-special ";
    }

    this.anchor_class = (this.is_active)
      ? " nav-menu-item active-menu-item-text "
      : "nav-menu-item nav-menu-item-text";
    this.fa_icon = this.props.fa_icon;
    if (this.is_active) {
      this.fa_icon += " active-menu-item-text ";
    }
  }

  render() {
    return (
      <li className={this.li_class}>
        <a className={this.anchor_class} href={this.props.destination}>
          <span className={this.fa_icon}></span>&nbsp;
          {this.props.display_name}</a>
      </li>
    );
  }
}
