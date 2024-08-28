const { selectCommentsById, insertCommentsById } = require("../models/comments.model")

exports.getCommentsById = (req, res, next) => {
    const { article_id } = req.params
    selectCommentsById(article_id).then((data) => {
        res.status(200).send(data)
    }).catch(next)
}

exports.postCommentsById = (req, res, next) => {
    const { article_id } = req.params;
    const { username, body } = req.body;
    insertCommentsById(article_id, username, body).then((comment) => {
        res.status(201).send(comment)
    }).catch(next)
}