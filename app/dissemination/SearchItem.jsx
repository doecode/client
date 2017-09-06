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
    return (
      <div>
        <div className='col-xs-1 search-result-count-column'>
          {this.props.listNumber}.
        </div>
        <div className="col-xs-11 search-result-sub-row">
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
                <a href={doiUrl}>{doi}</a>
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
