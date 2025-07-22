const pool = require("./pool");

async function getUsers() {
    const {rows} = pool.query("SELECT * FROM users");
    console.log(rows)
}

module.exports = {getUsers}