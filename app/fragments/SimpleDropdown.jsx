import React from 'react';
import ReactDOM from 'react-dom';
import {Dropdown, MenuItem} from 'react-bootstrap';

export default class SimpleDropdown extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var btn_class = (this.props.btnClass)
      ? (this.props.btnClass)
      : ('btn btn-link dropdown-toggle');

    if (this.props.noBtnPadding) {
      btn_class += " no-col-padding-left no-col-padding-right no-btn-padding-bottom no-btn-padding-top";
    }
    return (
      <div className="dropdown">
        <button className={btn_class} type="button" data-toggle="dropdown">{this.props.label}
        </button>
        {this.props.noToggleArrow === undefined && <span className='fa fa-angle-down'></span>}
        <ul className="dropdown-menu">
          {this.props.items.map((row, index) => <li key={'dropdown-' + index}>
            <a href={row.link}>{row.display}</a>
          </li>)}
        </ul>
      </div>
    );
  }

}
