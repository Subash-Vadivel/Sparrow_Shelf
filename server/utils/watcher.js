const { Client } = require('elasticsearch');
const client = new Client({ node: 'http://localhost:9200', apiVersion: '6.8' });

async function setupWatcher() {
  try {
    const watchId = 'order_watcher'; // Choose a unique name for your watcher

    const response = await client.watcher.putWatch({
      id: watchId,
      body: {
        trigger: {
          schedule: {
            interval: '5s' // Adjust the interval as needed
          }
        },
        input: {
          search: {
            request: {
              indices: ['orders'], // Replace with your actual index name
              body: {
                query: {
                  // Define your query to match specific conditions
                }
              }
            }
          }
        },
        condition: {
          script: {
            source: "ctx.payload.hits.total > 0"
          }
        },
        actions: {
          notify_order_change: {
            webhook: {
              method: 'POST',
              url: 'http://localhost:8080/analytics/orderstatus', // Replace with your actual webhook URL
              body: "An order change was detected"
            }
          }
        }
      }
    });

    console.log('Watcher response:', response);
  }
  catch (err) {
    console.log(err);
  }
}

setupWatcher();