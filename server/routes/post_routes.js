import express from 'express'
import database from '../database/database.js'

const router = express.Router()

router.post("/create-post", (req, res) => {
    const { author, title, desc } = req.body;

    if (!author) return res.json({ success: false, message: "You need to login to your account first." })
    if (!title || !desc) return res.json({ success: false, message: "Title and description are required." })

    database.run("INSERT INTO posts (author, title, description, score) VALUES (?, ?, ?, ?)", [author, title, desc, 0], (err) => {
        if (err) return res.json({ success: false, message: "Failed to create post." })
        res.json({ success: true, message: "Post created successfully." })
    })
})

router.post("/get-post", (req, res) => {
    const { postid } = req.body
    // find the post in the database by postid
    database.get("SELECT * FROM posts WHERE id = ?", [postid], async (err, row) => {
        if (err) return res.json({ success: false, message: "An error occured in database, please try again later." })
        if (!row) return res.json({ success: false, message: "Post not found." })
        return res.json({
            success: true, post: {
                id: row.id,
                author: row.author,
                title: row.title,
                description: row.description,
                score: row.score,
                created_at: row.created_at
            }
        })
    })
})

router.post("/update-post", (req, res) => {
    const { postid, update, username } = req.body
    database.get("SELECT * FROM posts WHERE id = ?", [postid], (err, postRow) => {
        if (err) return res.json({ success: false, message: "Database error." })
        if (!postRow) return res.json({ success: false, message: "Post not found." })
        // control if user has a vote 
        database.get("SELECT * FROM post_votes WHERE post_id = ? AND username = ?", [postid, username], (err, voteRow) => {
            if (err) return res.json({ success: false, message: "Error checking votes." })
            if (!voteRow) {
                // add vote if there is not a vote
                database.run("INSERT INTO post_votes (post_id, username, vote) VALUES (?, ?, ?)", [postid, username, update], (err) => {
                    if (err) return res.json({ success: false, message: "Failed to add vote." })
                    return res.json({ success: true, score: postRow.score + update })
                });
            } else if (voteRow.vote === update) {
                // remove the vote if its the same vote
                database.run("DELETE FROM post_votes WHERE post_id = ? AND username = ?", [postid, username], (err) => {
                    if (err) return res.json({ success: false, message: "Failed to remove vote." })
                    return res.json({ success: true, score: postRow.score - update })
                });
            } else {
                // update the vote if its not the same vote 
                database.run("UPDATE post_votes SET vote = ? WHERE post_id = ? AND username = ?", [update, postid, username], (err) => {
                    if (err) return res.json({ success: false, message: "Failed to update vote." })
                    return res.json({ success: true, score: postRow.score + 2 * update })
                });
            }
        });
    });
});

router.post("/get-home-page", (req, res) => {
    database.all(`SELECT * FROM posts ORDER BY RANDOM() LIMIT 10`, (err, rows) => {
        if (err) console.error(err);
        else res.json(rows)
    })
})

export default router;