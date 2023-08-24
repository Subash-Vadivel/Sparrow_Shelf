const Bull = require('bull');
const elastic = require('utils/elastic')

const updateBook = new Bull('Book_Update');
const deleteBook = new Bull("Book_Delete");
const addBook = new Bull("Book_Add");


const options = {
  attempts: 2,
};


const addUpdateBook = (data) => {
  updateBook.add(data, options)
}
updateBook.process(async (job) => {
  return await elastic.updateBook(job.data.content, job.data.id);

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
  return
})
deleteBook.on('completed', (job) => {
  console.log("Job Completed Book Deleted")
})

const addInsertBook = (data) => {
  addBook.add(data, options);
}
addBook.process(async (job) => {
  return await elastic.insertBook(job.data)
})

addBook.on('completed', (job) => {
  console.log("Added New Book to ES !!!")
})

module.exports = { addDeleteBook, addInsertBook, addUpdateBook }
