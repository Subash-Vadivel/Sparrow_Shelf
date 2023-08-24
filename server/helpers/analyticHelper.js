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

module.exports = { runOrderStatus }
