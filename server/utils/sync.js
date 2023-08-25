const models = require('../models');
const { Client } = require('elasticsearch');
const client = new Client({ node: 'http://localhost:9200', apiVersion: '6.8' });


async function insertDocument(data) {
  try {
    await client.index({
      index: 'books',
      id: data.id,
      type: '_doc',
      body: {
        book_name: data.book_name,
        stock: data.stock,
        price: data.price
      },
    });
    console.log("Added Book ID : " + data.id);

  } catch (error) {
    console.error(error);
  }
}

const loadBooks = async () => {
  return new Promise(async (reject, resolve) => {
    try {
      const data = await models.books.findAll({});
      data.map(async (item) => {
        insertDocument(item.dataValues);
        await new Promise((resolve) => setTimeout(resolve, 500))
      })
      resolve();
    }
    catch (err) {
      console.log(err);
      reject();
    }
  })

}
loadBooks()