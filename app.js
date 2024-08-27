const express = require('express')
const app = express();

const { getApi } = require("./controllers/api.controller")
const { getTopics } = require("./controllers/topics.controller")



app.get("/api", getApi);
app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send(err)
    } else {
        next(err)
    }
})

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