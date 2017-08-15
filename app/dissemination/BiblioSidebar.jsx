import React from 'react';
import ReactDOM from 'react-dom';

export default class BiblioSidebar extends React.Component {
    constructor(props) {
        super(props);
      }

      render() {
        return (
        <div className={this.props.sidebarClass}>
            <div className="row center-text">
                <div className="col-md-9 col-xs-12">
                    <h3 className='biblio-sidebar-title'>Save / Share Record </h3>
                    <br/>
                    {/*Citation Formats*/}
                    <div className="panel-group">
                        <div className="panel panel-default biblio-sidebar-collapse-panel">
                            <div className="panel-heading biblio-sidebar-collapse-heading">
                                <h4 className="panel-title">
                                    <a data-toggle="collapse" href="#citation-formats-collapse">Citation Formats <span className='fa fa-download'></span></a>
                                </h4>
                            </div>
                            <div id="citation-formats-collapse" className="panel-collapse collapse">
                                <div className="panel-body biblio-sidebar-collapse-item">MLA</div>
                                <div className="panel-body biblio-sidebar-collapse-item">APA</div>
                                <div className="panel-body biblio-sidebar-collapse-item">Chicago</div>
                                <div className="panel-body biblio-sidebar-collapse-item">Bibtex</div>
                            </div>
                        </div>
                    </div> 
                </div>
                <div className="col-md-3"></div>
            </div>
        </div>
        );
      }

    }

