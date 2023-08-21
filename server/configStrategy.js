const strategy = require("strategies")
const models = require("sequelizer");
const redis = require('redisConnection');

module.exports = (server) => {
  //   server.auth.scheme('sessionScheme', strategy.session.strategy.scheme);
  //  server.auth.strategy('session','sessionScheme');

  server.auth.strategy('session', 'cookie', 'try', {
    password: 'password-should-be-32-characters',
    cookie: 'ag-47',
    redirectTo: false,
    isSecure: false,
    validateFunc: async function (Request, session, callback) {
      try {
        const user = await redis.get(session.token)
        if (user == session.user_id) {
          return callback(null, true);
        }

        const result = await models.session.findOne({
          where: {
            user_id: session.user_id,
            token: session.token
          }
        });
        redis.set(session.token, session.user_id)

        if (result) {
          return callback(null, true, result);
        }
        else {
          return callback(null, false);
        }
      }
      catch (err) {
        return callback(err, false);
      }
    }
  });








}