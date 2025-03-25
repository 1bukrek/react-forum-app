import express from 'express';
import cors from 'cors';

import auth_routes from "./routes/auth_routes.js"
import post_routes from "./routes/post_routes.js"
import comment_routes from "./routes/comment_routes.js"

import database from "./database/database.js";

const app = express();
app.use(express.json());
app.use(cors());

// connecting routes
app.use("/", auth_routes)
app.use("/api", post_routes)
app.use("/api", comment_routes)

app.post("/api/get-profile", (req, res) => {
    const { username } = req.body
    // find the user in the database by username
    database.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (err) return res.json({ success: false, message: "An error occured in database, please try again later." })
        if (!row) return res.json({ success: false, message: "User not found." })
        database.all('SELECT * FROM posts WHERE author = ? ORDER BY created_at DESC LIMIT 10 OFFSET 0', [row.username], (err, rows) => {
            if (err) return
            return res.json({
                success: true, message: "User found.", profile: {
                    id: row.id,
                    username: row.username,
                    created_at: row.created_at,
                    posts: rows
                }
            })
        })
    })
})

app.get("/search", (req, res) => {
    let { query } = req.query
    if (!query || query.length < 3) return res.json({ results: [] }); // returns empty array

    let formatted_query = `%${query.toLowerCase()}%`
    // set query limit to 10 for default
    let limit = 2;

    database.all(`SELECT * FROM posts WHERE LOWER(title) LIKE ? COLLATE NOCASE LIMIT ?`, [formatted_query, limit], (err, rows) => {
        if (err) {
            console.error("SEARCH ERROR: ", err.message)
            return res.status(500).json({ message: err.message })
        }
        res.json({ results: rows });
    })
})

app.listen(3001, () => console.warn("SERVER IS RUNNING ON http://localhost:3001"))