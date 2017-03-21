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
        this.onModalChange = this.onModalChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    close() {
        this.props.tableStore.showModal = false;
        this.props.tableStore.clear();
    }

    open() {
        this.props.tableStore.isEdit = false;
        this.props.tableStore.showModal = true;
        this.props.tableStore.clear();

    }

    onModalChange(field, value) {
        this.props.tableStore.setCurrentField(field,value);
    }

    handleSave(event) {

        var data = this.props.tableStore.makeCurrentCopy();
        const arrName = this.props.tableStore.current.arrName;

        if (this.props.tableStore.isEdit) {
        	this.props.metadataStore.modifyArrayElement(arrName,data, this.props.tableStore.previousPlace);
    	} else {
            this.props.metadataStore.addToArray(arrName,data);
    	}
        this.close();
    }

    handleDelete(event) {
        const arrName = this.props.tableStore.current.arrName;
		this.props.metadataStore.removeFromArray(arrName,this.props.tableStore.makeCurrentCopy());
        this.close();
    }

    render() {
        const showModal = this.props.tableStore.showModal;
        const isEdit = this.props.tableStore.isEdit;
    	let content = null;
    	if (this.props.contentType === 'Devs') {
    		content = <DevsModalContent tableStore={this.props.tableStore} isEdit={isEdit}/>
    	} else if (this.props.contentType === 'RIs') {
        content = <RIsModalContent tableStore={this.props.tableStore} isEdit={isEdit}/>
    	} else if(this.props.contentType === 'Orgs') {
    		content = <OrgsModalContent tableStore={this.props.tableStore} isEdit={isEdit}/>
    	}


        return (
            <div className="form-group form-group-sm">
                <div className="col-xs-offset-5">
                    <Button bsStyle="primary" bsSize="large" onClick={this.open}>
                        Add {this.props.tableStore.current.label}
                    </Button>

                    <Modal show={showModal} onHide={this.close} bsSize="large">
                        <Modal.Header closeButton>
                            <Modal.Title>Manage {this.props.tableStore.current.label}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {content}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button onClick={this.close}>Close</Button>
                            {isEdit && <Button bsStyle="danger" onClick={this.handleDelete}>Delete</Button>
}
                            <Button bsStyle="primary" onClick={this.handleSave}>Save and close</Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        );
    }
}
