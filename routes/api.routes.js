const apiRouter = require("express").Router();
const { getApi } = require("../controllers/api.controller");
const usersRouter = require("./users.routes");
const topicsRouter = require("./topics.routes");
const articleRouter = require("./article.routes");
const commentsRouter = require("./comments.routes");


apiRouter.use("/users", usersRouter);
apiRouter.use("/topics", topicsRouter);
apiRouter.use("/articles", articleRouter);
apiRouter.use("/comments", commentsRouter);

apiRouter.get("/", getApi);

module.exports = apiRouter
