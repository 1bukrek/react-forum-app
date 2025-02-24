import { Card, ListGroup } from "react-bootstrap"

export default function PostContent({ post, handleLike, handleDislike, likeStatus }) {

    const date = new Date(post.created_at)

    let ms_diff = Date.now() - date.getTime()
    console.log(ms_diff)

    return (
        <>
            <Card className='container col-md-6 ms-md-auto mt-3 p-0 bg-dark border-secondary text-secondary'>
                <Card.Body><a href={`/user/${post.author}`} className="link-light">u/{post.author}</a> | {post.created_at}</Card.Body>
            </Card>
            <Card className='w-50 top-10 mt-0 start-50 translate-middle-x mt-3 bg-dark text-white border-secondary'>
                <Card.Header><p className='mb-0'><strong>{post.title}</strong></p></Card.Header>
                <Card.Body><p className='mb-0'>{post.description}</p></Card.Body>
                <Card.Footer>
                    <div className='mb-0 w-25'>
                        <ListGroup horizontal >
                            <ListGroup.Item className="border-secondary bg-dark text-secondary"><strong>{post.score}</strong></ListGroup.Item>
                            <ListGroup.Item className="border-secondary" variant='success' action onClick={handleLike} active={likeStatus === 'like'}>Like</ListGroup.Item>
                            <ListGroup.Item className="border-secondary" variant='danger' action onClick={handleDislike} active={likeStatus === 'dislike'}>Dislike</ListGroup.Item>
                        </ListGroup>
                    </div>
                </Card.Footer>
            </Card>
        </>
    )
}