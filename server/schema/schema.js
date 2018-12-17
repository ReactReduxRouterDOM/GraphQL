const graphql = require("graphql")
const lodash = require("lodash")
const Book = require("../models/book")
const Author = require("../models/author")

const { 
    GraphQLObjectType,
    GraphQLString, 
    GraphQLSchema,
    GraphQLID,
    GraphQLInt,
    GraphQLList
} = graphql

// dummy data
const books = [
    {name: 'The intelligence of new', id: "01236", genre:'sci-fi', authorId: "745"},
    {name: 'Color of magic', id: "01566", genre:'fiction', authorId: "745"},
    {name: 'Heroes of ages', id: "01326", genre:'ancient', authorId: "745"},

    {name: 'The incredibles', id: "01548", genre:'fantasy', authorId: "456"},
    {name: 'Steve Jobs', id: "01254", genre:'biography', authorId: "456"},
    {name: 'The incredibles2', id: "01452", genre:'fantasy', authorId: "456"},

    {name: 'Prince of persia', id: "01654", genre:'fantasy', authorId: "125"},
    {name: 'Making foods', id: "04512", genre:'recipies', authorId: "125"},
    {name: 'Our green land', id: "0125", genre:'nature', authorId: "125"},
]

const authors = [
    {name: "Author1", age:23, id: '125',},
    {name: 'Author2', id: '456', age:38 },
    {name: 'Author3', id:'745', age:40},
]

const authorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        age: {type: GraphQLInt},
        book:{
            type: new GraphQLList(bookType),
            resolve: (parent, args) => {
                return lodash.filter(books, {authorId: parent.id})
            }
        }
    })
})

const bookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: {type: GraphQLID},
        name: {type: GraphQLString},
        genre : {type: GraphQLString},
        author:{
            type: authorType,
            resolve: (parent, args) => {
                console.log(parent);
                return lodash.find(authors, {id: parent.authorId})
                
            }}
    }),
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        book:{
            type: bookType,
            description: "Query for retreiving books",
            args: {id: {type: GraphQLID} },
            resolve: (parent, args) => {
                // get data from db or other source....
                return lodash.find(books, {id: args.id})
            }
        },
        author:{
            type: authorType,
            description: "Query for retreiving authors",
            args: {id: {type: GraphQLID}},
            resolve: (parent, args) => {
                // get data from db or other source....
                return lodash.find(authors, {id: args.id})
            }
        },

        books:{
            type: new GraphQLList(bookType),
            resolve: (parent, args) => {
                return books
            }
        },
        authors:{
            type: new GraphQLList(authorType),
            resolve: (parent, args) => {
                return authors
            }
        }
    }}
)

const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        addAuthor: {
            type: authorType,
            args: {
                name: {type: GraphQLString},
                age: {type: GraphQLInt}
            },
            resolve: (parent, args) => {
                const name = args.name
                const age = args.age

                let author = new Author({
                    name,
                    age
                })

                return author.save()
            }
        },

        addBook: {
            type: bookType,
            args: {
                name: {type: GraphQLString},
                genre: {type: GraphQLString},
                authorId: {type: GraphQLString}
            },
            resolve: (parent, args) => {
                const name = args.name
                const genre = args.genre
                const authorId = args.authorId

                let book = new Book({
                    name,
                    genre,
                    authorId
                })

                return book.save()
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
})