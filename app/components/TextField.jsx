import React from 'react';
import SimpleInputs from './SimpleInputs';

export default class TextField extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
	  const labelStyle = this.props.labelStyle != undefined ? this.props.labelStyle : "col-sm-2 control-label";
	  const divStyle = this.props.divStyle != undefined ? this.props.divStyle : "col-sm-4 ";

	  return(
      <div>
      <label className={labelStyle}>
        {this.props.label}
      </label>
      <div className={divStyle}>
        <SimpleInputs field={this.props.field} checked={this.props.checked} elementType={this.props.elementType} displayOnly={this.props.displayOnly} value={this.props.value} onChange={this.props.onChange} options={this.props.options}/>
      </div>
      </div>
    );
  }

}
