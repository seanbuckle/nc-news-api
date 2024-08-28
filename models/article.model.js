const db = require("../db/connection")
const format = require("pg-format")


exports.selectArticles = () => {
    return db.query("SELECT * FROM articles ORDER BY created_at DESC").then(({ rows }) => {
        rows.forEach((article) => {
            delete article.body
        })
        return rows
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
        return rows[0]
    })
}