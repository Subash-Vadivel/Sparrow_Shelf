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

const images = ["https://template.canva.com/EADaopxBna4/1/0/251w-ujD6UPGa9hw.jpg", "https://marketplace.canva.com/EAFersXpW3g/1/0/1003w/canva-blue-and-white-modern-business-book-cover-cfxNJXYre8I.jpg",
  "https://img.freepik.com/free-psd/book-hardcover-mockup-three-views_125540-226.jpg?w=2000", "https://marketplace.canva.com/EAFh7bSCs1U/1/0/1131w/canva-brown-aesthetic-minimalist-note-book-cover-page-a4-document-yhk3SDUOdz8.jpg",
  "https://marketplace.canva.com/EAFioJosrX8/2/0/501w/canva-white-and-orange-modern-business-book-cover-oVHIF1kx9QU.jpg", "https://marketplace.canva.com/EAFfzzUHgHc/1/0/501w/canva-blue-modern-business-book-cover--zGfHn9hrFs.jpg",
  "https://marketplace.canva.com/EAFfz3R6fVM/1/0/1003w/canva-yellow-simple-minimalist-modern-business-solution-book-cover-9dJ1K0aD35k.jpg", "https://marketplace.canva.com/EAFn-A7wxHU/1/0/1003w/canva-blue-minimalist-business-book-cover-d1Z8r9twpoM.jpg",
  "https://marketplace.canva.com/EAFZ8o1S2_Y/1/0/501w/canva-white-blue-modern-business-solution-book-cover-kUQK2W0wjc0.jpg", "https://marketplace.canva.com/EAFWxHVr8aE/1/0/501w/canva-black-white-and-blue-modern-business-solution-book-cover-YYqja9da0BQ.jpg",
  "https://marketplace.canva.com/EAFYBJwn3kI/1/0/1003w/canva-red-black-and-white-modern-business-solution-book-cover-4Ni4Qms65fk.jpg", "https://marketplace.canva.com/EAFYrqv5K-c/3/0/1024w/canva-gray-and-orange-modern-business-solution-ebook-cover-zxHxDeV7gik.jpg"];


export default function Cart() {

  const [isOpen, setOpen] = useState(false);
  const [item, setItem] = useState(0);
  const [order, setOrder] = useState(false);
  const [qty, setQty] = useState(1);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();
  const user = useSelector(state => state.auth.user);
  const details = useSelector(state => state.auth.details);
  const data = useSelector(state => state.content.allCarts);
  const dispatch = useDispatch();

  const handleRemove = async (e, cid) => {
    e.preventDefault();
    try {
      await axiosPrivate.delete(`/removecart/${cid}`)
      await dispatch(cartData(details.id))
    }
    catch (err) {
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
      if (err.response.data.statusCode === 401) {
        await dispatch(logout()); navigate('/')
      }
      console.log(err);
    }
  }
  const load = async () => {
    if (!user) {
      alert("Plz Login");
      navigate('/');
    }
    else {
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
        onClose={() => { setQty(1); setOpen(false); setItem(0) }}
        position="center"
        className='login-popup'
      >
        {order !== false ?
          <Container>
            <Card style={{ width: '25rem', height: '450px' }}>
              <Card.Img variant="top" src={images[0]} className='wrapped-img-order' />
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
                  <Button variant="danger" onClick={() => { setQty(1); setOpen(false) }}>Close</Button>
                  <Button variant="success" style={{ float: "right" }} onClick={placeOrder}>Place Order</Button>
                </div>
              </div>
            </Card>
          </Container> : <Loading />}

      </Popup>

      <Header />
      <Container>
        {data.length === 0 ? <div className='center-img'><img src="https://assets.materialup.com/uploads/66fb8bdf-29db-40a2-996b-60f3192ea7f0/preview.png" alt='loading' /></div> : <>
          <Row>
            {data.slice(page * 8, page * 8 + 8).map((item, idx) => {
              console.log(item);
              return (
                <Col style={{ marginBottom: '50px' }} key={idx}>
                  <Card style={{ width: '18rem', height: '450px' }}>
                    <Card.Img variant="top" src={images[idx]} className='wrapped-img' />
                    <Card.Body>
                      <Card.Title >{item.book.book_name}</Card.Title>
                      <Card.Subtitle className="mb-2 text-muted">₹{item.book.price}</Card.Subtitle>
                      <Card.Text>
                        {item.book.stock > 0 ? `Only ${item.book.stock} stocks left Hurry!!!` : "New Stocks Will arrive Soon 🚛"}
                      </Card.Text>
                    </Card.Body>
                    <div>
                      <h6 style={{ textAlign: 'right', marginRight: "5px" }}><span style={{ color: 'red' }}>{item.book.stock <= 3 && item.book.stock > 0 ? "Few Stocks Left : " + item.book.stock : ""}{item.book.stock <= 0 ? "Out Of Stock !" : ""}</span>{item.book.stock > 3 ? "Stock Left : " + item.book.stock : ""} </h6>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '10px' }}>

                    </div>
                    <div style={{ padding: '10px' }}>
                      <div>
                        <Button variant="danger" onClick={(e) => handleRemove(e, item.id)}>Remove</Button>
                        <Button variant={item.book.stock <= 0 ? "danger" : "success"} style={{ float: "right" }} onClick={() => {
                          if (user && item.book.stock <= 0) {
                            alert("You will received a notification on new stock 📦")
                          }
                          else if (user) {
                            setItem(prev => item.book_id); setOpen(true);

                          }
                          else {
                            alert("You Need To Login First");
                          }
                        }}>{item.book.stock > 0 ? "Buy" : "Notify"}</Button>
                      </div>
                    </div>
                  </Card>
                </Col>
              );
            })}
            <Row>
              <Col>         {page > 0 ? <Button style={{ float: 'right' }} onClick={() => setPage((prev) => prev - 1)} variant='success'>Prev</Button> : ""}
              </Col>
              <Col>         {data.length > page * 8 + 8 ? <Button onClick={() => setPage((prev) => prev + 1)} variant='success' style={{ float: "left" }}>Next</Button> : ""}
              </Col>
            </Row>

          </Row>
        </>}
      </Container>
      <Footer />

    </>
  )
}
