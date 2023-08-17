const Sequelize=require("sequelize");
const path=require("path");
const fs=require("fs");

const sequelize=new Sequelize('sparrow','postgres','1818',{
  host:'localhost',
  dialect:'postgres'
});

const models={}

const modelsDir = path.join(__dirname, 'models');
fs.readdirSync(modelsDir).forEach(file => {
  const model = require(path.join(modelsDir, file))(sequelize, Sequelize.DataTypes);
  models[model.name] = model;
});

// Association

Object.keys(models).forEach((modelName)=>{
  if(models[modelName].associate)
  {
    models[modelName].associate(models);
  }
})




models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;