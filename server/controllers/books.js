const models = require("sequelizer");
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

  }
  catch(err)
  {
    
  }

}

module.exports = { allBooks, bookByID }