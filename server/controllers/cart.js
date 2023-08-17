const models=require("sequelizer")
const showCart=async(Request,Reply)=>{
  try
  {
      const uid=Request.params.uid;
     const result=await models.user.findOne({
      where:{
        id:uid,
    
      },
      include:[{
        model:models.cart,
        include:[{model:models.books}]
      }]
     });
     Reply(result).code(200);
  }
  catch(err)
  {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}
const addToCart=async(Request,Reply)=>{
  try{
    console.log(Request.payload.item);
    const {uid,item}=Request.payload;
    const result=await models.cart.findOne({where:{
          user_id:uid,
          book_id:item.book_id
    }})
    if(result)
       return Reply({status:false});
    await models.cart.create(item);
    Reply({status:true}).code(200);

  }catch(err)
  {

    // console.log(err);
    Reply("Internal Error").code(500);
  }
}

const removeFromCart=async(Request,Reply)=>{
  try{
    const cid=Request.params.cid;
    const result=await models.cart.findOne({
      id:cid
    })
    console.log(result);
    await result.destroy();
    Reply("ok").code(200)

  }
  catch(err)
  {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}
module.exports={showCart,addToCart,removeFromCart};