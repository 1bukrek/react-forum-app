import database from "../config/database.js"

function create_post(author_id, title, desc) {
    database.run("INSERT INTO posts (author_id, title, description) VALUES (?, ?, ?)", [author_id, title, desc], (err) => {
        if (err) return console.error("DATABASE ERROR: ", err)
    })
}

function get_user_posts(author_id) {
    return new Promise((resolve, reject) => {
        database.all('SELECT * FROM posts WHERE author_id = ? ORDER BY created_at DESC', [author_id], (err, rows) => {
            if (err) return console.error("DATABASE ERROR: ", err)
            if (!rows) return null
            resolve(rows)
        });
    })
}

/* trigger for updating a post

database.run(`
    CREATE TRIGGER IF NOT EXISTS update_post_timestamp
    AFTER UPDATE ON posts
    BEGIN
        UPDATE posts SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END;
`)

*/

export {
    create_post,
    get_user_posts
}