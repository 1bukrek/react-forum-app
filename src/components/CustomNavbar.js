import { Navbar, Container, Nav } from "react-bootstrap";

import CreatePost from "./post/CreatePost.js";
import SearchBox from "./navbar/SearchBox.js";

function CustomNavbar() {
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
                <SearchBox />
                <Container className="col col-lg-2">
                    <CreatePost />
                    <Nav className="me-auto mx-4">
                        <Nav.Link href={`/user/${sessionStorage.getItem("username")}`} className="row">
                            <i className="bi bi-person-circle" style={{ fontSize: "20px", color: "text-secondary-emphasis" }}></i>
                            u/{sessionStorage.getItem("username")}
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar >
        </div >
    );
}

export default CustomNavbar;