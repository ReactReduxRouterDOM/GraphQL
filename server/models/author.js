const mongoose = require('mongoose')
const schema = mongoose.Schema

const authorSchema = new schema({
    name: String,
    age: Number
})

const model = mongoose.model("Authors", authorSchema)

module.exports = model