import './css/App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home';
import Books from './pages/Books';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Shipping from './pages/Shipping';
import LoginRequired from './components/LoginRequired';
import Admin from './components/Admin';
import PageNotFound from './components/PageNotFound';
import { useSelector, useDispatch } from 'react-redux';


function App() {

  const details = useSelector(state => state.auth.details);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />}>
          </Route>
          {(!details || details.isadmin === false) &&
            <Route path="/book" element={<Books />}></Route>
          }
          {details && !details.isadmin &&
            <>
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/order" element={<Orders />}></Route>
            </>
          }

          <Route path="/admin" element={<LoginRequired><Admin /></LoginRequired>}>
            <Route index element={<Dashboard />}></Route>
            <Route path='inventory' element={<Inventory />}></Route>
            <Route path='view-order' element={<Shipping />}></Route>
          </Route>

          <Route path="/*" element={<PageNotFound />}></Route>
        </Routes>
      </BrowserRouter>

    </>
  );
}

export default App;


