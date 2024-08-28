const express = require('express')
const app = express();

app.use(express.json())

const { getApi } = require("./controllers/api.controller")
const { getTopics } = require("./controllers/topics.controller")
const { getArticles,getArticlesById,patchArticlesById } = require("./controllers/article.controller")
const { getCommentsById,postCommentsById, deleteCommentById} = require("./controllers/comments.controller")


app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.patch("/api/articles/:article_id", patchArticlesById);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postCommentsById);
app.delete("/api/comments/:comment_id", deleteCommentById);




app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({msg: "Bad request!"});
    } else {
        next(err)
    }
});

app.use((err, req, res, next) => {
    if (err.status === 404) {
        res.status(404).send({ msg: "Not found" });
    } else {
        next(err)
    }
});

app.use((err, req, res, next) => {
    res.status(500).send({ msg: "Internal server error" })
})


module.exports = app;