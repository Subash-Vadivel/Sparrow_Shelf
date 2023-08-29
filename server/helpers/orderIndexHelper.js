const Bull = require('bull');
const elastic = require('utils/elastic')

const updateOrder = new Bull('Order_Update');
const deleteOrder = new Bull("Order_Delete");
const addOrder = new Bull("Order_Add");
const axios = require("axios");


const updateDashBoard = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      await axios.get("http://localhost:8080/analytics/orderstatus");
      resolve();
    }
    catch (err) {
      console.log(err);
      reject();
    }
  })
}

const options = {
  attempts: 2,
};


const addUpdateOrder = (data) => {
  updateOrder.add(data, options)
}
updateOrder.process(async (job) => {
  await elastic.updateOrder(job.data.content, job.data.id);
  await updateDashBoard();
  return;

})
updateOrder.on('completed', (job) => {
  console.log("Job Completed Updated Order");

})


const addDeleteOrder = (data) => {
  deleteOrder.add(data, options);
}
deleteOrder.process(async (job) => {

  await elastic.deleteOrder(job.data.id)
  await updateDashBoard();
  return


})
deleteOrder.on('completed', (job) => {
  console.log("Job Completed Order Deleted")

})

const addInsertOrder = (data) => {
  addOrder.add(data, options);
}
addOrder.process(async (job) => {
  await elastic.insertOrder(job.data)
  await updateDashBoard();
  return;
})

addOrder.on('completed', async (job) => {
  console.log("Added New Order to ES !!!")

})

module.exports = { addDeleteOrder, addInsertOrder, addUpdateOrder }
