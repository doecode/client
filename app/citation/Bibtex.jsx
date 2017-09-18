import React from 'react';
import DelimitedDisplayList from '../fragments/DelimitedDisplayList';
import moment from 'moment';
import {combineAuthorLists} from '../utils/utils';

export default class Bibtex extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    /*Authors*/
    var modified_author_list = combineAuthorLists(this.props.data.contributors, this.props.data.developers);

    const delimiter = <span>,&nbsp;</span>;
    /*Release Date*/
    var release_date = (this.props.data.release_date)
      ? moment(this.props.data.release_date, "YYYY-MM-DD").format('YYYY, MM DD')
      : '';

    var sponsoring_orgs_list = [];
    this.props.data.sponsoring_organizations.forEach(function(item) {
      sponsoring_orgs_list.push(item.organization_name);
    });
    return (
      <div>
        
      </div>
    );
  }

}
