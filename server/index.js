require('app-module-path').addPath('./server/');
const Hapi = require("hapi")
const route = require("route")
const models = require("models");
const SocketIO = require('socket.io');
const helper = require("helpers");
const configStrategy = require("utils/configStrategy");
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


    websocket();
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


const websocket = () => {
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

    //On
    socket.on("orderStatus", async () => {
      const data = await helper.analyticHelper.runOrderStatus();
      socket.emit("orderStatusResponse", data);
    });

    socket.on("bookSales", async () => {
      try {
        const data = await helper.analyticHelper.runBookSalesStatus();
        console.log(data);
        const bookids = data.map((item) => item.key);
        const books = await models.books.findAll({
          where: {
            id: bookids
          }, attributes: ['id', 'price', 'stock', 'book_name']
        });
        const combinedData = books.map((book) => {
          const matching = data.find((countItem) => countItem.key === book.id);
          return {
            ...book.get(),
            count: matching ? matching.doc_count : 0,
            amount: matching ? matching.total_amount.value : 0
          };
        });
        socket.emit("booksSalesResponse", combinedData);


      } catch (err) {
        console.log(err);
        socket.emit("bookSalesResponse", []);
      }

    })


    //Emits
    socket.emit("newUser", (socket.id));
  })
}
