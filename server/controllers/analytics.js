const elastic = require('utils/elastic')
const models = require("models");
const helper = require("helpers");

const orderStatus = async (Request, Reply) => {
  try {
    const data = helper.analyticHelper.runOrderStatus();
    Reply(data);
  }
  catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}

const bookSales = async (Request, Reply) => {
  try {
    const data = await helper.analyticHelper.runBookSalesStatus();
    console.log(data);
    const bookids = data.map((item) => item.key);
    const books = await models.books.findAll({
      where: {
        id: bookids
      }, attributes: ['id', 'price', 'stock', 'book_name']
    });
    const combinedData = books.map((book) => {
      const matching = data.find((countItem) => countItem.key === book.id);
      return {
        ...book.get(),
        count: matching ? matching.doc_count : 0,
        amount: matching ? matching.total_amount.value : 0
      };
    });

    Reply(combinedData);
  } catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}

module.exports = { orderStatus, bookSales }