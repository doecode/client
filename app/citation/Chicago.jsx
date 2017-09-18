import React from 'react';
import DelimitedDisplayList from '../fragments/DelimitedDisplayList';
import moment from 'moment';
import {combineAuthorLists} from '../utils/utils';

export default class Chicago extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    /*Authors*/
    var modified_author_list = combineAuthorLists(this.props.data.contributors, this.props.data.developers);

    const delimiter = <span>,&nbsp;</span>;
    /*Release Date*/
    var release_date = (this.props.data.release_date)
      ? moment(this.props.data.release_date, "YYYY-MM-DD").format('MMMM D, YYYY')
      : '';

    var sponsoring_orgs_list = [];
    this.props.data.sponsoring_organizations.forEach(function(item) {
      sponsoring_orgs_list.push(item.organization_name);
    });
    return (
      <div>
        <DelimitedDisplayList last_delimiter=' and ' items={modified_author_list} keyprefix='authors-' delimiter={delimiter}/>&nbsp;
        <span className='italic-text'>{this.props.data.software_title}.</span>&nbsp;Computer software.&nbsp;
        <span>&nbsp;{release_date}</span>).&nbsp;
        <span>{this.props.data.repository_link}.&nbsp;</span>&nbsp; {this.props.data.doi && <span>doi:{this.props.data.doi}</span>}
      </div>
    );
  }

}
