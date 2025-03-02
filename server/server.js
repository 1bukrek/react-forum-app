import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import database from "./models/database.js";

const app = express();
app.use(express.json());
app.use(cors());

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.json({ success: false, message: "Username and password are required." })

    database.get(
        "SELECT * FROM users WHERE users.username = ?", [username], (err, row) => {
            if (err) return res.json({ success: false, message: "An error occured in database, please try again later." })
            if (row) return res.json({ success: false, message: "This username is already taken, choose another one." })
            // hash the password
            const hashedPassword = bcrypt.hashSync(password, 8)
            // insert the new user into the database
            database.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
                if (err) return res.json({ success: false, message: "Failed to register user.", })
                res.json({ success: true, message: "User registered successfully.", })
            })
        }
    )

});

app.post('/login', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.json({ success: false, message: "Username and password are required." })

    // find the user in the database by username
    database.get(
        "SELECT * FROM users WHERE username = ?", [username], (err, row) => {
            if (err) return res.json({ success: false, message: "An error occured in database, please try again later." })
            if (!row) return res.json({ success: false, message: "Invalid username or password." })

            // compare the provided password with the hashed password from the database
            const password_match = bcrypt.compareSync(password, row.password)

            if (password_match) {
                // create jsonwebtoken for one hour after successful login
                const token = jwt.sign({ id: row.id, username: row.username }, "secretkey", { expiresIn: "1h" })
                // send the token to the client
                return res.json({ success: true, message: "User logged in successfully.", token: token, user: row })
            } else {
                // if the passwords do not match
                return res.json({ success: false, message: "Invalid username or password." })
            }
        }
    )
})

app.post("/api/create-post", (req, res) => {
    const { author, title, desc } = req.body;

    if (!author) return res.json({ success: false, message: "You need to login to your account first." })
    if (!title || !desc) return res.json({ success: false, message: "Title and description are required." })

    database.run("INSERT INTO posts (author, title, description, score) VALUES (?, ?, ?, ?)", [author, title, desc, 0], (err) => {
        if (err) return res.json({ success: false, message: "Failed to create post." })
        res.json({ success: true, message: "Post created successfully." })
    })
})

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

app.post("/api/get-post", (req, res) => {
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

app.post("/api/update-post", (req, res) => {
    const { postid, update, username } = req.body

    database.get("SELECT * FROM posts WHERE id = ?", [postid], (err, postRow) => {
        if (err) return res.json({ success: false, message: "Database error." });
        if (!postRow) return res.json({ success: false, message: "Post not found." });

        // control if user has a vote 
        database.get("SELECT * FROM post_votes WHERE post_id = ? AND username = ?", [postid, username], (err, voteRow) => {
            if (err) return res.json({ success: false, message: "Error checking votes." });

            if (!voteRow) {
                // add vote if there is not a vote
                database.run("INSERT INTO post_votes (post_id, username, vote) VALUES (?, ?, ?)", [postid, username, update], (err) => {
                    if (err) return res.json({ success: false, message: "Failed to add vote." });
                    return res.json({ success: true, score: postRow.score + update });
                });
            } else if (voteRow.vote === update) {
                // remove the vote if its the same vote
                database.run("DELETE FROM post_votes WHERE post_id = ? AND username = ?", [postid, username], (err) => {
                    if (err) return res.json({ success: false, message: "Failed to remove vote." });
                    return res.json({ success: true, score: postRow.score - update });
                });
            } else {
                // update the vote if its not the same vote 
                database.run("UPDATE post_votes SET vote = ? WHERE post_id = ? AND username = ?", [update, postid, username], (err) => {
                    if (err) return res.json({ success: false, message: "Failed to update vote." });
                    return res.json({ success: true, score: postRow.score + 2 * update });
                });
            }
        });
    });
});

app.post("/api/add-comment", (req, res) => {
    const { postid, content, username } = req.body;

    // find the user in database
    database.get("SELECT id FROM users WHERE username = ?", [username], (err, user) => {
        if (err || !user) return res.json({ success: false, message: "User not found." });

        // add the comment
        database.run("INSERT INTO comments (post_id, author, content) VALUES (?, ?, ?)", [postid, username, content], function (err) {
            if (err) return res.json({ success: false, message: "Failed to add comment." });
            res.json({ success: true, commentid: this.lastID });
        }
        );
    });
});

app.post("/api/get-comments", (req, res) => {
    const { postid } = req.body

    database.all(`SELECT comments.id, comments.content, comments.created_at, users.username FROM comments JOIN users ON comments.author = users.username WHERE comments.post_id = ? ORDER BY comments.created_at DESC`,
        [postid], (err, comments) => {
            if (err) return res.json({ success: false, message: "Failed to get comments." });
            res.json({ success: true, comments });
        }
    );
});

app.post("/api/get-home-page", (req, res) => {
    database.all(`SELECT * FROM posts ORDER BY RANDOM() LIMIT 10`, (err, rows) => {
        if (err) console.error(err);
        else res.json(rows)
    });
})

app.get("/search", (req, res) => {
    let { query } = req.query;
    if (!query || query.length < 3) return res.json({ results: [] }); // returns empty array

    let formattedQuery = `%${query.toLowerCase()}%`;

    // set query limit to 10 for default
    let limit = 2; // parseInt(limit) ||

    database.all(
        `SELECT * FROM posts WHERE LOWER(title) LIKE ? COLLATE NOCASE LIMIT ?`, [formattedQuery, limit], (err, rows) => {
            if (err) {
                console.error("SEARCH ERROR: ", err.message);
                return res.status(500).json({ message: err.message });
            }
            res.json({ results: rows });
        }
    );
});

app.listen(3001, () => console.warn("SERVER IS RUNNING ON http://localhost:3001"));