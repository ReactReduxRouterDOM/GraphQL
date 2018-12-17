// initial requirements for app
const express = require('express')
const graphqlHTTP = require('express-graphql')
const schema = require("./schema/schema")
const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/gpql", {useNewUrlParser: true})
mongoose.connection.once("open", () => console.log("Connected to mongoDB"))

const app = express()
const port = process.env.PORT || 4000

app.use('/backend', graphqlHTTP({
    schema,
    graphiql: true,
}))

app.listen(port, () => {
    console.log(`Connected to localhost:${port}`)
})