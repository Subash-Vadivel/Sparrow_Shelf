import React, { useEffect, useState } from 'react'
import Header from '../components/Header'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axiosPrivate from '../utils/axiosPrivate';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button'

import { useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux';
import Footer from '../components/Footer';

const images = ["https://marketplace.canva.com/EAFioJosrX8/2/0/501w/canva-white-and-orange-modern-business-book-cover-oVHIF1kx9QU.jpg", "https://marketplace.canva.com/EAFfzzUHgHc/1/0/501w/canva-blue-modern-business-book-cover--zGfHn9hrFs.jpg",
  "https://marketplace.canva.com/EAFfz3R6fVM/1/0/1003w/canva-yellow-simple-minimalist-modern-business-solution-book-cover-9dJ1K0aD35k.jpg", "https://marketplace.canva.com/EAFn-A7wxHU/1/0/1003w/canva-blue-minimalist-business-book-cover-d1Z8r9twpoM.jpg",
  "https://marketplace.canva.com/EAFZ8o1S2_Y/1/0/501w/canva-white-blue-modern-business-solution-book-cover-kUQK2W0wjc0.jpg", "https://marketplace.canva.com/EAFWxHVr8aE/1/0/501w/canva-black-white-and-blue-modern-business-solution-book-cover-YYqja9da0BQ.jpg",
  "https://marketplace.canva.com/EAFYBJwn3kI/1/0/1003w/canva-red-black-and-white-modern-business-solution-book-cover-4Ni4Qms65fk.jpg", "https://marketplace.canva.com/EAFYrqv5K-c/3/0/1024w/canva-gray-and-orange-modern-business-solution-ebook-cover-zxHxDeV7gik.jpg"];

export default function Orders() {
  const user = useSelector(state => state.auth.user);
  const userDetails = useSelector(state => state.auth.details);
  const [data, setData] = useState([])
  const [filterdata, setFilterData] = useState([])
  const [select, setSelect] = useState(false);
  const [page, setPage] = useState(0);
  const navigate = useNavigate();

  const filter = () => {
    if (select) {
      const applyFilter = data.filter((item) => item.status === select);
      setFilterData(() => applyFilter)
    }
    else {
      setFilterData(data)
    }
  }
  useEffect(() => {
    filter();
  }, [select])

  const load = async () => {
    try {
      if (userDetails) {
        const result = await axiosPrivate.get(`/user/${userDetails.id}/order`);
        setData(result.data);
        if (select) {
          const applyFilter = result.data.filter((item) => item.status === select);
          setFilterData(() => applyFilter)
        }
        else {
          setFilterData(result.data)
        }
      }
    }
    catch (err) {
      console.log(err);
      alert("Internal Error");
    }
  }

  const cancelOrder = async (e, id) => {
    e.preventDefault();
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
  useEffect(() => {
    load();
  }, [userDetails]);
  return (
    <>
      <Header />
      <Container>

        {data.length === 0 ? <div className='center-img'><img src="https://cdn.dribbble.com/users/357929/screenshots/2276751/media/678caef6068a976e4a0d94bbdba6b660.png?resize=400x0" alt='loading' /></div> :
          <>
            <Row>

              <Col>
                <h6 className='filter-order' style={{ background: !select && "green" }} onClick={() => setSelect(false)}>All</h6>
              </Col>
              <Col>
                <h6 className='filter-order' style={{ background: select === "Processing" && "green" }} onClick={() => setSelect("Processing")}>Processing</h6>
              </Col>
              <Col>
                <h6 className='filter-order' style={{ background: select === "Shipped" && "green" }} onClick={() => setSelect("Shipped")}>Shipped</h6>
              </Col>
              <Col>
                <h6 className='filter-order' style={{ background: select === "Delivered" && "green" }} onClick={() => setSelect("Delivered")}> Delivered</h6>
              </Col>
            </Row>
            <Row>

              {
                filterdata.slice(page * 8, page * 8 + 8).map((item, index) => {
                  return (<Col key={index} style={{ marginBottom: '50px' }} >

                    <Card style={{ width: '18rem', height: '400px' }}>
                      <Card.Img variant="top" src={images[index]} className='wrapped-img' />
                      <Card.Body>
                        <Card.Title>{item.book.book_name}</Card.Title>
                        <Card.Text>
                          Order Id : {item.id} <br ></br>
                          Order Value : {item.amount}<br>
                          </br>
                          Status : {item.status}
                        </Card.Text>
                        <div>
                          {
                            item.status === "Delivered" ? <>
                              <Button variant="success" style={{ float: 'left' }} >Return</Button>
                              <Button variant="success" style={{ float: 'right' }} href='https://sprw.io/stt-h2XdNbpJzECBYMQisWCQqe'> Review</Button>
                            </> :
                              <>
                                {item.status === "Rejected" || item.status === "Cancelled" ? <>
                                  <Button variant="danger" style={{ float: 'right' }}> Support</Button>

                                </> :
                                  <>
                                    <Button variant="danger" style={{ float: 'left' }} onClick={(e) => cancelOrder(e, item.id)}>Cancel</Button>
                                    <Button variant="success" style={{ float: 'right' }}> Track</Button>
                                  </>}
                              </>
                          }
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>)
                })
              }
            </Row>
          </>
        }

        <Row>
          <Col>         {page > 0 ? <Button style={{ float: 'right' }} onClick={() => setPage((prev) => prev - 1)} variant='success'>Prev</Button> : ""}
          </Col>
          <Col>         {filterdata.length > page * 8 + 8 ? <Button onClick={() => setPage((prev) => prev + 1)} variant='success' style={{ float: "left" }}>Next</Button> : ""}
          </Col>
        </Row>
      </Container >
      <Footer />

    </>
  )
}

