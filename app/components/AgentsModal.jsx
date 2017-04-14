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
    }

    close() {
        this.props.tableStore.showModal = false;
        this.props.tableStore.currentId = "";
        this.props.tableStore.data = {};
    }

    open() {
        this.props.tableStore.showModal = true;
    }

    handleSave(event) {

    	this.props.data.saveToParentArray()
        this.close();
    }

    handleDelete(event) {
    	this.props.data.removeFromParentArray()
        this.close();
    }

    render() {
        const showModal = this.props.tableStore.showModal;
        const currentParent = this.props.currentParent;









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
