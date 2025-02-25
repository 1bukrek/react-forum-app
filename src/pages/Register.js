import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import React, { useState } from "react";

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [serverMessage, setServerMessage] = useState('');

    const register = async () => {
        if (!username || !password) return setServerMessage("Username and password are required.");
        const res = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        });

        let { success, message } = await res.json();
        if (success) window.location.href = '/login';
        else setServerMessage(message);
    };

    return (
        <div className="container border border-dark-subtle rounded-3 w-25" style={{ marginTop: "150px" }}>
            <div className="container" style={{ marginTop: "16px" }}>
                <h1 className="w-auto mx-0 text-white">Register</h1>
                <hr className="w-auto mx-0 text-white"></hr>
            </div>
            <div>
                <Form className="w-auto mx-0" style={{ paddingLeft: "12px", paddingRight: "12px" }}>
                    <InputGroup className="mb-3">
                        <InputGroup.Text className="bg-dark text-secondary border-secondary" id="basic-addon1">@</InputGroup.Text>
                        <Form.Control
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="bg-dark border-secondary text-white"
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text style={{ width: "40px" }} className="bg-dark text-secondary border-secondary" id="basic-addon1">$</InputGroup.Text>
                        <Form.Control
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                            type="password"
                            value={password}
                            required
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-dark border-secondary text-white"
                        />
                    </InputGroup>

                </Form>
            </div>
            <div className="container mb-3 text-center">
                <Button className="w-100 mx-0 bg-dark border-secondary" onClick={register}>Register</Button>
            </div>
            <div className="container">
                {serverMessage && <Alert variant="danger" className="w-auto mx-auto">{serverMessage}</Alert>}
            </div>
        </ div>
    )
}

export default Register;