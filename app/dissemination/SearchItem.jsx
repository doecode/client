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
            releaseDate =data.releaseDate.substring(0,data.releaseDate.indexOf("T"));


        const devsAndContributors = data._names;
        if (devsAndContributors === undefined){
            return (null);
        }
        const softwareTitle = data.softwareTitle;
        if (softwareTitle === undefined){
            return (null);
        }
        const biblioUrl = "/doecode/biblio?code_id=" + data.codeId;
        

        return (

        <div className="col-xs-12 panel-body">
            <div className="row">
                <div className="col-xs-12">
                    <div>
                        <a href={biblioUrl} className="search-result-title">
                            {softwareTitle}
                        </a>
                    </div>

                    <div className="search-result-author">
                        <DevAndContribLinks devsAndContributors={devsAndContributors}/>
                    </div>


                    {releaseDate !== undefined &&
                    <div className="search-result-release-date">
                        Publication Date: {releaseDate}
                    </div>
                    }

                    {doi !== undefined &&
                    <div className="search-result-doi">
                        <span className="glyphicon glyphicon-link"></span> DOI: <a href={doiUrl}>{doi}</a>
                    </div>
                    }
                    
                    {data.description !== undefined &&
                        <SearchRowDescription text={data.description}/>
                    }
                </div>
            </div>
        </div>

        );
      }

    }
