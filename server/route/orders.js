const handler=require("controllers")


const route=[{
  method:"POST",
  path:"/order",
  config:{
    auth:{
      strategy:'session',
      mode:'required'
    },
    handler:handler.orders.placeOrder
  }
},
{
  method:"GET",
  path:"/user/{id}/order",
  config:{
    auth:{
      strategy:'session',
      mode:'required'
    },
    handler:handler.orders.orderByUID
  }
}
,
{
  method:"DELETE",
  path:"/cancel-order/{id}",
  config:{
    auth:{
      strategy:'session',
      mode:'required'
    },
    handler:handler.orders.cancelOrderById
  }
},
{
  method:"GET",
  path:"/orders/all",
  config:{
    handler:handler.orders.allOrders
  }
},
{
  method:"PUT",
  path:"/updateorder/{id}",
  config:{
    handler:handler.orders.updateOrder
  }
}
]

module.exports=route