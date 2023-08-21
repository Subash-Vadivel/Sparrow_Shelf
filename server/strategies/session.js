const models = require("models/sequelizer");
exports.strategy =
{
  scheme: (server, option) => {
    return {
      authenticate: async (request, reply) => {
        const token = request.cookieAuth;
        console.log(token);
        const result = true;
        // await models.session.findAll({where:{
        //   token:token
        // }});
        if (result) {
          return reply.continue({ credentials: { token } });
        } else {
          return reply("Invalid token").code(401);
        }
      }
    }
  }

};

