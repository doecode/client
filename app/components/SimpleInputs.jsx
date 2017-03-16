import React from 'react';

export default class SimpleInputs extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);


  }

  handleChange(event) {
    this.props.onChange(this.props.field,event.target.value);
  }



  render() {
	  let input = null;
	  const elementType = this.props.elementType;

	  if (this.props.displayOnly) {
		  input = this.props.value;
	  }
	  else if (elementType === 'input') {
		input = <input type="text" className="form-control" value={this.props.value} onChange={this.handleChange} />
	  } else if (elementType === 'select') {
		 const options = this.props.options;
	     input = <select className="form-control" value={this.props.value} onChange={this.handleChange}>
	     {Object.keys(options).map(function(key) {
	    	 return <option key={key} value={options[key]}>{key}</option>
	     })
	     }
	     </select>
	  } else if (elementType === 'textarea') {
		 input = <textarea type="text" className="form-control" value={this.props.value} onChange={this.handleChange} />
	  }
	  return(
      <div>
        {input}
      </div>

    );
  }

}
