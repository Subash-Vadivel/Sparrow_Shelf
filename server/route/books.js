const handler = require("controllers")


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
    handler: handler.books.bookByID
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
    handler: handler.books.deleteBookById
  }
},
{
  method: "PUT",
  path: "/updatebook/{id}",
  config: {
    handler: handler.books.updateBook
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