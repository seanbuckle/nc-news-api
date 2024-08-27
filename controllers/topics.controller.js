const {selectTopics} = require("../models/topics.model")

exports.getTopics = (req,res) => {
    selectTopics().then((data) => {
        res.status(200).send(data)
    })
    
}