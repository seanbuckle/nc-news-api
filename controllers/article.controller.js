const { selectArticles, selectArticlesById, updateArticleById } = require("../models/article.model")


exports.getArticles = (req, res, next) => {
    const { topic, sort_by, order } = req.query
    
    selectArticles(topic, sort_by, order).then((articles) => {
        res.status(200).send(articles)
    }).catch(next)
}

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params
    selectArticlesById(article_id).then((articles) => {
        res.status(200).send(articles)
    }).catch(next)
}

exports.patchArticlesById = (req, res, next) => {
    const { article_id } = req.params
    const { inc_votes } = req.body
    updateArticleById(article_id,inc_votes).then((articles) => {
        res.status(200).send(articles)
    }).catch(next)
}

