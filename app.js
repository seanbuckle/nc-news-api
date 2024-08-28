const express = require('express')
const app = express();

app.use(express.json())

const { getApi } = require("./controllers/api.controller")
const { getTopics } = require("./controllers/topics.controller")
const { getArticles,getArticlesById } = require("./controllers/article.controller")
const { getCommentsById,postCommentsById } = require("./controllers/comments.controller")


app.get("/api", getApi);
app.get("/api/topics", getTopics);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id", getArticlesById);
app.get("/api/articles/:article_id/comments", getCommentsById);
app.post("/api/articles/:article_id/comments", postCommentsById);



app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send(err)
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
    console.log(err)
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