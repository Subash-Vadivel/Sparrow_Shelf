const elastic = require('utils/elastic')
const helper = require("helpers");
const orderStatus = async (Request, Reply) => {
  try {
    const data = helper.analyticHelper.runOrderStatus();
    Reply(data);
  }
  catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}
module.exports = { orderStatus }