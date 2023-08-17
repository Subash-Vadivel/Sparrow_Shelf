import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axiosPrivate from '../utils/axiosPrivate';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'
import { useAuth } from '../utils/Authentication';
import { useNavigate } from "react-router-dom"


import { useSelector, useDispatch } from 'react-redux';

export default function Orders() {
  const user = useSelector(state => state.auth.user);
  const userDetails=useSelector(state => state.auth.details);
  const [data, setData] = useState([])
  const [start,setStart]=useState(0);
  const navigate = useNavigate();
  const auth = useAuth();
  const load = async () => {
    try {
      console.log(userDetails);
      const result = await axiosPrivate.get(`/user/${userDetails.id}/order`);
      setData(result.data);
    }
    catch (err) {
      console.log(err);
      alert("Internal Error");
    }
  }

  const cancelOrder = async (e, id) => {
    e.preventDefault();
    console.log("Cancel Req")
    console.log(id);
    try {
      await axiosPrivate.delete(`/cancel-order/${id}`);
      load();

    }
    catch (err) {
      console.log(err);
      alert("Try Again Later")
    }
  }

  useEffect(() => {
    if (!user) {
      alert("Plz Login");
      navigate('/');
      return;
    }
    load();
  }, [])
  return (
    <>
      <Header />
      <Container>
        <Row>
          {data.length === 0 ? <p>No Orders</p> : <>
            {
              data.slice(start,start+8).map((item, index) => {
                return (<Col key={index} style={{ marginBottom: '50px' }} >

                  <Card style={{ width: '18rem', height: '200px' }}>
                    <Card.Body>
                      <Card.Title>Order Id : {item.id}</Card.Title>
                      <Card.Text>
                        Order Value : {item.amount}<br>
                        </br>
                        Status : {item.status}
                      </Card.Text>
                      <div>
                        <Button variant="success" style={{ float: 'left' }} onClick={(e) => cancelOrder(e, item.id)}>Cancel</Button>
                        <Button variant="success" style={{ float: 'right' }}> Track</Button>
                      </div>
                    </Card.Body>
                  </Card>




                </Col>)
              })
            }</>
          }

        </Row>
        <Row>
            <Col>         {start > 0 ? <Button style={{ float: 'right' }} onClick={() => setStart((prev) => prev - 1)} variant='success'>Prev</Button> : ""}
            </Col>
            <Col>         {data.length > start * 8 + 8 ? <Button onClick={() => setStart((prev) => prev + 1)} variant='success' style={{ float: "left" }}>Next</Button> : ""}
            </Col>
          </Row>
      </Container>

    </>
  )
}
