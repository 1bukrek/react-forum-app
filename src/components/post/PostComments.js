import { Form, InputGroup, ListGroup, Button } from "react-bootstrap"

export default function PostComments({ newComment, setNewComment, addComment, comments }) {
    return (
        <>
            <div className='container col-md-6 ms-md-auto mt-3 p-0'>
                <h3 className='mb-0 text-white text-opacity-75'>Comments</h3>
                <hr className="text-white m-2 "></hr>
                <Form>
                    <InputGroup className="mb-3 mt-3">
                        <Form.Control
                            placeholder="Add a comment..."
                            aria-label="Add a comment..."
                            aria-describedby="basic-addon2"
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="bg-dark border-secondary text-white"
                        />
                        <Button variant="outline-success" id="button-addon2" onClick={addComment} s>
                            Send
                        </Button>
                    </InputGroup>
                </Form>
            </div>
            <div className='container col-md-6 ms-md-auto mt-3'>
                {comments.map((comment) => (
                    <ListGroup key={comment.id}>
                        <ListGroup.Item className='mb-3' style={{ paddingLeft: "25px" }}>
                            <a href={`/user/${comment.username}`} className='row' style={{ fontWeight: "bold" }}>u/{comment.username}</a>
                            <p className='row mb-0'>{comment.content}</p>
                        </ListGroup.Item>
                    </ListGroup>
                ))}
            </div>
        </>
    )
}