import { Navbar, Container, Nav, InputGroup, Form, Button } from "react-bootstrap";
import CreatePost from "./post/CreatePost.js";
import { useContext } from "react";
import { SearchContext } from "../context/SearchContext.js"; // Eski haline getirildi

function CustomNavbar() {
    const { searchQuery, setSearchQuery, setSearchResults } = useContext(SearchContext);

    async function search() {
        try {
            const res = await fetch(`http://localhost:3001/search?query=${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data.results); // Assuming the response has a 'results' field
                console.log(data.results);
            } else {
                console.error("Search request failed");
            }
        } catch (error) {
            console.error("Error during search:", error);
        }
    }

    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            search();
        }
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
                            onKeyPress={handleKeyPress}
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
    );
}

export default CustomNavbar;