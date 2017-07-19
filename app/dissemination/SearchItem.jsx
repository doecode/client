import React from 'react';
import ReactDOM from 'react-dom';
import DevAndContribLinks from './DevAndContribLinks'

export default class SearchItem extends React.Component {
    constructor(props) {
        super(props);
      }


      render() {

        const data = this.props.data;
        const devsAndContributors = data._names;
        if (devsAndContributors === undefined)
            return (null);

        const softwareTitle = data.softwareTitle;
        if (softwareTitle === undefined)
            return (null);

        const biblioUrl = "/biblio?code_id=" + data.codeId;

        return (

            <div className="col-xs-12">
              <div className="row">
                <div className="col-sm-8">
                  <div>
                  <a href={biblioUrl} className="search-result-title">
                    {softwareTitle}
                  </a>
                </div>

                <div className="search-result-author">
                  <DevAndContribLinks devsAndContributors={devsAndContributors}/>
                </div>
                </div>
              </div>

            </div>

        );
      }

    }
