import { Container } from "react-bootstrap"
import Post from "../post/Post.js"

export default function RandomPostResult({ posts }) {
    return (
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
    )
}