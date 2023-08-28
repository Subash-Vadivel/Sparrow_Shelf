require('app-module-path').addPath('./server/');
const Hapi = require("hapi")
const route = require("route")
const models = require("models");
const SocketIO = require('socket.io');
const websocket = require("utils/websocket")
const configStrategy = require("utils/configStrategy");
const watcher = require("utils/watcher");
// const sync = require("utils/sync")
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
const mainserver = new Hapi.Server();

async function registerRoute() {
  try {
    mainserver.connection({
      labels: ["master"],
      port: 8080,
      routes: {
        cors: {
          origin: ["*"],
          credentials: true
        },

      },
    })
    var server = mainserver.select('master');




    server.ext('onPreHandler', (Request, Reply) => {
      console.log("-------------------------- On Request ----------------------------")
      console.log(" Path : " + Request.path);
      return Reply.continue();

    })
    server.ext('onPostHandler', (Request, Reply) => {
      console.log("-------------------------- Request Completed ----------------------");
      return Reply.continue();
    })

    await server.register([require('hapi-auth-cookie'), require('inert'), require('vision')])


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


    webSocketConnection();
    mainserver.start((err) => {
      if (err)
        return console.log("Server Failed to Start");
      console.log("Server started at ");

    })

  } catch (err) {
    console.log("------------------------------------------------------------------")
    console.log(err);
    console.log("------------------------------------------------------------------")

  }
}

registerRoute();


const webSocketConnection = () => {
  mainserver.connection({
    labels: ["web"],
    port: 8082,
    routes: {
      cors: {
        origin: ["*"],
        credentials: true
      },

    },
  });
  var web = mainserver.select('web');
  var io = SocketIO(web.listener, {
    cors: "*"
  });
  io.on('connection', (socket) => {

    websocket.setSocket(socket);


    //Emits
    socket.emit("newUser", (socket.id));
  })
}
