const { Client } = require('elasticsearch');
const client = new Client({ node: 'http://localhost:9200',apiVersion:'6.8' });

console.log("---------------------------------------------")
// Create an index
async function createIndex() {
  try {
     await client.indices.create({
      index: 'books',
      body: {
        mappings: {
          doc:{
            properties: {
              book_name: { type: 'text' },
              stock: { type: 'integer' },
              price: { type: 'float' }
            }}
        },
      },
    });

    console.log("Created New Index");
  } catch (error) {
    console.error(error);
  }
}

// Insert a document
async function insertDocument() {
  try {
    const { body } = await client.index({
      index: 'books',
      id: '1',
      type: '_doc', 
      body: {
        book_name: "subash",
        stock: 20,
        price: 35.6
      },
    });

    console.log(body);
  } catch (error) {
    console.error(error);
  }
}

// Update a document
async function updateBook(data,id) {
  try {
    await client.update({
      index: 'books',
      type:'_doc',
      id: id,
      body: {
        doc: data,
        doc_as_upsert:true
      },
    });
    console.log("Updated Book : "+id);
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

// createIndex()
// insertDocument()
// updateDocument();
// deleteDocument();

async function searchBook(searchString){
  try{
    const response = await client.search({
      index: 'books',
      body: {
        query: {
          match_phrase: {
            book_name: searchString
          }
        }
      }
    });
    const data=response.hits.hits.map((item)=>{
      return {id:+item._id,book_name:item._source.book_name,stock:item._source.stock,price:item._source.price}
    })
    return data;
  }
  catch(err){
    console.log(err);
  }
}


const elastic={searchBook,client,updateBook}
module.exports=elastic