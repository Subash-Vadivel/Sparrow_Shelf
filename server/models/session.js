
module.exports = (sequelize, DataTypes) => {
  const Session = sequelize.define("session", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    token: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    index: [{
      fields: ['user_id'],
      name: "byUserId"
    }]
  })

  Session.associate = (models) => {

    Session.belongsTo(models.user, {
      foreignKey: {
        name: "user_id"
      }
    })
  }

  return Session;
}