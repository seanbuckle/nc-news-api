const {selectApi} = require("../models/api.model")

exports.getApi = (req, res, next) => {
    selectApi().then((api) => {
        res.status(200).send(api)
    }).catch(next)
}