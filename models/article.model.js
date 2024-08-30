const db = require("../db/connection")
const format = require("pg-format")


exports.selectArticles = (topic, sort_by, order) => {
    const columns = []
    return db.query("SELECT * FROM articles").then(({ rows }) => {
        columns.push(...Object.keys(rows[0]))
        const topics = []
        rows.forEach((article) => {
            topics.push(article.topic)
        })
        return topics
    }).then((topics) => {
        const orderBy = ["asc", "desc"]
        const err400 = { status: 400, msg: "Bad request!" }
        let baseQuery = "SELECT * FROM articles"
        if (topic) {
            if (topics.includes(topic)) {
                baseQuery += ` WHERE topic = %L`
            } else {
                return Promise.reject(err400)
            }
        }
        if (!sort_by) {
            baseQuery += " ORDER BY created_at"
        } else if (columns.includes(sort_by)) {
            baseQuery += ` ORDER BY ${sort_by}`
        } else {
            return Promise.reject(err400)
        }
        if (!order) {
            baseQuery += " desc"
        } else if (orderBy.includes(order)) {
            baseQuery += ` ${order}`
        } else {
            return Promise.reject(err400)
        }
        baseQuery = format(baseQuery, topic)
        return db.query(baseQuery).then(({ rows }) => {
            rows.forEach((article) => {
                delete article.body
            })
            return rows
        })

    }).then((articles) => {
        return Promise.all(articles.map(article => {
            const query = format(`SELECT COUNT(*) FROM comments WHERE article_id = %L`, [article.article_id]);
            return db.query(query).then(({ rows }) => {
                article.comment_count = rows[0].count;
                return article;
            });
        }));

    }).then((updatedArticles) => {
        return updatedArticles
    })
}

exports.selectArticlesById = (article_id) => {
    if (Number(article_id) === NaN) {
        return Promise.reject({ status: 400, msg: "Bad request!" })
    }
    const query = format(`SELECT * FROM articles WHERE article_id = %L`, [article_id])
    return db.query(query).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article not found!" })
        }
        const countQuery = format(`SELECT COUNT(*) FROM comments WHERE article_id = ${article_id}`)
        return db.query(countQuery)
    }).then(({ rows }) => {
        const count = Number(rows[0].count)
        return db.query(query).then(({ rows }) => {
            rows[0].comment_count = count
            return rows[0]
        })
    })
}

exports.updateArticleById = (article_id, inc_votes) => {
    const err400 = { status: 400, msg: "Bad request!" }
    if (Number(article_id) === NaN || !inc_votes) {
        return Promise.reject(err400)
    }
    const query = format(`UPDATE articles SET votes = votes + %L WHERE article_id = %L RETURNING *`, inc_votes, article_id)
    return db.query(query).then(({ rows }) => {
        if (rows.length === 0) {
            return Promise.reject({ status: 404, msg: "Article not found!" })
        }
        if (rows[0].votes < 0) {
            return Promise.reject(err400)
        }
        return rows[0];
    })
}

