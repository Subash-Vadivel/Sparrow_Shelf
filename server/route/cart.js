const handler = require("controllers")

const route = [{
  method: "GET",
  path: "/cart/{uid}",
  config: {
    auth: {
      strategy: 'session',
      mode: "required"
    },
    handler: handler.cart.showCart
  }
}, {
  method: "POST",
  path: "/addtocart",
  config: {
    auth: {
      strategy: 'session',
      mode: "required"
    },
    handler: handler.cart.addToCart
  }

}, {
  method: "DELETE",
  path: "/removecart/{cid}",
  config: {
    auth: {
      strategy: 'session',
      mode: "required"
    },
    handler: handler.cart.removeFromCart
  }

}
]


module.exports = route;