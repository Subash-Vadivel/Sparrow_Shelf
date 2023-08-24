const handler = require("controllers")

const route = [{
  method: "GET",
  path: "/analytics/orderstatus",
  config: {
    handler: handler.analytics.orderStatus
  }
}]
module.exports = route