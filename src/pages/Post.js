import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { Alert } from 'react-bootstrap';

// component imports
import PostContent from '../components/post/PostContent.js';
import PostComments from '../components/post/PostComments.js';

export default function Post() {
    const { postid } = useParams();

    // react state assignments
    const [serverMessage, setServerMessage] = useState("");
    const [post, setPost] = useState({});
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [likeStatus, setLikeStatus] = useState(null);

    useEffect(() => {
        async function getPost() {
            const res = await fetch(`http://localhost:3001/api/get-post`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ postid })
            });

            const { success, message, post } = await res.json();
            if (success) setPost(post)
            else setServerMessage(message)
        }

        if (postid) getPost()
    }, [postid])

    useEffect(() => {
        async function getComments() {
            const res = await fetch(`http://localhost:3001/api/get-comments`, {
                method: "POST",
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ postid })
            })

            const { success, comments } = await res.json()
            if (success) setComments(comments)
        }

        if (postid) getComments()
    }, [postid]);

    async function updatePostScore(update) {
        const res = await fetch(`http://localhost:3001/api/update-post`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ postid: postid, update: update, username: sessionStorage.getItem("username") })
        })

        const { success, score } = await res.json();
        if (success) {
            setPost(prevPost => ({
                ...prevPost,
                score: score
            }))
        }
    }

    async function addComment() {
        const res = await fetch("http://localhost:3001/api/add-comment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ postid: postid, content: newComment, username: sessionStorage.getItem("username") })
        });
        const { success, message, commentid } = await res.json();
        if (success) {
            setComments([{ id: commentid, content: newComment, username: sessionStorage.getItem("username"), created_at: new Date().toISOString() }, ...comments]);
            setNewComment("");
        } else {
            alert(message);
        }
    };

    const handleLike = () => {
        if (likeStatus === 'like') {
            setLikeStatus(null);
            updatePostScore(1);
        } else {
            setLikeStatus('like');
            updatePostScore(1);
        }
    };

    const handleDislike = () => {
        if (likeStatus === 'dislike') {
            setLikeStatus(null);
            updatePostScore(-1);
        } else {
            setLikeStatus('dislike');
            updatePostScore(-1);
        }
    };

    if (serverMessage.length > 0) return (
        <div className='text-center'> <Alert className='w-50' variant='danger'>{serverMessage}</Alert> </div>
    )
    else return (
        <>
            <PostContent post={post} handleLike={handleLike} handleDislike={handleDislike} likeStatus={likeStatus} />
            <PostComments newComment={newComment} setNewComment={setNewComment} addComment={addComment} comments={comments} />
        </ >
    )
};