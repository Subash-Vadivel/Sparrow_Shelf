
module.exports=(sequelize,DataTypes)=>{
  const Books=sequelize.define("books",{
    id:{
      type:DataTypes.INTEGER,
      primaryKey:true,
      autoIncrement:true
    },
    book_name:{
      type:DataTypes.STRING,
      allowNull:false
    },
    stock:{
      type:DataTypes.INTEGER,
      allowNull:false
    },
    price:{
      type:DataTypes.INTEGER,
      allowNull:false
    }
  },{
    index:[{
     fields:['book_name'],
     name:'byBook'
    }]
  })

  Books.associate = models => {
    
Books.hasMany(models.cart,{foreignKey:{
  name:"book_id"
}})

  
  };


  return Books;
}