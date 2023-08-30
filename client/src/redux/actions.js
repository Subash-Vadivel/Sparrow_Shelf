import React from 'react';

import axiosPrivate from "../utils/axiosPrivate";

// With the help of redux thunk api is performed between redux store to handle logout and cart data 

export const logout = () => async (dispatch) => {
  try {
    await axiosPrivate.post('/logout');
    await dispatch({ type: 'LOGOUT' });
  } catch (error) {
    console.log(error);
  }
};

export const cartData = (ids) => async (dispatch) => {
  try {
    const id = ids;
    const result = await axiosPrivate.get(`/cart/${id}`);
    dispatch({ type: "LOAD_CART", data: result.data.carts })
  }
  catch (err) {
    console.log(err);
  }
}

