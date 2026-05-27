import React, { useState } from 'react'
import { Button, Modal, ModalFooter, ModalHeader, ModalBody } from "reactstrap";

function ViewImage({ displayName }) {


    const [modalOpen, setModalOpen] = useState(false);


    const toggleModal = () => {
        setModalOpen(!modalOpen);
    };
    const imageUrl = displayName;
    const urlParts = imageUrl.split('.');
    const imageType = urlParts[urlParts.length - 1].toLowerCase();
    const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];


    return (
        <>
            <a color='primary' className='d-flex justify-content-center font-weight-bold' target='_blank' rel='noreferrer' onClick={toggleModal}>
                View File
            </a>
            <Modal className='start_screening_modal app_modal' tabIndex='-1' role='dialog' aria-hidden='true' isOpen={modalOpen} toggle={toggleModal} centered={true}>
                <ModalHeader toggle={toggleModal}>Document</ModalHeader>
                <ModalBody>
                    {imageExtensions.includes(imageType) ? <img src={displayName} style={{ height: "400px", width: "400px", margin: "10px", marginLeft: "10px" }}></img>
                        : <iframe src={displayName} style={{ height: "400px", width: "400px", margin: "10px", marginLeft: "10px" }}></iframe>}
                </ModalBody>
                <ModalFooter>
                    <Button type='button' color='light' className='btn-md waves-effect waves-light action_btn' onClick={toggleModal}>
                        Cancel
                    </Button>
                    <a href={displayName} target='_blank' rel='noreferrer' className='d-flex justify-content-center font-weight-bold'>
                        Download
                    </a>
                </ModalFooter>
            </Modal>
        </>)
}

export default ViewImage