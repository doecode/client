import React from 'react';
import DelimitedDisplayList from '../fragments/DelimitedDisplayList';
import moment from 'moment';
import {combineAuthorLists} from '../utils/utils';

export default class APA extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    /*Authors*/
    var modified_author_list = combineAuthorLists(this.props.data.contributors, this.props.data.developers);

    const delimiter = <span>,&nbsp;</span>;
    /*Release Date*/
    var release_date = (this.props.data.release_date)
      ? moment(this.props.data.release_date, "YYYY-MM-DD").format('YYYY, MMMM D')
      : '';

    var sponsoring_orgs_list = [];
    this.props.data.sponsoring_organizations.forEach(function(item) {
      sponsoring_orgs_list.push(item.organization_name);
    });
    return (
      <div>
        <DelimitedDisplayList items={modified_author_list} last_delimiter='&nbsp;&amp;&nbsp;' keyprefix='authors-' delimiter={delimiter}/>&nbsp;
        <span>({release_date})&nbsp;</span>
        <span className='italic-text'>{this.props.data.software_title}.</span>&nbsp;[Computer software].&nbsp;
        <span>{this.props.data.repository_link && <span>{this.props.data.repository_link}.&nbsp;</span>}</span>
        &nbsp;{this.props.data.doi && <span>doi:{this.props.data.doi}</span>}
      </div>
    );
  }

}
