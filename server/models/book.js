const mongoose = require('mongoose')
const schema = mongoose.Schema

const bookSchema = new schema({
    name: String,
    genre: String,
    authorId: String
})

const model = mongoose.model("Books", bookSchema)

module.exports = model