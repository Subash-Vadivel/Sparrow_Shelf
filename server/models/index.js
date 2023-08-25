const Sequelize = require("sequelize");
const path = require("path");
const fs = require("fs");

const sequelize = new Sequelize('sparrow', 'postgres', '1818', {
  host: 'localhost',
  dialect: 'postgres'
});

const models = {}

const modelsDir = path.join(__dirname, '.');
fs.readdirSync(modelsDir).forEach(file => {
  if (file !== "index.js") {
    const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes);
    models[model.name] = model;
  }
});

// Association

Object.keys(models).forEach((modelName) => {
  if (models[modelName].associate) {
    models[modelName].associate(models);
  }
})

const hooksDir = path.join(__dirname, '../hooks');
// Hooks
fs.readdirSync(hooksDir).forEach(file => {
  if (file !== "index.js") {
    require(path.join(hooksDir, file))(models);
  }
});



models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;