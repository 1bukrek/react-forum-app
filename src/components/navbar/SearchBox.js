import { useContext, useEffect, useState } from "react"
import { SearchContext } from "../../context/SearchContext.js"

import { Container, Form, InputGroup, Button } from "react-bootstrap"

export default function SearchBox() {

    const { searchQuery, setSearchQuery, search, setIsFocused, isFocused } = useContext(SearchContext)

    const [labelSearchResults, setLabelSearchResults] = useState([])

    useEffect(function () {
        if (searchQuery.length < 3) return;
        if (!isFocused) return
        async function labelSearch() {
            try {
                const res = await fetch(`http://localhost:3001/search?query=${searchQuery}`);
                if (res.ok) {
                    const { results } = await res.json();
                    setLabelSearchResults(results)
                } else console.error("Search request failed");
            } catch (error) {
                console.error("Error during search:", error);
            }
        }

        // execute label search when "" changes
        labelSearch()
    }, [searchQuery])

    return (
        <>
            <Container className="col col-lg-3 px-0 position-relative">
                <InputGroup className="mb-0 w-100">
                    <Form.Control
                        required
                        id="searchQuery"
                        className="border-secondary"
                        placeholder="Search on Convonet"
                        aria-label="Search on Convonet"
                        aria-describedby="basic-addon1"
                        value={searchQuery}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setTimeout(() => { setIsFocused(false) }, 200)}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && search()}
                    />
                    <Button onClick={search} variant="secondary" className="bg-transparent" >
                        <i className="bi bi-search"></i>
                    </Button>
                </InputGroup>
                {isFocused && searchQuery && (
                    <div className="position-absolute bg-dark text-white border rounded p-1 w-100 mt-2"
                        style={{ top: "100%", zIndex: 10, fontSize: "1rem", boxShadow: "0px 2px 5px rgba(0,0,0,0.1)" }}
                        onClick={search}>

                        {labelSearchResults.length > 0 && (
                            <>
                                <p className="text-muted fw-bold mb-0 p-1 pb-0">Posts</p>
                                <hr className="m-0 mt-1"></hr>
                                {labelSearchResults.map((result, index) => (
                                    <div style={{ cursor: "pointer" }} key={index} onClick={() => { setSearchQuery(result.title); search() }}>
                                        <p className="mb-0 p-1">{result.title} <small className="text-secondary">u/{result.author}</small></p>
                                    </div>
                                ))}
                                <hr className="mb-2 mt-1"></hr>
                            </>
                        )}
                        <i className="bi bi-search" style={{ cursor: "pointer" }}></i> Search for "<strong>{searchQuery}</strong>"
                    </div>
                )}
            </Container >
        </>
    )
}