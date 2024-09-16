const express = require('express')
const app = express();
const cors = require('cors');

app.use(express.json())

app.use(cors());

const apiRouter = require("./routes/api.routes")



app.use("/api", apiRouter);



app.use((err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ msg: err.msg })
    } else {
        next(err)
    }
})

app.use((err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ msg: "Bad request!" });
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