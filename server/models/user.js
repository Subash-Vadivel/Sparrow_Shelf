
module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define("user", {
    user_name: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    isadmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    index: [{
      name: "email_index",
      fields: ['email']
    }]
  });

  User.associate = models => {
    User.hasMany(models.orders, {
      foreignKey: {
        name: "user_id",
      }
    });

    User.hasMany(models.session, {
      foreignKey: {
        name: "user_id"
      }
    })

    User.hasMany(models.cart, {
      foreignKey: {
        name: "user_id"
      }
    })

  };
  return User;
}