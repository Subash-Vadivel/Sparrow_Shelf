const helper = require("helpers");

module.exports = (sequelize, DataTypes) => {
  const Orders = sequelize.define("orders", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Processing"
    }
  }, {
    index: [{
      fields: ['user_id'],
      name: 'byUserId'
    }, {
      fields: ['book_id'],
      name: 'byBookId'
    }]
  })

  // Orders.afterUpdate(async (order, options) => {
  //   helper.orderIndexHelper.addUpdateOrder({ content: { status: order.status }, id: order.id })
  // });

  Orders.afterDestroy(async (order, options) => {
    helper.orderIndexHelper.addDeleteOrder({ id: order.id })

  });

  Orders.afterCreate(async (order, options) => {
    helper.orderIndexHelper.addInsertOrder({ book_id: order.book_id, user_id: order.user_id, quantity: order.quantity, amount: order.amount, status: order.status, id: order.id })
  });

  Orders.associate = (models) => {


    Orders.belongsTo(models.user, {
      foreignKey: {
        name: "user_id"
      }
    });



  }



  return Orders;
}