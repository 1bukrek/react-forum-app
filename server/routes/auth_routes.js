import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import database from '../database/database.js';

const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.json({ success: false, message: "Username and password are required." })
    database.get("SELECT * FROM users WHERE users.username = ?", [username], (err, row) => {
        if (err) return res.json({ success: false, message: "An error occured in database, please try again later." })
        if (row) return res.json({ success: false, message: "This username is already taken, choose another one." })
        // hash the password
        const hashedPassword = bcrypt.hashSync(password, 8)
        // insert the new user into the database
        database.run("INSERT INTO users (username, password) VALUES (?, ?)", [username, hashedPassword], (err) => {
            if (err) return res.json({ success: false, message: "Failed to register user.", })
            res.json({ success: true, message: "User registered successfully.", })
        })
    })
})

router.post('/login', (req, res) => {
    const { username, password } = req.body
    if (!username || !password) return res.json({ success: false, message: "Username and password are required." })
    // find the user in the database by username
    database.get("SELECT * FROM users WHERE username = ?", [username], (err, row) => {
        if (err) return res.json({ success: false, message: "An error occured in database, please try again later." })
        if (!row) return res.json({ success: false, message: "Invalid username or password." })
        // compare the provided password with the hashed password from the database
        const password_match = bcrypt.compareSync(password, row.password)
        if (password_match) {
            // create jsonwebtoken for one hour after successful login
            const token = jwt.sign({ id: row.id, username: row.username }, "secretkey", { expiresIn: "1h" })
            // send the token to the client
            return res.json({ success: true, message: "User logged in successfully.", token: token, user: row })
        } else return res.json({ success: false, message: "Invalid username or password." })
    })
})

export default router;
