const models = require("sequelizer")
const {v4 :uuid}=require("uuid")
const bcrypt=require("bcrypt")

const login = async(Request, Reply) => {
  try {
    const {email,password}=Request.payload;
    const hasOne = await models.user.findOne({
      where: {
        email: email
      },
      attributes:['email','user_name','password','id']
    })
    const result=await bcrypt.compare(password,hasOne.dataValues.password);
    if(result) {
      const token=uuid();
      const r=await models.session.create({
        user_id:hasOne.id,
        token:token
      })
      
      Request.cookieAuth.set({ user_id: hasOne.id,token:token });
      return Reply(hasOne.dataValues).code(200)

    }
    else
      return Reply("Invalid Credentials").code(409);
  }
  catch (err) {
    console.log(err);
    Reply("Error").code(500);
  }
}

const logout = async(Request, Reply) => {
  try {
    const data=Request.state['ag-47'];
    const r=await models.session.findOne({where:{
      user_id:data.user_id,
      token:data.token
    }})
    if(r)
       await r.destroy();

    Request.cookieAuth.clear();
    

    Reply("Logged out")
  }
  catch (err) {
    console.log(err);
    Reply("Error").code(500);
  }
}

const signup = async (Request, Reply) => {
  try {

    const {email,password}=Request.payload;
    const hashPassword=await bcrypt.hash(password,8)
    const hasOne = await models.user.findOne({
      where: {
        email
      },
      

    })
    if (hasOne)
      return Reply("Already Exist").code(400)
    const result = await models.user.create({email,password:hashPassword});
    return Reply("Created").code(201);

  }
  catch (err) {
    Reply("Error").code(500);
  }
}


module.exports = { login, signup, logout }
