import { useState, useEffect } from "react";
import { Container } from "react-bootstrap";

import Post from "../components/post/Post.js";

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
            <Container className="w-50 mx-auto container col-md-5 ms-md-auto">
                {posts.length > 0 &&
                    posts.map((post, index) => {
                        return (
                            <div key={index}>
                                <Post post={post} />
                            </div>
                        )
                    })
                }
            </Container>
        </>
    )
}

export default Home;