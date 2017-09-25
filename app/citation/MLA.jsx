import React from 'react';
import DelimitedDisplayList from '../fragments/DelimitedDisplayList';
import moment from 'moment';
import {combineAuthorLists, joinWithDelimiters} from '../utils/utils';

export default class MLA extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    let needSpacing = false;

    /*Authors*/
    let modified_author_list = combineAuthorLists(this.props.data.contributors, this.props.data.developers);
    let authorsText = joinWithDelimiters(modified_author_list, ", ", ", and ");

    if (authorsText)
      authorsText = (needSpacing ? " " : "") + authorsText + (authorsText.endsWith(".") ? "" : ".");

    needSpacing = needSpacing || authorsText;


    /*Software Title*/
    let softwareTitle = this.props.data.software_title && <span className='italic-text'>{(needSpacing ? " " : "") + this.props.data.software_title}.</span>;

    needSpacing = needSpacing || softwareTitle;


    /*Computer Software*/
    let computerSoftware = (needSpacing ? " " : "") + "Computer software.";

    needSpacing = needSpacing || computerSoftware;


    /*URL*/
    let url = this.props.data.repository_link && <span className='italic-text'>{(needSpacing ? " " : "") + this.props.data.repository_link}.</span>;

    needSpacing = needSpacing || url;


    /*Sponsor Orgs*/
    let sponsoring_orgs_list = [];
    this.props.data.sponsoring_organizations.forEach(function(item) {
      sponsoring_orgs_list.push(item.organization_name);
    });

    let sponsorOrgsText = joinWithDelimiters(sponsoring_orgs_list, ", ");

    if (sponsorOrgsText)
      sponsorOrgsText = (needSpacing ? " " : "") + sponsorOrgsText + (sponsorOrgsText.endsWith(".") ? "" : ".");

    needSpacing = needSpacing || sponsorOrgsText;


    /*Release Date*/
    let releaseDate = (this.props.data.release_date
      ? (needSpacing ? " " : "") + moment(this.props.data.release_date, "YYYY-MM-DD").format('DD MMM. YYYY.')
      : '');

    needSpacing = needSpacing || releaseDate;


    /*Web*/
    let web = (needSpacing ? " " : "") + "Web.";

    needSpacing = needSpacing || web;


    /*DOI*/
    let doi = (needSpacing ? " " : "") + (this.props.data.doi ? "doi:" + this.props.data.doi + "." : "");

    needSpacing = needSpacing || doi;


    return (
      <div>
        {authorsText}
        {softwareTitle}
        {computerSoftware}
        {url}
        {sponsorOrgsText}
        {releaseDate}
        {web}
        {doi}
      </div>
    );
  }

}
