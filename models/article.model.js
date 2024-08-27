const db = require("../db/connection")
const format = require("pg-format")


exports.selectArticles = (article_id) => {
    if (Number(article_id) === NaN){
        return Promise.reject({status: 400, msg:"Bad request!"})
    }
    const query = format(`SELECT * FROM articles WHERE article_id = %L`, [article_id])
    return db.query(query).then(({ rows }) => {
        if (rows.length === 0){
            return Promise.reject({status: 404,msg:"Article not found!"})
        }
        return rows[0]
    })
}