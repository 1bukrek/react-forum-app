import { Navbar, Container, Nav, InputGroup, Form } from "react-bootstrap";
import CreatePost from "./post/CreatePost.js";

function CustomNavbar() {

    return (
        <div>
            <Navbar bg="dark" data-bs-theme="dark">
                <Container className="col col-lg-2">
                    <Nav className="me-auto">
                        <Navbar.Brand href="/"><i class="bi bi-text-paragraph"></i>  Convonet</Navbar.Brand>
                        <Nav.Link href="/login">Log in</Nav.Link>
                        <Nav.Link href="/register">Register</Nav.Link>
                    </Nav>
                </Container>
                <Container className="col col-lg-3">
                    <InputGroup className="mb-0 w-100">
                        <InputGroup.Text id="basic-addon1"><i className="bi bi-search"></i></InputGroup.Text>
                        <Form.Control
                            placeholder="Search on Convonet"
                            aria-label="Search on Convonet"
                            aria-describedby="basic-addon1"
                        />
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