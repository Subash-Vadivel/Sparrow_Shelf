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
}
]


module.exports=route