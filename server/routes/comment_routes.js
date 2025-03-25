import express from 'express';
import database from '../database/database.js';

const router = express.Router();

router.post("/add-comment", (req, res) => {
    const { postid, content, username } = req.body;
    // find the user in database
    database.get("SELECT id FROM users WHERE username = ?", [username], (err, user) => {
        if (err || !user) return res.json({ success: false, message: "User not found." })
        // add the comment
        database.run("INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)", [postid, username, content], function (err) {
            if (err) return res.json({ success: false, message: "Failed to add comment." })
            res.json({ success: true, commentid: this.lastID })
        })
    })
})

router.post("/get-comments", (req, res) => {
    const { postid } = req.body
    database.all(`SELECT comments.id, comments.content, comments.created_at, users.username FROM comments JOIN users ON comments.author = users.username WHERE comments.post_id = ? ORDER BY comments.created_at DESC`,
        [postid], (err, comments) => {
            if (err) return res.json({ success: false, message: "Failed to get comments." })
            res.json({ success: true, comments })
        }
    )
})


export default router;
