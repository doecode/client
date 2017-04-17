import React from 'react';
import {Modal, Button} from 'react-bootstrap';
import InputHelper from './InputHelper';
import DevsModalContent from '../ModalComponents/DevsModalContent'
import RIsModalContent from '../ModalComponents/RIsModalContent'
import OrgsModalContent from '../ModalComponents/OrgsModalContent'
import {observer} from "mobx-react";

@observer
export default class AgentsModal extends React.Component {
    constructor(props) {
        super(props);
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.state = {errors: ''};
    }

    close() {
        this.props.tableStore.showModal = false;
        this.props.data.clear();
        this.setState({errors: ''});
    }

    open() {
        this.props.tableStore.showModal = true;
    }

    handleSave(event) {
    	
    	
        const errors = this.props.data.checkForSchemaErrors();
        
        if (errors.length === 0) {
        	this.props.metadata.saveToArray(this.props.dataType,this.props.data.getData());
            this.close();
        }
        else {
            this.setState({errors: "The following fields contain errors: " + errors.join(", ")});
        }

    }

    handleDelete(event) {
    	this.props.metadata.removeFromArray(this.props.dataType,this.props.data.getData());
        this.close();
    }

    render() {
        const showModal = this.props.tableStore.showModal;
        const currentParent = this.props.currentParent;


        let content = null;
        if (this.props.contentType === 'Devs') {
        content = <DevsModalContent type={this.props.dataType} data={this.props.data}/>
        }






        return (
            <div className="form-group form-group-sm">
                <div className="col-xs-offset-5">
                    <Button bsStyle="primary" bsSize="large" onClick={this.open}>
                        Add Whatever
                    </Button>

                    <Modal show={showModal} onHide={this.close} bsSize="large">
                        <Modal.Header closeButton>
                            <Modal.Title>Manage Whatever</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                         {this.state.errors &&
                         <div className="error-color">
                         <h2>{this.state.errors}</h2>
                         </div>
                         }
                            {content}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.close}>Close</Button>
                            {this.props.data.edit && <Button bsStyle="danger" onClick={this.handleDelete}>Delete</Button>
}
                            <Button bsStyle="primary" onClick={this.handleSave}>Save and close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}
