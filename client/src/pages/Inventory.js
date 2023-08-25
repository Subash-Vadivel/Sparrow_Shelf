import React, { useState, useEffect } from 'react'
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axiosPrivate from '../utils/axiosPrivate';
import { Col, Row, Container, FloatingLabel, Form, Button } from 'react-bootstrap';
import Popup from "reactjs-popup"
import Header from '../components/Header';
import Loading from '../components/Loading';

export default function Inventory() {

  const [book_name, setBookName] = useState('');
  const [stock, setStock] = useState(1);
  const [price, setPrice] = useState(0);

  const [addData, setAddData] = useState(false);
  const [status, setstatus] = useState(false)
  const [data, setData] = useState([]);
  const load = async () => {
    try {
      const result = await axiosPrivate.get('/books/admin/');
      setData(result.data);
      setstatus(true);
    }
    catch (err) {
      console.log(err);
    }
  }
  useEffect((() => { load() }), [])

  const clear = () => {
    setBookName('');
    setPrice(0);
    setStock(1);
  }


  const selectRowProp = {
    mode: 'checkbox',
    clickToSelect: true,
    onSelect: (row, isSelected) => {
      const updatedData = data.map(item =>
        item.id === row.id ? { ...item, isSelected } : item
      );
      setData(updatedData);
    }
  };
  const onAfterSaveCell = async (row, cellName, cellValue) => {
    try {
      await axiosPrivate.put(`/updatebook/${row.id}`, { data: { [cellName]: cellValue } });
      // console.log('Updating', row.id, cellName, cellValue);
      const updatedData = data.map(item =>
        item.id === row.id ? { ...item, [cellName]: cellValue } : item
      );
      setData(updatedData);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteData = async (e) => {
    e.preventDefault();
    const selectedRows = data.filter(row => row.isSelected);
    const idsToDelete = selectedRows.map(row => row.id);
    try {
      // Perform your delete action here
      await axiosPrivate.post('/books/all', { ids: idsToDelete });
      // console.log('Deleting IDs:', idsToDelete);
      load(); // Reload the data after deletion
    } catch (err) {
      console.log(err);
    }
  }

  const handleAddData = async (e) => {
    e.preventDefault();
    try {
      const result = await axiosPrivate.post('books/add', { book_name, price, stock });
      clear()
      load();
    }
    catch (err) {
      console.log(err);
    }
  }

  return (
    <>
      <Popup
        open={addData}
        onClose={() => { setAddData(false); clear(); }}
        position="center"
        className='login-popup'
      >
        <Container fluid className='login-template'>
          <Form className='popup-form'>
            <Form.Group as={Row} className="mb-3" controlId="formHorizontalBookName">
              <Form.Label column sm={2} md={4}>
                Book Name
              </Form.Label>
              <Col sm={10} md={8}>
                <Form.Control type="name" placeholder="Name" value={book_name} onChange={(e) => setBookName(e.target.value)} />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalStock">
              <Form.Label column sm={2} md={4}>
                Stock
              </Form.Label>
              <Col sm={10} md={8}>
                <Form.Control type="number" value={stock} onChange={(e) => setStock(e.target.value)} placeholder="Stock" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3" controlId="formHorizontalPrice">
              <Form.Label column sm={2} md={4}>
                Price
              </Form.Label>
              <Col sm={10} md={8}>
                <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price" />
              </Col>
            </Form.Group>

            <Form.Group as={Row} className="mb-3 justify-content-center">
              <Col className="text-center">
                <Button type="submit" variant='success' onClick={(e) => handleAddData(e)}>Confirm</Button>
              </Col>
            </Form.Group>
          </Form>


        </Container>
      </Popup>
      <Header />
      {status ?
        (
          <Container >
            <Row>
              <Col><h1 className='heading'>Inventory</h1></Col>
            </Row>
            <Row>
              <Col>
              </Col>
              <Col>

                <Button
                  variant='success'
                  onClick={() => setAddData(true)}
                  className='floatRightBtn'
                >
                  Add
                </Button>
                <Button
                  variant='danger'
                  className='floatRightBtn'
                  onClick={(e) => deleteData(e)}
                >
                  Delete
                </Button>
              </Col>
            </Row>
            <Row className='topspace'>
              <Col>
                <BootstrapTable data={data} striped hover pagination cellEdit={{ mode: 'click', blurToSave: true, afterSaveCell: onAfterSaveCell }}
                  selectRow={selectRowProp}
                >
                  <TableHeaderColumn isKey dataField='id' dataSort={true}>Product ID</TableHeaderColumn>
                  <TableHeaderColumn dataField='book_name'  >Product Name</TableHeaderColumn>
                  <TableHeaderColumn dataField='stock'>Stock</TableHeaderColumn>
                  <TableHeaderColumn dataField='price'>Product Price</TableHeaderColumn>
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




