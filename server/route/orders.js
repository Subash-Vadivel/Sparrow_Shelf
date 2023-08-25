const handler = require("controllers")
const Joi = require("joi")


const route = [{
  method: "POST",
  path: "/order",
  config: {
    auth: {
      strategy: 'session',
      mode: 'required'
    },
    handler: handler.orders.placeOrder,
    validate: {
      payload: {
        book_id: Joi.number().required(),
        user_id: Joi.number().required(),
        amount: Joi.number().required(),
        quantity: Joi.number().required()
      }
    }
  }
},
{
  method: "GET",
  path: "/user/{id}/order",
  config: {
    auth: {
      strategy: 'session',
      mode: 'required'
    },
    handler: handler.orders.orderByUID,
    validate: {
      params: {
        id: Joi.number().required(),
      }
    }
  }
}
  ,
{
  method: "DELETE",
  path: "/cancel-order/{id}",
  config: {
    auth: {
      strategy: 'session',
      mode: 'required'
    },
    handler: handler.orders.cancelOrderById,
    validate: {
      params: {
        id: Joi.number().required(),
      }
    }
  }
},
{
  method: "GET",
  path: "/orders/all",
  config: {
    handler: handler.orders.allOrders
  }
},
{
  method: "PUT",
  path: "/updateorder/{id}",
  config: {
    handler: handler.orders.updateOrder,
    validate: {
      params: {
        id: Joi.number().required(),
      }
    }
  }
}
]

module.exports = route