import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Home from './pages/Home';
import Books from './pages/Books';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import { Provider } from 'react-redux'; // Import the Provider component
import store from './redux/store';
function App() {
  return (
    <>
      <BrowserRouter>
        <Provider store={store}>
            <Routes>
              <Route path="/" element={<Home />}>
              </Route>
              <Route path="/book" element={<Books />}></Route>
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/order" element={<Orders />}></Route>
            </Routes>
        </Provider>
      </BrowserRouter>

    </>
  );
}

export default App;


