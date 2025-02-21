import sqlite from "sqlite3"
import path from "path"
import { fileURLToPath } from "url"

// find the directory name of the current module
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const sqlite3 = sqlite.verbose()

// create a new database object
const database = new sqlite3.Database(path.join(__dirname, "forum_app.db"), (err) => {
    if (err) console.error("DATABASE ERROR: ", err.message)
})

database.serialize(() => {
    database.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP
        )
    `)

    database.run(`
        CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            author TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            score INTEGER DEFAULT 0,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (author) REFERENCES users(username) ON DELETE CASCADE
        )
    `)

    database.run(`
        CREATE TABLE IF NOT EXISTS comments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            author INTEGER NOT NULL,
            content TEXT NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (author) REFERENCES users(username) ON DELETE CASCADE
        );
    `)

    database.run(`
        CREATE INDEX IF NOT EXISTS idx_posts_author ON posts(author);
    `);

    database.run(`
        CREATE TABLE IF NOT EXISTS post_votes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            post_id INTEGER NOT NULL,
            username INTEGER NOT NULL,
            vote INTEGER NOT NULL,
            created_at TEXT DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
            FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE,
            UNIQUE (post_id, username)
        );
    `)

    // TRIGGERS
    database.run(`
        CREATE TRIGGER IF NOT EXISTS after_vote_insert
        AFTER INSERT ON post_votes
        BEGIN
            UPDATE posts
            SET score = (SELECT IFNULL(SUM(vote), 0) FROM post_votes WHERE post_id = NEW.post_id)
            WHERE id = NEW.post_id;
        END;
    `);

    database.run(`
        CREATE TRIGGER IF NOT EXISTS after_vote_update
        AFTER UPDATE ON post_votes
        BEGIN
            UPDATE posts
            SET score = (SELECT IFNULL(SUM(vote), 0) FROM post_votes WHERE post_id = NEW.post_id)
            WHERE id = NEW.post_id;
        END;
    `);

    database.run(`
        CREATE TRIGGER IF NOT EXISTS after_vote_delete
        AFTER DELETE ON post_votes
        BEGIN
            UPDATE posts
            SET score = (SELECT IFNULL(SUM(vote), 0) FROM post_votes WHERE post_id = OLD.post_id)
            WHERE id = OLD.post_id;
        END;
    `);
})

export default database