import { useState, useEffect } from "react";

import SearchResult from "../components/home/SearchResult.js";
import RandomPostResult from "../components/home/RandomPostResults.js";

function Home() {

    const token = sessionStorage.getItem("token")
    if (!token) window.location.href = "/login"

    const [posts, setPosts] = useState([])

    useEffect(() => {
        const getPosts = async () => {
            const res = await fetch(`http://localhost:3001/api/get-home-page`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            const posts = await res.json();
            if (posts.length > 0) setPosts(posts);
        };

        getPosts();
    }, [])

    return (
        <>
            <SearchResult />
            <RandomPostResult posts={posts} />
        </>
    )
}

export default Home;