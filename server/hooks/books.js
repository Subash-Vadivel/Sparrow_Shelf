const helper = require("helpers");

module.exports = (models) => {
  models.books.afterUpdate((book, options) => {
    helper.bookIndexHelper.addUpdateBook({ content: { book_name: book.book_name, stock: book.stock, price: book.price }, id: book.id })
  });

  models.books.afterDestroy((book, options) => {
    helper.bookIndexHelper.addDeleteBook({ id: book.id })

  });

  models.books.afterCreate(async (book, options) => {
    helper.bookIndexHelper.addInsertBook({ book_name: book.book_name, stock: book.stock, price: book.price, id: book.id })
  });
}
