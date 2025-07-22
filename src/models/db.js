const pool = require("./pool");

async function getUserByUsername(userName) {
    const {rows} = await pool.query("SELECT * FROM users WHERE username = $1", [userName]);
    return(rows[0])
}

async function signUpUser(firstName, lastName, userName, password) {
    await pool.query("INSERT INTO users (firstname, lastname, username, password) VALUES ($1, $2, $3, $4)", [firstName, lastName, userName, password])
}

module.exports = {signUpUser, getUserByUsername}