const models=require("sequelizer");
const placeOrder=async(Request,Reply)=>{
  const t = await models.sequelize.transaction();
  try
  {

    //saveponit a
    const {book_id,user_id,amount,quantity}=Request.payload;
     const Result=await models.orders.create({
      book_id,user_id,amount,quantity
     },{transaction:t})

     const Result1=await models.books.findOne({where:{
      id:book_id
     },
    transaction:t});

    
    const newStock=Result1.stock-quantity;


    await Result1.update({ stock: newStock }, { transaction: t });


    //commit
    await t.commit();
    Reply({Status:true}).code(200);
  }
  catch(err)
  {
    //roll back
    await t.rollback();
    console.log(err);
    Reply("Error").code(500);
  }

}

const orderByUID=async(Request,Reply)=>{
  try
  {
    const id=Request.params.id;
    const result=await models.user.findAll({
      where:{
        id:id
      },
      include:[{
        model:models.orders
      }]

    }) 
    Reply(result[0].orders);
     
  }
  catch(err)
  {
    console.log(err);
    Reply("Error").code(500);
  }
}

const cancelOrderById=async(Request,Reply)=>{
  var t=await models.sequelize.transaction();
  try
  {
    console.log("Hitting")
     const id=Request.params.id;
     console.log(id);
     const result=await models.orders.findOne({where:{
      id:id
     },
    transaction:t})
     if(result)
     {
     const result1=await models.books.findOne({where:{
      id:result.book_id
     },
    transaction:t})
     await result1.increment('stock',{by:result.quantity,transaction:t});
     await result.destroy({transaction:t});
     t.commit();

     return Reply({status:true}).code(200);
    }
    Reply({status:false}).code(200);
    
  }
  catch(err)
  {
    t.rollback();
    console.log(err);
    Reply("Error").code(500);
  }
}

module.exports={placeOrder,orderByUID,cancelOrderById}