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
      socket.emit("booksSalesResponse", combinedData);


    } catch (err) {
      console.log(err);
      socket.emit("bookSalesResponse", []);
    }

  })

}

async function changesInOrder() {
  const data = await helper.analyticHelper.runOrderStatus();
  socket.emit("orderStatusResponse", data);
}



module.exports = { setSocket, socket, changesInOrder }