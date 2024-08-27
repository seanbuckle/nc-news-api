const {readFile} = require("fs/promises")

exports.selectApi = () => {
    return readFile("./endpoints.json", "utf-8").then((api) => {
        return JSON.parse(api)
    })
}