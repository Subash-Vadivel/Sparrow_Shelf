
module.exports = (sequelize, DataTypes) => {
  const Cart = sequelize.define('cart', {
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
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    index: [{
      field: ['user_id'],
      name: 'byUser'
    }]
  });
  Cart.associate = models => {
    Cart.belongsTo(models.books, {
      foreignKey: {
        name: "book_id"
      }
    })
  }
  return Cart;
}