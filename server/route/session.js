const handler=require("controllers")
const Joi=require("joi")


const route=[{
  method:"POST",
  path:"/login",
  config:{
    handler:handler.session.login,
      validate:{
        payload:Joi.object({
          email:Joi.string().email().required(),
          password:Joi.string().min(8).max(25).required()
        })
      }
  }},
  {
    method:"POST",
    path:"/signup",
    config:{
      handler:handler.session.signup,
      validate:{
        payload:Joi.object({
          email:Joi.string().email().required(),
          password:Joi.string().min(8).max(25).required()
        })
      }
    }
},{
  method:"POST",
  path:"/logout",
  config:{
    handler:handler.session.logout
  }
}]

module.exports=route