import React, { useState, useEffect } from 'react'
import Header from '../components/Header'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import Loading from '../components/Loading'
import { Col, Row, Container, FloatingLabel, Form, Button } from 'react-bootstrap';
import axiosPrivate from '../utils/axiosPrivate';
export default function Shipping() {

  const [data, setData] = useState([]);
  const [status, setstatus] = useState(false);
  const load = async () => {
    try {
      console.log("load")
      const result = await axiosPrivate.get('/orders/all');
      const filter = result.data.map((item) => {
        return {
          id: item.id,
          product_name: item.book.book_name,
          user_name: item.user.user_name ? item.user.user_name : item.user_id,
          amount: item.amount,
          quantity: item.quantity,
          status: item.status
        }
      })
      setData(filter);
      setstatus(true);
      console.log(result.data);
    }
    catch (err) {
      console.log(err);
    }
  }
  useEffect((() => { load() }), [])

  const onAfterSaveCell = async (row, cellName, cellValue) => {
    try {
      console.log("Hitting Delivery Status");
      await axiosPrivate.put(`/updateorder/${row.id}`, { data: { [cellName]: cellValue } });
      console.log('Updating', row.id, cellName, cellValue);
      const updatedData = data.map(item =>
        item.id === row.id ? { ...item, [cellName]: cellValue } : item
      );
      setData(updatedData);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Header />
      {status ?
        (
          <Container >
            <Row>
              <Col><h1 className='heading'>Orders</h1></Col>
            </Row>
            <Row className='topspace'>
              <Col>
                <BootstrapTable data={data} striped hover pagination cellEdit={{ mode: 'click', blurToSave: true, afterSaveCell: onAfterSaveCell }} exportCSV>
                  <TableHeaderColumn isKey dataField='id' dataSort={true}>Order ID</TableHeaderColumn>
                  <TableHeaderColumn dataField='product_name' editable={false}>Product Name</TableHeaderColumn>
                  <TableHeaderColumn dataField='user_name' editable={false}>User Name</TableHeaderColumn>
                  <TableHeaderColumn dataField='amount' editable={false}>Amount</TableHeaderColumn>
                  <TableHeaderColumn dataField='quantity' editable={false}>Quantity</TableHeaderColumn>
                  <TableHeaderColumn dataField='status' editable={{ type: 'select', options: { values: ['Processing', 'Shipped', 'Delivered', 'Returned'] } }}>
                    Status
                  </TableHeaderColumn>
                </BootstrapTable>
              </Col>
            </Row>
          </Container>
        )
        : (<><Loading /></>)
      }
    </>
  )
}
