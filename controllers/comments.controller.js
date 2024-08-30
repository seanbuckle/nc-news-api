const { selectCommentsById, insertCommentsById, updateCommentsById, removeCommentById } = require("../models/comments.model")

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

exports.patchCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    const { inc_votes } = req.body;
    updateCommentsById(comment_id, inc_votes).then((comment) => {
        res.status(200).send(comment)
    }).catch(next)
}

exports.deleteCommentById = (req, res, next) => {
    const { comment_id } = req.params;
    if (Number(comment_id) === NaN) {
        return Promise.reject({ status: 400, msg: "Bad request!" })
    }
    removeCommentById(comment_id).then(() => {
        res.status(204).send()
    }).catch(next)
}