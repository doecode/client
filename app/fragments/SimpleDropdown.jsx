import React from 'react';
import ReactDOM from 'react-dom';
import {Dropdown, MenuItem} from 'react-bootstrap';

export default class SimpleDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.makeRow = this.makeRow.bind(this);
  }

  makeRow(row, index) {
    let linkToUse = (row.customAnchor != undefined)
      ? (row.display)
      : (
        <a title={row.display} href={row.link}>{row.display}</a>
      );

    return (
      <li key={'dropdown-' + index}>
        {linkToUse}
      </li>
    );
  }

  render() {
    var btn_class = (this.props.btnClass)
      ? (this.props.btnClass)
      : ('btn btn-link dropdown-toggle');

    if (this.props.noBtnPadding) {
      btn_class += " no-col-padding-left no-col-padding-right no-btn-padding-bottom no-btn-padding-top";
    }

    if (this.props.extraBtnClasses) {
      btn_class += (" " + this.props.extraBtnClasses);
    }

    const ul_class = (this.props.ulClasses)
      ? this.props.ulClasses
      : 'dropdown-menu';

      var buttonTitle = this.props.title ? this.props.title : this.props.label;

    const listItems = this.props.items.map(this.makeRow);
    return (
      <span className="dropdown">
        <button title={buttonTitle} className={btn_class} type="button" data-toggle="dropdown">{this.props.label}
        </button>{this.props.noToggleArrow === undefined && <span className='fa fa-angle-down dropdown-toggle-arrow clickable' data-toggle="dropdown"></span>}
        <ul className={ul_class}>
          {listItems}
        </ul>
      </span>
    );
  }

}
