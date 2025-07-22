const pool = require("./pool");

async function getUserByUsername(userName) {
    const {rows} = await pool.query("SELECT * FROM users WHERE username = $1", [userName]);
    return(rows[0])
}

async function signUpUser(firstName, lastName, userName, password) {
    await pool.query("INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)", [firstName, lastName, userName, password])
}

async function getAllMessages() {
    const {rows} = await pool.query("SELECT * FROM messages_1")
    return(rows)
}

async function getAllMessagesWithAuthor() {
    const {rows} = await pool.query("SELECT * FROM messages_1 JOIN users ON authorid = users.id")
    return(rows)
}

module.exports = {signUpUser, getUserByUsername, getAllMessages, getAllMessagesWithAuthor}