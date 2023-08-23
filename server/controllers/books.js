const models = require("models");
const elastic = require('utils/elastic')
const allBooks = async (Request, Reply) => {
  try {
    const book = Request.query.book;
    console.log(book);
    if (book) {
      const bookids = await elastic.searchBook(book);
      const books = await models.books.findAll({
        where: {
          id: bookids
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
    const id = parseInt(Request.params.id);
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

const bookByParams = async (Request, Reply) => {
  try {
    const page = parseInt(Request.params.page);
    const result = await models.books.findAll({
      where: {
        id: { [models.Sequelize.Op.between]: [page * 12 + 1, (page * 12) + 12] }
      }, attributes: ['id', 'price', 'stock', 'book_name']
    })
    //  console.log(result);

    Reply(result).code(200);
  }
  catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }

}

const deleteBookById = async (Request, Reply) => {
  try {
    console.log(Request.payload);
    const { ids } = Request.payload;
    if (!ids || !Array.isArray(ids)) {
      return Reply('Invalid IDs').code(400);
    }
    await models.books.destroy({
      where: {
        id: ids
      }
    });
    Reply("Done").code(200);
  }
  catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }

}

const updateBook = async (Request, Reply) => {
  try {
    const id = Request.params.id;
    const { data } = Request.payload;
    console.log(data);
    await models.books.update(data, {
      where: {
        id: id
      }
    });
    // await elastic.updateBook(data,id);
    Reply("ok").code(200)
  }
  catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}

const addBook = async (Request, Reply) => {
  try {
    const data = Request.payload;
    console.log(data);
    await models.books.create(data);
    Reply("ok").code(201);
  }
  catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}

module.exports = { allBooks, bookByID, bookByParams, deleteBookById, updateBook, addBook }