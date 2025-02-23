import React, { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import Post from '../components/post/Post.js';

export default function Profile() {
    const { username } = useParams();

    const [serverMessage, setServerMessage] = useState("");
    const [profile, setProfile] = useState({});

    var date = new Date()
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    useEffect(() => {
        const getProfile = async () => {
            const res = await fetch(`http://localhost:3001/api/get-profile`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', },
                body: JSON.stringify({ username })
            });

            const { success, message, profile } = await res.json();
            if (success) {
                setProfile(profile)
                date = new Date(profile.created_at)
            }
            else if (username === "null" && !sessionStorage.getItem("username")) setServerMessage("You must login your account to view your user profile.")
            else setServerMessage(message)
        }

        if (username) getProfile()
    }, [username])

    if (serverMessage.length > 0) return (
        <div className='text-center'> <Alert className='w-50 mx-auto mt-5' variant='danger'>{serverMessage}</Alert> </div>
    )
    return (
        <>
            <div className='container col-md-5 ms-md-auto' style={{ marginTop: "75px" }}>
                <div className='row align-items-center'>
                    <h2 className='w-auto'>u/{profile.username}</h2>
                </div>
                <hr className='row w-100'></hr>
                <div className='row' style={{ paddingLeft: "12px" }}>
                    <p>Forum member since: <ins>{`${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`}</ins></p>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. </p>
                </div>
                <hr className='row w-100'></hr>
                <div>
                    {profile.posts !== undefined &&
                        Object.entries(profile.posts).map((post, index) => {
                            return (
                                <div key={index}>
                                    <Post post={post[1]} />
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </>
    )
};