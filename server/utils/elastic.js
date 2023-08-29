const { resolve, reject } = require('bluebird');
const { Client } = require('elasticsearch');
const client = new Client({ node: 'http://localhost:9200', apiVersion: '6.8' });
console.log("---------------------------------------------")
// Create an index
async function createIndexBook() {
  try {
    await client.indices.create({
      index: 'books',
      body: {
        mappings: {
          doc: {
            properties: {
              book_name: { type: 'text' },
              stock: { type: 'integer' },
              price: { type: 'float' }
            }
          }
        },
      },
    });

    console.log("Created New Index");
  } catch (error) {
    console.error(error);
  }
}

async function createIndexOrder() {
  try {
    await client.indices.create({
      index: 'orders',
      body: {
        mappings: {
          doc: {
            properties: {
              book_id: { type: 'integer' },
              user_id: { type: 'integer' },
              amount: { type: 'float' },
              quantity: { type: 'integer' },
              status: { type: 'keyword' }
            }
          }
        },
      },
    });

    console.log("Created New Index Order");
  } catch (error) {
    console.error(error);
  }
}



// Delete a document
async function deleteDocument() {
  try {
    const { body } = await client.delete({
      index: 'books',
      id: '1',
      type: '_doc',
    });

    console.log(body);
  } catch (error) {
    console.error(error);
  }
}



// createIndexBook()
// insertDocument()
// updateDocument();
// deleteDocument();

// Update a document

async function insertBook(data) {
  return new Promise(async (resolve, reject) => {
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
  })

}

async function deleteBook(id) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.delete({
        index: 'books',
        type: '_doc',
        id: id
      });
      resolve()
    }
    catch (err) {
      console.log(err);
      reject()
    }
  })


}

async function updateBook(data, id) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.update({
        index: 'books',
        type: '_doc',
        id: id,
        body: {
          doc: data,
          doc_as_upsert: true
        },
      });
      console.log("Updated Book : " + id);
    } catch (error) {
      console.error(error);
    }

  })

}

async function searchBook(searchString, page) {
  try {
    const response = await client.search({
      index: 'books',
      body: {

        from: page * 12,
        size: 12,
        query: {
          match_phrase: {
            book_name: searchString
          }
        }
      }
    });
    const data = response.hits.hits.map((item) => {
      return item._id
    })
    return data;
  }
  catch (err) {
    console.log(err);
  }
}
async function searchAllBook(page) {
  try {
    const response = await client.search({
      index: 'books',
      body: {
        from: page * 12,
        size: 12
      }
    });
    const data = response.hits.hits.map((item) => {
      return item._id
    })
    return data;
  }
  catch (err) {
    console.log(err);
  }
}
async function insertOrder(data) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.index({
        index: 'orders',
        id: data.id,
        type: '_doc',
        body: {
          book_id: data.book_id,
          user_id: data.user_id,
          amount: data.amount,
          quantity: data.quantity,
          status: data.status
        },
      });
      console.log("Added Order ID : " + data.id);
      resolve();

    } catch (error) {
      console.error(error);
      reject();
    }
  })

}
async function updateOrder(data, id) {
  return new Promise(async (resolve, reject) => {
    try {
      await client.update({
        index: 'orders',
        type: '_doc',
        id: id,
        body: {
          doc: data,
          doc_as_upsert: true
        },
      });
      console.log("Updated Order : " + id);
      resolve();

    } catch (error) {
      console.error(error);
      reject();
    }
  })

}
async function deleteOrder(id) {
  return new Promise(async (resolve, reject) => {

    try {
      await client.delete({
        index: 'orders',
        type: '_doc',
        id: id
      });
      resolve();

    }
    catch (err) {
      console.log(err);
      reject();
    }
  })

}
const elastic = { client, insertBook, searchBook, searchAllBook, deleteBook, updateBook, insertOrder, updateOrder, deleteOrder }
module.exports = elastic