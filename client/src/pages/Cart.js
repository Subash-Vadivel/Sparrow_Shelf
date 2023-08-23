import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import axiosPrivate from '../utils/axiosPrivate';
import { useSelector, useDispatch } from 'react-redux';
import { logout, cartData } from '../redux/actions';
import Footer from '../components/Footer';

import Popup from "reactjs-popup"
import Loading from '../components/Loading';

export default function Cart() {

  const [isOpen, setOpen] = useState(false);
  const [item, setItem] = useState(0);
  const [order, setOrder] = useState(false);
  const [qty, setQty] = useState(1);
  const [page,setPage]=useState(0);
  const navigate = useNavigate();
  const user  = useSelector(state => state.auth.user);
  const details  = useSelector(state => state.auth.details);
  const data  = useSelector(state => state.content.allCarts);
  const dispatch = useDispatch();
  
  const handleRemove=async(e,cid)=>{
    e.preventDefault();
    try{
        await axiosPrivate.delete(`/removecart/${cid}`)
        await dispatch(cartData(details.id))
    }
    catch(err){
      console.log(err);
    }
  }

  const placeOrder = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.post("/order", {
        book_id: order.id, user_id: details.id, amount: qty * order.price, quantity: qty
      })
      setOrder(false);
      setOpen(false);
      load();
      alert("Order Placed");
    }
    catch (err) {
      if(err.response.data.statusCode===401)
      {
        await dispatch(logout()); navigate('/')
      }
      console.log(err);
    }
  }
  const load=async()=>{
    if (!user) {
      alert("Plz Login");
      navigate('/'); 
    }
    else
    {
          await dispatch(cartData(details.id));
    }
  }
  useEffect(() => {
    
  }, [])


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
                  <Button variant="danger" onClick={()=>{setQty(1);setOpen(false)}}>Close</Button>
                  <Button variant="success" style={{ float: "right" }} onClick={placeOrder}>Place Order</Button>
                </div>
              </div>
            </Card>
          </Container> : <Loading />}

      </Popup>
     
      <Header />
      <Container>
        {data.length === 0 ? <p>Cart Is Empty</p> : <>
        <Row>
        {data.slice(page*8,page*8+8).map((item,idx)=>{
          console.log(item);
          return (
            <Col style={{ marginBottom: '50px' }} key={idx}>
            <Card style={{ width: '18rem', height: '275px' }}>
              <Card.Body>
                <Card.Title >{item.book.book_name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">₹{item.book.price}</Card.Subtitle>
                <Card.Text>
                 { item.book.stock>0? `Only ${item.book.stock} stocks left Hurry!!!`:"New Stocks Will arrive Soon 🚛" }
                </Card.Text>
              </Card.Body>
              <div>
                <h6 style={{ textAlign: 'right', marginRight: "5px" }}><span style={{ color: 'red' }}>{item.book.stock <= 3 && item.book.stock>0? "Few Stocks Left : " + item.book.stock : ""}{item.book.stock <=0? "Out Of Stock !"  : ""}</span>{item.book.stock > 3 ? "Stock Left : " + item.book.stock : ""} </h6>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '10px' }}>
                
              </div>
              <div style={{ padding: '10px' }}>
                <div>
                  <Button variant="danger" onClick={(e)=>handleRemove(e,item.id)}>Remove</Button>
                  <Button variant="success" style={{ float: "right" }}  onClick={() => {
                      if (user && item.stock<=0) {
                        alert("Sorry Out Of Stock")
                      }
                      else if(user)
                      {
                        setItem(prev => item.book_id); setOpen(true);

                      }
                      else {
                        alert("You Need To Login First");
                      }
                    }}>Place Order</Button>
                </div>
              </div>
            </Card>
          </Col>
          );
        })}
          <Row>
            <Col>         {page > 0 ? <Button style={{ float: 'right' }} onClick={() => setPage((prev) => prev - 1)} variant='success'>Prev</Button> : ""}
            </Col>
            <Col>         {data.length > page*8 + 8 ? <Button onClick={() => setPage((prev) => prev + 1)} variant='success' style={{ float: "left" }}>Next</Button> : ""}
            </Col>
          </Row>

     </Row>
        </>}
      </Container>
      <Footer/>

    </>
  )
}
