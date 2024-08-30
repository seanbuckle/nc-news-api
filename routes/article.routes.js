const articleRouter = require("express").Router();
const { getArticles, getArticlesById, patchArticlesById } = require("../controllers/article.controller");
const { getCommentsById, postCommentsById } = require("../controllers/comments.controller");

articleRouter.get("/", getArticles);

articleRouter
    .route("/:article_id")
    .get(getArticlesById)
    .patch(patchArticlesById);

articleRouter
    .route("/:article_id/comments")
    .get(getCommentsById)
    .post(postCommentsById);


module.exports = articleRouter