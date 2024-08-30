const db = require("../db/connection")
const format = require("pg-format")

exports.selectCommentsById = (article_id) => {
    const typeChange = Number(article_id)
    if (typeChange === NaN) {
        return Promise.reject({ status: 400, msg: "Bad request!" })
    }
    const query = format(`SELECT * FROM comments WHERE article_id = %L ORDER BY created_at DESC`, [article_id])
    return db.query(query).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Comments not found!" })
        }
        return rows
    })
}

exports.insertCommentsById = (article_id, username, body) => {
    if (!username || !body) {
        return Promise.reject({ status: 400, msg: "Bad request!" })
    }
    const query = format(`INSERT INTO comments (body,author,article_id) VALUES (%L) RETURNING *;`, [body, username, article_id])
    return db.query(query).then(({ rows }) => {
        return rows[0]
    })
}


exports.updateCommentsById = (comment_id, inc_votes) => {
    const err400 = { status: 400, msg: "Bad request!" }
    if (isNaN(Number(comment_id)) || !inc_votes) {
        return Promise.reject(err400)
    }
    const query = format(`UPDATE comments SET votes = votes + %L WHERE comment_id = %L RETURNING *`, inc_votes, comment_id)
    return db.query(query).then(({ rows }) => {
        if (rows.length < 1) {
            return Promise.reject({ status: 404, msg: "Comment not found!" })
        }
        return rows[0];
    })
}


exports.removeCommentById = (comment_id) => {
    const query = format(`DELETE FROM comments WHERE comment_id = %L AND EXISTS (SELECT 1 FROM comments WHERE comment_id = %L);`, comment_id,comment_id);
    return db.query(query)
};