const models = require("models/sequelizer");
const placeOrder = async (Request, Reply) => {
  const t = await models.sequelize.transaction();
  try {

    //saveponit a
    const { book_id, user_id, amount, quantity } = Request.payload;
    const Result = await models.orders.create({
      book_id, user_id, amount, quantity
    }, { transaction: t })

    const Result1 = await models.books.findOne({
      where: {
        id: book_id
      },
      transaction: t
    });


    const newStock = Result1.stock - quantity;


    await Result1.update({ stock: newStock }, { transaction: t });


    //commit
    await t.commit();
    Reply({ Status: true }).code(200);
  }
  catch (err) {
    //roll back
    await t.rollback();
    console.log(err);
    Reply("Error").code(500);
  }

}

const orderByUID = async (Request, Reply) => {
  try {
    const id = Request.params.id;
    const result = await models.user.findAll({
      where: {
        id: id
      },
      include: [{
        model: models.orders
      }]

    })
    console.log(result);
    Reply(result[0].orders);

  }
  catch (err) {
    console.log(err);
    Reply("Error").code(500);
  }
}

const cancelOrderById = async (Request, Reply) => {
  var t = await models.sequelize.transaction();
  try {
    console.log("Hitting")
    const id = Request.params.id;
    console.log(id);
    const result = await models.orders.findOne({
      where: {
        id: id
      },
      transaction: t
    })
    if (result) {
      const result1 = await models.books.findOne({
        where: {
          id: result.book_id
        },
        transaction: t
      })
      await result1.increment('stock', { by: result.quantity, transaction: t });
      await result.destroy({ transaction: t });
      t.commit();

      return Reply({ status: true }).code(200);
    }
    Reply({ status: false }).code(200);

  }
  catch (err) {
    t.rollback();
    console.log(err);
    Reply("Error").code(500);
  }
}

const allOrders = async (Request, Reply) => {
  try {
    const result = await models.orders.findAll({});
    Reply(result).code(200);

  }
  catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}

const updateOrder = async (Request, Reply) => {
  try {
    const data = Request.payload.data;
    const id = Request.params.id;
    const result = await models.orders.update(data, {
      where: {
        id: id
      }
    });
    Reply("ok").code(200);

  }
  catch (err) {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}

module.exports = { placeOrder, orderByUID, cancelOrderById, allOrders, updateOrder }