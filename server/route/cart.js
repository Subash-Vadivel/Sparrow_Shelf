const handler = require("controllers")
const Joi = require("joi")
const route = [{
  method: "GET",
  path: "/cart/{uid}",
  config: {
    auth: {
      strategy: 'session',
      mode: "required"
    },
    handler: handler.cart.showCart,
    validate: {
      params: {
        uid: Joi.number().required(),
      }
    }
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
    handler: handler.cart.removeFromCart,
    validate: {
      params: {
        cid: Joi.number().required(),
      }
    }
  }

}
]


module.exports = route;