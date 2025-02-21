import { Form, Button, InputGroup, Alert } from "react-bootstrap";
import React, { useState } from "react";

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [serverMessage, setServerMessage] = useState('');

    async function login() {
        if (!username || !password) return setServerMessage("Username and password are required.");

        const res = await fetch('http://localhost:3001/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const { success, message, token, user } = await res.json();

        // set jsonwebtoken to session storage
        if (token) sessionStorage.setItem('token', token)
        // redirect to home page
        if (success) {
            window.location.href = '/';
            // set user id to session storage 
            sessionStorage.setItem('user_id', user.id)
            sessionStorage.setItem('username', user.username)
        }
        // error message from server
        else setServerMessage(message);
    };

    return (
        <div className="container border border-dark-subtle rounded-3 w-25" style={{ marginTop: "150px" }} >
            <div className="container" style={{ marginTop: "16px" }}>
                <h1 className="w-auto mx-0">Log in</h1>
                <hr className="w-auto mx-0"></hr>
            </div>
            <div className="container">
                <Form className="w-auto mx-0">
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">@</InputGroup.Text>
                        <Form.Control
                            placeholder="Username"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </InputGroup>
                    <InputGroup className="mb-3">
                        <InputGroup.Text id="basic-addon1">$</InputGroup.Text>
                        <Form.Control
                            placeholder="Password"
                            aria-label="Password"
                            aria-describedby="basic-addon1"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </InputGroup>
                </Form>
            </div>
            <div className="container mb-3 text-center">
                <p><a href="/register" className="link-offset-2 link-underline link-underline-opacity-0 w-auto mx-0">I don't have an account.</a></p>
                <Button className="mt-0 w-100 mx-0 bg-dark border-dark" onClick={login}>Log in</Button>
            </div>
            <div className="container mt-3">
                {serverMessage && <Alert variant="danger" className="w-auto mx-0">{serverMessage}</Alert>}
            </div>
        </ div >
    )
}

export default Login;