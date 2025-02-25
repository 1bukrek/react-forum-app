import { Navbar, Container, Nav, InputGroup, Form, Button } from "react-bootstrap";
import CreatePost from "./post/CreatePost.js";
import { useState } from "react";

function CustomNavbar() {
    const [searchQuery, setSearchQuery] = useState("")

    async function search() {
        const res = await fetch(`/search?query=${encodeURIComponent(searchQuery)}`);
    }

    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container className="col col-lg-2">
                    <Nav className="me-auto">
                        <Navbar.Brand href="/"><i className="bi bi-text-paragraph"></i>  Convonet</Navbar.Brand>
                        <Nav.Link href="/login">Log in</Nav.Link>
                        <Nav.Link href="/register">Register</Nav.Link>
                    </Nav>
                </Container>
                <Container className="col col-lg-3 px-0">
                    <InputGroup className="mb-0 w-100">
                        <Form.Control
                            className="border-secondary"
                            placeholder="Search on Convonet"
                            aria-label="Search on Convonet"
                            aria-describedby="basic-addon1"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            id="searchQuery"
                            value={searchQuery}
                            required
                        />
                        <Button onClick={search} variant="secondary" className="bg-transparent" type="submit">
                            <i className="bi bi-search"></i>
                        </Button>
                    </InputGroup>
                </Container>
                <Container className="col col-lg-2">
                    <CreatePost />
                    <Nav className="me-auto mx-4">
                        <Nav.Link href={`/user/${sessionStorage.getItem("username")}`} className="row">
                            <i className="bi bi-person-circle" style={{ fontSize: "20px", color: "text-secondary-emphasis" }}></i>
                            u/{sessionStorage.getItem("username")}
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
        </div>
    )
}

export default CustomNavbar;