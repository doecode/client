import React from 'react';

export default class ResearchOrgItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var research_orgs_list = [];
    this.props.items.forEach(function(item) {
      if ('organization_name' in item) {
        research_orgs_list.push(item.organization_name);
      }
    });
    return (
      <div>
        {research_orgs_list.map((item,index)=>
          <div key={index}>{item}</div>
        )}
      </div>
    );
  }
}
