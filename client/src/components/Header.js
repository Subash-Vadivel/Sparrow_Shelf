import React from 'react';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import axiosPrivate from '../utils/axiosPrivate';
import { useEffect, useState } from 'react';
import logo from "../../assets/logo.png"
import Popup from "reactjs-popup"
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, cartData } from '../redux/actions';

function Header(props) {
  const [error, setError] = useState('');
  const [book, setBook] = useState(null);
  const [name, setName] = useState('');
  const [isOpen, setOpen] = useState(false);
  const [isLogin, setLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const location = useLocation();
  const currentPath = location.pathname;
  const user = useSelector(state => state.auth.user);
  const details = useSelector(state => state.auth.details);
  const dispatch = useDispatch();
  const data = useSelector(state => state.content.allCarts);
  const navigate = useNavigate();
  useEffect(() => {
    if (user && details) {
      dispatch(cartData(details.id));

    }
  }, [])

  const search = async (e) => {
    e.preventDefault();
    try {
      if (book) {
        props.setSearch(book);

      }
      else {

        const result = await axiosPrivate.get("/books?page=0");
        props.setData(result.data);
      }
    }
    catch (err) {
      console.log(err);
    }
  }
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      if (!email || !password) {
        setError("Missing Data");
        return;
      }
      else if (password.length < 8) {
        setError("Invalid Password")
        return;
      }
      const result = await axiosPrivate.post("/login", { email, password });
      await dispatch(cartData(result.data.id));
      await dispatch({ type: 'LOGIN', data: result.data })
      setEmail('');
      setPassword('');
      setError('');
      if (result.data.isadmin)
        navigate('/admin');
      setOpen(false);
    }
    catch (err) {
      if (err.response.status === 409) {
        setError("Invalid Credential")
      };
    }
  }

  const handleSign = async (e) => {
    e.preventDefault();
    try {
      await axiosPrivate.post('/signup', { email, password, user_name: name });
      setLogin(true);
    }
    catch (err) {
      console.log(err);
      alert("failed");
    }
  }
  return (
    <><Popup
      open={isOpen}
      onClose={() => { setOpen(false); setError(''); setEmail(''); setPassword('') }}
      position="center"
      className='login-popup'
    >
      <Container fluid className='login-template'>
        {isLogin ? <Form className='popup-form'>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2} md={4}>
              Email
            </Form.Label>
            <Col sm={10} md={8}>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            </Col>
          </Form.Group>


          <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
            <Form.Label column sm={2} md={4}>
              Password
            </Form.Label>
            <Col sm={10} md={8}>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </Col>
            <p style={{ color: "red", textAlign: 'center' }}>{error}</p>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalCheck" >
            <Col className="d-flex justify-content-end">
              <Form.Check className='checkbox' label="Remember me" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3 justify-content-center">
            <Col className="text-center">
              <Button type="submit" variant='success' onClick={handleLogin}>Log in</Button>
            </Col>
          </Form.Group>

          <Col>
            <p>Don't have an account ? <span style={{ color: "green", cursor: "pointer" }} onClick={(e) => { e.preventDefault(); setLogin(false); setEmail(''); setPassword('') }}> Register </span></p>
          </Col>
        </Form> : <Form className='popup-form'>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalEmail">
            <Form.Label column sm={2} md={4}>
              Email
            </Form.Label>
            <Col sm={10} md={8}>
              <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalName">
            <Form.Label column sm={2} md={4}>
              Name
            </Form.Label>
            <Col sm={10} md={8}>
              <Form.Control type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formHorizontalPassword">
            <Form.Label column sm={2} md={4}>
              Password
            </Form.Label>
            <Col sm={10} md={8}>
              <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
            </Col>
          </Form.Group>
          <Form.Group as={Row} className="mb-3" controlId="formHorizontalCheck" >
            <Col className="d-flex justify-content-end">
              <Form.Check className='checkbox' label="Remember me" />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3 justify-content-center">
            <Col className="text-center">
              <Button type="submit" variant='success' onClick={handleSign}>Register</Button>
            </Col>
          </Form.Group>

          <Col>
            <p>Have an account ? <span style={{ color: "green", cursor: "pointer" }} onClick={(e) => { e.preventDefault(); setLogin(true); setEmail(''); setPassword('') }}> Login </span></p>
          </Col>
        </Form>}


      </Container>

    </Popup>
      <Container >
        <Navbar expand="lg" className="colorNav">
          <Container fluid>
            <Navbar.Brand href="/"><div className="logoWrapper">
              < img src={logo} alt="logo" />
            </div></Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
              <Nav
                className="me-auto my-2 my-lg-3"
                style={{ maxHeight: '100px' }}
                navbarScroll
              >

                {!user ?
                  <>
                    <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                    <Nav.Link onClick={() => navigate("/book")}>Books</Nav.Link>
                  </>
                  :
                  (!details.isadmin ? <>
                    <Nav.Link onClick={() => navigate("/")}>Home</Nav.Link>
                    <Nav.Link onClick={() => navigate("/book")}>Books</Nav.Link></> :
                    <>
                      <Nav.Link onClick={() => navigate("/admin")}>Dashboard</Nav.Link>
                      <Nav.Link onClick={() => navigate("/admin/inventory")}>Inventory</Nav.Link>
                      <Nav.Link onClick={() => navigate("/admin/view-order")}>View Orders</Nav.Link>

                    </>
                  )}

                {user && !details.isadmin &&
                  <> <Nav.Link onClick={() => navigate("/order")}>Orders</Nav.Link>
                    <Nav.Link onClick={() => navigate("/cart")} className='cart-link'>Cart<span className="cart-count">{data.length}</span></Nav.Link>
                  </>}

              </Nav>

              <Nav className="justify-content-end my-2 my-lg-3">

                {currentPath === '/book' ?
                  <Form className="d-flex">
                    <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2"
                      aria-label="Search"
                      value={book} onChange={(e) => setBook(e.target.value)}
                    />
                    <div className="d-flex gap-2">
                      <Button variant="outline-success" onClick={search}>Search</Button>

                    </div>
                  </Form> : <><p className='user-name'>👨🏻‍💼 {details.user_name}</p></>}

                <div style={{ marginLeft: '5px' }}>
                  {user ?
                    <>
                      <Button variant="danger" onClick={(e) => { e.preventDefault(); dispatch(logout()); navigate('/') }}>Logout</Button> </> :
                    <Button variant="success" onClick={() => {
                      setOpen(true);
                    }}>Login</Button>
                  }

                </div>

              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </Container></>

  );
}

export default Header;