import React, { useContext } from "react";
import { SearchContext } from "../../context/SearchContext.js";

function SearchResult() {
    const { searchQuery, searchResults } = useContext(SearchContext);

    return (
        <div>
            <h1>Search Results</h1>
            <p>Search Query: {searchQuery}</p>
            <ul>
                {searchResults.map((result) => (
                    <li key={result.id}>
                        <h2>{result.title}</h2>
                        <p>{result.description}</p>
                        <p>Author: {result.author}</p>
                        <p>Score: {result.score}</p>
                        <p>Created At: {new Date(result.created_at).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default SearchResult;
