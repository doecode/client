import React from 'react';
import DelimitedDisplayList from './DelimitedDisplayList';

export default class MetadataListAuthors extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    /*For each item given, show first, middle, and last name, and if there are any affiliations, show them, and wrap them in parentheses, and separate them by a space and comma*/
    const delimiter = <span>,&nbsp;</span>;
    return (
      <div>
        {this.props.items.map((row, index) => <div key={this.props.prefix + index}>
          {row.first_name && <span>{row.first_name}</span>}
          &nbsp; {row.middle_name && <span>{row.middle_name}</span>}
          &nbsp; {row.last_name && <span>{row.last_name}</span>}
          &nbsp; {row.affiliations.length > 0 && <span>
            &nbsp;&nbsp;(
            <DelimitedDisplayList items={row.affiliations} keyprefix={this.props.prefix + 'affiliations-'} delimiter={delimiter}/>
            )
          </span>}
        </div>)}
      </div>
    );
  }
}
