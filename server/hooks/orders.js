const helper = require("helpers");


// models.orders.afterUpdate(async (order, options) => {
//   helper.orderIndexHelper.addUpdateOrder({ content: { status: order.status }, id: order.id })
// });
module.exports = (models) => {

  models.orders.afterDestroy(async (order, options) => {
    helper.orderIndexHelper.addDeleteOrder({ id: order.id })
  });

  models.orders.afterCreate(async (order, options) => {
    helper.orderIndexHelper.addInsertOrder({ book_id: order.book_id, user_id: order.user_id, quantity: order.quantity, amount: order.amount, status: order.status, id: order.id })
  });
}
