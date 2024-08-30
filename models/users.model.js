const db = require("../db/connection")
const format = require("pg-format")

exports.selectUsers = () => {
    return db.query("SELECT * FROM users").then(({ rows }) => {
        return rows
    })
}

exports.selectUserByUsername = (username) => {
    
    const query = format(`SELECT * FROM users WHERE username = %L`, username)
    return db.query(query).then(({ rows }) => {
        if (rows.length < 1){
            return Promise.reject({status: 404, msg: "User not found!"})
        }
        return rows[0]
    })
}