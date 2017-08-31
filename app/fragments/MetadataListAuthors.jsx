import React from 'react';

export default class MetadataListAuthors extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    /*For each item given, show first, middle, and last name, and if there are any affiliations, show them, and wrap them in parentheses, and separate them by a space and comma*/
    return (
      <div>
        {this.props.items.map((row, index) => <div key={'developers-' + index}>
          {row.first_name && <span>{row.first_name}</span>}
          &nbsp; {row.middle_name && <span>{row.middle_name}</span>}
          &nbsp; {row.last_name && <span>{row.last_name}</span>}
          &nbsp; {row.affiliations.length > 0 && <span>
            &nbsp;&nbsp;( {row.affiliations.map((row2, index2) => <span key={index2}>
              {row2}
              {index2 < row.affiliations.length - 1 && <span>
                ,&nbsp;
              </span>}
            </span>)}
            )
          </span>}
        </div>)}
      </div>
    );
  }
}
