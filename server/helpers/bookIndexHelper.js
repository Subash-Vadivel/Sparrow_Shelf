const Bull = require('bull');
const elastic = require('utils/elastic')

const updateBook = new Bull('Book_Update');
const deleteBook = new Bull("Book_Delete");
const addBook = new Bull("Book_Add");

const axios = require("axios");

const updateDashBoard = async () => {
  try {
    await axios.get("http://localhost:8080/analytics/salesstatus");
  }
  catch (err) {
    console.log(err);
  }
}


const options = {
  attempts: 2,
};


const addUpdateBook = (data) => {
  updateBook.add(data, options)
}
updateBook.process(async (job) => {
  await elastic.updateBook(job.data.content, job.data.id);

  return await updateDashBoard()

})
updateBook.on('completed', (job) => {
  console.log("Job Completed Updated Book");
})


const addDeleteBook = (data) => {
  deleteBook.add(data, options);
}
deleteBook.process(async (job) => {
  job.data.id.map(async (id) => {
    await elastic.deleteBook(id)
  })

  return await updateDashBoard()
})
deleteBook.on('completed', (job) => {
  console.log("Job Completed Book Deleted")
})

const addInsertBook = (data) => {
  addBook.add(data, options);
}
addBook.process(async (job) => {

  await elastic.insertBook(job.data)
  return await updateDashBoard()
})

addBook.on('completed', (job) => {
  console.log("Added New Book to ES !!!")
})

module.exports = { addDeleteBook, addInsertBook, addUpdateBook }
