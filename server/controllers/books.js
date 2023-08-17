const models = require("sequelizer");
const redis=require('redisConnection');

const allBooks = async (Request, Reply) => {
  try {
    const book = Request.query.book;
    if (book) {

      const books = await models.books.findAll({
        where: {
          book_name: { [models.Sequelize.Op.like]: `${book}%` }
        }, attributes: ['id', 'price', 'stock', 'book_name']
      });
      Reply(books);
    }
    else {

      const books = await models.books.findAll({ attributes: ['id', 'price', 'stock', 'book_name'] });
      Reply(books);
    }

  }
  catch (err) {
    Reply("Server Error").code(500);
  }
}

const bookByID = async (Request, Reply) => {
  try {
    const id =parseInt( Request.params.id);
    console.log(id);
    const result = await models.books.findOne({
      where: {
        id: id
      }
    });
    Reply(result).code(200);
  }
  catch (err) {
    console.log(err)
    Reply("Server Error").code(500);
  }
}

const bookByParams=async(Request,Reply)=>{
  try
  {
       const page= parseInt(Request.params.page);
       console.log(page);
       const cacheValue=await redis.get(`page#${page}`);
       if(cacheValue)
       {
        
       }
       const result =await models.books.findAll({
        where:{
          id:{[models.Sequelize.Op.between]:[page*12+1,(page*12)+12]}
        }, attributes: ['id', 'price', 'stock', 'book_name']
       })
      //  console.log(result);

       Reply(result).code(200);
  }
  catch(err)
  {
    console.log(err);
    Reply("Internal Error").code(500);
  }

}

module.exports = { allBooks, bookByID ,bookByParams}