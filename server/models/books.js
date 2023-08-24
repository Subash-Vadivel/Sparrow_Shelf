// const helper = require("helpers/bookIndexHelper");
module.exports = (sequelize, DataTypes) => {
  const Books = sequelize.define("books", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    index: [{
      fields: ['book_name'],
      name: 'byBook'
    }]
  })

  // Books.afterUpdate((book, options) => {
  //   helper.addUpdateBook({ content: { book_name: book.book_name, stock: book.stock, price: book.price }, id: book.id })
  // });

  // Books.afterDestroy((book, options) => {
  //   helper.addDeleteBook({ id: book.id })

  // });

  // Books.afterCreate(async (book, options) => {
  //   helper.addInsertBook({ book_name: book.book_name, stock: book.stock, price: book.price, id: book.id })
  // });

  Books.associate = models => {

    Books.hasMany(models.cart, {
      foreignKey: {
        name: "book_id"
      }
    })


  };


  return Books;
}