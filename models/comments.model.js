const db = require("../db/connection")
const format = require("pg-format")

exports.selectCommentsById = (article_id) => {
    const typeChange = Number(article_id)
    if (typeChange === NaN){
        return Promise.reject({status: 400, msg: "Bad request!"})
    }
    const query = format(`SELECT * FROM comments WHERE article_id = %L ORDER BY created_at DESC`,[article_id])
    return db.query(query).then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({status: 404, msg: "Comments not found!"})
        }
        return rows
    })
}