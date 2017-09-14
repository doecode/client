import React from 'react';
import PageMessageBox from '../fragments/PageMessageBox';
import {Modal} from 'react-bootstrap';

export default class MessageBoxModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const prefix = this.props.keyPrefix ? this.props.keyPrefix : "modal";
    const title = this.props.title ? this.props.title : (this.props.isError ? "ERROR" : (this.props.showCloseButton ? "Notice" : "Loading..."));
    const classes = this.props.classValue ? this.props.classValue : (this.props.isError ? "center-text has-error" : "center-text");
    const items = this.props.items ? this.props.items : [];
    const closeBtn = (this.props.showCloseButton) && <div><br />
        <div>
          <button type="button" className="btn btn-lg pull-right" onClick={this.props.exitCallback}>Close</button>
        </div>
      </div>;

      return (
          <Modal show={this.props.showModal} onExit={this.props.exitCallback}>
              <Modal.Header>
                  <Modal.Title>{title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="row">
                  <div className="col-md-3 col-xs-12">
                    {this.props.showSpinner && <div className={this.props.isError ? "loaderError" : "loader"}></div>}
                  </div>
                  <div className="col-md-9 col-xs-12">
                    <PageMessageBox classValue={classes} showMessage={this.props.showModal} items={items} keyPrefix={prefix}/>
                    {closeBtn}
                  </div>
                </div>
              </Modal.Body>
          </Modal>
      );
  }
}
