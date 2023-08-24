const Bull = require('bull');
const elastic = require('utils/elastic')

const updateOrder = new Bull('Order_Update');
const deleteOrder = new Bull("Order_Delete");
const addOrder = new Bull("Order_Add");


const options = {
  attempts: 2,
};


const addUpdateOrder = (data) => {
  updateOrder.add(data, options)
}
updateOrder.process(async (job) => {
  return await elastic.updateOrder(job.data.content, job.data.id);

})
updateOrder.on('completed', (job) => {
  console.log("Job Completed Updated Order");
})


const addDeleteOrder = (data) => {
  deleteOrder.add(data, options);
}
deleteOrder.process(async (job) => {

  return await elastic.deleteOrder(job.data.id)

})
deleteOrder.on('completed', (job) => {
  console.log("Job Completed Order Deleted")
})

const addInsertOrder = (data) => {
  addOrder.add(data, options);
}
addOrder.process(async (job) => {
  return await elastic.insertOrder(job.data)
})

addOrder.on('completed', (job) => {
  console.log("Added New Order to ES !!!")
})

module.exports = { addDeleteOrder, addInsertOrder, addUpdateOrder }
