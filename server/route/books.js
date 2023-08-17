const handler=require("controllers")


const route=[{
  method:"GET",
  path:"/books",
  config:{
    handler:handler.books.allBooks
  }
},
{
  method:"GET",
  path:"/books/{id}",
  config:{
    handler:handler.books.bookByID
  }
},
{
  method:"GET",
  path:"/books/page/{page}",
  config:{
    handler:handler.books.bookByParams
  }
}
]


module.exports=route