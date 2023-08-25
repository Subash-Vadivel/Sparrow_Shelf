const { Client } = require('elasticsearch');
const client = new Client({ node: 'http://localhost:9200', apiVersion: '6.8' });
async function runOrderStatus() {
  try {
    const response = await client.search({
      index: 'orders',
      body: {
        size: 0,
        aggs: {
          status: {
            terms: {
              field: 'status.keyword'
            },
            aggs: {
              value: {
                sum: {
                  field: 'amount'
                }
              }
            }
          }
        }
      }
    });

    return (response.aggregations.status.buckets);
  } catch (error) {
    console.error(error);
  }
}
async function runBookSalesStatus() {
  try {
    const response = await client.search({
      index: 'orders',
      body:
      {
        size: 0,
        aggs: {
          top_books: {
            terms: {
              field: "book_id",
              size: 7,
              order: {
                total_amount: "desc"
              }
            },
            aggs: {
              total_amount: {
                sum: {
                  field: "amount"
                }
              }
            }
          }
        }
      }
    })

    return (response.aggregations.top_books.buckets);
  }
  catch (err) {
    console.log(err);
  }
}

module.exports = { runOrderStatus, runBookSalesStatus }
