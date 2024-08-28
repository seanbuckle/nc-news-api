const { selectCommentsById } = require("../models/comments.model")

exports.getCommentsById = (req, res,next) => {
    const {article_id} = req.params
    selectCommentsById(article_id).then((data) => {
        res.status(200).send(data)
    }).catch(next)
}