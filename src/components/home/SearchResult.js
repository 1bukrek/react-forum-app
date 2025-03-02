import React, { useContext } from "react";
import { SearchContext } from "../../context/SearchContext.js";
import Post from "../post/Post.js";

export default function SearchResult() {
    const { searchResults } = useContext(SearchContext);

    return (
        <div className="w-50 mx-auto container col-md-5 ms-md-auto text-white text-opacity-75">
            <p className="display-4 mb-0 mt-4" style={{ fontWeight: "bold" }}>Search Results</p>
            <hr className="my-3 text-light mt-1" />
            {searchResults.length > 0 && searchResults.map((result, index) => (
                <Post key={index} post={result} ></Post>
            ))
            }
            {searchResults.length === 0 &&
                (
                    <>
                        <p className="text-center fs-3 mb-0 mt-5">We couldn’t find any results for your search.</p>
                        <p className="text-center fs-6">Double-check your spelling or try different keywords</p>
                    </>
                )
            }
        </div >
    )
}