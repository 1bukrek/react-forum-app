import React from 'react';

import { Card } from 'react-bootstrap';

export default function Post({ post }) {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    const date = new Date(post.created_at)
    return (
        <>
            <div>
                <Card className='w-100 mb-3 mt-3'>
                    <Card.Header>
                        <p className='mb-0' style={{ fontSize: "0.8rem" }}>u/{post.author} | {`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`}</p>
                        <Card.Title className='mb-0 mt-0'>
                            <strong>{post.title}</strong>
                        </Card.Title>
                    </Card.Header>
                    <Card.Body>{post.description}</Card.Body>
                    <Card.Footer>
                        <a href={`/post/${post.id}`} className="stretched-link">Go to post</a >
                    </Card.Footer>
                </Card>
            </div>
        </ >
    )
}