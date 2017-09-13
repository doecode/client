import React from 'react';
import ReactDOM from 'react-dom';
import moment from 'moment';
import DevAndContribLinks from './DevAndContribLinks'
import SearchRowDescription from '../fragments/SearchRowDescription'

export default class SearchItem extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const data = this.props.data;
    let releaseDate = undefined;
    let doi = undefined;
    let doiUrl = "";
    if (data.doi !== undefined) {
      doi = data.doi;
      doiUrl = "https://doi.org/" + doi;
    }

    if (data.releaseDate !== undefined)
      releaseDate = data.releaseDate.substring(0, data.releaseDate.indexOf("T"));

    const devsAndContributors = data._names;
    let devContribList = [];

    if (devsAndContributors === undefined) {
      return (null);
    } else {
      devsAndContributors.forEach(function(item) {
        devContribList.push({
          name: (item.replace('(undefined),', '').replace(' (undefined)', '').replace(' null', '').replace('null ', ''))
        });
      });
    }

    const softwareTitle = data.softwareTitle;
    if (softwareTitle === undefined) {
      return (null);
    }
    const biblioUrl = "/doecode/biblio/" + data.codeId;

    var releaseDateDisplay = (releaseDate !== undefined)
      ? <span className='search-result-release-date text-muted'>&nbsp;&nbsp;
          <time>Release Date {releaseDate}</time>
        </span>
      : <span></span>;

    //If we have a search result number higher than 9999,  then we start having a number that is too close to the title, so we'll increase the number column size if we exceed 9999
    var result_column_classes = (this.props.listNumber > 9999)
      ? 'col-sm-2 col-xs-12 search-result-count-column'
      : 'col-sm-1 col-xs-2 search-result-count-column';
    var result_subrow_classes = (this.props.listNumber > 9999)
      ? "col-sm-10 col-xs-12 search-result-sub-row"
      : "col-sm-11 col-xs-10 search-result-sub-row";
    return (
      <div>
        <div className={result_column_classes}>
          {this.props.listNumber}.
        </div>
        <div className={result_subrow_classes}>
          <div className="row">
            <div className="col-xs-12">
              <div>
                <a href={biblioUrl} className="search-result-title">
                  {softwareTitle}
                </a>
              </div>

              <div className='row'>
                <div className="search-result-author col-md-8 col-xs-12">
                  <DevAndContribLinks items={devContribList} searchPage releaseDate={releaseDateDisplay}/>
                </div>

              </div>
              {doi !== undefined && <div className="search-result-doi">
                <span className="fa fa-link"></span>
                DOI:
                <a target="_blank" href={doiUrl}>{doi}</a>
              </div>}

              {data.description !== undefined && <SearchRowDescription text={data.description} moreLess={100}/>}

              {data.repositoryLink && <div className='right-text'>
                <br/>
                <a target='_blank' href={data.repositoryLink}>Repository Link</a>
              </div>}
              <br/>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
