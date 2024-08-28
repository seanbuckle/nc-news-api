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

exports.updateArticleById = (article_id,inc_votes) => {
    const err400 = { status: 400, msg: "Bad request!" }
    if (Number(article_id) === NaN || !inc_votes) {
         return Promise.reject(err400)
    }
    const query = format(`UPDATE articles SET votes = votes + %L WHERE article_id = %L RETURNING *`, inc_votes,article_id)
    return db.query(query).then(({ rows }) => {
        if (rows.length === 0) {
             return Promise.reject({ status: 404, msg: "Article not found!" })
        }
        if (rows[0].votes < 0){
            return Promise.reject(err400)
        }
        return rows[0];
    })
}

