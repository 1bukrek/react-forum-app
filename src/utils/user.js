import database from "../config/database.js"

function delete_all_users() {
    const query = `DELETE FROM users`

    database.run(query, (err) => {
        if (err) console.error("DATABASE UPDATE ERROR: ", err.message)
        else {
            console.warn("USERS DELETED")
            database.run(
                `DELETE FROM sqlite_sequence WHERE name='users'`, (reset_err) => {
                    if (reset_err) console.error("DATABASE UPDATE ERROR: ", reset_err.message)
                }
            )
        }
    })
}

function get_user_by_username(username) {
    const query = `
        SELECT * FROM users
        WHERE users.username = ?
    `

    return new Promise((resolve, reject) => {
        database.get(query, [username], (err, row) => {
            if (err) reject(err)
            if (!row) return undefined

            resolve(row)
        })
    })
}


export {
    delete_all_users,
    get_user_by_username,
}