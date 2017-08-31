import React from 'react';

export default class DelimitedDisplayList extends React.Component {
  constructor(props) {
    super(props);
  }

  /*
    Pretty much just takes a list, delimits it by your specified character, makes sure the last one doesn't have the delimiter afterwards
  */
  render() {
    return (
      <span>
        {this.props.items.map((row, index) => <span key={this.props.keyprefix + index}>
          {row}
          {(index < (this.props.items.length - 1)) && <span>
            {this.props.delimiter}
          </span>}
        </span>)}
      </span>
    );
  }
}
