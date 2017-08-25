import React from 'react';
import ReactDOM from 'react-dom';

export default class PageMessageBox extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={this.props.classValue}>
        {this.props.showMessage && <div>
          {this.props.items.map((item, index) => <div key={this.props.keyPrefix + '-' + index}>
            <label className='control-label'>{item}</label>
          </div>)}
        </div>}
      </div>
    );
  }
}
