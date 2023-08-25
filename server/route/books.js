const handler = require("controllers")
const Joi = require("joi")

const route = [{
  method: "GET",
  path: "/books",
  config: {
    handler: handler.books.allBooks
  }
},
{
  method: "GET",
  path: "/books/{id}",
  config: {
    handler: handler.books.bookByID,
    validate: {
      params: {
        id: Joi.number().required()
      }
    }
  }
},
{
  method: "GET",
  path: "/books/admin/",
  config: {
    handler: handler.books.bookByAdmin
  }
},
{
  method: "POST",
  path: "/books/all",
  config: {
    handler: handler.books.deleteBookById,
    validate: {
      payload: {
        ids: Joi.array().required()
      }
    }
  }
},
{
  method: "PUT",
  path: "/updatebook/{id}",
  config: {
    handler: handler.books.updateBook,
    validate: {
      params: {
        id: Joi.number().required()
      }
    }
  }
},
{
  method: "POST",
  path: "/books/add",
  config: {
    handler: handler.books.addBook
  }
}
]


module.exports = route