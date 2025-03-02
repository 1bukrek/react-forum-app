import { createContext, useState } from "react";

export const SearchContext = createContext();

export function SearchProvider({ children }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false)
    const [isFocused, setIsFocused] = useState(false)

    async function search() {
        try {
            const res = await fetch(`http://localhost:3001/search?query=${searchQuery}`);
            if (res.ok) {
                const data = await res.json();
                setSearchResults(data.results); // assuming the response has a 'results' field
                setIsSearching(true)
            } else console.error("Search request failed");
        } catch (error) {
            console.error("Error during search:", error);
        }
    }

    return (
        <SearchContext.Provider value={{
            searchQuery, setSearchQuery, searchResults, setSearchResults, isSearching, setIsSearching, search, isFocused, setIsFocused
        }}>
            {children}
        </SearchContext.Provider>
    );
}
