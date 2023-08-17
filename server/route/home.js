const handler = require("controllers")

const route = [
  {
  method: "GET",
  path: "/{any*}",
  config: {
    handler: handler.home.getApp
  }
}
]


module.exports = route;