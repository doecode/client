import React from 'react';
import DelimitedDisplayList from '../fragments/DelimitedDisplayList';
import moment from 'moment';
import {combineAuthorLists, joinWithDelimiters} from '../utils/utils';

export default class APA extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let needSpacing = false;

    /*Authors*/
    let modified_author_list = combineAuthorLists(this.props.data.contributors, this.props.data.developers);
    let authorsText = joinWithDelimiters(modified_author_list, ", ", ", & ");

    if (authorsText)
      authorsText = (needSpacing ? " " : "") + authorsText + (authorsText.endsWith(".") ? "" : ".");

    needSpacing = needSpacing || authorsText;


    /*Release Date*/
    let releaseDate = (this.props.data.release_date
      ? (needSpacing ? " " : "") + "(" + moment(this.props.data.release_date, "YYYY-MM-DD").format('YYYY, MMMM D') + ")."
      : '');

    needSpacing = needSpacing || releaseDate;


    /*Software Title*/
    let softwareTitle = this.props.data.software_title && <span className='italic-text'>{(needSpacing ? " " : "") + this.props.data.software_title}.</span>;

    needSpacing = needSpacing || softwareTitle;


    /*Computer Software*/
    let computerSoftware = (needSpacing ? " " : "") + "[Computer software].";

    needSpacing = needSpacing || computerSoftware;


    /*URL*/
    let url = (this.props.data.repository_link ? (needSpacing ? " " : "") + this.props.data.repository_link + "." : "");

    needSpacing = needSpacing || url;


    /*DOI*/
    let doi = (needSpacing ? " " : "") + (this.props.data.doi ? "doi:" + this.props.data.doi + "." : "");

    needSpacing = needSpacing || doi;


    return (
      <div>
        {authorsText}
        {releaseDate}
        {softwareTitle}
        {computerSoftware}
        {url}
        {doi}
      </div>
    );
  }

}
