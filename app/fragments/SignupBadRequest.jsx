import React from 'react';
import ReactDOM from 'react-dom';

export default class SignupBadRequest extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div>
        {this.props.errors.map((row) => <div className="has-error" key={row.key}>
          {!row.customError && <label className="control-label">{row.error}
          </label>}
          {row.customError && <span>
            {row.error}
          </span>}
        </div>)}
      </div>
    );
  }
}
