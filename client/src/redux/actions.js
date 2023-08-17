// src/actions/index.js
import React from 'react';

import axiosPrivate from "../utils/axiosPrivate";

export const logout = () => async (dispatch) => {
  try {
    await axiosPrivate.post('/logout');
    dispatch({ type: 'LOGOUT' });
  } catch (error) {
    console.log(error);
  }
};

export const cartData=()=>async(dispatch)=>{
  try{
    const id=2;
    console.log("Hitting cart")
      const result=await axiosPrivate.get(`/cart/${id}`) ;
      dispatch({type:"LOAD_CART",data:result.data.carts})
  }
  catch(err)
  {
    console.log(err);
  }
}

