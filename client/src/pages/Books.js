import React, { useState, useEffect } from 'react'
import axiosPrivate from '../utils/axiosPrivate'
import Loading from '../components/Loading';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Header from '../components/Header';
import Popup from "reactjs-popup"
import { useAuth } from '../utils/Authentication';

import { useSelector, useDispatch } from 'react-redux';
import { cartData } from '../redux/actions';


export default function Books() {
  const [data, setData] = useState(null);
  const [isOpen, setOpen] = useState(false);
  const [start, setStart] = useState(0);
  const [item, setItem] = useState(0);
  const [order, setOrder] = useState(false);
  const [qty, setQty] = useState(1);
  const auth = useAuth();

  const dispatch = useDispatch();

  useEffect(()=>{
    load();
  },[start])



  const load = async () => {
    try {
      const result = await axiosPrivate.get(`/books/page/${start}`);
      console.log(result.data);
      setData(result.data);
    }
    catch (err) {
      console.log(err);

    }
  }
  useEffect(() => {
    load();
  }, [])

  const addToCart=async(e,price,id)=>{
    e.preventDefault();
    try{
       const result=await axiosPrivate.post("/addtocart",{item:{
        book_id:id,user_id:auth.details.id,price:price},uid:auth.details.id
       })
       
       if(result.data.status)
       {
           dispatch(cartData())
          alert("Item Added")
       }
        else
           alert("Item Already in Cart")
    }
    catch(err)
    {
      alert("Some thing went wrong")
      console.log(err);
    }
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.post("/order", {
        book_id: order.id, user_id: auth.details.id, amount: qty * order.price, quantity: qty
      })
      setOrder(false);
      setOpen(false);
      load();
      alert("Order Placed");
    }
    catch (err) {
      if(err.response.data.statusCode===401)
      {
        auth.logout();
      }
      console.log(err);
    }
  }

  const findItem = async () => {
    await axiosPrivate.get(`/books/${item}`).then((res) => {
      setOrder(res.data);
      console.log(res);
    }).catch((err) => {
      console.log(err);
      setOrder(false);
    })
  }
  useEffect(() => {
    findItem();
  }, [item])

  return (
    <>
      <Header setData={setData} />
      <Popup
        open={isOpen}
        onClose={() => { setQty(1); setOpen(false); }}
        position="center"
        className='login-popup'
      >
        {order !== false ?
          <Container>
            <Card style={{ width: '18rem', height: '275px' }}>
              <Card.Body>
                <Card.Title >{order.book_name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">₹{order.price}</Card.Subtitle>
                <Card.Text>
                  Only {order.stock} stocks left Hurry!!!
                </Card.Text>
              </Card.Body>
              <div>
                <h6 style={{ textAlign: 'right', marginRight: "5px" }}><span style={{ color: 'red' }}>{item.stock <= 3 ? "Few Stocks Left : " + item.stock : ""}</span>{item.stock > 3 ? "Stock Left : " + item.stock : ""} </h6>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '10px' }}>
                <div>
                  <Button variant="outline-success" onClick={(e) => {
                    e.preventDefault()
                    if (qty > 1)
                      setQty(prev => prev - 1);
                  }}>-</Button>
                  <span style={{ margin: '0 10px' }}>{qty}</span>
                  <Button variant="outline-success" onClick={(e) => {
                    e.preventDefault();
                    if (qty < order.stock) {
                      setQty(prev => prev + 1);
                    }
                  }}>+</Button>
                </div>
                <div>
                  <p>Total: ₹{qty * order.price}</p>
                </div>
              </div>
              <div style={{ padding: '10px' }}>
                <div>
                  <Button variant="success">Add to Cart</Button>
                  <Button variant="success" style={{ float: "right" }} onClick={placeOrder}>Place Order</Button>
                </div>
              </div>
            </Card>
          </Container> : <Loading />}

      </Popup>
      {!data ? <Loading /> : <>

        <Container >
          <Row>
            {data.map((item, index) => {
              return (<Col style={{ marginBottom: '50px' }} key={index}>
                <Card style={{ width: '18rem', height: '275px' }} >
                  <Card.Body>
                    <Card.Title >{item.book_name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">₹{item.price}</Card.Subtitle>
                    <Card.Text>
                      {item.book_name} is one of the good book to read at the price of ₹{item.price}
                    </Card.Text>

                  </Card.Body>
                  <div>
                    <h6 style={{ textAlign: 'right', marginRight: "5px" }}><span style={{ color: 'red' }}>{item.stock <= 3 && item.stock > 0 ? "Few Stocks Left : " + item.stock : ""}</span>{item.stock > 3 ? "Stock Left : " + item.stock : ""} {item.stock<=0?"Out Of Stock":""} </h6>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '10px' }}>
                    <Button variant="success" onClick={(e)=>addToCart(e,item.price,item.id)}>Add to Cart</Button>
                    <Button variant="success" onClick={() => {
                      if (auth.user && item.stock<=0) {
                        alert("Sorry Out Of Stock")
                      }
                      else if(auth.user)
                      {
                        setItem(prev => item.id); setOpen(true);

                      }
                      else {
                        alert("You Need To Login First");
                      }
                    }} >Buy</Button>
                  </div>
                </Card>
              </Col>
              );
            })}



          </Row>
          <Row>
            <Col>         {start > 0 ? <Button style={{ float: 'right' }} onClick={() => setStart((prev) => prev - 1)} variant='success'>Prev</Button> : ""}
            </Col>
            <Col>         {data.length > 11 ? <Button onClick={() => setStart((prev) => prev + 1)} variant='success' style={{ float: "left" }}>Next</Button> : ""}
            </Col>
          </Row>
        </Container>
      </>}
    </>
  )
}
