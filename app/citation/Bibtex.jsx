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

    var sponsoring_orgs_list = [];
    this.props.data.sponsoring_organizations.forEach(function(item) {
      sponsoring_orgs_list.push(item.organization_name);
    });
    return (
      <div>
        <br/>
        @misc&#123;osti_{this.props.data.code_id},<br/>
        title&nbsp;=&nbsp;&#123;{this.props.data.software_title}&#125;<br/>
        author&nbsp;=&nbsp;&#123;<DelimitedDisplayList last_delimiter=' and ' items={modified_author_list} keyprefix='authors-' delimiter={delimiter}/>&#125;<br/>
        abstractNote&nbsp;=&nbsp;&#123;{this.props.data.description}&#125;<br/> {this.props.data.repository_link && <span>
          url&nbsp;=&nbsp;&#123;{this.props.data.repository_link}&#125;<br/>
        </span>}
        {this.props.data.doi && <span>doi&nbsp;=&nbsp;&#123;{this.props.data.doi}&#125;<br/></span>}
        year&nbsp;=&nbsp;{moment(this.props.data.release_date, "YYYY-MM-DD").format('YYYY')}<br/>
        month&nbsp;=&nbsp;{moment(this.props.data.release_date, "YYYY-MM-DD").format('MM')}<br/>
        note = &#125;
      </div>
    );
  }

}
