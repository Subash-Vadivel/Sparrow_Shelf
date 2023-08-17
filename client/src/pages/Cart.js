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
import { cartData } from '../redux/actions';



export default function Cart() {

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

  useEffect(async() => {
    if (!user) {
      alert("Plz Login");
      navigate('/'); 
    }
    else
    {
          await dispatch(cartData(details.id));
    }
  }, [])
  return (
    <>
      <Header />
      <Container>
        {data.length === 0 ? <p>Cart Is Empty</p> : <>
        <Row>
        {data.map((item,idx)=>{
          console.log(item);
          return (
            <Col style={{ marginBottom: '50px' }} key={idx}>
            <Card style={{ width: '18rem', height: '275px' }}>
              <Card.Body>
                <Card.Title >{item.book.book_name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">₹{item.book.price}</Card.Subtitle>
                <Card.Text>
                  Only {item.book.stock} stocks left Hurry!!!
                </Card.Text>
              </Card.Body>
              <div>
                <h6 style={{ textAlign: 'right', marginRight: "5px" }}><span style={{ color: 'red' }}>{item.book.stock <= 3 ? "Few Stocks Left : " + item.book.stock : ""}</span>{item.book.stock > 3 ? "Stock Left : " + item.book.stock : ""} </h6>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', padding: '10px' }}>
                <div>
                  <Button variant="outline-success" onClick={(e) => {
                    e.preventDefault();
                  }}>-</Button>
                  <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                  <Button variant="outline-success" onClick={(e) => {
                    e.preventDefault();          
                  }}>+</Button>
                </div>
                <div>
                  <p>Total: ₹{item.quantity * item.price}</p>
                </div>
              </div>
              <div style={{ padding: '10px' }}>
                <div>
                  <Button variant="success" onClick={(e)=>handleRemove(e,item.id)}>Remove</Button>
                  <Button variant="success" style={{ float: "right" }} >Place Order</Button>
                </div>
              </div>
            </Card>
          </Col>
          );
        })}
     </Row>
        </>}
      </Container>

    </>
  )
}
