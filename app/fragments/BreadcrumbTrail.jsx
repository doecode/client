import React from 'react';

export default class BreadcrumbTrail extends React.Component {
  constructor(props) {
    super(props);
    this.listLength = this.props.list.length;
  }

  render() {
    return (
      <div className='breadcrumbTrail'>
        {this.props.list.map((item, index) => <span className='text-muted' key={item.key}>{item.value}</span>)}
      </div>
    );
  }
}
