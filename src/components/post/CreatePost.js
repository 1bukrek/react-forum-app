import { use, useState } from "react";
import { Button, Modal, Form, Alert, Toast, ToastContainer } from "react-bootstrap";

export default function CreatePost() {
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');

    const [show, setShow] = useState(false);
    const [serverMessage, setServerMessage] = useState('');

    const [notification, setNotification] = useState(false)
    const [notificationMessage, setNotificationMessage] = useState("")

    async function handleClose() {
        let author = sessionStorage.getItem('username');

        const res = await fetch('http://localhost:3001/api/create-post', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ author, title, desc })
        });

        const { success, message } = await res.json();
        if (!success) return setServerMessage(message);
        else {
            // modal settings
            setTitle('')
            setDesc('')
            setShow(false);
            // server message setting
            setServerMessage("")
            // notification settings
            setNotification(true)
            setNotificationMessage("You created a post!")
        }
    }

    function handleCloseCancel() {
        // modal settings
        setTitle('')
        setDesc('')
        setShow(false)
        // server message setting
        setServerMessage("")
    }

    function handleShow() {
        if (!sessionStorage.getItem("username")) {
            setNotification(true)
            setNotificationMessage("You need to login your account.")
        }
        else setShow(true);
    }

    function toggleShow() { setNotification(!notification) }

    return (
        <>
            <ToastContainer className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1 }}>
                <Toast show={notification} onClose={toggleShow} role='alert' className='align-items-center bg-white'>
                    <Toast.Header closeButton={true}>
                        <strong className="me-auto">Convonet</strong>
                        <small>just now</small>
                    </Toast.Header>
                    <Toast.Body>{notificationMessage}</Toast.Body>
                </Toast>
            </ToastContainer>
            <Button onClick={handleShow} className="bg-transparent border text-secondary-emphasis border-light-subtle">Create Post</Button>
            <Modal show={show} onHide={handleClose}>
                <Modal.Header>
                    <Modal.Title>Create Post</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                            value={title}
                            placeholder="Title"
                            onChange={(e) => setTitle(e.target.value)}
                            as="textarea"
                            rows={1}
                            maxLength={60}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            value={desc}
                            placeholder="Description"
                            onChange={(e) => setDesc(e.target.value)}
                            as="textarea"
                            rows={6}
                            maxLength={1500}
                            required />
                    </Form.Group>
                    {serverMessage && <Alert className="mb-0" variant="danger">{serverMessage}</Alert>}
                </Modal.Body>
                <Modal.Footer>
                    <Button className="col" variant="danger" onClick={handleCloseCancel}>Cancel</Button>
                    <Button className="col" variant="success" onClick={handleClose}>Post</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}