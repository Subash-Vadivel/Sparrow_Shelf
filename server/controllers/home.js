const Path=require("path");
const getApp=(Request,Reply)=>{
  try
  {
    Reply.view('index');
  }
  catch(err)
  {
    console.log(err);
    Reply("Internal Error").code(500);
  }
}


module.exports={getApp}