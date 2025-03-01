import { createContext, useState } from "react";

export const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    return (
        <SearchContext.Provider value={{ searchQuery, setSearchQuery, searchResults, setSearchResults }}>
            {children}
        </SearchContext.Provider>
    );
}
