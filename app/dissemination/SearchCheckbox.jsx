import React from 'react';
import ReactDOM from 'react-dom';

export default class SearchCheckbox extends React.Component {
    constructor(props) {
        super(props);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
        this.state = {"checked" : false}
      }

      toggleCheckbox(event) {
      const newState = !this.state.checked;
      
      this.setState({"checked" : newState});
      
      this.props.toggleCallback(newState, this.props.value, this.props.type);
      }
      
      render() {

       

        return (
        <span>
              <input name={this.props.name} type="checkbox" checked={this.state.checked} onChange={this.toggleCheckbox} />
        </span>

        );
      }

    }

