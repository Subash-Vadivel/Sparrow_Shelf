const handler = require("controllers")

const route = [{
  method: "GET",
  path: "/analytics/orderstatus",
  config: {
    handler: handler.analytics.orderStatus
  }
},
{
  method: "GET",
  path: "/analytics/salesstatus",
  config: {
    handler: handler.analytics.bookSales
  }
}]
module.exports = route