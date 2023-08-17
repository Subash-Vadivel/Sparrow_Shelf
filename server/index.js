require('app-module-path').addPath('./server/');

const Hapi = require("hapi")
const route = require("route")
const models = require("sequelizer");
const configStrategy = require("configStrategy");
const redis=require('redisConnection');




async function syncModels() {
  try {
    await models.sequelize.sync();
    console.log("------------------------------------------------------------------")
  }
  catch (err) {
    console.log(err);
  }
}

syncModels();


async function registerRoute() {

  try {
    const server = new Hapi.Server();
    server.connection({
      port: 8080,
      routes: {
        cors: {
          origin: ["*"],
          credentials: true
        },

      },
    })
    server.ext('onPreHandler',(Request,Reply)=>{
      console.log("-------------------------- On Request ----------------------------")
      console.log(" Path : "+Request.path);
      return Reply.continue();

    })

    server.ext('onPostHandler',(Request,Reply)=>{
      console.log("-------------------------- Request Completed ----------------------");
      return Reply.continue();
    })
    
    await server.register([require('hapi-auth-cookie'),require('inert'),require('vision')])


    configStrategy(server);
   

    const flatRoutes = [];
    for (const key in route) {
      if (route[key].length > 0) {
        const routes = route[key];
        flatRoutes.push(...routes);
      }
    }
    server.route(flatRoutes)


    server.views({
      engines: {
        ejs: require('ejs')
      },
      relativeTo: __dirname,
      path: 'views'
    });


    server.start((err) => {
      if (err)
        return console.log("Server Failed to Start");
      console.log("Server started at " + server.info.uri);

    })

  } catch (err) {
    console.log("------------------------------------------------------------------")

    console.log(err);

    console.log("------------------------------------------------------------------")

  }
}

registerRoute();
