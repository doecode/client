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

    //Digital Object Identifier
    let doi = "";
    let doiUrl = "";
    if (data.doi !== undefined) {
      doi = data.doi;
      doiUrl = "https://doi.org/" + doi;
    }

    //Developers and Contributors
    let devContribList = [];
    const devs = data.developers;
    const contributors = data.contributors;
    devs.forEach(function(item) {
      var first_name = item.first_name.replace('(undefined),', '').replace(' (undefined)', '').replace(' null', '').replace('null ', '');
      var last_name = item.last_name.replace('(undefined),', '').replace(' (undefined)', '').replace(' null', '').replace('null ', '')
      devContribList.push({
        name: (last_name + ", " + first_name)
      });
    });
    contributors.forEach(function(item) {
      var first_name = item.first_name.replace('(undefined),', '').replace(' (undefined)', '').replace(' null', '').replace('null ', '');
      var last_name = item.last_name.replace('(undefined),', '').replace(' (undefined)', '').replace(' null', '').replace('null ', '')
      devContribList.push({
        name: (last_name + ", " + first_name)
      });
    });

    const softwareTitle = data.software_title;

    const biblioUrl = "/doecode/biblio/" + data.code_id;

    var releaseDateDisplay = (data.release_date)
      ? <span className='search-result-release-date text-muted'>
          <time>Release Date:&nbsp;{data.release_date}</time>
        </span>
      : <span></span>;

    //If we have a search result number higher than 9999,  then we start having a number that is too close to the title, so we'll increase the number column size if we exceed 9999
    var result_column_classes = (this.props.listNumber > 9999)
      ? 'col-sm-2 col-xs-12 search-result-count-column'
      : 'col-sm-1 col-xs-2 search-result-count-column';
    var result_subrow_classes = (this.props.listNumber > 9999)
      ? "col-sm-10 col-xs-12 search-result-sub-row"
      : "col-sm-11 col-xs-10 search-result-sub-row";

    var landing_page_display = '';
    if (data.landing_page) {
      landing_page_display=(data.landing_page.indexOf('http:') > -1 || data.landing_page.indexOf('https:') > -1)
        ? data.landing_page
        : 'http://' + data.landing_page;
    }
    return (
      <div>
        <div className={result_column_classes}>
          {this.props.listNumber}.
        </div>
        <div className={result_subrow_classes}>
          <div className="row">
            <div className="col-xs-12">
              <div>
                <a title={'Bibliographic Data for Code ID ' + data.code_id} href={biblioUrl} className="search-result-title">
                  {softwareTitle}
                </a>
              </div>

              <div className='row'>
                <div className="search-result-author col-md-8 col-xs-12">
                  <DevAndContribLinks items={devContribList} searchPage releaseDate={releaseDateDisplay}/>
                </div>

              </div>
              {data.description !== undefined && <SearchRowDescription text={data.description} moreLess={100}/>}

              <div className='right-text'>
                <br/> {/*DOI*/}
                {doi && <span>DOI:&nbsp;
                  <a title={'DOI for Code ID ' + data.code_id} target="_blank" href={doiUrl}>{doi}</a>
                </span>}
                {/*Divider*/}
                {((data.repository_link || data.landing_page) && doi) && <span>
                  <span className='search-item-doi-divider hide-xs'>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;</span>
                  <span className='hide-sm hide-md hide-lg'><br/></span>
                </span>}
                {/*Repository Link*/}
                {data.repository_link && <span>
                  <a title={'Repository Link for Code ID ' + data.code_id} target='_blank' href={data.repository_link}>Repository Link</a>
                </span>}
                {/*Landing Page*/}
                {data.landing_page && <span>
                  <a title={'Landing Page for Code ID ' + data.code_id} target='_blank' href={landing_page_display}>Landing Page</a>
                </span>}
              </div>
              <br/>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
