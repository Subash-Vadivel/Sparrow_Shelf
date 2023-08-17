// src/actions/index.js
import React from 'react';

import axiosPrivate from "../utils/axiosPrivate";
export const logout = () => async (dispatch) => {
  try {
    await axiosPrivate.post('/logout');
    await dispatch({ type: 'LOGOUT' });
  } catch (error) {
    console.log(error);
  }
};

export const cartData=(ids)=>async(dispatch)=>{
  try{
    const id=ids;
      const result=await axiosPrivate.get(`/cart/${id}`) ;
       dispatch({type:"LOAD_CART",data:result.data.carts})
  }
  catch(err)
  {
    console.log(err);
  }
}

