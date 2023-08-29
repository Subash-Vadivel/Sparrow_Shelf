const helper = require("helpers");
const models = require("models");
let socket;
function setSocket(newSocket) {
  socket = newSocket;
  //On
  socket.on("orderStatus", async () => {
    const data = await helper.analyticHelper.runOrderStatus();
    socket.emit("orderStatusResponse", data);
  });

  socket.on("bookSales", async () => {
    try {
      const data = await bookData();
      socket.emit("booksSalesResponse", data);


    } catch (err) {
      console.log(err);
      socket.emit("bookSalesResponse", []);
    }

  })

}

async function changesInOrder() {
  console.log("Changes in Orders !!!")
  const data = await helper.analyticHelper.runOrderStatus();
  console.log(data);
  socket.emit("orderStatusResponse", data);
  return;
}
async function changesInBooks() {
  console.log("Changes in Books !!!");

  const data = await bookData();
  socket.emit("booksSalesResponse", data);
  return;
}



const bookData = async () => {
  const data = await helper.analyticHelper.runBookSalesStatus();
  console.log(data);
  const bookids = data.map((item) => item.key);
  const books = await models.books.findAll({
    where: {
      id: bookids
    }, attributes: ['id', 'price', 'stock', 'book_name']
  });
  const combinedData = books.map((book) => {
    const matching = data.find((countItem) => countItem.key === book.id);
    return {
      ...book.get(),
      count: matching ? matching.doc_count : 0,
      amount: matching ? matching.total_amount.value : 0
    };
  });
  return combinedData;
}





module.exports = { setSocket, socket, changesInOrder, changesInBooks }