const models = require("models")
const { v4: uuid } = require("uuid")
const bcrypt = require("bcrypt")
const redis = require('utils/redisConnection');
const helper = require('helpers');
const login = async (Request, Reply) => {
  try {
    const { email, password } = Request.payload;
    const hasOne = await models.user.findOne({
      where: {
        email: email
      },
      attributes: ['email', 'user_name', 'password', 'id', 'isadmin']
    })
    if (!hasOne) {
      return Reply("failed").code(409);

    }
    const result = await bcrypt.compare(password, hasOne.dataValues.password);
    if (result) {
      const token = uuid();
      const r = await models.session.create({
        user_id: hasOne.id,
        token: token
      })
      await redis.set(token, hasOne.id);
      Request.cookieAuth.set({ user_id: hasOne.id, token: token });
      return Reply(hasOne.dataValues).code(200)

    }
    else
      return Reply("failed").code(409);
  }
  catch (err) {
    console.log(err);
    Reply("Error").code(500);
  }
}

const logout = async (Request, Reply) => {
  try {
    const data = Request.state['ag-47'];

    const result = await models.session.findOne({
      where: {
        user_id: data.user_id,
        token: data.token
      }
    })
    if (result)
      await result.destroy();
    await redis.del(data.token);
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

    const { email, password, user_name } = Request.payload;
    const hashPassword = await bcrypt.hash(password, 8)
    const hasOne = await models.user.findOne({
      where: {
        email
      },
    })
    if (hasOne)
      return Reply("Already Exist").code(400)

    const result = await models.user.create({ email, password: hashPassword, user_name });
    helper.mailHelper.addTaskMail({ email });
    return Reply("Created").code(201);

  }
  catch (err) {
    Reply("Error").code(500);
  }
}


module.exports = { login, signup, logout }
