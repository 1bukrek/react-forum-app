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

export {
    create_post,
    get_user_posts
}