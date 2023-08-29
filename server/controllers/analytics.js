const models = require("models");
const helper = require("helpers");
const websocket = require("utils/websocket");
const orderStatus = async (Request, Reply) => {
  try {
    console.log("Reload Orders");
    websocket.changesInOrder();
    Reply("done");
  }
  catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}
const bookSales = async (Request, Reply) => {
  try {
    console.log("Reload Books")
    websocket.changesInBooks();
    Reply("ok");
  } catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}
module.exports = { orderStatus, bookSales }