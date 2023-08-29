const axios = require('axios');

async function setupWatcher() {
  try {
    const watchId = 'order_watcher'; // Choose a unique name for your watcher

    const response = await axios.put(`http://localhost:9200/_watcher/watch/${watchId}`, {
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
    });

    console.log('Watcher response:', response.data);
  }
  catch (err) {
    console.error('Error setting up watcher:', err.response.data);
  }
}

setupWatcher();
