import React from 'react';
import DelimitedDisplayList from '../fragments/DelimitedDisplayList';
import moment from 'moment';
import {combineAuthorLists, joinWithDelimiters} from '../utils/utils';

export default class Bibtex extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    /*Software Title*/
    let softwareTitle = this.props.data.software_title ? "{" + this.props.data.software_title + "}" : "";


    /*Authors*/
    let modified_author_list = combineAuthorLists(this.props.data.contributors, this.props.data.developers);
    let authorsText = joinWithDelimiters(modified_author_list, " and ");

    if (authorsText)
      authorsText = "{" + authorsText + "}";


    /*Description*/
    let description = (this.props.data.description ? "{" + this.props.data.description + "}" : "");


    /*URL*/
    let url = (this.props.data.repository_link ? "{" + this.props.data.repository_link + "}" : "");


    /*DOI*/
    let doi = (this.props.data.doi ? "{" + this.props.data.doi + "}" : "");


    /*Release Date*/
    let releaseDateYear = (this.props.data.release_date
      ? moment(this.props.data.release_date, "YYYY-MM-DD").format('YYYY')
      : '');

    let releaseDateMonth = (this.props.data.release_date
      ? moment(this.props.data.release_date, "YYYY-MM-DD").format('MM')
      : '');


    return (
      <div>
        @misc&#123;doecode_{this.props.data.code_id},<br/>
        {softwareTitle && <span>title&nbsp;=&nbsp;{softwareTitle}<br/></span>}
        {authorsText && <span>author&nbsp;=&nbsp;{authorsText}<br/></span>}
        {description && <span>abstractNote&nbsp;=&nbsp;{description}<br/></span>}
        {url && <span>url&nbsp;=&nbsp;{url}<br/></span>}
        {doi && <span>doi&nbsp;=&nbsp;{doi}<br/></span>}
        {releaseDateYear && <span>year&nbsp;=&nbsp;{releaseDateYear}<br/></span>}
        {releaseDateMonth && <span>month&nbsp;=&nbsp;{releaseDateMonth}<br/></span>}
        &#125;
      </div>
    );
  }

}
