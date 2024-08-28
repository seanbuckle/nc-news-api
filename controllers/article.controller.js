const { selectArticles, selectArticlesById } = require("../models/article.model")


exports.getArticles = (req, res, next) => {
    const { article_id } = req.params
    selectArticles(article_id).then((articles) => {
        res.status(200).send(articles)
    }).catch(next)
}

exports.getArticlesById = (req, res, next) => {
    const { article_id } = req.params
    selectArticlesById(article_id).then((articles) => {
        res.status(200).send(articles)
    }).catch(next)
}